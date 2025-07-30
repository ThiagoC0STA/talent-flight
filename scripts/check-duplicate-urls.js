const fs = require("fs");
const path = require("path");

// Função para verificar URLs duplicadas no sitemap
function checkDuplicateUrls() {
  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    console.log("❌ Sitemap não encontrado");
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

  // Extrair todas as URLs do sitemap
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);

  if (!urlMatches) {
    console.log("❌ Nenhuma URL encontrada no sitemap");
    return;
  }

  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Verificar duplicatas
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);

  if (duplicates.length > 0) {
    console.log("❌ URLs duplicadas encontradas:");
    duplicates.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL duplicada encontrada");
  }

  // Verificar URLs com problemas reais de formato
  const problematicUrls = urls.filter((url) => {
    return (
      url.includes("undefined") ||
      url.includes("null") ||
      url.includes("//") ||
      !url.startsWith("https://talentflight.com") ||
      url.length > 2048
    ); // URLs muito longas
  });

  if (problematicUrls.length > 0) {
    console.log("❌ URLs com problemas encontradas:");
    problematicUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Todas as URLs estão no formato correto");
  }

  // Verificar URLs específicas mencionadas no problema
  const specificUrl =
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai";
  const foundSpecificUrl = urls.find((url) => url === specificUrl);

  if (foundSpecificUrl) {
    console.log(`✅ URL específica encontrada no sitemap: ${specificUrl}`);
  } else {
    console.log(`❌ URL específica NÃO encontrada no sitemap: ${specificUrl}`);
  }

  console.log(`\n📊 Estatísticas:`);
  console.log(`  - Total de URLs: ${urls.length}`);
  console.log(`  - URLs únicas: ${new Set(urls).size}`);
  console.log(`  - Duplicatas: ${duplicates.length}`);
  console.log(`  - URLs com problemas: ${problematicUrls.length}`);

  // Verificar se há URLs com caracteres especiais problemáticos
  const urlsWithSpecialChars = urls.filter((url) => {
    return (
      url.includes("%") ||
      url.includes("&") ||
      url.includes("+") ||
      url.includes("=")
    );
  });

  if (urlsWithSpecialChars.length > 0) {
    console.log(
      `⚠️  URLs com caracteres especiais: ${urlsWithSpecialChars.length}`
    );
  }
}

// Executar verificação
checkDuplicateUrls();
