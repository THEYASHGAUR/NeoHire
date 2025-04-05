import React from 'react';
import { Check } from 'lucide-react';

const SuccessMessage = () => (
  <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-fade-in-up z-50">
    <div className="flex items-center space-x-2">
      <Check className="w-5 h-5" />
      <span>Successfully uploaded! Redirecting to job matching...</span>
    </div>
  </div>
);

export default SuccessMessage;