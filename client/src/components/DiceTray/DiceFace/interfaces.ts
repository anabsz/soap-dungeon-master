export interface DiceFaceProps {
  value: number;
  /** Número de lados do dado (6 para D6, 20 para D20...). NaN se desconhecido. */
  sides: number;
  /** Posição na bandeja, usada no atraso da animação. */
  index: number;
}
