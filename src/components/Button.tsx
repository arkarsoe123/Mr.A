import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: Props) {
  return (
    <button className={`inline-flex items-center justify-center ${className}`} {...props}>
      {children}
    </button>
  );
}
