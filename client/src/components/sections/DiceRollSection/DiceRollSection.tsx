import { useState, type FormEvent } from "react";
import { useServiceCall } from "../../../hooks/useServiceCall";
import { rollDice } from "../../../services/dungeonMasterService";
import { parseIntInput } from "../../../utils/parseIntInput";
import DiceTray from "../../DiceTray/DiceTray";
import Field from "../../Field/Field";
import SectionFrame from "../../SectionFrame/SectionFrame";
import type { SectionProps } from "../interfaces";
import { DICE_TYPES, MAX_QUANTITY, MIN_QUANTITY } from "./constants";

export default function DiceRollSection({ onClose }: SectionProps) {
  const [diceType, setDiceType] = useState<string>("D20");
  const [quantity, setQuantity] = useState("1");
  const { result, error, loading, run } = useServiceCall(rollDice);

  const quantityValue = parseIntInput(quantity);
  const isValid =
    quantityValue !== null &&
    quantityValue >= MIN_QUANTITY &&
    quantityValue <= MAX_QUANTITY;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isValid) void run(diceType, quantityValue);
  }

  return (
    <SectionFrame
      title="Rolagem de dados"
      onClose={onClose}
      error={error}
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Tipo de dado" htmlFor="diceType">
            <select
              className="control"
              id="diceType"
              value={diceType}
              onChange={(event) => setDiceType(event.target.value)}
            >
              {DICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quantidade" htmlFor="quantity">
            <input
              className="control"
              id="quantity"
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Field>

          <button type="submit" className="btn" disabled={loading || !isValid}>
            {loading ? "Rolando..." : "Rolar"}
          </button>
        </form>
      }
    >
      <DiceTray roll={result} />
    </SectionFrame>
  );
}
