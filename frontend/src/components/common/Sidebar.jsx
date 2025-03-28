import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import icons from Lucide
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  WalletCards
} from 'lucide-react';

// Main Sidebar component with dark mode and collapse functionality
const Sidebar = ({ isDarkMode, toggleDarkMode, isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  // State for settings panel and notifications
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const settingsRef = useRef(null);

  // Toggle settings panel visibility
  const toggleSettings = () => setShowSettings(!showSettings);

  // Handle click outside settings panel to close it
  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setShowSettings(false);
    }
  };

  // Add/remove event listener for clicking outside settings
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items
  const navItems = [
    { path: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/resume-upload', icon: <FileText className="w-5 h-5" />, label: 'Resumes' },
    // { path: '/job-matching', icon: <Users className="w-5 h-5" />, label: 'Job Matching' },
    { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { path: '/payments', icon: <WalletCards className="w-5 h-5" />, label: 'Payments' }
  ];

  return (
    // Main sidebar container with collapse animation
    <div className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo and collapse button header */}
      <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 px-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {isCollapsed ? "NH" : "NeoHire"}
          </h1>
        </div>
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Navigation menu */}
      <nav className="p-4" aria-label="Main navigation">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all
                  ${location.pathname === item.path 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme toggle */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && (
            <span className="ml-3">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
