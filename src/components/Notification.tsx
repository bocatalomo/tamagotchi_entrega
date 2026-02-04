import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationVariants } from '../utils/animationVariants';

interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<{ 
  notification: NotificationItem; 
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  return (
    <motion.div
      key={notification.id}
      className={`notification ${notification.type}`}
      initial={{ opacity: 0, scale: 0.9, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2 } }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 200 }}
      dragElastic={0.1}
      dragSnapToOrigin={false}
      onDragEnd={(_, info) => {
        if (info.offset.y < -80) {
          onRemove(notification.id);
        }
      }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1001 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="notification-content">
        {notification.message}
      </div>
      <motion.div 
        className="swipe-hint"
        animate={{ opacity: 0.5 }}
      >
        ↑ Desliza hacia arriba
      </motion.div>
    </motion.div>
  );
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
}) => {
  return (
    <div className="notification-container">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface NotificationToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
  onClose?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      className={`notification ${type}`}
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }}
    >
      {message}
    </motion.div>
  );
};

export default NotificationContainer;
