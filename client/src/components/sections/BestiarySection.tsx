import { useState, type SubmitEvent } from "react";
import Field from "@/components/Field";
import SectionFrame from "@/components/SectionFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceCall } from "@/hooks/useServiceCall";
import { getCreature } from "@/services/soapClient";
import type { Creature } from "@/services/interfaces";
import type { SectionProps } from "./interfaces";

function CreatureCard({ creature }: { creature: Creature }) {
  const stats = [
    ["Pontos de vida", creature.hitPoints],
    ["Classe de armadura", creature.armorClass],
    ["Nível de desafio", creature.challengeRating],
  ];

  return (
    <article>
      <h3 className="text-2xl font-semibold text-primary">{creature.name}</h3>
      <p className="mt-1 mb-4.5 text-sm text-muted-foreground italic">
        {creature.creatureType}
      </p>

      <dl className="mb-4.5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-secondary px-3.5 py-2.5">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-[22px] font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="max-w-[62ch] leading-relaxed">{creature.description}</p>
    </article>
  );
}

export default function BestiarySection({ onClose }: SectionProps) {
  const [name, setName] = useState("");
  const { result, error, loading, run } = useServiceCall(getCreature);

  const trimmedName = name.trim();

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (trimmedName) void run(trimmedName);
  }

  return (
    <SectionFrame
      title="Bestiário"
      onClose={onClose}
      error={error}
      emptyMessage="A ficha da criatura aparece aqui."
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Nome da criatura" htmlFor="creatureName">
            <Input
              id="creatureName"
              placeholder="Ex.: Goblin"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Button type="submit" disabled={loading || !trimmedName}>
            {loading ? "Consultando..." : "Consultar"}
          </Button>
        </form>
      }
    >
      {result && <CreatureCard creature={result} />}
    </SectionFrame>
  );
}
