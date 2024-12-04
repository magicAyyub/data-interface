import React from 'react';

export const Alert = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'p-4 rounded-lg flex items-center gap-2';
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800 border-l-4 border-red-500'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '' }) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
};