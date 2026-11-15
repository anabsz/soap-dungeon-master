import { BookOpen, Dices, Skull, Swords } from "lucide-react";
import BestiarySection from "./BestiarySection";
import DiceRollSection from "./DiceRollSection";
import EncounterSection from "./EncounterSection";
import type { SectionDefinition } from "./interfaces";
import SkillTestSection from "./SkillTestSection";

/** Ordem aqui = ordem dos cards na tela principal. */
export const SECTIONS: SectionDefinition[] = [
  {
    id: "dice",
    title: "Rolagem de dados",
    description: "D4 · D6 · D8 · D10 · D12 · D20",
    Icon: Dices,
    Component: DiceRollSection,
  },
  {
    id: "skill-test",
    title: "Testes de habilidade",
    description: "Força, destreza, inteligência...",
    Icon: Swords,
    Component: SkillTestSection,
  },
  {
    id: "encounter",
    title: "Gerar encontro",
    description: "Criaturas e dificuldades",
    Icon: Skull,
    Component: EncounterSection,
  },
  {
    id: "bestiary",
    title: "Bestiário",
    description: "Consulta de criaturas",
    Icon: BookOpen,
    Component: BestiarySection,
  },
];
