
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  type: 'email' | 'push' | 'sms';
  enabled: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAsyncError } = useErrorHandler();

  const fetchNotifications = async () => {
    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockNotifications: NotificationItem[] = [
        {
          id: '1',
          title: 'New Job Assignment',
          message: 'You have been assigned to repair HVAC at 123 Main St',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false
        },
        {
          id: '2',
          title: 'Training Reminder',
          message: 'Your safety certification expires in 30 days',
          type: 'warning',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: false
        },
        {
          id: '3',
          title: 'Job Completed',
          message: 'Customer rated your service 5 stars!',
          type: 'success',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          read: true
        }
      ];

      const mockSettings: NotificationSetting[] = [
        {
          id: 'job_assignments',
          title: 'Job Assignments',
          description: 'Get notified when you receive new job assignments',
          type: 'push',
          enabled: true
        },
        {
          id: 'schedule_changes',
          title: 'Schedule Changes',
          description: 'Receive alerts about schedule modifications',
          type: 'email',
          enabled: true
        },
        {
          id: 'training_reminders',
          title: 'Training Reminders',
          description: 'Reminders about upcoming training and certifications',
          type: 'email',
          enabled: false
        },
        {
          id: 'emergency_alerts',
          title: 'Emergency Alerts',
          description: 'Critical system alerts and emergency notifications',
          type: 'sms',
          enabled: true
        }
      ];

      setNotifications(mockNotifications);
      setSettings(mockSettings);
      
      return { notifications: mockNotifications, settings: mockSettings };
    }, 'fetchNotifications');
    
    setIsLoading(false);
    return result.data;
  };

  const markAsRead = async (notificationId: string) => {
    await handleAsyncError(async () => {
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    }, 'markNotificationAsRead');
  };

  const markAllAsRead = async () => {
    await handleAsyncError(async () => {
      setNotifications(prev => prev.map(notification => 
        ({ ...notification, read: true })
      ));
    }, 'markAllNotificationsAsRead');
  };

  const toggleSetting = async (settingId: string) => {
    await handleAsyncError(async () => {
      setSettings(prev => prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      ));
    }, 'toggleNotificationSetting');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    settings,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toggleSetting,
    refreshData: fetchNotifications
  };
}
