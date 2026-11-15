import { useState, type FormEvent } from "react";
import DiceTray from "@/components/DiceTray";
import Field from "@/components/Field";
import SectionFrame from "@/components/SectionFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceCall } from "@/hooks/useServiceCall";
import { formatSigned, parseIntInput } from "@/lib/utils";
import { calculateTest } from "@/services/soapClient";
import type { SkillTestResult } from "@/services/interfaces";
import type { SectionProps } from "./interfaces";

function SkillTestResultView({ result }: { result: SkillTestResult }) {
  const rows: [label: string, value: string | number][] = [
    ["Rolagem (D20)", result.diceResult],
    [`Bônus do atributo (valor ${result.attributeValue})`, formatSigned(result.attributeBonus)],
    ["Modificador", formatSigned(result.modifier)],
  ];

  return (
    <div className="flex flex-col gap-4.5">
      <p
        className={`flex items-baseline gap-3 text-2xl font-bold ${
          result.success ? "text-success" : "text-destructive"
        }`}
      >
        {result.success ? "Sucesso" : "Falha"}
        <span className="text-sm font-normal text-muted-foreground">
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
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="mt-1 flex justify-between gap-4 border-t pt-2 font-bold">
          <dt>Resultado final</dt>
          <dd className="tabular-nums">{result.finalResult}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function SkillTestSection({ onClose }: SectionProps) {
  const [attributeValue, setAttributeValue] = useState("10");
  const [modifier, setModifier] = useState("0");
  const [difficulty, setDifficulty] = useState("15");
  const { result, error, loading, run } = useServiceCall(calculateTest);

  const attribute = parseIntInput(attributeValue);
  const modifierValue = parseIntInput(modifier);
  const difficultyValue = parseIntInput(difficulty);
  const isValid =
    attribute !== null && modifierValue !== null && difficultyValue !== null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;

    void run({
      attributeValue: attribute,
      modifier: modifierValue,
      difficulty: difficultyValue,
    });
  }

  return (
    <SectionFrame
      title="Testes de habilidade"
      onClose={onClose}
      error={error}
      emptyMessage="O resultado do teste aparece aqui."
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Valor do atributo" htmlFor="attributeValue">
            <Input
              id="attributeValue"
              type="number"
              value={attributeValue}
              onChange={(event) => setAttributeValue(event.target.value)}
            />
          </Field>

          <Field label="Modificador" htmlFor="modifier">
            <Input
              id="modifier"
              type="number"
              value={modifier}
              onChange={(event) => setModifier(event.target.value)}
            />
          </Field>

          <Field label="Dificuldade" htmlFor="difficulty">
            <Input
              id="difficulty"
              type="number"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            />
          </Field>

          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Testando..." : "Testar"}
          </Button>
        </form>
      }
    >
      {result && <SkillTestResultView result={result} />}
    </SectionFrame>
  );
}
