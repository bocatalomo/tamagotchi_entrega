import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const handleDragStart = () => {
    setIsDragging(true);
    startY.current = 0;
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    startY.current = info.offset.y;
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (startY.current < -50) { // Si se desliza hacia arriba más de 50px
      onRemove(notification.id);
    } else {
      setIsDragging(false);
    }
  };

  return (
    <motion.div
      key={notification.id}
      className={`notification ${notification.type}`}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        y: isDragging ? startY.current : 0,
        opacity: isDragging ? Math.max(0.3, 1 - Math.abs(startY.current) / 100) : 1,
      }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="notification-content">
        {notification.message}
      </div>
      <div className="swipe-hint">↑ Desliza para cerrar</div>
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
