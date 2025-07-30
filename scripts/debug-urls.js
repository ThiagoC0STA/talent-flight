const fs = require("fs");
const path = require("path");

function debugUrls() {
  console.log("🔍 Debugando URLs problemáticas...\n");

  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  const urls = urlMatches.map((match) =>
    match.replace("<loc>", "").replace("</loc>", "")
  );

  // Verificar cada tipo de problema
  const undefinedUrls = urls.filter((url) => url.includes("undefined"));
  const nullUrls = urls.filter((url) => url.includes("null"));
  const doubleSlashUrls = urls.filter((url) => url.includes("//"));
  const wrongDomainUrls = urls.filter(
    (url) => !url.startsWith("https://talentflight.com")
  );

  console.log(`URLs com 'undefined': ${undefinedUrls.length}`);
  console.log(`URLs com 'null': ${nullUrls.length}`);
  console.log(`URLs com '//': ${doubleSlashUrls.length}`);
  console.log(`URLs com domínio errado: ${wrongDomainUrls.length}`);

  if (undefinedUrls.length > 0) {
    console.log("\nURLs com undefined:");
    undefinedUrls.forEach((url) => console.log(`  - ${url}`));
  }

  if (nullUrls.length > 0) {
    console.log("\nURLs com null:");
    nullUrls.forEach((url) => console.log(`  - ${url}`));
  }

  if (doubleSlashUrls.length > 0) {
    console.log("\nURLs com //:");
    doubleSlashUrls.forEach((url) => console.log(`  - ${url}`));
  }

  if (wrongDomainUrls.length > 0) {
    console.log("\nURLs com domínio errado:");
    wrongDomainUrls.forEach((url) => console.log(`  - ${url}`));
  }

  // Verificar algumas URLs específicas
  console.log("\n🔍 Verificando algumas URLs específicas:");
  const testUrls = [
    "https://talentflight.com/",
    "https://talentflight.com/jobs",
    "https://talentflight.com/job/software-engineer-front-end-react-js-at-eshipjet-ai",
  ];

  testUrls.forEach((url) => {
    const hasUndefined = url.includes("undefined");
    const hasNull = url.includes("null");
    const hasDoubleSlash = url.includes("//");
    const hasWrongDomain = !url.startsWith("https://talentflight.com");

    console.log(`\nURL: ${url}`);
    console.log(`  - Tem undefined: ${hasUndefined}`);
    console.log(`  - Tem null: ${hasNull}`);
    console.log(`  - Tem //: ${hasDoubleSlash}`);
    console.log(`  - Domínio errado: ${hasWrongDomain}`);
  });
}

debugUrls();
