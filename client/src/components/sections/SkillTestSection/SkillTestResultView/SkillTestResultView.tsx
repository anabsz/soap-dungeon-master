import { formatSigned } from "../../../../utils/formatSigned";
import DiceTray from "../../../DiceTray/DiceTray";
import type { SkillTestResultViewProps } from "./interfaces";

export default function SkillTestResultView({
  result,
}: SkillTestResultViewProps) {
  const rows: [label: string, value: string | number][] = [
    ["Rolagem (D20)", result.diceResult],
    [`Bônus do atributo (valor ${result.attributeValue})`, formatSigned(result.attributeBonus)],
    ["Modificador", formatSigned(result.modifier)],
  ];

  return (
    <div className="flex flex-col gap-4.5">
      <p
        className={`flex items-baseline gap-3 text-2xl font-bold ${
          result.success ? "text-ok" : "text-danger"
        }`}
      >
        {result.success ? "Sucesso" : "Falha"}
        <span className="text-sm font-normal text-muted">
          {result.finalResult} contra dificuldade {result.difficulty}
        </span>
      </p>

      <DiceTray
        hideTotal
        roll={{ diceType: "D20", results: [result.diceResult], total: result.diceResult }}
      />

      <dl className="grid max-w-90 gap-1.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-muted">{label}</dt>
            <dd className="tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="mt-1 flex justify-between gap-4 border-t border-line pt-2 font-bold">
          <dt>Resultado final</dt>
          <dd className="tabular-nums">{result.finalResult}</dd>
        </div>
      </dl>
    </div>
  );
}
