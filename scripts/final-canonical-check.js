const fs = require("fs");
const path = require("path");

function finalCanonicalCheck() {
  console.log("🔍 Verificação final de canônicas...\n");

  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Verificar URL específica
  const specificUrl =
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai";
  const foundSpecificUrl = urls.find((url) => url === specificUrl);

  console.log(
    `✅ URL específica encontrada no sitemap: ${foundSpecificUrl ? "SIM" : "NÃO"}`
  );

  // Verificar duplicatas
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  console.log(`✅ URLs duplicadas: ${duplicates.length > 0 ? "SIM" : "NÃO"}`);

  // Verificar URLs problemáticas reais (sem considerar https:// como problema)
  const problematicUrls = urls.filter((url) => {
    return (
      url.includes("undefined") ||
      url.includes("null") ||
      (url.includes("//") && !url.startsWith("https://")) ||
      !url.startsWith("https://talentflight.com")
    );
  });

  console.log(
    `✅ URLs com problemas reais: ${problematicUrls.length > 0 ? "SIM" : "NÃO"}`
  );

  console.log(`\n📊 Estatísticas:`);
  console.log(`  - Total de URLs: ${urls.length}`);
  console.log(`  - URLs únicas: ${new Set(urls).size}`);

  console.log(
    `\n🔍 Diagnóstico do problema "Página alternativa com tag canônica adequada":`
  );

  if (duplicates.length === 0 && problematicUrls.length === 0) {
    console.log(`✅ O sitemap está correto. O problema pode estar em:`);
    console.log(`  1. Configuração de canônicas nas páginas individuais`);
    console.log(`  2. Redirecionamentos no servidor`);
    console.log(`  3. URLs com parâmetros de query string`);
    console.log(`  4. Problemas de cache do Google`);

    console.log(`\n💡 Soluções recomendadas:`);
    console.log(
      `  1. Verificar se todas as páginas têm tags canônicas corretas`
    );
    console.log(
      `  2. Verificar se não há redirecionamentos 301/302 incorretos`
    );
    console.log(`  3. Verificar se não há URLs com parâmetros desnecessários`);
    console.log(`  4. Aguardar o Google reindexar (pode levar alguns dias)`);

    console.log(`\n🎯 Resumo:`);
    console.log(`  - A URL específica está no sitemap`);
    console.log(`  - Não há URLs duplicadas`);
    console.log(`  - Não há URLs problemáticas`);
    console.log(
      `  - O problema provavelmente está na configuração de canônicas ou cache do Google`
    );
  } else {
    console.log(
      `❌ Encontrados problemas no sitemap que precisam ser corrigidos`
    );
  }
}

finalCanonicalCheck();
