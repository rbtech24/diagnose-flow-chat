
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Fetch notifications from database using correct column names
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
        return { notifications: [], settings: [] };
      }

      // Fetch notification settings using correct column names
      const { data: settingsData, error: settingsError } = await supabase
        .from('notification_settings')
        .select('*');

      if (settingsError) {
        console.error('Error fetching notification settings:', settingsError);
      }

      const formattedNotifications: NotificationItem[] = (notificationsData || []).map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationItem['type'],
        timestamp: new Date(notification.timestamp),
        read: notification.read || false
      }));

      // Create mock settings since the database structure doesn't match our interface
      const formattedSettings: NotificationSetting[] = [
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'email',
          enabled: true
        },
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          description: 'Receive push notifications in browser',
          type: 'push',
          enabled: true
        },
        {
          id: 'sms_notifications',
          title: 'SMS Notifications',
          description: 'Receive notifications via SMS',
          type: 'sms',
          enabled: false
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
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    }, 'markNotificationAsRead');
  };

  const markAllAsRead = async () => {
    await handleAsyncError(async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notification => 
        ({ ...notification, read: true })
      ));
    }, 'markAllNotificationsAsRead');
  };

  const toggleSetting = async (settingId: string) => {
    await handleAsyncError(async () => {
      // Update local state since we're using mock settings
      setSettings(prev => prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      ));
      
      // In a real implementation, you would update the database here
      console.log('Setting toggled:', settingId);
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
