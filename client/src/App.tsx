import { useState } from "react";
import Header from "./components/Header/Header";
import MenuGrid from "./components/MenuGrid/MenuGrid";
import type { SectionId } from "./components/sections/interfaces";
import { SECTIONS } from "./components/sections/sections";

export default function App() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const ActiveSection = SECTIONS.find((section) => section.id === activeId)?.Component;

  return (
    <main className="grid min-h-screen place-items-center p-3 sm:p-6">
      <div className="flex w-full max-w-[880px] flex-col gap-6 rounded-[14px] border border-line bg-panel p-[18px] sm:p-7">
        <Header />

        {ActiveSection ? (
          <ActiveSection onClose={() => setActiveId(null)} />
        ) : (
          <MenuGrid sections={SECTIONS} onSelect={setActiveId} />
        )}
      </div>
    </main>
  );
}
