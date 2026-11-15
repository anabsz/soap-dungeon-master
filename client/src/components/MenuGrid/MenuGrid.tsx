import MenuCard from "../MenuCard/MenuCard";
import type { MenuGridProps } from "./interfaces";

export default function MenuGrid({ sections, onSelect }: MenuGridProps) {
  return (
    <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Ferramentas">
      {sections.map(({ id, title, description, Icon }) => (
        <MenuCard
          key={id}
          title={title}
          description={description}
          Icon={Icon}
          onClick={() => onSelect(id)}
        />
      ))}
    </nav>
  );
}
