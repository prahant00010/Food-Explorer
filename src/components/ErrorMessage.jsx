import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
      <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
      <p className="text-red-800">{message}</p>
    </div>
  );
}

export default ErrorMessage;
