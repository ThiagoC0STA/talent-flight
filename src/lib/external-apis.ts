// APIs externas para buscar vagas
export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: string;
  category?: string;
  experience?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  description: string;
  requirements?: string[];
  benefits?: string[];
  isRemote?: boolean;
  applicationUrl: string;
  companyLogo?: string;
  tags?: string[];
  source: string;
  originalUrl: string;
  createdAt: Date;
}

// RemoteOK API
export async function searchRemoteOK(query: string): Promise<ExternalJob[]> {
  try {
    const response = await fetch(
      `https://remoteok.io/api?search=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    return data.map((job: any) => ({
      id: `remoteok-${job.id}`,
      title: job.position,
      company: job.company,
      location: job.location || "Remote",
      type: job.contract || "full-time",
      category: "engineering", // RemoteOK é focado em tech
      experience: "mid", // Default
      salary:
        job.salary_min && job.salary_max
          ? {
              min: job.salary_min,
              max: job.salary_max,
              currency: job.salary_currency || "USD",
              period: "yearly",
            }
          : undefined,
      description: job.description || "",
      requirements: [],
      benefits: [],
      isRemote: true, // RemoteOK é só remoto
      applicationUrl: job.url,
      companyLogo: job.company_logo,
      tags: job.tags || [],
      source: "remoteok",
      originalUrl: `https://remoteok.io/remote-jobs/${job.id}`,
      createdAt: new Date(job.date),
    }));
  } catch (error) {
    console.error("Erro ao buscar RemoteOK:", error);
    return [];
  }
}

// Remotive API
export async function searchRemotive(query: string): Promise<ExternalJob[]> {
  try {
    const response = await fetch(
      `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    return data.jobs.map((job: any) => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || "Remote",
      type: job.job_type || "full-time",
      category: job.category_name || "other",
      experience: "mid", // Default
      salary:
        job.salary_min && job.salary_max
          ? {
              min: job.salary_min,
              max: job.salary_max,
              currency: job.salary_currency || "USD",
              period: "yearly",
            }
          : undefined,
      description: job.description || "",
      requirements: [],
      benefits: [],
      isRemote: true,
      applicationUrl: job.url,
      companyLogo: job.company_logo,
      tags: job.tags || [],
      source: "remotive",
      originalUrl: `https://remotive.io/remote-jobs/${job.id}`,
      createdAt: new Date(job.publication_date),
    }));
  } catch (error) {
    console.error("Erro ao buscar Remotive:", error);
    return [];
  }
}

// GitHub Jobs API (como fallback)
export async function searchGitHubJobs(query: string): Promise<ExternalJob[]> {
  try {
    const response = await fetch(
      `https://jobs.github.com/positions.json?search=${encodeURIComponent(
        query
      )}&location=remote`
    );
    const data = await response.json();

    return data.map((job: any) => ({
      id: `github-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location || "Remote",
      type: job.type || "full-time",
      category: "engineering",
      experience: "mid",
      salary: undefined, // GitHub Jobs não tem salário
      description: job.description || "",
      requirements: [],
      benefits: [],
      isRemote: job.location?.toLowerCase().includes("remote") || false,
      applicationUrl: job.url,
      companyLogo: job.company_logo,
      tags: [],
      source: "github",
      originalUrl: job.url,
      createdAt: new Date(job.created_at),
    }));
  } catch (error) {
    console.error("Erro ao buscar GitHub Jobs:", error);
    return [];
  }
}

// Função principal para buscar em múltiplas APIs
export async function searchExternalJobs(
  query: string,
  sources: string[]
): Promise<ExternalJob[]> {
  try {
    const params = new URLSearchParams({
      query,
      sources: sources.join(","),
    });

    const response = await fetch(`/api/external-jobs?${params}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.jobs;
  } catch (error) {
    console.error("Erro na busca externa:", error);
    return [];
  }
}
