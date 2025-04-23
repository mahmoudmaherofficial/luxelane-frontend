'use client'
import React from 'react'
import classNames from 'classnames'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | danger | outline
  size = 'md', // sm | md | lg
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'rounded-md font-medium transition-colors focus:outline-none'

  const variantStyles = {
    primary:
      'bg-slate-900 text-slate-100 hover:bg-slate-800 active:bg-slate-700',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-700 text-slate-100 hover:bg-red-800 active:bg-red-900',
    outline:
      'border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-slate-100 focus:ring-sky-500',
  }

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  }

  const allClasses = classNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    { 'opacity-50 cursor-not-allowed': disabled },
    className
  )

  return (
    <button
      type={type}
      onClick={onClick}
      className={allClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
