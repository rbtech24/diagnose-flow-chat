
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
      
      // Fetch notifications from database
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
        return { notifications: [], settings: [] };
      }

      // Fetch notification settings
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
        timestamp: new Date(notification.created_at),
        read: notification.read || false
      }));

      const formattedSettings: NotificationSetting[] = (settingsData || []).map(setting => ({
        id: setting.id,
        title: setting.title,
        description: setting.description,
        type: setting.type as NotificationSetting['type'],
        enabled: setting.enabled || false
      }));

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
      const setting = settings.find(s => s.id === settingId);
      if (!setting) return;

      const { error } = await supabase
        .from('notification_settings')
        .update({ enabled: !setting.enabled })
        .eq('id', settingId);

      if (error) throw error;

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
