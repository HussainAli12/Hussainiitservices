export interface AnalyticsPoint {
  date: string;
  users: number;
  sessions: number;
  views: number;
}

export interface AnalyticsPage {
  path: string;
  views: number;
  users: number;
  engagementRate: number;
}

export interface AudienceRow {
  label: string;
  primary: number;
  secondary: number;
}

export interface AnalyticsSnapshot {
  users: number;
  newUsers: number;
  sessions: number;
  views: number;
  engagementRate: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export interface SearchPoint {
  date: string;
  clicks: number;
  impressions: number;
}

export interface SearchRow {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchSnapshot {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface AnalyticsInsights extends AnalyticsSnapshot {
  connected: boolean;
  error: string | null;
  previous: AnalyticsSnapshot;
  series: AnalyticsPoint[];
  pages: AnalyticsPage[];
  channels: AudienceRow[];
  countries: AudienceRow[];
  devices: AudienceRow[];
}

export interface SearchInsights extends SearchSnapshot {
  connected: boolean;
  error: string | null;
  previous: SearchSnapshot;
  series: SearchPoint[];
  queries: SearchRow[];
  pages: SearchRow[];
  countries: SearchRow[];
  devices: SearchRow[];
}

export interface InsightsReport {
  startDate: string;
  endDate: string;
  analytics: AnalyticsInsights;
  search: SearchInsights;
}
