import React, { useState } from 'react';
import { CreditCard, FileText, Star, Plus, Check, AlertCircle } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$0',
    cycle: 'month',
    features: [
      '20 job postings/month',
      'AI-powered resume screening',
      'Basic analytics',
      'Standard support'   
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$39',
    cycle: 'month',
    features: [
      'Unlimited job postings',
      'AI recruiting assistant - NeoAI',
      'Advanced analytics',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    cycle: 'month',
    features: [
      'Collaborative hiring features',
      'Advanced AI screening',
      'Custom analytics',
      '24/7 dedicated support',
      'API access'
    ]
  }
];

const BillingSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plans[0]); // Basic plan instead of Professional
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/24',
      isPrimary: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiry: '06/25',
      isPrimary: false
    }
  ]);

  const [billingHistory, setBillingHistory] = useState([
    {
      id: 'INV-2024-001',
      date: '2024-03-01',
      amount: '$29.00',
      status: 'Paid',
      invoice: '#'
    },
    {
      id: 'INV-2024-002',
      date: '2024-02-01',
      amount: '$29.00',
      status: 'Paid',
      invoice: '#'
    }
  ]);

  const handleUpgradePlan = async (planId) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement plan upgrade API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPlan = plans.find(p => p.id === planId);
      setCurrentPlan(newPlan);
      setShowUpgradeModal(false);
    } catch (err) {
      setError('Failed to upgrade plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement payment method addition
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate adding a new payment method
      const newMethod = {
        id: Date.now(),
        type: 'visa',
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        expiry: '12/25',
        isPrimary: false
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    } catch (err) {
      setError('Failed to add payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement set primary payment method API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isPrimary: method.id === id
      }));
      setPaymentMethods(updatedMethods);
    } catch (err) {
      setError('Failed to set primary payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement payment method removal API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      setPaymentMethods(updatedMethods);
    } catch (err) {
      setError('Failed to remove payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      )}
      {/* Current Plan */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Current Plan
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentPlan.name} Plan
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                {currentPlan.price} per {currentPlan.cycle}
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Upgrade Plan
            </button>
          </div>
          <div className="space-y-2">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal - Reduced size and improved layout */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upgrade Plan
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-3 rounded-lg border ${
                    currentPlan.id === plan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:border-blue-500 transition-colors`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.price} per {plan.cycle}
                      </p>
                    </div>
                    {currentPlan.id !== plan.id && (
                      <button
                        onClick={() => handleUpgradePlan(plan.id)}
                        className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Select'}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Methods
        </h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires {method.expiry}
                    {method.isPrimary && (
                      <span className="ml-2 text-blue-500">(Primary)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!method.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(method.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {isLoading ? 'Loading...' : 'Make Primary'}
                  </button>
                )}
                <button
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  {isLoading ? 'Loading...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddPaymentMethod}
            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            {isLoading ? 'Loading...' : <><Plus className="w-5 h-5 mr-2" /> Add Payment Method</>}
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Billing History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Invoice ID</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((bill) => (
                <tr key={bill.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 text-gray-900 dark:text-white">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-gray-900 dark:text-white">{bill.id}</td>
                  <td className="py-4 text-gray-900 dark:text-white">{bill.amount}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-sm text-green-600 bg-green-100 dark:bg-green-900/20 rounded">
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <a
                      href={bill.invoice}
                      className="text-blue-500 hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;