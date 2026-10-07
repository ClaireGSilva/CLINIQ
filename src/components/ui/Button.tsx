import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 
    'inline-flex items-center justify-center font-semibold transition-all whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-[#0F5A47] focus-visible:outline-offset-2';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg min-h-[36px]',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-xl min-h-[44px]',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl min-h-[48px]',
  }[size];

  const variantClasses = {
    primary: 'bg-[#0F5A47] text-white hover:bg-[#0C4738] shadow-xs shadow-[#0F5A47]/10',
    secondary: 'bg-[#E8F3EE] text-[#0F5A47] hover:bg-[#D5E8DF]',
    outline: 'border border-[#D5D8D4] text-[#1A1C1A] bg-white hover:bg-[#FAF9F5]',
    ghost: 'text-[#525A56] hover:text-[#0F5A47] hover:bg-[#FAF9F5]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Aguarde...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
