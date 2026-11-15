import type { DiceFaceProps } from "./interfaces";
import { PIP_CELLS } from "./pips";

const CELLS = Array.from({ length: 9 }, (_, cell) => cell);

export default function DiceFace({ value, sides, index }: DiceFaceProps) {
  const pips = sides === 6 ? PIP_CELLS[value] : undefined;

  return (
    <div
      title={String(value)}
      style={{ animationDelay: `${Math.min(index, 24) * 40}ms` }}
      className={`size-16 animate-dice-in rounded-2xl border-2 border-gold bg-[#171310] text-gold motion-reduce:animate-none ${
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
