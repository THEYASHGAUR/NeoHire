import React from 'react';
import { Check, X } from 'lucide-react';

const PlanUpgradeModal = ({ isOpen, onClose, plans, currentPlan, onUpgrade, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl shadow-xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Choose a Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border-2 ${
                    plan.id === currentPlan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onUpgrade(plan.id)}
                    disabled={isLoading || plan.id === currentPlan.id}
                    className={`w-full px-4 py-2 rounded-md ${
                      plan.id === currentPlan.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {plan.id === currentPlan.id ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradeModal;