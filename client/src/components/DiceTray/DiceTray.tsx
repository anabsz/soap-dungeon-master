import DiceFace from "./DiceFace/DiceFace";
import type { DiceTrayProps } from "./interfaces";

export default function DiceTray({ roll, hideTotal = false }: DiceTrayProps) {
  if (!roll) {
    return <div className="empty-state">Os dados rolados aparecem aqui.</div>;
  }

  const sides = Number(roll.diceType.replace(/\D/g, "")) || NaN;

  return (
    <div>
      {/* A key força a animação a recomeçar a cada nova rolagem. */}
      <div
        key={roll.results.join("-") + roll.total}
        className="flex max-h-70 flex-wrap gap-3 overflow-y-auto p-0.5"
      >
        {roll.results.map((value, index) => (
          <DiceFace key={index} value={value} sides={sides} index={index} />
        ))}
      </div>

      {!hideTotal && (
        <p className="mt-4 flex items-baseline gap-2.5 text-muted">
          <span>Total</span>
          <strong className="text-3xl leading-none font-bold text-gold">
            {roll.total}
          </strong>
        </p>
      )}
    </div>
  );
}
