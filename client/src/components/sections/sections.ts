import { BookIcon, DiceIcon, SkullIcon, SwordsIcon } from "../icons/Icons";
import BestiarySection from "./BestiarySection/BestiarySection";
import DiceRollSection from "./DiceRollSection/DiceRollSection";
import EncounterSection from "./EncounterSection/EncounterSection";
import type { SectionDefinition } from "./interfaces";
import SkillTestSection from "./SkillTestSection/SkillTestSection";

/** Ordem aqui = ordem dos cards na tela principal. */
export const SECTIONS: SectionDefinition[] = [
  {
    id: "dice",
    title: "Rolagem de dados",
    description: "D4 · D6 · D8 · D10 · D12 · D20",
    Icon: DiceIcon,
    Component: DiceRollSection,
  },
  {
    id: "skill-test",
    title: "Testes de habilidade",
    description: "Força, destreza, inteligência...",
    Icon: SwordsIcon,
    Component: SkillTestSection,
  },
  {
    id: "encounter",
    title: "Gerar encontro",
    description: "Criaturas e dificuldades",
    Icon: SkullIcon,
    Component: EncounterSection,
  },
  {
    id: "bestiary",
    title: "Bestiário",
    description: "Consulta de criaturas",
    Icon: BookIcon,
    Component: BestiarySection,
  },
];
