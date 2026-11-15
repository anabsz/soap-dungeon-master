import { XMLParser } from "fast-xml-parser";
import type {
  Creature,
  DiceRollResult,
  EncounterParams,
  EncounterResult,
  SkillTestParams,
  SkillTestResult,
} from "./interfaces";

const SOAP_ENDPOINT: string =
  import.meta.env.VITE_SOAP_ENDPOINT ?? "http://localhost:8000/soap";
const SOAP_NAMESPACE = "http://schemas.xmlsoap.org/soap/envelope/";
const DM_NAMESPACE = "http://dungeonmaster.local/soap";


const parser = new XMLParser({
  removeNSPrefix: true,
  parseTagValue: false,
  isArray: (tag) => tag === "result" || tag === "monster",
});

function escapeXml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
interface SoapBody {
  Fault?: { faultstring?: string };
  [key: string]: unknown;
}

/** Envia `<dm:operation>` e devolve o conteúdo de `<operationResponse>`. */
async function sendSoapRequest<T>(
  operation: string,
  params: Record<string, string | number>
): Promise<T> {
    const fields = Object.entries(params)
    .map(([key, value]) => `<dm:${key}>${escapeXml(value)}</dm:${key}>`)
    .join("");

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="${SOAP_NAMESPACE}" xmlns:dm="${DM_NAMESPACE}">
      <soap:Body>
        <dm:${operation}>${fields}</dm:${operation}>
      </soap:Body>
    </soap:Envelope>`;

  let response: Response;

  try {
    response = await fetch(SOAP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: `${DM_NAMESPACE}/${operation}`,
      },
      body: envelope,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor SOAP.");
  }

  const body: SoapBody | undefined = parser.parse(await response.text())?.Envelope?.Body;

  // SOAP 1.1 devolve Fault com HTTP 500, então o Fault vem antes do status.
  if (body?.Fault) {
    throw new Error(body.Fault.faultstring || "Erro ao processar a requisição SOAP.");
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  const result = body?.[`${operation}Response`];

  if (!result || typeof result !== "object") {
    throw new Error("O servidor retornou uma resposta inválida.");
  }

  return result as T;
}

function int(value: unknown): number {
  const number = Number(value);

  if (value === "" || !Number.isInteger(number)) {
    throw new Error("O servidor retornou um valor numérico inválido.");
  }

  return number;
}

/* ---------- operações do WSDL ---------- */

export async function rollDice(
  diceType: string,
  quantity: number
): Promise<DiceRollResult> {
  const r = await sendSoapRequest<{
    diceType: string;
    results?: { result: string[] };
    total: string;
  }>("rollDices", { diceType, quantity });

  const results = r.results?.result.map((value) => int(value)) ?? [];

  if (!r.diceType || results.length === 0) {
    throw new Error("Os dados retornados pelo servidor são inválidos.");
  }

  return { diceType: r.diceType, results, total: int(r.total) };
}

export async function calculateTest(
  params: SkillTestParams
): Promise<SkillTestResult> {
  const r = await sendSoapRequest<Record<string, string>>("calculateTest", { ...params });

  return {
    attributeValue: int(r.attributeValue),
    attributeBonus: int(r.attributeBonus),
    modifier: int(r.modifier),
    difficulty: int(r.difficulty),
    diceResult: int(r.diceResult),
    finalResult: int(r.finalResult),
    success: r.success === "true" || r.success === "1",
  };
}

export async function generateEncounter(
  params: EncounterParams
): Promise<EncounterResult> {
  const r = await sendSoapRequest<{
    encounterName: string;
    difficulty: string;
    groupLevel: string;
    playerCount: string;
    monsters?: { monster: { name: string; quantity: string }[] };
  }>("generateEncounter", { ...params });

  return {
    encounterName: r.encounterName,
    difficulty: r.difficulty,
    groupLevel: int(r.groupLevel),
    playerCount: int(r.playerCount),
    monsters: (r.monsters?.monster ?? []).map((monster) => ({
      name: monster.name,
      quantity: int(monster.quantity),
    })),
  };
}

export async function getCreature(name: string): Promise<Creature> {
  const r = await sendSoapRequest<Record<string, string>>("getCreature", { name });

  return {
    name: r.name,
    creatureType: r.creatureType,
    description: r.description,
    hitPoints: int(r.hitPoints),
    armorClass: int(r.armorClass),
    challengeRating: r.challengeRating,
  };
}
