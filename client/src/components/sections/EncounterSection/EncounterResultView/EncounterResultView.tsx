import type { EncounterResultViewProps } from "./interfaces";

export default function EncounterResultView({
  encounter,
}: EncounterResultViewProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-[22px] font-semibold">{encounter.encounterName}</h3>
        <span className="rounded-full border border-gold-soft px-2.5 py-0.5 text-xs font-semibold text-gold">
          {encounter.difficulty}
        </span>
      </div>

      <p className="mt-2 mb-4.5 text-sm text-muted">
        Grupo de nível {encounter.groupLevel} com {encounter.playerCount}{" "}
        {encounter.playerCount === 1 ? "jogador" : "jogadores"}
      </p>

      <ul className="grid gap-2">
        {encounter.monsters.map((monster) => (
          <li
            key={monster.name}
            className="flex items-center gap-3 rounded-lg bg-card px-3.5 py-2.5"
          >
            <span className="min-w-[2ch] font-bold text-gold">{monster.quantity}×</span>
            {monster.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
