import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiAlertCircle, FiInfo, FiX } = FiIcons;

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`fixed top-4 right-4 z-50 ${colors[notification.type]} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md`}
      >
        <SafeIcon icon={icons[notification.type]} className="w-5 h-5" />
        <span className="flex-1">{notification.message}</span>
        <button onClick={onClose} className="hover:opacity-80">
          <SafeIcon icon={FiX} className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;