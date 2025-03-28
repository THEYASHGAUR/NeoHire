import React from 'react';
import { FileText, Upload, History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadCTA = () => {
  const [] = React.useState(0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Quick Upload Center
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Need to upload resumes or JDs? Get started below!
          </p>
        </div>
        <div className="relative">
        </div>
      </div>

      <Link
        to="/resume-upload"
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 group"
      >
        <div className="flex items-center">
          <Upload className="w-5 h-5 mr-3" />
          <span className="font-medium">Upload Files</span>
        </div>
        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default UploadCTA;