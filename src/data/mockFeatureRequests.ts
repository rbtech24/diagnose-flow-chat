
import { FeatureRequest } from "@/types/feature-request";

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "feature-1",
    title: "Add dark mode support",
    description: "It would be great to have a dark mode option for the application. This would reduce eye strain when using the app at night or in low-light conditions.",
    status: "pending",
    priority: "medium",
    company_id: "company-1",
    user_id: "user-1",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    votes_count: 12,
    user_has_voted: false,
    comments_count: 3,
    created_by_user: {
      name: "John Manager",
      email: "john@acme.com",
      avatar_url: "https://i.pravatar.cc/150?u=john",
      role: "company"
    }
  },
  {
    id: "feature-2",
    title: "Bulk technician assignment",
    description: "Allow assigning multiple technicians to a repair job at once. This would be useful for large jobs that require multiple people.",
    status: "approved",
    priority: "high",
    company_id: "company-1",
    user_id: "user-2",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    votes_count: 25,
    user_has_voted: true,
    comments_count: 8,
    created_by_user: {
      name: "Sarah Admin",
      email: "sarah@acme.com",
      avatar_url: "https://i.pravatar.cc/150?u=sarah",
      role: "company"
    }
  },
  {
    id: "feature-3",
    title: "Calendar integration with Google Calendar",
    description: "Would like to see integration with Google Calendar so technicians can see their repair schedules alongside their personal appointments.",
    status: "in-progress",
    priority: "medium",
    company_id: "company-2",
    user_id: "user-3",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    votes_count: 18,
    user_has_voted: true,
    comments_count: 5,
    created_by_user: {
      name: "Mike Technician",
      email: "mike@fastfix.com",
      avatar_url: "https://i.pravatar.cc/150?u=mike",
      role: "tech"
    }
  },
  {
    id: "feature-4",
    title: "Export repair history to CSV",
    description: "Need the ability to export repair history to CSV format for reporting and analysis purposes.",
    status: "completed",
    priority: "low",
    company_id: "company-1",
    user_id: "user-4",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    votes_count: 7,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "Lisa Support",
      email: "lisa@acme.com",
      avatar_url: "https://i.pravatar.cc/150?u=lisa",
      role: "company"
    }
  },
  {
    id: "feature-5",
    title: "Offline mode for mobile app",
    description: "Would be great if the mobile app could work offline and sync when back online. This is especially important for technicians in areas with poor connectivity.",
    status: "pending",
    priority: "critical",
    company_id: "company-3",
    user_id: "user-5",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    votes_count: 32,
    user_has_voted: false,
    comments_count: 12,
    created_by_user: {
      name: "David Field",
      email: "david@expertrepair.com",
      avatar_url: "https://i.pravatar.cc/150?u=david",
      role: "tech"
    }
  }
];
