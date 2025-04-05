import React, { useState, useCallback } from 'react';
import { Users, FileText, Briefcase, TrendingUp, LogOut, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/common/Sidebar';
import AnalyticsCard from '../../components/dashboard/AnalyticsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import UploadCTA from '../../components/dashboard/UploadCTA';


const Dashboard = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg backdrop-blur-lg backdrop-filter"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Your Recruitment Dashboard!! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered insights to speed up your hiring decisions.
                  <br />
                  Let's find the best candidates today!
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-blue-600 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Upload CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <UploadCTA />
          </motion.div>

          {/* Analytics Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: "Total Candidates",
                value: "1,234",
                icon: <Users className="w-6 h-6 text-blue-500" />,
                trend: { value: 12, isPositive: true }
              },
              {
                title: "Resumes Processed",
                value: "856",
                icon: <FileText className="w-6 h-6 text-purple-500" />,
                trend: { value: 8, isPositive: true }
              },
              {
                title: "Active Jobs",
                value: "42",
                icon: <Briefcase className="w-6 h-6 text-green-500" />,
                trend: { value: 5, isPositive: true }
              },
              {
                title: "Success Rate",
                value: "89%",
                icon: <TrendingUp className="w-6 h-6 text-yellow-500" />,
                trend: { value: 3, isPositive: true }
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AnalyticsCard {...card} />
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <RecentActivity />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;