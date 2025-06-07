
import { useState, useEffect, useCallback } from 'react';
import { analyticsService, AnalyticsEvent } from '@/services/analyticsService';

export function useAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const track = useCallback((
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ) => {
    const eventId = analyticsService.track(name, category, action, label, value, properties);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const trackPageView = useCallback((customPath?: string) => {
    const eventId = analyticsService.trackPageView(customPath);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const trackClick = useCallback((
    element: string,
    label?: string,
    properties?: Record<string, any>
  ) => {
    const eventId = analyticsService.trackClick(element, label, properties);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const trackFormSubmit = useCallback((
    formName: string,
    success: boolean,
    properties?: Record<string, any>
  ) => {
    const eventId = analyticsService.trackFormSubmit(formName, success, properties);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const trackFeatureUsage = useCallback((
    feature: string,
    action: string,
    properties?: Record<string, any>
  ) => {
    const eventId = analyticsService.trackFeatureUsage(feature, action, properties);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const trackError = useCallback((
    error: Error | string,
    context?: string,
    properties?: Record<string, any>
  ) => {
    const eventId = analyticsService.trackError(error, context, properties);
    setEvents(analyticsService.getEvents({ limit: 100 }));
    return eventId;
  }, []);

  const identify = useCallback((userId: string, properties?: Record<string, any>) => {
    analyticsService.identify(userId, properties);
  }, []);

  const getAnalyticsSummary = useCallback(() => {
    return analyticsService.getAnalyticsSummary();
  }, []);

  const getCurrentSession = useCallback(() => {
    return analyticsService.getCurrentSession();
  }, []);

  useEffect(() => {
    // Initial load of events
    setEvents(analyticsService.getEvents({ limit: 100 }));
  }, []);

  return {
    events,
    track,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackFeatureUsage,
    trackError,
    identify,
    getAnalyticsSummary,
    getCurrentSession
  };
}
