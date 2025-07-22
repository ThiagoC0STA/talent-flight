import { NextRequest, NextResponse } from "next/server";

// Função para detectar categoria baseada no título
function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("front") ||
    lowerTitle.includes("ui") ||
    lowerTitle.includes("ux")
  ) {
    return "frontend";
  }
  if (
    lowerTitle.includes("back") ||
    lowerTitle.includes("api") ||
    lowerTitle.includes("server")
  ) {
    return "backend";
  }
  if (lowerTitle.includes("full") || lowerTitle.includes("stack")) {
    return "fullstack";
  }
  if (
    lowerTitle.includes("mobile") ||
    lowerTitle.includes("ios") ||
    lowerTitle.includes("android")
  ) {
    return "mobile";
  }
  if (
    lowerTitle.includes("devops") ||
    lowerTitle.includes("infra") ||
    lowerTitle.includes("cloud")
  ) {
    return "devops";
  }
  if (
    lowerTitle.includes("data") ||
    lowerTitle.includes("analytics") ||
    lowerTitle.includes("ml") ||
    lowerTitle.includes("ai")
  ) {
    return "ai";
  }
  if (lowerTitle.includes("design") || lowerTitle.includes("ui/ux")) {
    return "design";
  }
  if (lowerTitle.includes("product") || lowerTitle.includes("manager")) {
    return "product";
  }
  if (
    lowerTitle.includes("dev") ||
    lowerTitle.includes("engineer") ||
    lowerTitle.includes("programmer")
  ) {
    return "development";
  }

  return "engineering"; // Default
}

// Função para mapear seniority para experiência
function getExperienceFromSeniority(seniority: string): string {
  if (!seniority) return "mid";

  const lowerSeniority = seniority.toLowerCase();

  if (lowerSeniority.includes("junior") || lowerSeniority.includes("entry")) {
    return "junior";
  }
  if (lowerSeniority.includes("senior") || lowerSeniority.includes("lead")) {
    return "senior";
  }
  if (
    lowerSeniority.includes("c_level") ||
    lowerSeniority.includes("executive")
  ) {
    return "senior"; // Mapear executive para senior
  }

  return "mid"; // Default
}

// Função para formatar descrição HTML
function formatDescription(description: string): string {
  if (!description) return "";

  // Remover markdown e converter para HTML limpo
  let formatted = description
    // Converter **texto** para <strong>texto</strong>
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Converter *texto* para <em>texto</em>
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Converter listas com * para <ul><li>
    .replace(/^\s*\*\s+(.*)$/gm, "<li>$1</li>")
    // Converter quebras de linha para <br>
    .replace(/\n/g, "<br>")
    // Limpar espaços extras
    .trim();

  // Se há <li> tags, envolver em <ul>
  if (formatted.includes("<li>")) {
    formatted = formatted.replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>");
    // Remover <ul> duplicados
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, "");
  }

  // Adicionar parágrafos onde necessário
  formatted = formatted.replace(/<br><br>/g, "</p><p>");
  if (!formatted.startsWith("<p>")) {
    formatted = "<p>" + formatted;
  }
  if (!formatted.endsWith("</p>")) {
    formatted = formatted + "</p>";
  }

  return formatted;
}

