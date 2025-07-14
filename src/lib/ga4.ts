// Serviço para buscar dados do Google Analytics 4
// Nota: Para produção, você precisará configurar a API do Google Analytics

export interface GA4Data {
  pageViews: number;
  uniqueUsers: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  eventCount: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  topEvents: Array<{
    event: string;
    count: number;
  }>;
}

export interface TrafficData {
  date: string;
  screenPageViews: number;
  activeUsers: number;
}

export interface DevicesData {
  deviceCategory: string;
  screenPageViews: number;
  activeUsers: number;
}

export interface CountriesData {
  country: string;
  screenPageViews: number;
  activeUsers: number;
}

export interface PagesData {
  pagePath: string;
  screenPageViews: number;
  avgSessionDuration: number;
}

export const ga4Service = {
  // Buscar dados de overview
  async getOverviewData(): Promise<GA4Data> {
    try {
      const response = await fetch("/api/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "overview",
          dateRanges: [
            {
              startDate: "7daysAgo",
              endDate: "today",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do GA4");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no serviço GA4:", error);
      return getMockOverviewData();
    }
  },

  // Buscar dados de tráfego
  async getTrafficData(): Promise<TrafficData[]> {
    try {
      const response = await fetch("/api/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "traffic",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados de tráfego");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de tráfego:", error);
      return getMockTrafficData();
    }
  },

  // Buscar dados de dispositivos
  async getDevicesData(): Promise<DevicesData[]> {
    try {
      const response = await fetch("/api/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "devices",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados de dispositivos");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de dispositivos:", error);
      return getMockDevicesData();
    }
  },

  // Buscar dados de países
  async getCountriesData(): Promise<CountriesData[]> {
    try {
      const response = await fetch("/api/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "countries",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados de países");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de países:", error);
      return getMockCountriesData();
    }
  },

  // Buscar dados de páginas
  async getPagesData(): Promise<PagesData[]> {
    try {
      const response = await fetch("/api/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "pages",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados de páginas");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de páginas:", error);
      return getMockPagesData();
    }
  },
};

// Dados mockados para fallback
function getMockOverviewData(): GA4Data {
  return {
    pageViews: 1247,
    uniqueUsers: 892,
    sessions: 1563,
    bounceRate: 42.3,
    avgSessionDuration: 185,
    eventCount: 2341,
    topPages: [
      { page: "/", views: 456 },
      { page: "/jobs", views: 234 },
      { page: "/job/senior-frontend-developer-at-techcorp", views: 89 },
      { page: "/job/full-stack-developer-at-startup", views: 67 },
      { page: "/about", views: 45 },
    ],
    topEvents: [
      { event: "view_job", count: 234 },
      { event: "click_job", count: 89 },
      { event: "apply_job", count: 34 },
      { event: "search", count: 156 },
      { event: "filter", count: 78 },
    ],
  };
}

function getMockTrafficData(): TrafficData[] {
  const data: TrafficData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      screenPageViews: Math.floor(Math.random() * 100) + 50,
      activeUsers: Math.floor(Math.random() * 80) + 30,
    });
  }
  return data;
}

function getMockDevicesData(): DevicesData[] {
  return [
    { deviceCategory: "desktop", screenPageViews: 856, activeUsers: 623 },
    { deviceCategory: "mobile", screenPageViews: 234, activeUsers: 189 },
    { deviceCategory: "tablet", screenPageViews: 157, activeUsers: 80 },
  ];
}

function getMockCountriesData(): CountriesData[] {
  return [
    { country: "Brazil", screenPageViews: 892, activeUsers: 623 },
    { country: "United States", screenPageViews: 234, activeUsers: 189 },
    { country: "Portugal", screenPageViews: 89, activeUsers: 67 },
    { country: "Canada", screenPageViews: 67, activeUsers: 45 },
    { country: "Germany", screenPageViews: 45, activeUsers: 32 },
  ];
}

function getMockPagesData(): PagesData[] {
  return [
    { pagePath: "/", screenPageViews: 456, avgSessionDuration: 185 },
    { pagePath: "/jobs", screenPageViews: 234, avgSessionDuration: 142 },
    {
      pagePath: "/job/senior-frontend-developer",
      screenPageViews: 89,
      avgSessionDuration: 203,
    },
    {
      pagePath: "/job/full-stack-developer",
      screenPageViews: 67,
      avgSessionDuration: 178,
    },
    { pagePath: "/about", screenPageViews: 45, avgSessionDuration: 95 },
  ];
}
