// components/Button.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Button({ 
  children, 
  href, 
  onClick, 
  variant = 'primary', 
  className = '' 
}: ButtonProps) {
  const baseClasses = 'inline-block px-6 py-3 rounded font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800',
    secondary: 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-50'
  };
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type="button" onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
}