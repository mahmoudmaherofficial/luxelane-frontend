import React from 'react';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  accept,
  minLength = 0,
  label,
  className,
  pattern,
  min,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        accept={accept}
        className={`peer w-full border border-gray-300 rounded-md px-3 py-2 text-primary-900 text-sm placeholder-transparent focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 peer-invalid:border-red-700 peer-invalid:ring-red-700 peer-valid:border-green-500 ${className}`}
        minLength={minLength}
        pattern={pattern}
        min={min}
      />
      <label
        htmlFor={name}
        className="absolute select-none left-3 -top-2.5 capitalize text-primary-500 bg-white px-1 py-0.5 text-xs transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary-500 peer-focus:bg-white peer-focus:px-1 peer-focus:py-0.5 peer-invalid:border-red-700"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
