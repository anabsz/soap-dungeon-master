import { useState } from "react";
import {
  rollDice,
  parseDiceRollResponse,
} from "./services/soapClient";import "./App.css";
import type { DiceRollResult } from "./services/interfaces";

export default function App() {
  const [diceType, setDiceType] = useState("D20");
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<DiceRollResult | null>(null);  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRollDice() {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const response = await rollDice(diceType, quantity);
      setResult(parseDiceRollResponse(response));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível realizar a rolagem."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Dungeon Master</h1>
      <p className="subtitle">Assistente de aventuras RPG</p>

      <section className="card">
        <h2>Rolagem de dados</h2>

        <div className="form-group">
          <label htmlFor="diceType">Tipo de dado</label>

          <select
            id="diceType"
            value={diceType}
            onChange={(event) => setDiceType(event.target.value)}
          >
            <option value="D4">D4</option>
            <option value="D6">D6</option>
            <option value="D8">D8</option>
            <option value="D10">D10</option>
            <option value="D12">D12</option>
            <option value="D20">D20</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantidade</label>

          <input
            id="quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(event) =>
              setQuantity(Number(event.target.value))
            }
          />
        </div>

        <button
          type="button"
          onClick={handleRollDice}
          disabled={loading || quantity < 1 || quantity > 100}
        >
          {loading ? "Rolando..." : "Rolar dados"}
        </button>

        {error && (
          <p className="error">{error}</p>
        )}

        {result && (
          <div className="result">
            <h3>Resultado da rolagem</h3>

            <p><strong>Dado:</strong> {result.diceType}</p>

            <p><strong>Resultados:</strong></p>
            <div className="dice-results">
              {result.results.map((value, index) => (
                <span key={index} className="dice-value">
                  {value}
                </span>
              ))}
            </div>

            <p><strong>Total:</strong> {result.total}</p>
          </div>
        )}
      </section>
    </main>
  );
}