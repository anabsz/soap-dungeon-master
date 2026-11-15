import type { LucideIcon } from "lucide-react";

export default function MenuCard({
  title,
  description,
  Icon,
  onClick,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-29 cursor-pointer flex-col items-start gap-1.5 rounded-xl border border-transparent bg-secondary px-5 py-[18px] text-left transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <Icon className="mb-2 size-[22px] text-primary" aria-hidden="true" />
      <span className="text-base font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}
