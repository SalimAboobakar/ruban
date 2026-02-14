import React from 'react';
import BoldSymbol from '../../assets/Bold.png';
import MediumSymbol from '../../assets/Medium.png';
import LightSymbol from '../../assets/light.png';

interface CurrencySymbolProps {
  className?: string;
  size?: number;
  variant?: 'bold' | 'medium' | 'light';
}

/**
 * Omani Rial Currency Symbol Component
 * Uses the custom symbol from assets
 */
export function CurrencySymbol({ 
  className = '', 
  size = 20,
  variant = 'medium' 
}: CurrencySymbolProps) {
  const symbolSrc = variant === 'bold' ? BoldSymbol : variant === 'light' ? LightSymbol : MediumSymbol;
  
  return (
    <img 
      src={symbolSrc} 
      alt="ر.ع" 
      className={`inline-block align-middle ${className}`}
      style={{ width: size, height: size, verticalAlign: 'middle' }}
    />
  );
}

