import React from 'react';

const variants = {
  primary:
    'bg-primary-container text-white rounded-xl hover:brightness-110 active:brightness-90',
  secondary:
    'border border-outline text-primary rounded-xl hover:bg-primary/5 active:bg-primary/10',
  ghost: 'text-primary hover:bg-primary/5 active:bg-primary/10',
};

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
