import type { MenuCardProps } from "./interfaces";

export default function MenuCard({
  title,
  description,
  Icon,
  onClick,
}: MenuCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-29 cursor-pointer flex-col items-start gap-1.5 rounded-[10px] border border-transparent bg-card px-5 py-[18px] text-left transition-colors hover:border-gold-soft hover:bg-card-hover"
    >
      <span className="mb-2 flex text-gold">
        <Icon />
      </span>
      <span className="text-base font-semibold">{title}</span>
      <span className="text-xs text-muted">{description}</span>
    </button>
  );
}
