const fs = require("fs");
const path = require("path");

function checkWwwUrls() {
  console.log("🔍 Verificando URLs com www...\n");

  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Verificar URLs com www
  const wwwUrls = urls.filter((url) => url.includes("www.talentflight.com"));
  const nonWwwUrls = urls.filter(
    (url) =>
      url.includes("talentflight.com") && !url.includes("www.talentflight.com")
  );

  console.log(`📊 URLs com www: ${wwwUrls.length}`);
  console.log(`📊 URLs sem www: ${nonWwwUrls.length}`);

  if (wwwUrls.length > 0) {
    console.log("\n❌ URLs com www encontradas:");
    wwwUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("\n✅ Nenhuma URL com www encontrada no sitemap");
  }

  // Verificar se há URLs com http (não https)
  const httpUrls = urls.filter((url) => url.startsWith("http://"));
  const httpsUrls = urls.filter((url) => url.startsWith("https://"));

  console.log(`\n📊 URLs com http: ${httpUrls.length}`);
  console.log(`📊 URLs com https: ${httpsUrls.length}`);

  if (httpUrls.length > 0) {
    console.log("\n❌ URLs com http encontradas:");
    httpUrls.forEach((url) => console.log(`  - ${url}`));
  }

  console.log(`\n🎯 Diagnóstico:`);
  console.log(
    `  - O problema "Página com redirecionamento" pode estar sendo causado por:`
  );
  console.log(`    1. URLs com www vs sem www`);
  console.log(`    2. URLs com http vs https`);
  console.log(`    3. Redirecionamentos não configurados corretamente`);

  if (wwwUrls.length === 0 && httpUrls.length === 0) {
    console.log(
      `\n✅ O sitemap está correto. O problema pode estar no servidor ou DNS.`
    );
  } else {
    console.log(
      `\n❌ Encontrados problemas no sitemap que precisam ser corrigidos.`
    );
  }
}

checkWwwUrls();
