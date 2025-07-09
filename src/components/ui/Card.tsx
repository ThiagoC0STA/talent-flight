import { CardProps } from '@/types/common';
import { cn } from '@/lib/utils';

export default function Card({
  children,
  className,
  onClick,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[#E5EAF1] shadow-sm',
        hover && 'hover:shadow-lg hover:border-[#0476D9]/20 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
} 