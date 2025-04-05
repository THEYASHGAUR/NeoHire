import React, { useState } from 'react';
import { Bell, Lock, Shield, CreditCard, User, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ProfileSection from '../../components/settings/ProfileSection';
import SecuritySection from '../../components/settings/SecuritySection';
import NotificationsSection from '../../components/settings/NotificationsSection';
import PrivacySection from '../../components/settings/PrivacySection';
import BillingSection from '../../components/settings/BillingSection';
import SettingsModal from '../../components/settings/SettingsModal';

const Settings = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
    timezone: user?.timezone || 'UTC',
    profilePicture: user?.profilePicture || null
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      setError('Failed to logout. Please try again.');
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Profile updated:', updatedData);
      setProfileData(updatedData);
    } catch (error) {
      setError('Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemClick = (content) => {
    try {
      setError('');
      setActiveContent(content);
      setShowModal(true);
    } catch (error) {
      setError('Failed to open settings section');
    }
  };

  const handleCloseModal = () => {
    try {
      setShowModal(false);
      setActiveContent(null);
      setError('');
    } catch (error) {
      setError('Failed to close modal');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: 'Profile Information',
          description: 'Update your account details and company information',
          content: (
            <ProfileSection
              profileData={profileData}
              handleProfileUpdate={handleProfileUpdate}
              handleFileUpload={handleFileUpload}
              setProfileData={setProfileData}
              isLoading={isLoading}
            />
          )
        },
        {
          icon: <Lock className="w-5 h-5" />,
          label: 'Password & Security',
          description: 'Change password and security settings',
          content: <SecuritySection />
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell className="w-5 h-5" />,
          label: 'Notifications',
          description: 'Manage your notification preferences',
          content: <NotificationsSection />
        },
        {
          icon: <Shield className="w-5 h-5" />,
          label: 'Privacy',
          description: 'Control your privacy settings and account deletion',
          content: <PrivacySection />
        }
      ]
    },
    {
      title: 'Billing',
      items: [
        {
          icon: <CreditCard className="w-5 h-5" />,
          label: 'Subscription & Billing',
          description: 'Manage your subscription and billing details',
          content: <BillingSection />
        }
      ]
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
            {error}
          </h1>
          <button
            onClick={() => setError('')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Back to Dashboard Button */}
      <Link 
        to="/"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleItemClick(item.content)}
                    className="w-full flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    disabled={isLoading}
                  >
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <SettingsModal isOpen={showModal} onClose={handleCloseModal}>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            activeContent
          )}
        </SettingsModal>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;