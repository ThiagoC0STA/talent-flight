const fs = require("fs");
const path = require("path");

function seoHealthCheck() {
  console.log("🔍 Verificação Completa de Saúde SEO\n");
  console.log("=".repeat(50));

  // 1. VERIFICAÇÃO DO SITEMAP
  console.log("\n📋 1. VERIFICAÇÃO DO SITEMAP");
  console.log("-".repeat(30));

  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.log("❌ Sitemap não encontrado");
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  console.log(`✅ Sitemap encontrado com ${urls.length} URLs`);

  // 2. VERIFICAÇÃO DE URLS DUPLICADAS
  console.log("\n📋 2. VERIFICAÇÃO DE URLS DUPLICADAS");
  console.log("-".repeat(30));

  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  if (duplicates.length > 0) {
    console.log(`❌ URLs duplicadas encontradas: ${duplicates.length}`);
    duplicates.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL duplicada encontrada");
  }

  // 3. VERIFICAÇÃO DE FORMATO DE URLS
  console.log("\n📋 3. VERIFICAÇÃO DE FORMATO DE URLS");
  console.log("-".repeat(30));

  const problematicUrls = urls.filter((url) => {
    return (
      url.includes("undefined") ||
      url.includes("null") ||
      (url.includes("//") && !url.startsWith("https://")) ||
      !url.startsWith("https://talentflight.com")
    );
  });

  if (problematicUrls.length > 0) {
    console.log(`❌ URLs com problemas encontradas: ${problematicUrls.length}`);
    problematicUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Todas as URLs estão no formato correto");
  }

  // 4. VERIFICAÇÃO DE URLS COM WWW
  console.log("\n📋 4. VERIFICAÇÃO DE URLS COM WWW");
  console.log("-".repeat(30));

  const wwwUrls = urls.filter((url) => url.includes("www.talentflight.com"));
  if (wwwUrls.length > 0) {
    console.log(`❌ URLs com www encontradas: ${wwwUrls.length}`);
    wwwUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL com www encontrada");
  }

  // 5. VERIFICAÇÃO DE URLS COM HTTP
  console.log("\n📋 5. VERIFICAÇÃO DE URLS COM HTTP");
  console.log("-".repeat(30));

  const httpUrls = urls.filter((url) => url.startsWith("http://"));
  if (httpUrls.length > 0) {
    console.log(`❌ URLs com http encontradas: ${httpUrls.length}`);
    httpUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL com http encontrada");
  }

  // 6. VERIFICAÇÃO DE URLS DE JOBS
  console.log("\n📋 6. VERIFICAÇÃO DE URLS DE JOBS");
  console.log("-".repeat(30));

  const jobUrls = urls.filter((url) => url.includes("/job/"));
  const correctJobUrls = jobUrls.filter((url) => {
    return (
      url.startsWith("https://talentflight.com/job/") &&
      url.split("/job/")[1] &&
      url.split("/job/")[1].length > 0
    );
  });

  console.log(`📊 Total de URLs de jobs: ${jobUrls.length}`);
  console.log(`✅ URLs de jobs corretas: ${correctJobUrls.length}`);
  console.log(
    `❌ URLs de jobs incorretas: ${jobUrls.length - correctJobUrls.length}`
  );

  // 7. VERIFICAÇÃO DE SLUGS DUPLICADOS
  console.log("\n📋 7. VERIFICAÇÃO DE SLUGS DUPLICADOS");
  console.log("-".repeat(30));

  const jobSlugs = jobUrls.map((url) => url.split("/job/")[1]);
  const duplicateSlugs = jobSlugs.filter(
    (slug, index) => jobSlugs.indexOf(slug) !== index
  );

  if (duplicateSlugs.length > 0) {
    console.log(`❌ Slugs duplicados encontrados: ${duplicateSlugs.length}`);
    duplicateSlugs.forEach((slug) => console.log(`  - ${slug}`));
  } else {
    console.log("✅ Nenhum slug duplicado encontrado");
  }

  // 8. VERIFICAÇÃO DE URLS MUITO LONGAS
  console.log("\n📋 8. VERIFICAÇÃO DE URLS MUITO LONGAS");
  console.log("-".repeat(30));

  const longUrls = urls.filter((url) => url.length > 2048);
  if (longUrls.length > 0) {
    console.log(`❌ URLs muito longas encontradas: ${longUrls.length}`);
    longUrls.forEach((url) => console.log(`  - ${url} (${url.length} chars)`));
  } else {
    console.log("✅ Nenhuma URL muito longa encontrada");
  }

  // 9. VERIFICAÇÃO DE CARACTERES ESPECIAIS
  console.log("\n📋 9. VERIFICAÇÃO DE CARACTERES ESPECIAIS");
  console.log("-".repeat(30));

  const specialCharUrls = urls.filter((url) => {
    return (
      url.includes("%") ||
      url.includes("&") ||
      url.includes("+") ||
      url.includes("=") ||
      url.includes("#") ||
      url.includes("?")
    );
  });

  if (specialCharUrls.length > 0) {
    console.log(`⚠️ URLs com caracteres especiais: ${specialCharUrls.length}`);
    specialCharUrls.forEach((url) => console.log(`  - ${url}`));
  } else {
    console.log("✅ Nenhuma URL com caracteres especiais problemáticos");
  }

  // 10. VERIFICAÇÃO DE URLS ESPECÍFICAS
  console.log("\n📋 10. VERIFICAÇÃO DE URLS ESPECÍFICAS");
  console.log("-".repeat(30));

  const specificUrls = [
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai",
    "https://talentflight.com/job/front-end-developer-at-eclaro-philippines",
    "https://talentflight.com/",
    "https://talentflight.com/jobs",
  ];

  specificUrls.forEach((url) => {
    const found = urls.find((u) => u === url);
    console.log(`${found ? "✅" : "❌"} ${url}`);
  });

  // RESUMO FINAL
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMO FINAL");
  console.log("=".repeat(50));

  const totalProblems =
    duplicates.length +
    problematicUrls.length +
    wwwUrls.length +
    httpUrls.length +
    (jobUrls.length - correctJobUrls.length) +
    duplicateSlugs.length +
    longUrls.length;

  console.log(`📈 Total de URLs no sitemap: ${urls.length}`);
  console.log(`📈 URLs de jobs: ${jobUrls.length}`);
  console.log(`❌ Problemas encontrados: ${totalProblems}`);

  if (totalProblems === 0) {
    console.log("\n🎉 EXCELENTE! Nenhum problema encontrado no sitemap.");
    console.log("💡 Se ainda há problemas de indexação, verifique:");
    console.log("   - Configuração de canônicas nas páginas");
    console.log("   - Redirecionamentos no servidor");
    console.log("   - Configuração de DNS");
    console.log("   - Cache do Google (pode levar alguns dias)");
  } else {
    console.log(
      `\n⚠️ ${totalProblems} problemas encontrados que precisam ser corrigidos.`
    );
  }

  // POSSÍVEIS CAUSAS DE NÃO INDEXAÇÃO
  console.log("\n🔍 POSSÍVEIS CAUSAS DE NÃO INDEXAÇÃO:");
  console.log("-".repeat(40));

  const issues = [];

  if (duplicates.length > 0) issues.push("URLs duplicadas");
  if (problematicUrls.length > 0) issues.push("URLs com formato incorreto");
  if (wwwUrls.length > 0) issues.push("URLs com www");
  if (httpUrls.length > 0) issues.push("URLs com http");
  if (duplicateSlugs.length > 0) issues.push("Slugs duplicados");
  if (longUrls.length > 0) issues.push("URLs muito longas");

  if (issues.length === 0) {
    console.log("✅ Nenhum problema técnico encontrado");
    console.log("💡 Verifique configurações de servidor e DNS");
  } else {
    issues.forEach((issue) => console.log(`❌ ${issue}`));
  }
}

seoHealthCheck();
