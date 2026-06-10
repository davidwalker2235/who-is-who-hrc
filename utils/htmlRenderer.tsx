import React from 'react';

interface HtmlRendererProps {
  text: string;
  as?: 'p' | 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

/**
 * Componente que renderiza texto condicionalmente como HTML o texto plano
 * Detecta automáticamente si el texto contiene HTML y lo renderiza apropiadamente
 */
export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ 
  text, 
  as = 'p', 
  className 
}) => {
  const hasHtml = text.includes('<');
  
  if (hasHtml) {
    // Cuando hay HTML, usar span para elementos de bloque para evitar anidación inválida
    const safeElement = (as === 'p' || as === 'h1' || as === 'h2' || as === 'h3' || as === 'h4' || as === 'h5' || as === 'h6') ? 'span' : as;
    
    switch (safeElement) {
      case 'div':
        return <div className={className} dangerouslySetInnerHTML={{ __html: text }} />;
      case 'span':
        return <span className={className} dangerouslySetInnerHTML={{ __html: text }} />;
      default:
        return <span className={className} dangerouslySetInnerHTML={{ __html: text }} />;
    }
  } else {
    switch (as) {
      case 'div':
        return <div className={className}>{text}</div>;
      case 'span':
        return <span className={className}>{text}</span>;
      case 'h1':
        return <h1 className={className}>{text}</h1>;
      case 'h2':
        return <h2 className={className}>{text}</h2>;
      case 'h3':
        return <h3 className={className}>{text}</h3>;
      case 'h4':
        return <h4 className={className}>{text}</h4>;
      case 'h5':
        return <h5 className={className}>{text}</h5>;
      case 'h6':
        return <h6 className={className}>{text}</h6>;
      default:
        return <p className={className}>{text}</p>;
    }
  }
}; 