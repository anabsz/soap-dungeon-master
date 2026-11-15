import type {
  Creature,
  DiceRollResult,
  EncounterParams,
  EncounterResult,
  SkillTestParams,
  SkillTestResult,
} from "./interfaces";
import { escapeXml, sendSoapRequest } from "./soapClient";
import {
  parseCreatureResponse,
  parseDiceRollResponse,
  parseEncounterResponse,
  parseSkillTestResponse,
} from "./soapParsers";

export async function rollDice(
  diceType: string,
  quantity: number
): Promise<DiceRollResult> {
  const xml = await sendSoapRequest(
    "rollDices",
    `<dm:rollDices>
      <dm:diceType>${escapeXml(diceType)}</dm:diceType>
      <dm:quantity>${quantity}</dm:quantity>
    </dm:rollDices>`
  );

  return parseDiceRollResponse(xml);
}

export async function calculateTest({
  attributeValue,
  modifier,
  difficulty,
}: SkillTestParams): Promise<SkillTestResult> {
  const xml = await sendSoapRequest(
    "calculateTest",
    `<dm:calculateTest>
      <dm:attributeValue>${attributeValue}</dm:attributeValue>
      <dm:modifier>${modifier}</dm:modifier>
      <dm:difficulty>${difficulty}</dm:difficulty>
    </dm:calculateTest>`
  );

  return parseSkillTestResponse(xml);
}

export async function generateEncounter({
  groupLevel,
  playerCount,
}: EncounterParams): Promise<EncounterResult> {
  const xml = await sendSoapRequest(
    "generateEncounter",
    `<dm:generateEncounter>
      <dm:groupLevel>${groupLevel}</dm:groupLevel>
      <dm:playerCount>${playerCount}</dm:playerCount>
    </dm:generateEncounter>`
  );

  return parseEncounterResponse(xml);
}

export async function getCreature(name: string): Promise<Creature> {
  const xml = await sendSoapRequest(
    "getCreature",
    `<dm:getCreature>
      <dm:name>${escapeXml(name)}</dm:name>
    </dm:getCreature>`
  );

  return parseCreatureResponse(xml);
}
