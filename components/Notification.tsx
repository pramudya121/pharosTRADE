
import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = 'fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg text-white text-sm';
  const typeClasses = type === 'success' ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
};
