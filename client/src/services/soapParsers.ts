import type {
  Creature,
  DiceRollResult,
  EncounterResult,
  SkillTestResult,
} from "./interfaces";

/* ---------- helpers ---------- */

function parseXml(xml: string): Document {
  return new DOMParser().parseFromString(xml, "text/xml");
}

function findResponse(xml: string, name: string): Element {
  const element = parseXml(xml).getElementsByTagNameNS("*", name)[0];

  if (!element) {
    throw new Error(`Resposta inválida: elemento "${name}" não encontrado.`);
  }

  return element;
}

function child(parent: Element, name: string): Element | undefined {
  return Array.from(parent.children).find((node) => node.localName === name);
}

function childrenOf(parent: Element, name: string): Element[] {
  return Array.from(parent.children).filter((node) => node.localName === name);
}

function requireChild(parent: Element, name: string): Element {
  const element = child(parent, name);

  if (!element) {
    throw new Error(`Resposta inválida: campo "${name}" ausente.`);
  }

  return element;
}

function toInt(value: string | null | undefined, field: string): number {
  const text = value?.trim() ?? "";
  const number = Number(text);

  if (text === "" || !Number.isInteger(number)) {
    throw new Error(`Resposta inválida: campo "${field}" não é um inteiro.`);
  }

  return number;
}

function intOf(parent: Element, name: string): number {
  return toInt(requireChild(parent, name).textContent, name);
}

function textOf(parent: Element, name: string): string {
  return requireChild(parent, name).textContent?.trim() ?? "";
}

function boolOf(parent: Element, name: string): boolean {
  const value = textOf(parent, name).toLowerCase();
  return value === "true" || value === "1";
}

/* ---------- rollDices ---------- */

function readDiceRoll(element: Element): DiceRollResult {
  const resultsElement = requireChild(element, "results");
  const results = childrenOf(resultsElement, "result").map((item) =>
    toInt(item.textContent, "result")
  );

  if (results.length === 0) {
    throw new Error("Os dados retornados pelo servidor são inválidos.");
  }

  return {
    diceType: child(element, "diceType")?.textContent?.trim() ?? "",
    results,
    total: intOf(element, "total"),
  };
}

export function parseDiceRollResponse(xml: string): DiceRollResult {
  const response = findResponse(xml, "rollDicesResponse");

  const diceType = textOf(response, "diceType");

  if (!diceType) {
    throw new Error("Os dados retornados pelo servidor são inválidos.");
  }

  return readDiceRoll(response);
}

/* ---------- calculateTest ---------- */

export function parseSkillTestResponse(xml: string): SkillTestResult {
  const response = findResponse(xml, "calculateTestResponse");

  return {
    attributeValue: intOf(response, "attributeValue"),
    attributeBonus: intOf(response, "attributeBonus"),
    modifier: intOf(response, "modifier"),
    difficulty: intOf(response, "difficulty"),
    diceResult: intOf(response, "diceResult"),
    finalResult: intOf(response, "finalResult"),
    success: boolOf(response, "success"),
  };
}

/* ---------- generateEncounter ---------- */

export function parseEncounterResponse(xml: string): EncounterResult {
  const response = findResponse(xml, "generateEncounterResponse");
  const monstersElement = requireChild(response, "monsters");

  return {
    encounterName: textOf(response, "encounterName"),
    difficulty: textOf(response, "difficulty"),
    groupLevel: intOf(response, "groupLevel"),
    playerCount: intOf(response, "playerCount"),
    monsters: childrenOf(monstersElement, "monster").map((monster) => ({
      name: textOf(monster, "name"),
      quantity: intOf(monster, "quantity"),
    })),
  };
}

/* ---------- getCreature ---------- */

export function parseCreatureResponse(xml: string): Creature {
  const response = findResponse(xml, "getCreatureResponse");

  return {
    name: textOf(response, "name"),
    creatureType: textOf(response, "creatureType"),
    description: textOf(response, "description"),
    hitPoints: intOf(response, "hitPoints"),
    armorClass: intOf(response, "armorClass"),
    challengeRating: textOf(response, "challengeRating"),
  };
}
