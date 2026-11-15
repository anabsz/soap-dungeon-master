const SOAP_ENDPOINT: string =
  import.meta.env.VITE_SOAP_ENDPOINT ?? "http://localhost:8000/soap";
const SOAP_NAMESPACE = "http://schemas.xmlsoap.org/soap/envelope/";

export const DM_NAMESPACE = "http://dungeonmaster.local/soap";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

  const responseText = await response.text();
  const xml = new DOMParser().parseFromString(responseText, "text/xml");
  const isInvalidXml = xml.querySelector("parsererror") !== null;

  if (!isInvalidXml) {
    const fault = xml.getElementsByTagNameNS(SOAP_NAMESPACE, "Fault")[0];

    if (fault) {
      const faultMessage =
        fault.getElementsByTagName("faultstring")[0]?.textContent;

      throw new Error(faultMessage || "Erro ao processar a requisição SOAP.");
    }
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  if (isInvalidXml) {
    throw new Error("O servidor retornou uma resposta XML inválida.");
  }

  return responseText;
}

/**
 * Verifica apenas se o servidor responde. Usa `no-cors` para não depender de
 * CORS e não dispara nenhuma operação do serviço.
 */
export async function pingServer(timeoutMs = 4000): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch(SOAP_ENDPOINT, {
      method: "GET",
      mode: "no-cors",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
