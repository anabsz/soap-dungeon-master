import { useState, type FormEvent } from "react";
import { useServiceCall } from "../../../hooks/useServiceCall";
import { getCreature } from "../../../services/dungeonMasterService";
import Field from "../../Field/Field";
import SectionFrame from "../../SectionFrame/SectionFrame";
import type { SectionProps } from "../interfaces";
import CreatureCard from "./CreatureCard/CreatureCard";

export default function BestiarySection({ onClose }: SectionProps) {
  const [name, setName] = useState("");
  const { result, error, loading, run } = useServiceCall(getCreature);

  const trimmedName = name.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (trimmedName) void run(trimmedName);
  }

  return (
    <SectionFrame
      title="Bestiário"
      onClose={onClose}
      error={error}
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Nome da criatura" htmlFor="creatureName">
            <input
              className="control"
              id="creatureName"
              type="text"
              placeholder="Ex.: Goblin"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <button type="submit" className="btn" disabled={loading || !trimmedName}>
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </form>
      }
    >
      {result ? (
        <CreatureCard creature={result} />
      ) : (
        <div className="empty-state">A ficha da criatura aparece aqui.</div>
      )}
    </SectionFrame>
  );
}
