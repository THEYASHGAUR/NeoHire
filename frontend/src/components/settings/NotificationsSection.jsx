import React, { useState } from "react";
import { Bell, Mail, Clock } from "lucide-react";

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState({
    email: {
      jobAlerts: false,
      securityAlerts: true,
    },
    push: {
      desktop: true,
      mobile: true,
      browser: false,
    },
    frequency: "instant", // 'instant', 'daily', 'weekly'
  });

  const handleToggle = (category, setting) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleFrequencyChange = (value) => {
    setNotifications((prev) => ({
      ...prev,
      frequency: value,
    }));
  };

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      {/* Email Notifications */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5" /> Email Notifications
        </h3>
        <div className="mt-3 space-y-3">
          {Object.entries(notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                onClick={() => handleToggle("email", key)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  ${value ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"}`}
              >
                <span
                  className={`absolute left-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Push Notifications */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5" /> Push Notifications
        </h3>
        <div className="mt-3 space-y-3">
          {Object.entries(notifications.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {key} Notifications
              </span>
              <button
                onClick={() => handleToggle("push", key)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  ${value ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"}`}
              >
                <span
                  className={`absolute left-1 h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Frequency */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5" /> Notification Frequency
        </h3>
        <div className="mt-3 flex gap-3">
          {["instant", "daily", "weekly"].map((frequency) => (
            <button
              key={frequency}
              onClick={() => handleFrequencyChange(frequency)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all 
                ${
                  notifications.frequency === frequency
                    ? "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NotificationsSection;
