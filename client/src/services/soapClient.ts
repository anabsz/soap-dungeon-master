import type { DiceRollResult } from "./interfaces";

const SOAP_ENDPOINT = "http://localhost:8000/soap";
const SOAP_NAMESPACE = "http://schemas.xmlsoap.org/soap/envelope/";
const DM_NAMESPACE = "http://dungeonmaster.local/soap";

export async function sendSoapRequest(
  operation: string,
  body: string
): Promise<string> {
  const envelope = `
    <soap:Envelope
      xmlns:soap="${SOAP_NAMESPACE}"
      xmlns:dm="${DM_NAMESPACE}">
      <soap:Body>
        ${body}
      </soap:Body>
    </soap:Envelope>
  `;

  const response = await fetch(SOAP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `${DM_NAMESPACE}/${operation}`,
    },
    body: envelope,
  });

  const responseText = await response.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(
    responseText,
    "text/xml"
  );

  const parseError = document.querySelector("parsererror");

  if (parseError) {
    throw new Error("O servidor retornou uma resposta XML inválida.");
  }

  const fault = document.getElementsByTagNameNS(
    SOAP_NAMESPACE,
    "Fault"
  )[0];

  if (fault) {
    const faultMessage =
      fault.getElementsByTagName("faultstring")[0]?.textContent;

    throw new Error(faultMessage || "Erro ao processar a requisição SOAP.");
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return responseText;
}

export async function rollDice(
  diceType: string,
  quantity: number
): Promise<string> {
  const body = `
    <dm:rollDices>
      <dm:diceType>${diceType}</dm:diceType>
      <dm:quantity>${quantity}</dm:quantity>
    </dm:rollDices>
  `;

  return sendSoapRequest("rollDices", body);
}

export function parseDiceRollResponse(
  xml: string
): DiceRollResult {
  const document = new DOMParser().parseFromString(
    xml,
    "text/xml"
  );

  const response = document.getElementsByTagNameNS(
    DM_NAMESPACE,
    "rollDicesResponse"
  )[0];

  if (!response) {
    throw new Error("Resposta de rolagem inválida.");
  }

  const diceType = response.getElementsByTagNameNS(
    DM_NAMESPACE,
    "diceType"
  )[0]?.textContent;

  const resultElements = response.getElementsByTagNameNS(
    DM_NAMESPACE,
    "result"
  );

  const results = Array.from(resultElements).map((element) =>
    Number(element.textContent)
  );

  const total = Number(
    response.getElementsByTagNameNS(
      DM_NAMESPACE,
      "total"
    )[0]?.textContent
  );

  if (
    !diceType ||
    results.length === 0 ||
    results.some((value) => !Number.isInteger(value)) ||
    !Number.isInteger(total)
  ) {
    throw new Error("Os dados retornados pelo servidor são inválidos.");
  }

  return {
    diceType,
    results,
    total,
  };
}