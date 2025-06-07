import { configService } from './configService';

export interface AnalyticsEvent {
  id: string;
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  properties?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  events: number;
  duration?: number;
  referrer?: string;
  userAgent?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private currentSession: UserSession;
  private isInitialized = false;

  constructor() {
    this.currentSession = this.createNewSession();
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // Track page views
    this.trackPageView();
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onSessionPause();
      } else {
        this.onSessionResume();
      }
    });

    // Track session end on beforeunload
    window.addEventListener('beforeunload', () => {
      this.endCurrentSession();
    });

    console.log('Analytics service initialized');
  }

  /**
   * Track a custom event
   */
  track(
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): string {
    if (!configService.getFeaturesConfig().analyticsEnabled) {
      return '';
    }

    const event: AnalyticsEvent = {
      id: this.generateId(),
      name,
      category,
      action,
      label,
      value,
      sessionId: this.currentSession.id,
      timestamp: new Date(),
      properties,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.addEvent(event);
    return event.id;
  }

  /**
   * Track page view
   */
  trackPageView(customPath?: string): string {
    const path = customPath || window.location.pathname;
    
    this.currentSession.pageViews++;
    
    return this.track(
      'page_view',
      'navigation',
      'view',
      path,
      undefined,
      {
        path,
        title: document.title,
        referrer: document.referrer
      }
    );
  }

  /**
   * Track user interaction
   */
  trackClick(
    element: string,
    label?: string,
    properties?: Record<string, any>
  ): string {
    return this.track(
      'click',
      'user_interaction',
      'click',
      label || element,
      undefined,
      { element, ...properties }
    );
  }

  /**
   * Track form submission
   */
  trackFormSubmit(
    formName: string,
    success: boolean,
    properties?: Record<string, any>
  ): string {
    return this.track(
      'form_submit',
      'user_interaction',
      success ? 'submit_success' : 'submit_error',
      formName,
      success ? 1 : 0,
      properties
    );
  }

  /**
   * Track API call
   */
  trackApiCall(
    endpoint: string,
    method: string,
    status: number,
    duration: number,
    properties?: Record<string, any>
  ): string {
    return this.track(
      'api_call',
      'api',
      `${method.toLowerCase()}_${status >= 400 ? 'error' : 'success'}`,
      endpoint,
      duration,
      {
        method,
        status,
        endpoint,
        duration,
        ...properties
      }
    );
  }

  /**
   * Track error
   */
  trackError(
    error: Error | string,
    context?: string,
    properties?: Record<string, any>
  ): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = error instanceof Error ? error.stack : undefined;

    return this.track(
      'error',
      'error',
      'javascript_error',
      context || 'unknown',
      1,
      {
        message: errorMessage,
        stack,
        context,
        ...properties
      }
    );
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(
    feature: string,
    action: string,
    properties?: Record<string, any>
  ): string {
    return this.track(
      'feature_usage',
      'feature',
      action,
      feature,
      1,
      { feature, ...properties }
    );
  }

  /**
   * Track performance metric
   */
  trackPerformance(
    metric: string,
    value: number,
    unit: string,
    properties?: Record<string, any>
  ): string {
    return this.track(
      'performance',
      'performance',
      'measure',
      metric,
      value,
      { metric, unit, ...properties }
    );
  }

  /**
   * Set user identification
   */
  identify(userId: string, properties?: Record<string, any>): void {
    this.currentSession.userId = userId;
    
    this.track(
      'user_identify',
      'user',
      'identify',
      userId,
      undefined,
      properties
    );
  }

  /**
   * Get events with filtering
   */
  getEvents(filters?: {
    category?: string;
    action?: string;
    sessionId?: string;
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): AnalyticsEvent[] {
    let events = [...this.events];

    if (filters?.category) {
      events = events.filter(e => e.category === filters.category);
    }

    if (filters?.action) {
      events = events.filter(e => e.action === filters.action);
    }

    if (filters?.sessionId) {
      events = events.filter(e => e.sessionId === filters.sessionId);
    }

    if (filters?.timeRange) {
      events = events.filter(e => 
        e.timestamp >= filters.timeRange!.start && 
        e.timestamp <= filters.timeRange!.end
      );
    }

    if (filters?.limit) {
      events = events.slice(-filters.limit);
    }

    return events;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEvents: number;
    uniqueSessions: number;
    averageSessionDuration: number;
    topCategories: Array<{ category: string; count: number }>;
    topActions: Array<{ action: string; count: number }>;
    errorRate: number;
  } {
    const uniqueSessions = new Set(this.events.map(e => e.sessionId)).size;
    const errors = this.events.filter(e => e.category === 'error').length;
    const errorRate = this.events.length > 0 ? (errors / this.events.length) * 100 : 0;

    // Count categories
    const categoryCount = this.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Count actions
    const actionCount = this.events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCount)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEvents: this.events.length,
      uniqueSessions,
      averageSessionDuration: this.calculateAverageSessionDuration(),
      topCategories,
      topActions,
      errorRate: Math.round(errorRate * 100) / 100
    };
  }

  /**
   * Get current session
   */
  getCurrentSession(): UserSession {
    return { ...this.currentSession };
  }

  private createNewSession(): UserSession {
    return {
      id: this.generateSessionId(),
      startTime: new Date(),
      pageViews: 0,
      events: 0,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };
  }

  private addEvent(event: AnalyticsEvent) {
    this.events.push(event);
    this.currentSession.events++;

    // Keep only last 10000 events in memory
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    if (configService.getFeaturesConfig().debugMode) {
      console.log('Analytics event tracked:', event);
    }
  }

  private onSessionPause() {
    // Could implement session pause logic here
    console.log('Session paused');
  }

  private onSessionResume() {
    // Could implement session resume logic here
    console.log('Session resumed');
  }

  private endCurrentSession() {
    this.currentSession.endTime = new Date();
    this.currentSession.duration = 
      this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();
  }

  private calculateAverageSessionDuration(): number {
    // This is a simplified calculation for the current session
    if (!this.currentSession.endTime) {
      const now = new Date();
      return now.getTime() - this.currentSession.startTime.getTime();
    }
    return this.currentSession.duration || 0;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();
