import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost'
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'px-6 py-3 rounded-xl font-button transition-opacity disabled:opacity-50'
  const variants: Record<string, string> = {
    primary: 'bg-primary-container text-white hover:opacity-90',
    secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
    outline: 'border border-outline-variant text-on-surface hover:bg-surface-container',
    gold: 'bg-secondary-container text-on-secondary-container hover:brightness-110',
    ghost: 'text-primary hover:bg-primary/5',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
