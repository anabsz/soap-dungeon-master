import type { ReactNode } from "react";

export interface SectionFrameProps {
  title: string;
  onClose: () => void;
  /** Coluna da esquerda (formulário). */
  controls: ReactNode;
  /** Se informado, é exibido no lugar do resultado. */
  error?: string | null;
  /** Coluna da direita (resultado). */
  children: ReactNode;
}
