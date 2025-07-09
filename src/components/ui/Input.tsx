import { InputProps } from '@/types/common';
import { cn } from '@/lib/utils';

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  disabled = false,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#011640] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-all duration-200',
          'placeholder:text-[#9CA3AF]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 