import { useEffect } from "react";
import { CloseIcon } from "../icons/Icons";
import type { SectionFrameProps } from "./interfaces";

export default function SectionFrame({
  title,
  onClose,
  controls,
  error,
  children,
}: SectionFrameProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <section
      aria-label={title}
      className="flex flex-col gap-5 rounded-xl border border-line bg-[#100e0c] px-6 pt-5 pb-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-medium">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar e voltar à tela principal"
          className="grid size-9 cursor-pointer place-items-center rounded-lg border border-transparent text-muted hover:border-line hover:text-ink"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(200px,250px)_1px_1fr]">
        <div className="min-w-0">{controls}</div>
        <div className="h-px bg-line md:h-auto" aria-hidden="true" />
        <div className="min-w-0">
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-[#5a2019] bg-danger-bg px-3.5 py-3 text-sm text-danger"
            >
              {error}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}
