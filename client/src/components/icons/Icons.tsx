import type { ReactNode } from "react";
import type { IconProps } from "./interfaces";

function Svg({ size = 22, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function DiceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
    </Svg>
  );
}

export function SwordsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4l9 9M4 4v4M4 4h4" />
      <path d="M20 4l-9 9M20 4v4M20 4h-4" />
      <path d="M11 15l-4 4M13 15l4 4M6 17l2 2M18 17l-2 2" />
    </Svg>
  );
}

export function SkullIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3a8 8 0 0 0-8 8c0 2.6 1.3 4.5 3 5.6V20h10v-3.4c1.7-1.1 3-3 3-5.6a8 8 0 0 0-8-8z" />
      <circle cx="9" cy="11.5" r="1.4" />
      <circle cx="15" cy="11.5" r="1.4" />
      <path d="M10.5 20v-2.5M13.5 20v-2.5" />
    </Svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6.5C10.3 5.2 8 4.7 4 4.7v13c4 0 6.3.5 8 1.8 1.7-1.3 4-1.8 8-1.8v-13c-4 0-6.3.5-8 1.8z" />
      <path d="M12 6.5v13" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Svg>
  );
}
