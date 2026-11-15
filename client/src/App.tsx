import { useState } from "react";
import MenuCard from "@/components/MenuCard";
import { SECTIONS } from "@/components/sections";
import type { SectionId } from "@/components/sections/interfaces";
import { Card } from "@/components/ui/card";

export default function App() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const ActiveSection = SECTIONS.find((section) => section.id === activeId)?.Component;

  return (
    <main className="grid min-h-screen place-items-center p-3 sm:p-6">
      <Card className="w-full max-w-[880px] gap-6 rounded-[14px] p-[18px] shadow-none sm:p-7">
        <header>
          <h1 className="text-[22px] font-semibold tracking-wide text-primary">
            DUNGEON MASTER
          </h1>
        </header>

        {ActiveSection ? (
          <ActiveSection onClose={() => setActiveId(null)} />
        ) : (
          <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Ferramentas">
            {SECTIONS.map(({ id, title, description, Icon }) => (
              <MenuCard
                key={id}
                title={title}
                description={description}
                Icon={Icon}
                onClick={() => setActiveId(id)}
              />
            ))}
          </nav>
        )}
      </Card>
    </main>
  );
}
