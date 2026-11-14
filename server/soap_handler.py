from mimetypes import encodings_map
import xml.etree.ElementTree as ET
from services.creature import get_creature
from services.dice import roll_dice
from services.encounter import generate_encounter

SOAP_NS = "http://schemas.xmlsoap.org/soap/envelope/"
DM_NS = "http://dungeonmaster.local/soap"

ET.register_namespace("soap", SOAP_NS)
ET.register_namespace("dm", DM_NS)

def qname(namespace, element):
    return f"{{{namespace}}}{element}"

class SoapFault(Exception):
    def __init__(self, faultcode, faultstring):
        self.faultcode = faultcode
        self.faultstring = faultstring
        super().__init__(faultstring)

def create_fault(faultcode, message):
    envelope = ET.Element(qname(SOAP_NS, "Envelope"))
    body = ET.SubElement(envelope, qname(SOAP_NS, "Body"))
    fault = ET.SubElement(body, qname(SOAP_NS, "Fault"))

    ET.SubElement(fault, "faultcode").text = faultcode
    ET.SubElement(fault, "faultstring").text = message

    return ET.tostring(
        envelope,
        encoding="UTF-8",
        xml_declaration=True
    )

def process_request(received_xml):
    try:
        envelope = ET.fromstring(received_xml)
        if envelope.tag != qname(SOAP_NS, "Envelope"):
            raise SoapFault(
                "soap:VersionMismatch",
                "O Envelope SOAP 1.1 é inválido."
            )

        body = envelope.find(qname(SOAP_NS, "Body"))
        if body is None:
            raise SoapFault(
                "soap:Client",
                "O elemento SOAP Body não foi encontrado."
            )

        operations = list(body)

        if len(operations) != 1:
            raise SoapFault(
                "soap:Client",
                "A mensagem deve conter exatamente uma operação."
            )

        operation = operations[0]
        if operation.tag == qname(DM_NS, "rollDices"):
            return 200, process_roll(operation)
    
        if operation.tag == qname(DM_NS, "calculateTest"):
            return 200, process_calculate_test(operation)
        
        if operation.tag == qname(DM_NS, "generateEncounter"):
            return 200, process_generate_encounter(operation)

        if operation.tag == qname(DM_NS, "getCreature"):
            return 200, process_get_creature(operation)
            
        raise SoapFault(
            "soap:Client",
            "Operação SOAP não reconhecida."
        )

    except ET.ParseError:
        return 500, create_fault(
            "soap:Client",
            "O XML recebido é inválido."
        )

    except SoapFault as error:
        return 500, create_fault(
            error.faultcode,
            error.faultstring
        )


# --------------
# Rolar Dados
# --------------

def create_response_roll_dice(result: dict):
    envelope = ET.Element(qname(SOAP_NS, "Envelope"))
    body = ET.SubElement(envelope, qname(SOAP_NS, "Body"))
    response = ET.SubElement(body,qname(DM_NS, "rolarDadosResponse"))

    ET.SubElement(response,qname(DM_NS, "diceType")).text = result["dice_type"]

    results = ET.SubElement(response,qname(DM_NS, "results"))

    for value in result["results"]:
        ET.SubElement(results, qname(DM_NS, "result")).text = str(value)
    ET.SubElement(response, qname(DM_NS, "total")). text = str(result["total"])

    return ET.tostring(
        envelope,
        encoding="UTF-8",
        xml_declaration=True
    )


def get_value(element, name):
    field = element.find(qname(DM_NS, name))
    if field is None or field.text is None:
        raise SoapFault(
            "soap:Client",
            f"Parâmetro obrigatório ausente: {name}"
        )
    return field.text.strip()

def process_roll(element):
    dice_type = get_value(element, "diceType")
    quantity_text = get_value(element, "quantity")

    try:
        quantity = int(quantity_text)
    except ValueError:
        raise SoapFault(
            "soap:Client",
            "A quantidade deve ser um número inteiro."
        )

    try:
        result = roll_dice(dice_type, quantity)
    except ValueError as error:
        raise SoapFault("soap:Client", str(error))

    return create_response_roll_dice(result)


# -----------------
# Calcular Teste
# -----------------

def get_integer_value(element, name):
    value = get_value(element, name)
    try:
        return int(value)
    except ValueError:
        raise SoapFault(
            "soap:Client",
            f"O parâmetro {name} deve ser um número inteiro."
        )


