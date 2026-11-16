import { getGoogleAccessToken, readServiceAccount } from "@/lib/google/access-token";
import type {
  AnalyticsInsights,
  AnalyticsSnapshot,
  AudienceRow,
  InsightsReport,
  SearchInsights,
  SearchRow,
  SearchSnapshot,
} from "@/lib/google/types";

const SEARCH_SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || "sc-domain:hussainiitservices.com";

function isoDate(offsetDays: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function numberValue(value: string | number | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

const EMPTY_ANALYTICS: AnalyticsSnapshot = {
  users: 0,
  newUsers: 0,
  sessions: 0,
  views: 0,
  engagementRate: 0,
  averageSessionDuration: 0,
  bounceRate: 0,
};

const EMPTY_SEARCH: SearchSnapshot = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  position: 0,
};

function emptyAnalytics(error: string | null): AnalyticsInsights {
  return {
    connected: false,
    error,
    ...EMPTY_ANALYTICS,
    previous: EMPTY_ANALYTICS,
    series: [],
    pages: [],
    channels: [],
    countries: [],
    devices: [],
  };
}

function emptySearch(error: string | null): SearchInsights {
  return {
    connected: false,
    error,
    ...EMPTY_SEARCH,
    previous: EMPTY_SEARCH,
    series: [],
    queries: [],
    pages: [],
    countries: [],
    devices: [],
  };
}

async function googleJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message || "Google request failed.");
  }
  return payload;
}

interface GaReport {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
}

function snapshotFromRow(report: GaReport | undefined, rangeName: string): AnalyticsSnapshot {
  const row = report?.rows?.find((item) => item.dimensionValues?.[0]?.value === rangeName);
  const value = (index: number) => numberValue(row?.metricValues?.[index]?.value);
  return {
    users: value(0),
    newUsers: value(1),
    sessions: value(2),
    views: value(3),
    engagementRate: value(4),
    averageSessionDuration: value(5),
    bounceRate: value(6),
  };
}

