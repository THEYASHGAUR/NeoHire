import React, { useState } from 'react';
import { Shield, Eye, Trash2, AlertCircle } from 'lucide-react';

const PrivacySection = () => {
  const [privacy, setPrivacy] = useState({
    dataSharing: {
      ShareAnalytics: false,
      ShareProfile: true,
    },
    ActivityStatus: true,
    DeleteConfirmation: false
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = (category, setting) => {
    if (typeof setting === 'string') {
      setPrivacy(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !prev[category][setting]
        }
      }));
    } else {
      setPrivacy(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    console.log('Account deletion requested');
  };

  return (
    <div className="space-y-8">
      {/* Data Sharing */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Data Sharing Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(privacy.dataSharing).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300">
                {key.split(/(?=[A-Z])/).join(' ')}
              </label>
              <button
                onClick={() => handleToggle('dataSharing', key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Status */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Activity Status
        </h3>
        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300">
            Show when you're active
          </label>
          <button
            onClick={() => handleToggle('activityStatus')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              privacy.activityStatus ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacy.activityStatus ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Trash2 className="w-5 h-5 mr-2" />
          Account Deletion
        </h3>
        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
};

export default PrivacySection;