def create_response_calculate_test(result):
    envelope = ET.Element(qname(SOAP_NS, "Envelope"))
    body = ET.SubElement(envelope, qname(SOAP_NS, "Body"))

    response = ET.SubElement(
        body,
        qname(DM_NS, "calculateTestResponse")
    )

    fields = {
        "attributeValue": result["attribute_value"],
        "attributeBonus": result["attribute_bonus"],
        "modifier": result["modifier"],
        "difficulty": result["difficulty"],
        "diceResult": result["dice_roll"],
        "finalResult": result["final_result"],
        "success": str(result["success"]).lower()
    }

    for name, value in fields.items():
        ET.SubElement(response, qname(DM_NS, name)).text = str(value)

    return ET.tostring(
        envelope,
        encoding="UTF-8",
        xml_declaration=True
    )


def process_calculate_test(element):
    attribute_value = get_integer_value(element, "attributeValue")
    modifier = get_integer_value(element, "modifier")
    difficulty = get_integer_value(element, "difficulty")

    if not 1 <= attribute_value <= 20:
        raise SoapFault(
            "soap:Client",
            "O valor do atributo deve estar entre 1 e 20."
        )

    if difficulty < 1:
        raise SoapFault(
            "soap:Client",
            "A dificuldade deve ser maior que zero."
        )

    attribute_bonus = (attribute_value - 10) // 2

    dice_roll = roll_dice("D20", 1)
    dice_result = dice_roll["results"][0]

    final_result = dice_result + attribute_bonus + modifier

    result = {
        "attribute_value": attribute_value,
        "attribute_bonus": attribute_bonus,
        "modifier": modifier,
        "difficulty": difficulty,
        "dice_roll": dice_roll,
        "final_result": final_result,
        "success": final_result >= difficulty
    }

    return create_response_calculate_test(result)

# ---------------------
# Gerador de Encontros
# ---------------------

def create_generate_encounter_response(result):
    envelope = ET.Element(qname(SOAP_NS, "Envelope"))
    body = ET.SubElement(envelope, qname(SOAP_NS, "Body"))

    response = ET.SubElement(
        body,
        qname(DM_NS, "generateEncounterResponse")
    )

    fields = {
        "encounterName": result["name"],
        "difficulty": result["difficulty"],
        "groupLevel": result["group_level"],
        "playerCount": result["player_count"]
    }

    for name, value in fields.items():
        ET.SubElement(
            response,
            qname(DM_NS, name)
        ).text = str(value)

    monsters = ET.SubElement(
        response,
        qname(DM_NS, "monsters")
    )

    for monster in result["monsters"]:
        monster_element = ET.SubElement(
            monsters,
            qname(DM_NS, "monster")
        )

        ET.SubElement(
            monster_element,
            qname(DM_NS, "name")
        ).text = monster["name"]

        ET.SubElement(
            monster_element,
            qname(DM_NS, "quantity")
        ).text = str(monster["quantity"])

    return ET.tostring(
        envelope,
        encoding="UTF-8",
        xml_declaration=True
    )


def process_generate_encounter(element):
    group_level = get_integer_value(element, "groupLevel")
    player_count = get_integer_value(element, "playerCount")

    try:
        result = generate_encounter(group_level, player_count)
    except ValueError as error:
        raise SoapFault("soap:Client", str(error))

    return create_generate_encounter_response(result)

# --------------
# Criaturas
# --------------
def create_get_creature_response(creature):
    envelope = ET.Element(qname(SOAP_NS, "Envelope"))
    body = ET.SubElement(envelope, qname(SOAP_NS, "Body"))

    response = ET.SubElement(
        body,
        qname(DM_NS, "getCreatureResponse")
    )

    fields = {
        "name": creature.name,
        "creatureType": creature.creature_type,
        "description": creature.description,
        "hitPoints": creature.hit_points,
        "armorClass": creature.armor_class,
        "challengeRating": creature.challenge_rating
    }

    for name, value in fields.items():
        ET.SubElement(
            response,
            qname(DM_NS, name)
        ).text = str(value)

    return ET.tostring(
        envelope,
        encoding="UTF-8",
        xml_declaration=True
    )

def process_get_creature(element):
    name = get_value(element, "name")

    if not name or not name.strip():
        raise SoapFault(
            "soap:Client",
            "O nome da criatura é obrigatório."
        )

    creature = get_creature(name)

    if creature is None:
        raise SoapFault(
            "soap:Client",
            "Criatura não encontrada."
        )

    return create_get_creature_response(creature)