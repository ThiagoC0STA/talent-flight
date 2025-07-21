declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Enhanced Job View Tracking
export const trackJobView = (
  jobId: string,
  jobTitle: string,
  company: string
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "job_view", {
      job_id: jobId,
      job_title: jobTitle,
      company: company,
      event_category: "job_interaction",
      event_label: "job_view",
      value: 1,
    });
  }
};

// Job Application Tracking
export const trackJobApplication = (
  jobId: string,
  jobTitle: string,
  company: string
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "job_application", {
      job_id: jobId,
      job_title: jobTitle,
      company: company,
      event_category: "conversion",
      event_label: "job_application",
      value: 100, // High value for applications
      conversion_value: 100,
    });
  }
};

// Alert Creation Tracking
export const trackAlertCreation = (keywords: string[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "alert_creation", {
      keywords: keywords.join(", "),
      event_category: "user_engagement",
      event_label: "alert_creation",
      value: 50,
    });
  }
};

// Search Tracking
export const trackJobSearch = (query: string, filters: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "job_search", {
      search_term: query,
      filters: JSON.stringify(filters),
      event_category: "search",
      event_label: "job_search",
      value: 1,
    });
  }
};

// Page View Tracking
export const trackPageView = (page: string, title: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_title: title,
      page_location: page,
      event_category: "navigation",
      event_label: "page_view",
    });
  }
};

// User Engagement Tracking
export const trackUserEngagement = (action: string, details: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "user_engagement", {
      action: action,
      details: JSON.stringify(details),
      event_category: "engagement",
      event_label: action,
      value: 1,
    });
  }
};

// Error Tracking
export const trackError = (error: string, page: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "error", {
      error_message: error,
      page: page,
      event_category: "error",
      event_label: "error_occurred",
    });
  }
};

// Performance Tracking
export const trackPerformance = (metric: string, value: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "performance", {
      metric: metric,
      value: value,
      event_category: "performance",
      event_label: metric,
    });
  }
};

// Custom Event Tracking
export const trackCustomEvent = (
  eventName: string,
  parameters: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...parameters,
      event_category: "custom",
      event_label: eventName,
    });
  }
};

// Conversion Funnel Tracking
export const trackFunnelStep = (step: string, stepNumber: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "funnel_step", {
      step: step,
      step_number: stepNumber,
      event_category: "funnel",
      event_label: step,
      value: stepNumber,
    });
  }
};

// User Journey Tracking
export const trackUserJourney = (journey: string, step: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "user_journey", {
      journey: journey,
      step: step,
      event_category: "journey",
      event_label: `${journey}_${step}`,
    });
  }
};
