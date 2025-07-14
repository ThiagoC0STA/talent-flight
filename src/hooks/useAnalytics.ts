"use client";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-6H0VCNQSW5", {
        page_path: url,
      });
    }
  };

  const trackJobView = (jobTitle: string, company: string) => {
    trackEvent("view_job", "jobs", `${jobTitle} at ${company}`);
  };

  const trackJobClick = (jobTitle: string, company: string) => {
    trackEvent("click_job", "jobs", `${jobTitle} at ${company}`);
  };

  const trackSearch = (query: string, results: number) => {
    trackEvent("search", "engagement", query, results);
  };

  const trackFilter = (filterType: string, filterValue: string) => {
    trackEvent("filter", "engagement", `${filterType}: ${filterValue}`);
  };

  const trackApply = (jobTitle: string, company: string) => {
    trackEvent("apply_job", "conversion", `${jobTitle} at ${company}`);
  };

  return {
    trackEvent,
    trackPageView,
    trackJobView,
    trackJobClick,
    trackSearch,
    trackFilter,
    trackApply,
  };
};
