require("dotenv").config({ path: ".env.local" });
const { writeFileSync } = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente do Supabase não encontradas");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para gerar slug (igual à usada no site)
function generateJobSlug(title, company) {
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const companySlug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Remover hífens duplos e hífens no início/fim
  const cleanTitle = titleSlug.replace(/-+/g, "-").replace(/^-|-$/g, "");
  const cleanCompany = companySlug.replace(/-+/g, "-").replace(/^-|-$/g, "");

  return `${cleanTitle}-at-${cleanCompany}`;
}

async function generateSitemap() {
  try {
    // Buscar todos os jobs ativos
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar jobs:", error);
      return;
    }

    const activeJobs = jobs || [];

    // URLs estáticas
    const staticUrls = [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/jobs", priority: 0.9, changefreq: "daily" },
      { loc: "/about", priority: 0.6, changefreq: "monthly" },
      { loc: "/contact", priority: 0.6, changefreq: "monthly" },
      { loc: "/terms", priority: 0.3, changefreq: "yearly" },
      { loc: "/privacy", priority: 0.3, changefreq: "yearly" },
    ];

    // URLs dos jobs
    const jobUrls = activeJobs.map((job) => ({
      loc: `/job/${generateJobSlug(job.title, job.company)}`,
      priority: 0.8,
      changefreq: "weekly",
      lastmod: job.updated_at || job.created_at,
    }));

    // Combinar todas as URLs
    const allUrls = [...staticUrls, ...jobUrls];

    // Gerar XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>https://talentflight.com${url.loc}</loc>
    <lastmod>${url.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    // Salvar arquivo
    writeFileSync("public/sitemap.xml", xml);
    console.log(
      `✅ Sitemap gerado com ${allUrls.length} URLs (${jobUrls.length} jobs)`
    );
  } catch (error) {
    console.error("❌ Erro ao gerar sitemap:", error);
  }
}

generateSitemap();
