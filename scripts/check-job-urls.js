const fs = require("fs");
const path = require("path");

function checkJobUrls() {
  console.log("🔍 Verificando URLs de jobs...\n");

  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Filtrar apenas URLs de jobs
  const jobUrls = urls.filter((url) => url.includes("/job/"));

  console.log(`📊 Total de URLs de jobs encontradas: ${jobUrls.length}`);

  // Verificar formato das URLs de jobs
  const correctFormatUrls = jobUrls.filter((url) => {
    return (
      url.startsWith("https://talentflight.com/job/") &&
      url.split("/job/")[1] &&
      url.split("/job/")[1].length > 0
    );
  });

  const incorrectFormatUrls = jobUrls.filter((url) => {
    return (
      !url.startsWith("https://talentflight.com/job/") ||
      !url.split("/job/")[1] ||
      url.split("/job/")[1].length === 0
    );
  });

  console.log(`✅ URLs com formato correto: ${correctFormatUrls.length}`);
  console.log(`❌ URLs com formato incorreto: ${incorrectFormatUrls.length}`);

  if (incorrectFormatUrls.length > 0) {
    console.log("\n❌ URLs com formato incorreto:");
    incorrectFormatUrls.forEach((url) => console.log(`  - ${url}`));
  }

  // Verificar algumas URLs específicas
  const testUrls = [
    "https://talentflight.com/job/front-end-developer-at-eclaro-philippines",
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai",
    "https://talentflight.com/job/front-end-developer-remote-at-venture-alliance-integrated",
  ];

  console.log("\n🔍 Verificando URLs específicas:");
  testUrls.forEach((url) => {
    const isJobUrl = url.includes("/job/");
    const hasSlug = url.split("/job/")[1] && url.split("/job/")[1].length > 0;
    const isCorrectFormat = url.startsWith("https://talentflight.com/job/");

    console.log(`\nURL: ${url}`);
    console.log(`  - É URL de job: ${isJobUrl}`);
    console.log(`  - Tem slug: ${hasSlug}`);
    console.log(`  - Formato correto: ${isCorrectFormat}`);
  });

  // Verificar se há URLs duplicadas entre jobs
  const jobSlugs = jobUrls.map((url) => url.split("/job/")[1]);
  const duplicateSlugs = jobSlugs.filter(
    (slug, index) => jobSlugs.indexOf(slug) !== index
  );

  if (duplicateSlugs.length > 0) {
    console.log("\n⚠️ Slugs duplicados encontrados:");
    duplicateSlugs.forEach((slug) => console.log(`  - ${slug}`));
  } else {
    console.log("\n✅ Nenhum slug duplicado encontrado");
  }

  console.log(`\n📊 Resumo:`);
  console.log(`  - Total de URLs de jobs: ${jobUrls.length}`);
  console.log(`  - URLs com formato correto: ${correctFormatUrls.length}`);
  console.log(`  - URLs com formato incorreto: ${incorrectFormatUrls.length}`);
  console.log(`  - Slugs duplicados: ${duplicateSlugs.length}`);
}

checkJobUrls();