function audienceRows(report: GaReport | undefined): AudienceRow[] {
  return (report?.rows ?? []).map((row) => ({
    label: row.dimensionValues?.[0]?.value || "—",
    primary: numberValue(row.metricValues?.[0]?.value),
    secondary: numberValue(row.metricValues?.[1]?.value),
  }));
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

async function loadAnalytics(token: string): Promise<AnalyticsInsights> {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  if (!propertyId) {
    return emptyAnalytics("Set GA4_PROPERTY_ID to the numeric Google Analytics property ID.");
  }
  if (!/^\d+$/.test(propertyId)) {
    return emptyAnalytics("GA4_PROPERTY_ID must be the numeric property ID, not the G- measurement ID.");
  }

  const currentRange = { startDate: "28daysAgo", endDate: "yesterday" };
  const comparisonRanges = [
    { ...currentRange, name: "current" },
    { startDate: "56daysAgo", endDate: "29daysAgo", name: "previous" },
  ];
  const summaryMetrics = [
    { name: "activeUsers" },
    { name: "newUsers" },
    { name: "sessions" },
    { name: "screenPageViews" },
    { name: "engagementRate" },
    { name: "averageSessionDuration" },
    { name: "bounceRate" },
  ];

  const [payload, countriesPayload] = await Promise.all([
    googleJson<{ reports?: GaReport[] }>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      token,
      {
        requests: [
          { dateRanges: comparisonRanges, metrics: summaryMetrics },
          {
            dateRanges: [currentRange],
            dimensions: [{ name: "date" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
          },
          {
            dateRanges: [currentRange],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }, { name: "engagementRate" }],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 10,
          },
          {
            dateRanges: [currentRange],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [{ name: "sessions" }, { name: "activeUsers" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: 6,
          },
          {
            dateRanges: [currentRange],
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          },
        ],
      },
    ),
    googleJson<{ reports?: GaReport[] }>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      token,
      {
        requests: [
          {
            dateRanges: [currentRange],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 8,
          },
        ],
      },
    ),
  ]);

  const [summary, series, pages, channels, devices] = payload.reports ?? [];
  const current = snapshotFromRow(summary, "current");
  return {
    connected: true,
    error: null,
    ...current,
    previous: snapshotFromRow(summary, "previous"),
    series: (series?.rows ?? []).map((row) => {
      const raw = row.dimensionValues?.[0]?.value ?? "";
      const date = raw.length === 8 ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}` : raw;
      return {
        date,
        users: numberValue(row.metricValues?.[0]?.value),
        sessions: numberValue(row.metricValues?.[1]?.value),
        views: numberValue(row.metricValues?.[2]?.value),
      };
    }),
    pages: (pages?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "/",
      views: numberValue(row.metricValues?.[0]?.value),
      users: numberValue(row.metricValues?.[1]?.value),
      engagementRate: numberValue(row.metricValues?.[2]?.value),
    })),
    channels: audienceRows(channels),
    countries: audienceRows(countriesPayload.reports?.[0]),
    devices: audienceRows(devices).map((row) => ({ ...row, label: titleCase(row.label) })),
  };
}

interface SearchResponse {
  rows?: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
}

function searchRows(payload: SearchResponse): SearchRow[] {
  return (payload.rows ?? []).map((row) => ({
    label: row.keys?.[0] || "—",
    clicks: numberValue(row.clicks),
    impressions: numberValue(row.impressions),
    ctr: numberValue(row.ctr),
    position: numberValue(row.position),
  }));
}

async function loadSearch(token: string, startDate: string, endDate: string): Promise<SearchInsights> {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SEARCH_SITE_URL)}/searchAnalytics/query`;
  const range = { startDate, endDate, dataState: "all" };

  const previousStart = isoDate(-56);
  const previousEnd = isoDate(-29);
  const [totals, previousTotals, queries, pages, daily, countries, devices] = await Promise.all([
    googleJson<SearchResponse>(endpoint, token, range),
    googleJson<SearchResponse>(endpoint, token, { startDate: previousStart, endDate: previousEnd, dataState: "all" }),
    googleJson<SearchResponse>(endpoint, token, { ...range, dimensions: ["query"], rowLimit: 12 }),
    googleJson<SearchResponse>(endpoint, token, { ...range, dimensions: ["page"], rowLimit: 10 }),
    googleJson<SearchResponse>(endpoint, token, { ...range, dimensions: ["date"], rowLimit: 28 }),
    googleJson<SearchResponse>(endpoint, token, { ...range, dimensions: ["country"], rowLimit: 8 }),
    googleJson<SearchResponse>(endpoint, token, { ...range, dimensions: ["device"], rowLimit: 5 }),
  ]);

  const total = searchRows(totals)[0];
  const previous = searchRows(previousTotals)[0];
  return {
    connected: true,
    error: null,
    clicks: total?.clicks ?? 0,
    impressions: total?.impressions ?? 0,
    ctr: total?.ctr ?? 0,
    position: total?.position ?? 0,
    previous: {
      clicks: previous?.clicks ?? 0,
      impressions: previous?.impressions ?? 0,
      ctr: previous?.ctr ?? 0,
      position: previous?.position ?? 0,
    },
    series: (daily.rows ?? [])
      .map((row) => ({
        date: row.keys?.[0] || "",
        clicks: numberValue(row.clicks),
        impressions: numberValue(row.impressions),
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    queries: searchRows(queries),
    pages: searchRows(pages),
    countries: searchRows(countries),
    devices: searchRows(devices).map((row) => ({ ...row, label: titleCase(row.label) })),
  };
}

export async function loadInsights(): Promise<InsightsReport> {
  const startDate = isoDate(-28);
  const endDate = isoDate(-1);

  let accountReady = true;
  let accountError: string | null = null;
  try {
    if (!readServiceAccount()) {
      accountReady = false;
      accountError = "Add GOOGLE_SERVICE_ACCOUNT_JSON, then give that account access in Analytics and Search Console.";
    }
  } catch (error) {
    accountReady = false;
    accountError = error instanceof Error ? error.message : "The Google service account could not be read.";
  }

  if (!accountReady) {
    return {
      startDate,
      endDate,
      analytics: emptyAnalytics(accountError),
      search: emptySearch(accountError),
    };
  }

  const token = await getGoogleAccessToken();
  const [analytics, search] = await Promise.all([
    loadAnalytics(token).catch((error: unknown) =>
      emptyAnalytics(error instanceof Error ? error.message : "Analytics could not be loaded."),
    ),
    loadSearch(token, startDate, endDate).catch((error: unknown) =>
      emptySearch(error instanceof Error ? error.message : "Search Console could not be loaded."),
    ),
  ]);

  return { startDate, endDate, analytics, search };
}
