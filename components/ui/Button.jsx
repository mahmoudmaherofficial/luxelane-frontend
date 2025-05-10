const variantClasses = {
  primary: "bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-800",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-700 active:bg-secondary-800",
  tertiary: "bg-tertiary-500 text-white hover:bg-tertiary-700 active:bg-tertiary-800",
  black: "bg-black text-white hover:bg-gray-900 active:bg-gray-800",
  "outline-primary": "border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100",
  "outline-secondary": "border border-secondary-500 text-secondary-500 hover:bg-secondary-50 active:bg-secondary-100",
  "outline-tertiary": "border border-tertiary-500 text-tertiary-500 hover:bg-tertiary-50 active:bg-tertiary-100",
  "outline-black": "border border-black text-black hover:bg-gray-100 active:bg-gray-200",
  danger: "bg-red-700 text-white hover:bg-red-800 active:bg-red-900",
};

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const baseClasses = "rounded-full transition-colors font-semibold";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  type = "button",
  onClick,
}) => {
  return (
    <button 
      type={type}
      disabled={disabled}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
