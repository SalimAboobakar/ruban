import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

