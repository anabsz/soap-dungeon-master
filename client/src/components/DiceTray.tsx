import type { DiceRollResult } from "@/services/interfaces";

/** Células (0-8, grade 3x3) preenchidas em cada face de um D6. */
const PIP_CELLS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const CELLS = Array.from({ length: 9 }, (_, cell) => cell);

function DiceFace({
  value,
  sides,
  index,
}: {
  value: number;
  /** Lados do dado (6 = D6, 20 = D20...). NaN se desconhecido. */
  sides: number;
  /** Posição na bandeja (atraso da animação). */
  index: number;
}) {
  const pips = sides === 6 ? PIP_CELLS[value] : undefined;

  return (
    <div
      title={String(value)}
      style={{ animationDelay: `${Math.min(index, 24) * 40}ms` }}
      className={`size-16 animate-dice-in rounded-2xl border-2 border-primary bg-[#171310] text-primary motion-reduce:animate-none ${
        pips
          ? "grid grid-cols-3 grid-rows-3 place-items-center p-2"
          : "grid place-items-center text-2xl font-bold"
      }`}
    >
      {pips
        ? CELLS.map((cell) => (
            <span
              key={cell}
              className={pips.includes(cell) ? "size-2 rounded-full bg-current" : undefined}
            />
          ))
        : value}
    </div>
  );
}

export default function DiceTray({
  roll,
  hideTotal = false,
}: {
  roll: DiceRollResult;
  /** Esconde o total quando ele já aparece em outro lugar. */
  hideTotal?: boolean;
}) {
  const sides = Number(roll.diceType.replace(/\D/g, "")) || NaN;

  return (
    <div>
      <div
        key={roll.results.join("-") + roll.total}
        className="flex max-h-70 flex-wrap gap-3 overflow-y-auto p-0.5"
      >
        {roll.results.map((value, index) => (
          <DiceFace key={index} value={value} sides={sides} index={index} />
        ))}
      </div>

      {!hideTotal && (
        <p className="mt-4 flex items-baseline gap-2.5 text-muted-foreground">
          <span>Total</span>
          <strong className="text-3xl leading-none font-bold text-primary">
            {roll.total}
          </strong>
        </p>
      )}
    </div>
  );
}