// Função para corrigir data
function parseDate(dateString: string): Date {
  if (!dateString) return new Date();

  // Tentar diferentes formatos de data
  const date = new Date(dateString);

  // Se a data é inválida (1970), tentar outros formatos
  if (date.getTime() === 0 || date.getFullYear() === 1970) {
    // Tentar formato ISO
    const isoDate = new Date(dateString + "T00:00:00Z");
    if (isoDate.getTime() > 0) return isoDate;

    // Tentar formato americano
    const americanDate = new Date(
      dateString.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$1-$2")
    );
    if (americanDate.getTime() > 0) return americanDate;

    // Se nada funcionar, usar data atual
    return new Date();
  }

  return date;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const sources = searchParams.get("sources")?.split(",") || [
    "remotive",
    "github",
    "stackoverflow",
  ];

  try {
    const allJobs = [];

    // TheirStack API (acesso a LinkedIn, Indeed, Glassdoor, etc)
    if (sources.includes("theirstack")) {
      try {
        const THEIRSTACK_API_KEY = process.env.THEIRSTACK_API_KEY;

        if (!THEIRSTACK_API_KEY) {
          console.log("TheirStack API key não configurada - pulando");
        } else {
          const apiUrl = `https://api.theirstack.com/v1/jobs/search`;

          // Payload conforme documentação - precisa de pelo menos um filtro obrigatório
          const payload = {
            limit: 50,
            posted_at_max_age_days: 30, // Vagas dos últimos 30 dias (filtro obrigatório)
            job_title_or: query ? [query] : [], // Busca por título se query fornecida
            remote: true, // Apenas vagas remotas
          };

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${THEIRSTACK_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const data = await response.json();

            const theirstackJobs =
              data.data?.map((job: any) => ({
                id: `theirstack-${job.id}`,
                title: job.job_title,
                company: job.company_object?.name || job.company || "Unknown",
                location: job.location || "Remote",
                type: "full-time", // TheirStack não tem tipo específico
                category: getCategoryFromTitle(job.job_title), // Função para detectar categoria
                experience: getExperienceFromSeniority(job.seniority), // Função para mapear seniority
                salary:
                  job.min_annual_salary && job.max_annual_salary
                    ? {
                        min: job.min_annual_salary,
                        max: job.max_annual_salary,
                        currency: job.salary_currency || "USD",
                        period: "yearly",
                      }
                    : undefined,
                description: formatDescription(job.description || ""),
                requirements: [],
                benefits: [],
                isRemote: job.remote === true, // Corrigido para usar o valor real
                applicationUrl: job.final_url || job.url,
                companyLogo: job.company_object?.logo,
                tags: job.company_object?.technology_names || [],
                source: "theirstack",
                originalUrl: job.url,
                createdAt: parseDate(job.date_posted),
              })) || [];

            allJobs.push(...theirstackJobs);
          } else {
            const errorText = await response.text();
            console.error(
              "Erro na API TheirStack:",
              response.status,
              errorText
            );
          }
        }
      } catch (error) {
        console.error("Erro ao buscar TheirStack:", error);
      }
    }

    // Remotive API (muito boa!)
    if (sources.includes("remotive")) {
      try {
        const response = await fetch(
          `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();

        const remotiveJobs = data.jobs.map((job: any) => ({
          id: `remotive-${job.id}`,
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || "Remote",
          type: job.job_type || "full-time",
          category: job.category_name || "other",
          experience: "mid",
          salary:
            job.salary_min && job.salary_max
              ? {
                  min: job.salary_min,
                  max: job.salary_max,
                  currency: job.salary_currency || "USD",
                  period: "yearly",
                }
              : undefined,
          description: formatDescription(job.description || ""),
          requirements: [],
          benefits: [],
          isRemote: true,
          applicationUrl: job.url,
          companyLogo: job.company_logo,
          tags: job.tags || [],
          source: "remotive",
          originalUrl: `https://remotive.io/remote-jobs/${job.id}`,
          createdAt: parseDate(job.publication_date),
        }));

        allJobs.push(...remotiveJobs);
      } catch (error) {
        console.error("Erro ao buscar Remotive:", error);
      }
    }

    // GitHub Jobs API
    if (sources.includes("github")) {
      try {
        const response = await fetch(
          `https://jobs.github.com/positions.json?search=${encodeURIComponent(
            query
          )}&location=remote`
        );
        const data = await response.json();

        const githubJobs = data.map((job: any) => ({
          id: `github-${job.id}`,
          title: job.title,
          company: job.company,
          location: job.location || "Remote",
          type: job.type || "full-time",
          category: "engineering",
          experience: "mid",
          salary: undefined,
          description: formatDescription(job.description || ""),
          requirements: [],
          benefits: [],
          isRemote: job.location?.toLowerCase().includes("remote") || false,
          applicationUrl: job.url,
          companyLogo: job.company_logo,
          tags: [],
          source: "github",
          originalUrl: job.url,
          createdAt: parseDate(job.created_at),
        }));

        allJobs.push(...githubJobs);
      } catch (error) {
        console.error("Erro ao buscar GitHub Jobs:", error);
      }
    }

    // Stack Overflow Jobs API
    if (sources.includes("stackoverflow")) {
      try {
        const response = await fetch(
          `https://api.stackexchange.com/2.3/jobs?order=desc&sort=creation&tagged=${encodeURIComponent(
            query
          )}&site=stackoverflow`
        );
        const data = await response.json();

        const stackoverflowJobs = data.items.map((job: any) => ({
          id: `stackoverflow-${job.job_id}`,
          title: job.title,
          company: job.company_name || "Unknown",
          location: job.location || "Remote",
          type: "full-time",
          category: "engineering",
          experience: "mid",
          salary: undefined,
          description: formatDescription(job.body || ""),
          requirements: [],
          benefits: [],
          isRemote: job.location?.toLowerCase().includes("remote") || false,
          applicationUrl: job.url,
          companyLogo: undefined,
          tags: job.tags || [],
          source: "stackoverflow",
          originalUrl: job.url,
          createdAt: parseDate(
            new Date(job.creation_date * 1000).toISOString()
          ),
        }));

        allJobs.push(...stackoverflowJobs);
      } catch (error) {
        console.error("Erro ao buscar Stack Overflow:", error);
      }
    }

    // AngelList API (gratuita)
    if (sources.includes("angellist")) {
      try {
        const response = await fetch(
          `https://api.angel.co/1/jobs?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const angellistJobs =
          data.jobs?.map((job: any) => ({
            id: `angellist-${job.id}`,
            title: job.title,
            company: job.startup?.name || "Unknown",
            location: job.location || "Remote",
            type: "full-time",
            category: "engineering",
            experience: "mid",
            salary: undefined,
            description: job.description || "",
            requirements: [],
            benefits: [],
            isRemote: job.location?.toLowerCase().includes("remote") || false,
            applicationUrl: job.url,
            companyLogo: job.startup?.logo_url,
            tags: job.tags || [],
            source: "angellist",
            originalUrl: job.url,
            createdAt: new Date(job.created_at),
          })) || [];

        allJobs.push(...angellistJobs);
      } catch (error) {
        console.error("Erro ao buscar AngelList:", error);
      }
    }

    return NextResponse.json({
      jobs: allJobs,
      total: allJobs.length,
    });
  } catch (error) {
    console.error("Erro geral na busca:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vagas externas" },
      { status: 500 }
    );
  }
}
