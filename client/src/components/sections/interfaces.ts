import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type SectionId = "dice" | "skill-test" | "encounter" | "bestiary";

/** Props recebidas por toda seção que ocupa a região dos cards. */
export interface SectionProps {
  onClose: () => void;
}

export interface SectionDefinition {
  id: SectionId;
  title: string;
  description: string;
  Icon: LucideIcon;
  Component: ComponentType<SectionProps>;
}
