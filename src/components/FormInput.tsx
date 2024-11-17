import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  pattern?: string;
  title?: string;
  placeholder?: string;
  type?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  value,
  onChange,
  required = false,
  pattern,
  title,
  placeholder,
  type = 'text'
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        pattern={pattern}
        title={title}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};
