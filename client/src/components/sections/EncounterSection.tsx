import { useState, type SubmitEvent } from "react";
import Field from "@/components/Field";
import SectionFrame from "@/components/SectionFrame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceCall } from "@/hooks/useServiceCall";
import { parseIntInput } from "@/lib/utils";
import { generateEncounter } from "@/services/soapClient";
import type { EncounterResult } from "@/services/interfaces";
import type { SectionProps } from "./interfaces";

function EncounterResultView({ encounter }: { encounter: EncounterResult }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-[22px] font-semibold">{encounter.encounterName}</h3>
        <Badge variant="outline" className="border-primary/50 text-primary">
          {encounter.difficulty}
        </Badge>
      </div>

      <p className="mt-2 mb-4.5 text-sm text-muted-foreground">
        Grupo de nível {encounter.groupLevel} com {encounter.playerCount}{" "}
        {encounter.playerCount === 1 ? "jogador" : "jogadores"}
      </p>

      <ul className="grid gap-2">
        {encounter.monsters.map((monster) => (
          <li
            key={monster.name}
            className="flex items-center gap-3 rounded-lg bg-secondary px-3.5 py-2.5"
          >
            <span className="min-w-[2ch] font-bold text-primary">{monster.quantity}×</span>
            {monster.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EncounterSection({ onClose }: SectionProps) {
  const [groupLevel, setGroupLevel] = useState("1");
  const [playerCount, setPlayerCount] = useState("4");
  const { result, error, loading, run } = useServiceCall(generateEncounter);

  const level = parseIntInput(groupLevel);
  const players = parseIntInput(playerCount);
  const isValid = level !== null && level >= 1 && players !== null && players >= 1;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (isValid) void run({ groupLevel: level, playerCount: players });
  }

  return (
    <SectionFrame
      title="Gerar encontro"
      onClose={onClose}
      error={error}
      emptyMessage="O encontro gerado aparece aqui."
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Nível do grupo" htmlFor="groupLevel">
            <Input
              id="groupLevel"
              type="number"
              min={1}
              value={groupLevel}
              onChange={(event) => setGroupLevel(event.target.value)}
            />
          </Field>

          <Field label="Número de jogadores" htmlFor="playerCount">
            <Input
              id="playerCount"
              type="number"
              min={1}
              value={playerCount}
              onChange={(event) => setPlayerCount(event.target.value)}
            />
          </Field>

          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Gerando..." : "Gerar"}
          </Button>
        </form>
      }
    >
      {result && <EncounterResultView encounter={result} />}
    </SectionFrame>
  );
}
