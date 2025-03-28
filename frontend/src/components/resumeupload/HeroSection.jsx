import React from 'react';
import { motion } from "framer-motion";
import { Check } from 'lucide-react';

const HeroSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8 }}
    className="text-center mb-12 relative"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
    
    <motion.h1 
      className="text-4xl sm:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Streamlined Resume Submission
      </span>
      <br />
      <span className="sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
      AI-Powered Screening & Blockchain-Backed Verification
      </span>
    </motion.h1>
    
    <motion.p 
      className="text-lg sm:text-l text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      Upload resumes in seconds. Let AI analyze, verify, & match candidates instantly.
      <span className="block mt-2 text-blue-500 dark:text-blue-400">
        Powered by blockchain technology for verified credentials
      </span>
    </motion.p>
    
    <motion.div
      className="flex justify-center gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Check className="w-5 h-5 text-green-500" />
        AI Analysis
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Check className="w-5 h-5 text-green-500" />
        Blockchain Verified
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Check className="w-5 h-5 text-green-500" />
        Instant Matching
      </div>
    </motion.div>
  </motion.div>
);

export default HeroSection;