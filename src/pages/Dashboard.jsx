import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiDollarSign, FiShoppingCart, FiTrendingUp } = FiIcons;

const Dashboard = ({ showNotification }) => {
  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12%', icon: FiUsers, color: 'blue' },
    { title: 'Revenue', value: '$45,231', change: '+8%', icon: FiDollarSign, color: 'green' },
    { title: 'Orders', value: '1,234', change: '+23%', icon: FiShoppingCart, color: 'purple' },
    { title: 'Growth', value: '18.2%', change: '+5%', icon: FiTrendingUp, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecentActivity showNotification={showNotification} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickActions showNotification={showNotification} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;