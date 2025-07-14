import { GoogleAuth } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType = "overview" } = body;

    // Configuração do Google Analytics Data API v1
    const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
    const GOOGLE_APPLICATION_CREDENTIALS =
      process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // Verificar se o Property ID está no formato correto
    let propertyId = GA4_PROPERTY_ID || "";
    if (!propertyId?.startsWith("properties/")) {
      propertyId = `properties/${propertyId}`;
    }

    if (!propertyId || !GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        {
          error: "Google Analytics credentials not configured",
          message:
            "Configure GA4_PROPERTY_ID e GOOGLE_APPLICATION_CREDENTIALS no .env.local",
        },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Failed to get access token",
          message: "Verifique se o arquivo de credenciais está correto",
        },
        { status: 500 }
      );
    }

    // Buscar diferentes tipos de dados baseado no reportType
    let processedData;

    switch (reportType) {
      case "overview":
        processedData = await getOverviewData(propertyId, accessToken);
        break;
      case "traffic":
        processedData = await getTrafficData(propertyId, accessToken);
        break;
      case "devices":
        processedData = await getDevicesData(propertyId, accessToken);
        break;
      case "countries":
        processedData = await getCountriesData(propertyId, accessToken);
        break;
      case "pages":
        processedData = await getPagesData(propertyId, accessToken);
        break;
      default:
        processedData = await getOverviewData(propertyId, accessToken);
    }

    return NextResponse.json(processedData);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token || null;
  } catch (error) {
    console.error("Erro ao obter token de acesso:", error);
    return null;
  }
}

async function getOverviewData(propertyId: string, accessToken: string) {
  const query = {
    property: propertyId,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
      { name: "eventCount" },
    ],
    dimensions: [{ name: "pagePath" }, { name: "eventName" }],
    limit: 10,
  };

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GA4 API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return processOverviewData(data);
}

async function getTrafficData(propertyId: string, accessToken: string) {
  const query = {
    property: propertyId,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    dimensions: [{ name: "date" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  };

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 API error: ${response.status}`);
  }

  const data = await response.json();
  return processTrafficData(data);
}

async function getDevicesData(propertyId: string, accessToken: string) {
  const query = {
    property: propertyId,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    dimensions: [{ name: "deviceCategory" }],
  };

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 API error: ${response.status}`);
  }

  const data = await response.json();
  return processDevicesData(data);
}

async function getCountriesData(propertyId: string, accessToken: string) {
  const query = {
    property: propertyId,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    dimensions: [{ name: "country" }],
    limit: 10,
  };

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 API error: ${response.status}`);
  }

  const data = await response.json();
  return processCountriesData(data);
}

async function getPagesData(propertyId: string, accessToken: string) {
  const query = {
    property: propertyId,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
    dimensions: [{ name: "pagePath" }],
    limit: 10,
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  };

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  if (!response.ok) {
    throw new Error(`GA4 API error: ${response.status}`);
  }

  const data = await response.json();
  return processPagesData(data);
}

function processOverviewData(rawData: any) {
  try {
    const pageViews = rawData.totals?.[0]?.metricValues?.[0]?.value || 0;
    const uniqueUsers = rawData.totals?.[0]?.metricValues?.[1]?.value || 0;
    const sessions = rawData.totals?.[0]?.metricValues?.[2]?.value || 0;
    const bounceRate = rawData.totals?.[0]?.metricValues?.[3]?.value || 0;
    const avgSessionDuration =
      rawData.totals?.[0]?.metricValues?.[4]?.value || 0;
    const eventCount = rawData.totals?.[0]?.metricValues?.[5]?.value || 0;

    const topPages =
      rawData.rows
        ?.filter((row: any) => row.dimensionValues?.[0]?.value !== "page_view")
        ?.map((row: any) => ({
          page: row.dimensionValues?.[0]?.value || "",
          views: parseInt(row.metricValues?.[0]?.value || "0"),
        }))
        ?.sort((a: any, b: any) => b.views - a.views)
        ?.slice(0, 5) || [];

    const topEvents =
      rawData.rows
        ?.filter((row: any) => row.dimensionValues?.[1]?.value !== "page_view")
        ?.map((row: any) => ({
          event: row.dimensionValues?.[1]?.value || "",
          count: parseInt(row.metricValues?.[0]?.value || "0"),
        }))
        ?.sort((a: any, b: any) => b.count - a.count)
        ?.slice(0, 5) || [];

    return {
      pageViews: parseInt(pageViews),
      uniqueUsers: parseInt(uniqueUsers),
      sessions: parseInt(sessions),
      bounceRate: parseFloat(bounceRate),
      avgSessionDuration: parseInt(avgSessionDuration),
      eventCount: parseInt(eventCount),
      topPages,
      topEvents,
    };
  } catch (error) {
    console.error("Erro ao processar dados de overview:", error);
    return getMockData();
  }
}

function processTrafficData(rawData: any) {
  try {
    const data: {
      date: string;
      screenPageViews: number;
      activeUsers: number;
    }[] = [];
    rawData.rows?.forEach((row: any) => {
      data.push({
        date: row.dimensionValues?.[0]?.value || "",
        screenPageViews: parseInt(row.metricValues?.[0]?.value || "0"),
        activeUsers: parseInt(row.metricValues?.[1]?.value || "0"),
      });
    });
    return data;
  } catch (error) {
    console.error("Erro ao processar dados de tráfego:", error);
    return [];
  }
}

function processDevicesData(rawData: any) {
  try {
    const data: {
      deviceCategory: string;
      screenPageViews: number;
      activeUsers: number;
    }[] = [];
    rawData.rows?.forEach((row: any) => {
      data.push({
        deviceCategory: row.dimensionValues?.[0]?.value || "",
        screenPageViews: parseInt(row.metricValues?.[0]?.value || "0"),
        activeUsers: parseInt(row.metricValues?.[1]?.value || "0"),
      });
    });
    return data;
  } catch (error) {
    console.error("Erro ao processar dados de dispositivos:", error);
    return [];
  }
}

function processCountriesData(rawData: any) {
  try {
    const data: {
      country: string;
      screenPageViews: number;
      activeUsers: number;
    }[] = [];
    rawData.rows?.forEach((row: any) => {
      data.push({
        country: row.dimensionValues?.[0]?.value || "",
        screenPageViews: parseInt(row.metricValues?.[0]?.value || "0"),
        activeUsers: parseInt(row.metricValues?.[1]?.value || "0"),
      });
    });
    return data;
  } catch (error) {
    console.error("Erro ao processar dados de países:", error);
    return [];
  }
}

function processPagesData(rawData: any) {
  try {
    const data: {
      pagePath: string;
      screenPageViews: number;
      avgSessionDuration: number;
    }[] = [];
    rawData.rows?.forEach((row: any) => {
      data.push({
        pagePath: row.dimensionValues?.[0]?.value || "",
        screenPageViews: parseInt(row.metricValues?.[0]?.value || "0"),
        avgSessionDuration: parseInt(row.metricValues?.[1]?.value || "0"),
      });
    });
    return data;
  } catch (error) {
    console.error("Erro ao processar dados de páginas:", error);
    return [];
  }
}

function getMockData() {
  return {
    pageViews: 1247,
    uniqueUsers: 892,
    sessions: 1563,
    bounceRate: 42.3,
    avgSessionDuration: 185,
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
