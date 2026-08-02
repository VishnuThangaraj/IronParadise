import type { ReactNode } from "react";
import Button from "./Button";

interface HeaderButtonProps {
  icon: ReactNode;
  text: string;
  variant: "secondary" | "blue" | "green";
  onClick?: () => void;
  ariaLabel?: string;
  iconClassName?: string;
}

const HeaderButton = ({
  icon,
  text,
  variant,
  onClick,
  ariaLabel,
  iconClassName = "",
}: HeaderButtonProps) => (
  <Button
    variant={variant}
    onClick={onClick}
    className="w-auto! rounded-full! px-4! py-2!"
    aria-label={ariaLabel}
  >
    <div className="text-xs font-bold flex justify-between gap-2 items-center align-middle">
      <div className={iconClassName}>{icon}</div>
      <div>{text}</div>
    </div>
  </Button>
);

export default HeaderButton;
