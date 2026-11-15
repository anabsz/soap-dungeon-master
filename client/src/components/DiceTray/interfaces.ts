import type { DiceRollResult } from "../../services/interfaces";

export interface DiceTrayProps {
  /** null = ainda não rolou nada. */
  roll: DiceRollResult | null;
  /** Esconde a linha de total (quando o total já é mostrado em outro lugar). */
  hideTotal?: boolean;
}
