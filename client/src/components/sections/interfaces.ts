import type { ComponentType } from "react";
import type { IconProps } from "../icons/interfaces";

export type SectionId = "dice" | "skill-test" | "encounter" | "bestiary";

/** Props recebidas por toda seção que ocupa a região dos cards. */
export interface SectionProps {
  onClose: () => void;
}

export interface SectionDefinition {
  id: SectionId;
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
  Component: ComponentType<SectionProps>;
}
