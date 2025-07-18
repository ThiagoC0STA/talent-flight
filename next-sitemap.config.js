/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://talentflight.com",
  generateRobotsTxt: false, // We have our own robots.txt
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/static/"],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    additionalSitemaps: ["https://talentflight.com/sitemap.xml"],
  },
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.7;
    let changefreq = "daily";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path === "/jobs") {
      priority = 0.9;
      changefreq = "daily";
    } else if (path.startsWith("/job/")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path === "/about" || path === "/contact") {
      priority = 0.6;
      changefreq = "monthly";
    } else if (path === "/terms" || path === "/privacy") {
      priority = 0.3;
      changefreq = "yearly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
