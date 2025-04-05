import React from 'react';
import { FileText, Briefcase } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="flex border-b border-gray-200 dark:border-gray-700">
    <button
      className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
        activeTab === 'resume'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
      onClick={() => setActiveTab('resume')}
    >
      <div className="flex items-center justify-center space-x-2">
        <FileText className="w-5 h-5" />
        <span>Resume Upload</span>
      </div>
    </button>
    <button
      className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
        activeTab === 'jd'
          ? 'text-purple-600 border-b-2 border-purple-600'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
      onClick={() => setActiveTab('jd')}
    >
      <div className="flex items-center justify-center space-x-2">
        <Briefcase className="w-5 h-5" />
        <span>Job Description</span>
      </div>
    </button>
  </div>
);

export default Tabs;