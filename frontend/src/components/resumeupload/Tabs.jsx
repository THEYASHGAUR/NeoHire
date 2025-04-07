import React from 'react';
import { FileText, Briefcase } from 'lucide-react';

const Tabs = () => (
  <div className="flex border-b border-gray-200 dark:border-gray-700">
    <button
      className="flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200  text-blue-600 border-b-2 border-blue-600"
         
      
    >
      <div className="flex items-center justify-center space-x-2">
        <FileText className="w-5 h-5" />
        <span>Resume Upload</span>
      </div>
    </button>
    <button
      className="flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200  text-purple-600 border-b-2 border-purple-600"
      
     
    >
      <div className="flex items-center justify-center space-x-2">
        <Briefcase className="w-5 h-5" />
        <span>Job Description</span>
      </div>
    </button>
  </div>
);

export default Tabs;