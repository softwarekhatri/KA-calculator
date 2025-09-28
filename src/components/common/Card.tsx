
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Card;
