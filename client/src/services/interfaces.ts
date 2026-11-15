/** Retorno de rollDices. */
export interface DiceRollResult {
  diceType: string;
  results: number[];
  total: number;
}

export interface SkillTestParams {
  attributeValue: number;
  modifier: number;
  difficulty: number;
}

export interface SkillTestResult {
  attributeValue: number;
  attributeBonus: number;
  modifier: number;
  difficulty: number;
  diceResult: number;
  finalResult: number;
  success: boolean;
}

export interface EncounterParams {
  groupLevel: number;
  playerCount: number;
}

export interface EncounterMonster {
  name: string;
  quantity: number;
}

export interface EncounterResult {
  encounterName: string;
  difficulty: string;
  groupLevel: number;
  playerCount: number;
  monsters: EncounterMonster[];
}

export interface Creature {
  name: string;
  creatureType: string;
  description: string;
  hitPoints: number;
  armorClass: number;
  challengeRating: string;
}
