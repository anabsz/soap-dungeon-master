import { useState, type FormEvent } from "react";
import { useServiceCall } from "../../../hooks/useServiceCall";
import { calculateTest } from "../../../services/dungeonMasterService";
import { parseIntInput } from "../../../utils/parseIntInput";
import Field from "../../Field/Field";
import SectionFrame from "../../SectionFrame/SectionFrame";
import type { SectionProps } from "../interfaces";
import SkillTestResultView from "./SkillTestResultView/SkillTestResultView";

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
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Valor do atributo" htmlFor="attributeValue">
            <input
              className="control"
              id="attributeValue"
              type="number"
              value={attributeValue}
              onChange={(event) => setAttributeValue(event.target.value)}
            />
          </Field>

          <Field label="Modificador" htmlFor="modifier">
            <input
              className="control"
              id="modifier"
              type="number"
              value={modifier}
              onChange={(event) => setModifier(event.target.value)}
            />
          </Field>

          <Field label="Dificuldade" htmlFor="difficulty">
            <input
              className="control"
              id="difficulty"
              type="number"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            />
          </Field>

          <button type="submit" className="btn" disabled={loading || !isValid}>
            {loading ? "Testando..." : "Testar"}
          </button>
        </form>
      }
    >
      {result ? (
        <SkillTestResultView result={result} />
      ) : (
        <div className="empty-state">O resultado do teste aparece aqui.</div>
      )}
    </SectionFrame>
  );
}
