import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationItem = ({ notification, onRemove }) => {
  const icons = {
    success: <FiCheck className="text-green-500" size={20} />,
    error: <FiAlertCircle className="text-red-500" size={20} />,
    info: <FiInfo className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 mb-2 rounded-lg border ${colors[notification.type]} shadow-sm`}
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-slate-900">{notification.message}</p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="ml-4 text-slate-400 hover:text-slate-500"
      >
        <FiX size={18} />
      </button>
    </motion.div>
  );
};

const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;