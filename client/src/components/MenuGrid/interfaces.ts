import type { SectionDefinition, SectionId } from "../sections/interfaces";

export interface MenuGridProps {
  sections: SectionDefinition[];
  onSelect: (id: SectionId) => void;
}
