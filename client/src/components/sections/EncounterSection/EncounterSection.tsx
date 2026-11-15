import { useState, type FormEvent } from "react";
import { useServiceCall } from "../../../hooks/useServiceCall";
import { generateEncounter } from "../../../services/dungeonMasterService";
import { parseIntInput } from "../../../utils/parseIntInput";
import Field from "../../Field/Field";
import SectionFrame from "../../SectionFrame/SectionFrame";
import type { SectionProps } from "../interfaces";
import EncounterResultView from "./EncounterResultView/EncounterResultView";

export default function EncounterSection({ onClose }: SectionProps) {
  const [groupLevel, setGroupLevel] = useState("1");
  const [playerCount, setPlayerCount] = useState("4");
  const { result, error, loading, run } = useServiceCall(generateEncounter);

  const level = parseIntInput(groupLevel);
  const players = parseIntInput(playerCount);
  const isValid = level !== null && level >= 1 && players !== null && players >= 1;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isValid) void run({ groupLevel: level, playerCount: players });
  }

  return (
    <SectionFrame
      title="Gerar encontro"
      onClose={onClose}
      error={error}
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Nível do grupo" htmlFor="groupLevel">
            <input
              className="control"
              id="groupLevel"
              type="number"
              min={1}
              value={groupLevel}
              onChange={(event) => setGroupLevel(event.target.value)}
            />
          </Field>

          <Field label="Número de jogadores" htmlFor="playerCount">
            <input
              className="control"
              id="playerCount"
              type="number"
              min={1}
              value={playerCount}
              onChange={(event) => setPlayerCount(event.target.value)}
            />
          </Field>

          <button type="submit" className="btn" disabled={loading || !isValid}>
            {loading ? "Gerando..." : "Gerar"}
          </button>
        </form>
      }
    >
      {result ? (
        <EncounterResultView encounter={result} />
      ) : (
        <div className="empty-state">O encontro gerado aparece aqui.</div>
      )}
    </SectionFrame>
  );
}
