import type { CreatureCardProps } from "./interfaces";

export default function CreatureCard({ creature }: CreatureCardProps) {
  const stats = [
    ["Pontos de vida", creature.hitPoints],
    ["Classe de armadura", creature.armorClass],
    ["Nível de desafio", creature.challengeRating],
  ];

  return (
    <article>
      <h3 className="text-2xl font-semibold text-gold">{creature.name}</h3>
      <p className="mt-1 mb-4.5 text-sm text-muted italic">{creature.creatureType}</p>

      <dl className="mb-4.5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-card px-3.5 py-2.5">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 text-[22px] font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="max-w-[62ch] leading-relaxed">{creature.description}</p>
    </article>
  );
}
