import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'px-6 py-3 rounded-xl font-button transition-opacity disabled:opacity-50'
  const variants = {
    primary: 'bg-primary-container text-white hover:opacity-90',
    secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
    outline: 'border border-outline-variant text-on-surface hover:bg-surface-container',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
