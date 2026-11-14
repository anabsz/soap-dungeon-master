from mimetypes import encodings_map
import xml.etree.ElementTree as ET
from services.dice import roll_dice

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
