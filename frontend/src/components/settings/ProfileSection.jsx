import React, { useState } from 'react';
import { User, Upload, Edit2, Check, X, AlertCircle } from 'lucide-react';

const ProfileSection = ({ profileData, handleProfileUpdate, handleFileUpload, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(profileData);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleProfileUpdate(tempData);
      setProfileData(tempData);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'CST', label: 'CST (Central Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' }
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center space-x-2 px-10 py-2 text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {tempData.profilePicture ? (
                <img 
                  src={tempData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-4" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                <Upload className="w-4 h-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</h4>
            <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size 2MB</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={tempData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={tempData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={tempData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Zone
            </label>
            <select
              name="timezone"
              value={tempData.timezone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Company Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={tempData.company}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Address
              </label>
              <input
                type="text"
                name="address"
                value={tempData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${!isEditing && 'opacity-75 cursor-not-allowed'}`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <span className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSection;