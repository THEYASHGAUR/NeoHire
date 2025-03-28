import React, { useState } from 'react';
import { Clock, FileText, Briefcase, User, Star, Calendar } from 'lucide-react';

const activities = [
  { 
    id: 1, 
    type: 'resume', 
    title: 'Senior React Developer Resume Uploaded',
    description: 'AI Match Score: 92% - Perfect fit for Frontend Lead position',
    timestamp: '2 hours ago',
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    id: 2, 
    type: 'job', 
    title: 'Frontend Developer Position Posted',
    description: '12 matching candidates found in database',
    timestamp: '3 hours ago',
    icon: <Briefcase className="w-5 h-5 text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20'
  },
  { 
    id: 3, 
    type: 'candidate', 
    title: 'John Doe Shortlisted',
    description: 'For Senior Software Engineer position',
    timestamp: '4 hours ago',
    icon: <User className="w-5 h-5 text-green-500" />,
    color: 'bg-green-50 dark:bg-green-900/20'
  },
  { 
    id: 4, 
    type: 'interview', 
    title: 'Technical Interview Scheduled',
    description: 'With Sarah Smith for UI/UX Designer role',
    timestamp: 'Tomorrow at 2 PM',
    icon: <Calendar className="w-5 h-5 text-yellow-500" />,
    color: 'bg-yellow-50 dark:bg-yellow-900/20'
  }
];

const RecentActivity = () => {
  const [starredActivities, setStarredActivities] = useState(new Set());

  const toggleStar = (id) => {
    setStarredActivities(prev => {
      const newStarred = new Set(prev);
      if (newStarred.has(id)) {
        newStarred.delete(id);
      } else {
        newStarred.add(id);
      }
      return newStarred;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`${activity.color} p-4 rounded-lg transition-all duration-300 hover:scale-101 group`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.timestamp}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button 
                  onClick={() => toggleStar(activity.id)}
                  className={`transition-colors duration-200 ${
                    starredActivities.has(activity.id)
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      starredActivities.has(activity.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;