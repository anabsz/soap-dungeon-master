import { useEffect, type ReactNode } from "react";
import { CircleAlert, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Moldura das seções: título, "x" para voltar, formulário | resultado. */
export default function SectionFrame({
  title,
  onClose,
  controls,
  error,
  emptyMessage,
  children,
}: {
  title: string;
  onClose: () => void;
  /** Coluna da esquerda (formulário). */
  controls: ReactNode;
  /** Se informado, é exibido no lugar do resultado. */
  error?: string | null;
  /** Texto exibido enquanto não há resultado (children nulo). */
  emptyMessage: string;
  /** Coluna da direita (resultado). */
  children?: ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Card role="region" aria-label={title} className="gap-5 bg-[#100e0c] pt-5 pb-6">
      <CardHeader>
        <CardTitle className="text-[22px] font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Fechar e voltar à tela principal"
          className="text-muted-foreground"
        >
          <X />
        </Button>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-[minmax(200px,250px)_1px_1fr]">
        <div className="min-w-0">{controls}</div>
        <div className="h-px bg-border md:h-auto" aria-hidden="true" />
        <div className="min-w-0">
          {error ? (
            <Alert variant="destructive" className="bg-destructive/10">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            (children ?? (
              <div className="grid min-h-40 place-items-center rounded-[10px] border border-dashed text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
