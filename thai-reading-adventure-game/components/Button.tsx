
import React from 'react';

interface ButtonProps {
  onClick?: () => void; // onClick is optional if type is submit
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  iconClass?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset'; // Added type prop
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', iconClass, disabled = false, type = 'button' }) => {
  const baseStyle = "px-6 py-3 border-none rounded-full text-[1.1rem] font-semibold font-['Kanit'] cursor-pointer transition-all duration-300 ease-in-out inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  let colorClasses = ''; 
  if (variant === 'primary') {
    colorClasses = 'bg-[#ff6b6b] text-white hover:-translate-y-0.5 shadow-[#ff6b6b]/40 focus:ring-[#ff6b6b]';
  } else { // secondary
    colorClasses = 'bg-[#118ab2] text-white hover:-translate-y-0.5 shadow-[#118ab2]/40 focus:ring-[#118ab2]';
  }
  
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type} // Use the type prop
      onClick={onClick}
      className={`${baseStyle} ${colorClasses} ${className} ${disabledStyle}`}
      disabled={disabled}
    >
      {iconClass && <i className={`${iconClass}`} aria-hidden="true"></i>}
      {children}
    </button>
  );
};

export default Button;
