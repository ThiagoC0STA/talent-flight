/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://talentflight.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    additionalSitemaps: ["https://talentflight.com/sitemap.xml"],
  },
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  transform: async (config, path) => {
    // Customize sitemap entries
    let priority = 0.7;
    let changefreq = "daily";

    // Homepage
    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    }

    // Jobs page
    if (path === "/jobs") {
      priority = 0.9;
      changefreq = "daily";
    }

    // About page
    if (path === "/about") {
      priority = 0.7;
      changefreq = "monthly";
    }

    // Contact page
    if (path === "/contact") {
      priority = 0.6;
      changefreq = "monthly";
    }

    // Legal pages
    if (path === "/privacy" || path === "/terms") {
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
  additionalPaths: async (config) => {
    const result = [
      {
        loc: '/privacy',
        changefreq: 'yearly',
        priority: 0.3,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/terms',
        changefreq: 'yearly',
        priority: 0.3,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      },
    ];

    // Add dynamic job pages
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, company, updated_at')
        .eq('is_active', true);

      if (jobs) {
        jobs.forEach((job) => {
          const slug = `${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-at-${job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          result.push({
            loc: `/job/${slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: job.updated_at,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching jobs for sitemap:', error);
    }

    return result;
  },
};
