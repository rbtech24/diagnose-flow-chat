
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'push' | 'sms';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const transformedNotifications: Notification[] = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'] || 'info',
        timestamp: new Date(notification.timestamp),
        read: notification.read
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Error fetching notification settings:', error);
        return;
      }

      // Define default settings with descriptions
      const defaultSettings = [
        {
          key: 'job_assignments',
          title: 'Job Assignments',
          description: 'Get notified when new jobs are assigned to you',
          type: 'push' as const
        },
        {
          key: 'schedule_changes',
          title: 'Schedule Changes',
          description: 'Receive alerts when your schedule is modified',
          type: 'email' as const
        },
        {
          key: 'parts_inventory',
          title: 'Parts & Inventory',
          description: 'Updates about parts delivery and inventory status',
          type: 'email' as const
        },
        {
          key: 'customer_messages',
          title: 'Customer Messages',
          description: 'Direct messages and feedback from customers',
          type: 'push' as const
        },
        {
          key: 'daily_summary',
          title: 'Daily Summary',
          description: 'Daily recap of completed jobs and upcoming tasks',
          type: 'email' as const
        }
      ];

      // Create settings map from database
      const settingsMap = new Map();
      data?.forEach(setting => {
        settingsMap.set(setting.setting_key, {
          enabled: setting.setting_value,
          type: setting.setting_type
        });
      });

      // Transform to UI format
      const transformedSettings: NotificationSetting[] = defaultSettings.map((defaultSetting, index) => {
        const dbSetting = settingsMap.get(defaultSetting.key);
        return {
          id: (index + 1).toString(),
          title: defaultSetting.title,
          description: defaultSetting.description,
          enabled: dbSetting?.enabled ?? true,
          type: dbSetting?.type ?? defaultSetting.type
        };
      });

      setSettings(transformedSettings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userData.user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const toggleSetting = async (id: string) => {
    const setting = settings.find(s => s.id === id);
    if (!setting) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Map UI setting to database key
      const settingKeyMap: Record<string, string> = {
        '1': 'job_assignments',
        '2': 'schedule_changes',
        '3': 'parts_inventory',
        '4': 'customer_messages',
        '5': 'daily_summary'
      };

      const settingKey = settingKeyMap[id];
      if (!settingKey) return;

      const newValue = !setting.enabled;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: userData.user.id,
          setting_key: settingKey,
          setting_value: newValue,
          setting_type: setting.type
        });

      if (error) {
        console.error('Error updating notification setting:', error);
        return;
      }

      setSettings(prev => 
        prev.map(s => 
          s.id === id ? { ...s, enabled: newValue } : s
        )
      );
    } catch (error) {
      console.error('Error toggling notification setting:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    settings,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toggleSetting,
    refreshNotifications: fetchNotifications
  };
}
