const fs = require("fs");
const path = require("path");

function checkCanonicalIssues() {
  console.log("🔍 Verificando problemas de canônicas...\n");

  // Verificar se a URL específica está no sitemap
  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    console.log("❌ Sitemap não encontrado");
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);

  if (!urlMatches) {
    console.log("❌ Nenhuma URL encontrada no sitemap");
    return;
  }

  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Verificar URL específica
  const specificUrl =
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai";
  const foundSpecificUrl = urls.find((url) => url === specificUrl);

  if (foundSpecificUrl) {
    console.log(`✅ URL específica encontrada no sitemap: ${specificUrl}`);
  } else {
    console.log(`❌ URL específica NÃO encontrada no sitemap: ${specificUrl}`);
  }

  // Verificar duplicatas
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);

  if (duplicates.length > 0) {
    console.log(`❌ URLs duplicadas encontradas: ${duplicates.length}`);
    duplicates.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL duplicada encontrada");
  }

  // Verificar URLs problemáticas reais
  const problematicUrls = urls.filter((url) => {
    return (
      url.includes("undefined") ||
      url.includes("null") ||
      url.includes("//") ||
      !url.startsWith("https://talentflight.com")
    );
  });

  if (problematicUrls.length > 0) {
    console.log(`❌ URLs com problemas encontradas: ${problematicUrls.length}`);
    problematicUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL com problemas encontrada");
  }

  console.log(`\n📊 Resumo:`);
  console.log(`  - Total de URLs no sitemap: ${urls.length}`);
  console.log(`  - URLs únicas: ${new Set(urls).size}`);
  console.log(`  - Duplicatas: ${duplicates.length}`);
  console.log(`  - URLs problemáticas: ${problematicUrls.length}`);

  // Análise do problema de canônicas
  console.log(
    `\n🔍 Análise do problema "Página alternativa com tag canônica adequada":`
  );
  console.log(
    `  - Este erro indica que o Google encontrou múltiplas URLs para o mesmo conteúdo`
  );
  console.log(
    `  - O Google está usando a tag canônica para determinar qual indexar`
  );
  console.log(`  - Possíveis causas:`);
  console.log(`    1. URLs duplicadas no sitemap`);
  console.log(`    2. Redirecionamentos incorretos`);
  console.log(`    3. Configuração incorreta de canônicas`);
  console.log(`    4. URLs com parâmetros desnecessários`);

  if (duplicates.length === 0 && problematicUrls.length === 0) {
    console.log(
      `\n✅ O sitemap parece estar correto. O problema pode estar em:`
    );
    console.log(`  - Configuração de canônicas nas páginas`);
    console.log(`  - Redirecionamentos no servidor`);
    console.log(`  - URLs com parâmetros de query string`);
  }
}

checkCanonicalIssues();
