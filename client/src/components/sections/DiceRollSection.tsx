import { useState, type SubmitEvent } from "react";
import DiceTray from "@/components/DiceTray";
import Field from "@/components/Field";
import SectionFrame from "@/components/SectionFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useServiceCall } from "@/hooks/useServiceCall";
import { parseIntInput } from "@/lib/utils";
import { rollDice } from "@/services/soapClient";
import type { SectionProps } from "./interfaces";

const DICE_TYPES = ["D4", "D6", "D8", "D10", "D12", "D20"];
const MAX_QUANTITY = 100;

export default function DiceRollSection({ onClose }: SectionProps) {
  const [diceType, setDiceType] = useState("D20");
  const [quantity, setQuantity] = useState("1");
  const { result, error, loading, run } = useServiceCall(rollDice);

  const quantityValue = parseIntInput(quantity);
  const isValid =
    quantityValue !== null && quantityValue >= 1 && quantityValue <= MAX_QUANTITY;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (isValid) void run(diceType, quantityValue);
  }

  return (
    <SectionFrame
      title="Rolagem de dados"
      onClose={onClose}
      error={error}
      emptyMessage="Os dados rolados aparecem aqui."
      controls={
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Tipo de dado" htmlFor="diceType">
            <NativeSelect
              id="diceType"
              value={diceType}
              onChange={(event) => setDiceType(event.target.value)}
            >
              {DICE_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Quantidade" htmlFor="quantity">
            <Input
              id="quantity"
              type="number"
              min={1}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Field>

          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Rolando..." : "Rolar"}
          </Button>
        </form>
      }
    >
      {result && <DiceTray roll={result} />}
    </SectionFrame>
  );
}
