import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  companyId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    systemUpdates: boolean;
    repairAssignments: boolean;
    communityActivity: boolean;
    trainingReminders: boolean;
    billingUpdates: boolean;
  };
}

// Fetch user notifications
export const fetchNotifications = async (limit = 50): Promise<Notification[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type as Notification['type'],
      title: notification.title,
      message: notification.message,
      read: notification.read,
      companyId: notification.company_id,
      metadata: {},
      createdAt: new Date(notification.timestamp)
    }));
  }, "fetchNotifications");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await APIErrorHandler.handleAPICall(async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
  }, "markNotificationAsRead");
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userData.user.id)
      .eq("read", false);

    if (error) throw error;
  }, "markAllNotificationsAsRead");
};

// Create notification
export const createNotification = async (notification: {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  companyId?: string;
  metadata?: Record<string, any>;
}): Promise<Notification> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        company_id: notification.companyId,
        read: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as Notification['type'],
      title: data.title,
      message: data.message,
      read: data.read,
      companyId: data.company_id,
      metadata: {},
      createdAt: new Date(data.timestamp)
    };
  }, "createNotification");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch notification settings
export const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", userData.user.id);

    if (error) throw error;

    // Default settings if none exist
    const defaultSettings: NotificationSettings = {
      userId: userData.user.id,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      categories: {
        systemUpdates: true,
        repairAssignments: true,
        communityActivity: true,
        trainingReminders: true,
        billingUpdates: true
      }
    };

    if (!data || data.length === 0) {
      return defaultSettings;
    }

    // Convert database settings to our format
    const settings = data.reduce((acc, setting) => {
      if (setting.setting_key === 'email_notifications') {
        acc.emailNotifications = setting.setting_value;
      } else if (setting.setting_key === 'push_notifications') {
        acc.pushNotifications = setting.setting_value;
      } else if (setting.setting_key === 'sms_notifications') {
        acc.smsNotifications = setting.setting_value;
      } else if (setting.setting_key.startsWith('category_')) {
        const category = setting.setting_key.replace('category_', '');
        if (category in acc.categories) {
          acc.categories[category as keyof typeof acc.categories] = setting.setting_value;
        }
      }
      return acc;
    }, defaultSettings);

    return settings;
  }, "fetchNotificationSettings");

  if (!response.success) throw response.error;
  return response.data!;
};

// Update notification settings
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Convert settings to database format
    const settingsArray: Array<{
      user_id: string;
      setting_key: string;
      setting_value: boolean;
      setting_type: string;
    }> = [];

    if (settings.emailNotifications !== undefined) {
      settingsArray.push({
        user_id: userData.user.id,
        setting_key: 'email_notifications',
        setting_value: settings.emailNotifications,
        setting_type: 'notification'
      });
    }

    if (settings.pushNotifications !== undefined) {
      settingsArray.push({
        user_id: userData.user.id,
        setting_key: 'push_notifications',
        setting_value: settings.pushNotifications,
        setting_type: 'notification'
      });
    }

    if (settings.smsNotifications !== undefined) {
      settingsArray.push({
        user_id: userData.user.id,
        setting_key: 'sms_notifications',
        setting_value: settings.smsNotifications,
        setting_type: 'notification'
      });
    }

    if (settings.categories) {
      Object.entries(settings.categories).forEach(([category, value]) => {
        settingsArray.push({
          user_id: userData.user.id,
          setting_key: `category_${category}`,
          setting_value: value,
          setting_type: 'notification'
        });
      });
    }

    // Upsert all settings
    const { error } = await supabase
      .from("notification_settings")
      .upsert(settingsArray, { 
        onConflict: 'user_id,setting_key',
        ignoreDuplicates: false 
      });

    if (error) throw error;

    // Fetch updated settings
    return await fetchNotificationSettings();
  }, "updateNotificationSettings");

  if (!response.success) throw response.error;
  return response.data!;
};

// Send bulk notifications
export const sendBulkNotifications = async (notifications: Array<{
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  companyId?: string;
  metadata?: Record<string, any>;
}>): Promise<void> => {
  await APIErrorHandler.handleAPICall(async () => {
    const notificationData = notifications.map(notification => ({
      user_id: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      company_id: notification.companyId,
      metadata: notification.metadata,
      read: false
    }));

    const { error } = await supabase
      .from("notifications")
      .insert(notificationData);

    if (error) throw error;
  }, "sendBulkNotifications");
};
