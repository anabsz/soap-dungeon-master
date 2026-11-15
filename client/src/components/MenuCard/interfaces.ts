import type { ComponentType } from "react";
import type { IconProps } from "../icons/interfaces";

export interface MenuCardProps {
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
  onClick: () => void;
}
