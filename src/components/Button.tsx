// components/Button.tsx
import React from 'react';

type ButtonColor = 'blue' | 'green' | 'red' | 'grey' | 'white';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: ButtonColor;
  fullWidth?: boolean;
}

const colorClasses: Record<ButtonColor, string> = {
  blue: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
  green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white',
  red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
  grey: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 text-white',
  white: 'bg-white hover:bg-gray-100 focus:ring-gray-200 text-gray-700 border border-gray-300',
};

export const Button: React.FC<ButtonProps> = ({ 
  color, 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${colorClasses[color]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
