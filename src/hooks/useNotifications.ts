
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { 
  fetchNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotificationSettings,
  updateNotificationSettings
} from '@/api/notificationApi';
import type { Notification } from '@/api/notificationApi';

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

  const fetchNotificationsData = async () => {
    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      // Fetch notifications from database
      const notificationsData = await fetchNotifications();
      
      // Fetch notification settings from database
      const settingsData = await fetchNotificationSettings();
      
      const formattedNotifications: NotificationItem[] = notificationsData.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        timestamp: notification.createdAt,
        read: notification.read
      }));

      // Convert settings to UI format
      const formattedSettings: NotificationSetting[] = [
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'email',
          enabled: settingsData.emailNotifications
        },
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          description: 'Receive push notifications in browser',
          type: 'push',
          enabled: settingsData.pushNotifications
        },
        {
          id: 'sms_notifications',
          title: 'SMS Notifications',
          description: 'Receive notifications via SMS',
          type: 'sms',
          enabled: settingsData.smsNotifications
        }
      ];

      setNotifications(formattedNotifications);
      setSettings(formattedSettings);
      
      return { notifications: formattedNotifications, settings: formattedSettings };
    }, 'fetchNotifications');
    
    setIsLoading(false);
    return result.data;
  };

  const markAsRead = async (notificationId: string) => {
    await handleAsyncError(async () => {
      await markNotificationAsRead(notificationId);

      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    }, 'markNotificationAsRead');
  };

  const markAllAsRead = async () => {
    await handleAsyncError(async () => {
      await markAllNotificationsAsRead();

      setNotifications(prev => prev.map(notification => 
        ({ ...notification, read: true })
      ));
    }, 'markAllNotificationsAsRead');
  };

  const toggleSetting = async (settingId: string) => {
    await handleAsyncError(async () => {
      const currentSetting = settings.find(s => s.id === settingId);
      if (!currentSetting) return;

      // Update local state immediately
      setSettings(prev => prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      ));
      
      // Update in database
      const updateData: any = {};
      switch (settingId) {
        case 'email_notifications':
          updateData.emailNotifications = !currentSetting.enabled;
          break;
        case 'push_notifications':
          updateData.pushNotifications = !currentSetting.enabled;
          break;
        case 'sms_notifications':
          updateData.smsNotifications = !currentSetting.enabled;
          break;
      }

      await updateNotificationSettings(updateData);
    }, 'toggleNotificationSetting');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  return {
    notifications,
    settings,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toggleSetting,
    refreshData: fetchNotificationsData
  };
}
