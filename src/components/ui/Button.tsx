import Link from "next/link";
import { ButtonProps } from "@/types/common";
import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  type = "button",
  href,
  target = "_blank",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#0476D9] text-white hover:bg-[#0366C4] focus:ring-[#0476D9] shadow-lg hover:shadow-xl",
    secondary:
      "bg-[#011640] text-white hover:bg-[#00070D] focus:ring-[#011640] shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-[#0476D9] text-[#0476D9] hover:bg-[#0476D9] hover:text-white focus:ring-[#0476D9]",
    ghost: "text-[#0476D9] hover:bg-[#0476D9]/10 focus:ring-[#0476D9]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
  };

  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} target={target} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
