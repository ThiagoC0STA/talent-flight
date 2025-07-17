import { SearchHistory } from "@/types/common";
import { Job } from "@/types/job";
import { supabase } from "./supabase";

// Converter dados do Supabase para o formato da aplicação
const mapSupabaseJobToJob = (supabaseJob: any): Job => ({
  id: supabaseJob.id,
  title: supabaseJob.title,
  company: supabaseJob.company,
  location: supabaseJob.location,
  type: supabaseJob.type as any,
  category: supabaseJob.category as any,
  experience: supabaseJob.experience as any,
  salary: {
    min: supabaseJob.salary_min,
    max: supabaseJob.salary_max,
    currency: supabaseJob.salary_currency,
    period: supabaseJob.salary_period as any,
  },
  description: supabaseJob.description,
  requirements: supabaseJob.requirements || [],
  benefits: supabaseJob.benefits || [],
  isRemote: supabaseJob.is_remote,
  isFeatured: supabaseJob.is_featured,
  isActive: supabaseJob.is_active,
  applicationUrl: supabaseJob.application_url,
  companyLogo: supabaseJob.company_logo,
  tags: supabaseJob.tags || [],
  createdAt: new Date(supabaseJob.created_at),
  updatedAt: new Date(supabaseJob.updated_at),
});

// Converter dados da aplicação para o formato do Supabase
const mapJobToSupabaseJob = (
  job: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: Date | string;
  }
) => {
  console.log("=== mapJobToSupabaseJob DEBUG ===");
  console.log("Job recebido:", job);
  console.log("job.createdAt:", job.createdAt);
  console.log("typeof job.createdAt:", typeof job.createdAt);
  console.log("job.createdAt instanceof Date:", job.createdAt instanceof Date);

  const created_at = job.createdAt
    ? job.createdAt instanceof Date
      ? job.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z"
      : (() => {
          try {
            return (
              new Date(job.createdAt as string).toISOString().split("T")[0] +
              "T00:00:00.000Z"
            );
          } catch (error) {
            console.error("Erro ao converter data:", job.createdAt, error);
            return new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
          }
        })()
    : new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

  console.log("created_at final:", created_at);

  return {
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    category: job.category,
    experience: job.experience,
    salary_min: job.salary?.min,
    salary_max: job.salary?.max,
    salary_currency: job.salary?.currency,
    salary_period: job.salary?.period,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    is_remote: job.isRemote,
    is_featured: job.isFeatured,
    is_active: job.isActive,
    application_url: job.applicationUrl,
    company_logo: job.companyLogo,
    tags: job.tags,
    created_at,
    updated_at: new Date().toISOString(),
  };
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

export const jobsService = {
  async getAllJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }

    return data.map(mapSupabaseJobToJob);
  },

  // Buscar vagas em destaque
  async getFeaturedJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured jobs:", error);
      return [];
    }

    return data.map(mapSupabaseJobToJob);
  },

  // Buscar vaga por ID ou slug
  async getJobById(idOrSlug: string): Promise<Job | null> {
    // Primeiro tenta buscar pelo slug
    let { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("slug", idOrSlug)
      .eq("is_active", true)
      .single();

    // Se não encontrou, tenta buscar pelo ID direto (para compatibilidade)
    if (error && !data) {
      const result = await supabase
        .from("jobs")
        .select("*")
        .eq("id", idOrSlug)
        .eq("is_active", true)
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Error fetching job:", error);
      return null;
    }

    return mapSupabaseJobToJob(data);
  },

  // Verificar se vaga já existe (por título, empresa e URL)
  async checkJobExists(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> {
    // Verificar por título e empresa (mais comum)
    const { data } = await supabase
      .from("jobs")
      .select("id")
      .eq("title", job.title)
      .eq("company", job.company)
      .eq("is_active", true)
      .single();

    if (data) return true;

    // Verificar por URL de aplicação (se existir)
    if (job.applicationUrl) {
      const { data: urlData } = await supabase
        .from("jobs")
        .select("id")
        .eq("application_url", job.applicationUrl)
        .eq("is_active", true)
        .single();

      if (urlData) return true;
    }

    // Verificar por slug
    const slug = `${slugify(job.title)}-at-${slugify(job.company)}`;
    const { data: slugData } = await supabase
      .from("jobs")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (slugData) return true;

    return false;
  },

  // Buscar vagas com filtros
  async searchJobs(filters: any): Promise<Job[]> {
    let query = supabase.from("jobs").select("*").eq("is_active", true);

    // Aplicar filtros
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,company.ilike.%${filters.query}%,location.ilike.%${filters.query}%`
      );
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.category && filters.category.length > 0) {
      query = query.in("category", filters.category);
    }

    if (filters.type && filters.type.length > 0) {
      query = query.in("type", filters.type);
    }

    if (filters.experience && filters.experience.length > 0) {
      query = query.in("experience", filters.experience);
    }

    if (filters.isRemote) {
      query = query.eq("is_remote", true);
    }

    if (filters.isFeatured) {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching jobs:", error);
      return [];
    }

    return data.map(mapSupabaseJobToJob);
  },

  // Buscar vagas com filtros para admin (inclui inativas)
  async searchJobsAdmin(filters: any): Promise<Job[]> {
    let query = supabase.from("jobs").select("*");

    // Aplicar filtros
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,company.ilike.%${filters.query}%,location.ilike.%${filters.query}%`
      );
    }

    if (filters.status === "active") {
      query = query.eq("is_active", true);
    } else if (filters.status === "inactive") {
      query = query.eq("is_active", false);
    }

    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.experience) {
      query = query.eq("experience", filters.experience);
    }

    if (filters.remote === "yes") {
      query = query.eq("is_remote", true);
    } else if (filters.remote === "no") {
      query = query.eq("is_remote", false);
    }

    if (filters.featured === "yes") {
      query = query.eq("is_featured", true);
    } else if (filters.featured === "no") {
      query = query.eq("is_featured", false);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching jobs admin:", error);
      return [];
    }

    return data.map(mapSupabaseJobToJob);
  },

  // Criar nova vaga
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Date | string;
    }
  ): Promise<Job | null> {
    console.log("=== createJob DEBUG ===");
    console.log("Job recebido para criar:", job);

    // Gerar slug
    const slug = `${slugify(job.title)}-at-${slugify(job.company)}`;
    const supabaseJob = { ...mapJobToSupabaseJob(job), slug };

    console.log("Supabase job para inserir:", supabaseJob);

    const { data, error } = await supabase
      .from("jobs")
      .insert(supabaseJob)
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return null;
    }

    console.log("Job criado com sucesso:", data);
    return mapSupabaseJobToJob(data);
  },

  // Atualizar vaga
  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    console.log("=== UPDATE JOB DEBUG ===");
    console.log("ID recebido:", id);
    console.log("Updates recebidos:", updates);

    const supabaseUpdates: any = {};

    if (updates.title) supabaseUpdates.title = updates.title;
    if (updates.company) supabaseUpdates.company = updates.company;
    if (updates.location) supabaseUpdates.location = updates.location;
    if (updates.type) supabaseUpdates.type = updates.type;
    if (updates.category) supabaseUpdates.category = updates.category;
    if (updates.experience) supabaseUpdates.experience = updates.experience;
    if (updates.salary) {
      supabaseUpdates.salary_min = updates.salary.min;
      supabaseUpdates.salary_max = updates.salary.max;
      supabaseUpdates.salary_currency = updates.salary.currency;
      supabaseUpdates.salary_period = updates.salary.period;
    }
    if (updates.description) supabaseUpdates.description = updates.description;
    if (updates.requirements)
      supabaseUpdates.requirements = updates.requirements;
    if (updates.benefits) supabaseUpdates.benefits = updates.benefits;
    if (updates.isRemote !== undefined)
      supabaseUpdates.is_remote = updates.isRemote;
    if (updates.isFeatured !== undefined)
      supabaseUpdates.is_featured = updates.isFeatured;
    if (updates.isActive !== undefined)
      supabaseUpdates.is_active = updates.isActive;
    if (updates.applicationUrl)
      supabaseUpdates.application_url = updates.applicationUrl;
    if (updates.companyLogo !== undefined)
      supabaseUpdates.company_logo = updates.companyLogo;
    if (updates.tags) supabaseUpdates.tags = updates.tags;
    if (updates.createdAt)
      supabaseUpdates.created_at = updates.createdAt.toISOString();
    // Gerar slug atualizado
    if (updates.title && updates.company) {
      supabaseUpdates.slug = `${slugify(updates.title)}-at-${slugify(
        updates.company
      )}`;
    }

    console.log("Payload para Supabase:", supabaseUpdates);
    console.log("Campos que serão atualizados:", Object.keys(supabaseUpdates));

    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update(supabaseUpdates)
      .eq("id", id)
      .select();

    console.log("Resposta do Supabase UPDATE:", { updateData, updateError });

    if (updateError) {
      console.error("Error updating job:", updateError);
      console.error("Detalhes do erro:", {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code,
      });
      return null;
    }

    console.log("Update realizado com sucesso. Dados retornados:", updateData);

    // Se o update retornou dados, usar eles diretamente
    if (updateData && updateData.length > 0) {
      return mapSupabaseJobToJob(updateData[0]);
    }

    // Se não retornou dados, buscar novamente
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    console.log("Busca após update:", { data, error });

    if (error) {
      console.error("Error fetching updated job:", error);
      return null;
    }

    return mapSupabaseJobToJob(data);
  },

  // Deletar vaga (soft delete)
  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error);
      return false;
    }

    return true;
  },
};

// Tracking de cliques
export const trackingService = {
  async trackClick(jobId: string, applicationUrl: string) {
    try {
      const { error } = await supabase.from("job_clicks").insert({
        job_id: jobId,
        application_url: applicationUrl,
        clicked_at: new Date().toISOString(),
        user_agent:
          typeof window !== "undefined" ? window.navigator.userAgent : null,
        referrer: typeof window !== "undefined" ? document.referrer : null,
        is_valid: true,
      });

      if (error) {
        console.error("Erro ao registrar clique:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
      return false;
    }
  },

  // Histórico de pesquisas
  async saveSearchHistory(
    query: string,
    sources: string[],
    resultsCount: number,
    results?: any[]
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.from("search_history").insert({
        query,
        sources,
        results_count: resultsCount,
        results: results || null,
        user_id: user.id,
      });

      if (error) {
        console.error("Erro ao salvar histórico:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
      return false;
    }
  },

  async getSearchHistory(): Promise<SearchHistory[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        query: item.query,
        sources: item.sources,
        resultsCount: item.results_count,
        results: item.results || [],
        createdAt: new Date(item.created_at),
        userId: item.user_id,
        imported: item.imported || false,
      }));
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  },

  async deleteSearchHistory(id: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao deletar histórico:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar histórico:", error);
      return false;
    }
  },

  async markSearchHistoryAsImported(id: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from("search_history")
        .update({ imported: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao marcar como importado:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao marcar como importado:", error);
      return false;
    }
  },

  async markJobAsImported(
    historyId: string,
    externalJobId: string,
    jobTitle: string,
    companyName: string
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.from("imported_jobs").insert({
        history_id: historyId,
        external_job_id: externalJobId,
        job_title: jobTitle,
        company_name: companyName,
        user_id: user.id,
      });

      if (error) {
        console.error("Erro ao marcar vaga como importada:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao marcar vaga como importada:", error);
      return false;
    }
  },

  async getImportedJobs(historyId?: string): Promise<string[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("imported_jobs")
        .select("external_job_id")
        .eq("user_id", user.id);

      if (historyId) {
        query = query.eq("history_id", historyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar vagas importadas:", error);
        return [];
      }

      return data.map((item) => item.external_job_id);
    } catch (error) {
      console.error("Erro ao buscar vagas importadas:", error);
      return [];
    }
  },

  async getImportedJobsList(limit: number = 50): Promise<Job[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      // Primeiro, buscar os registros de vagas importadas
      const { data: importedJobs, error: importedError } = await supabase
        .from("imported_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("imported_at", { ascending: false })
        .limit(limit);

      if (importedError) {
        console.error("Erro ao buscar vagas importadas:", importedError);
        return [];
      }

      if (!importedJobs || importedJobs.length === 0) {
        return [];
      }

      // Buscar as vagas correspondentes na tabela jobs
      // Vamos buscar por título e empresa para encontrar as vagas importadas
      const importedJobsData: Job[] = [];

      for (const importedJob of importedJobs) {
        // Buscar a vaga na tabela jobs por título e empresa
        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("title", importedJob.job_title)
          .eq("company", importedJob.company_name)
          .eq("is_active", true)
          .single();

        if (jobData && !jobError) {
          importedJobsData.push(mapSupabaseJobToJob(jobData));
        }
      }

      // Ordenar pela data de importação (mais recentes primeiro)
      return importedJobsData.sort((a, b) => {
        const aImported = importedJobs.find(
          (item) =>
            item.job_title === a.title && item.company_name === a.company
        );
        const bImported = importedJobs.find(
          (item) =>
            item.job_title === b.title && item.company_name === b.company
        );

        if (!aImported || !bImported) return 0;

        return (
          new Date(bImported.imported_at).getTime() -
          new Date(aImported.imported_at).getTime()
        );
      });
    } catch (error) {
      console.error("Erro ao buscar lista de vagas importadas:", error);
      return [];
    }
  },

  async clearImportedHistory(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      // Deletar todos os registros de imported_jobs do usuário
      const { error } = await supabase
        .from("imported_jobs")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao limpar histórico importado:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao limpar histórico importado:", error);
      return false;
    }
  },

  async getClickStats(jobId?: string) {
    try {
      // Buscar cliques
      let query = supabase
        .from("job_clicks")
        .select("*")
        .order("clicked_at", { ascending: false });

      if (jobId) {
        query = query.eq("job_id", jobId);
      }

      const { data: clicks, error: clicksError } = await query;

      if (clicksError) {
        console.error("Erro ao buscar cliques:", clicksError);
        return [];
      }

      if (!clicks || clicks.length === 0) {
        return [];
      }

      // Buscar jobs correspondentes
      const jobIds = [...new Set(clicks.map((click) => click.job_id))];
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, company")
        .in("id", jobIds);

      if (jobsError) {
        console.error("Erro ao buscar jobs:", jobsError);
        return [];
      }

      // Criar mapa de jobs para acesso rápido
      const jobsMap = new Map();
      jobs?.forEach((job) => {
        jobsMap.set(job.id, job);
      });

      // Combinar dados
      const clicksWithJobs = clicks.map((click) => ({
        ...click,
        jobs: [
          jobsMap.get(click.job_id) || { title: "Unknown", company: "Unknown" },
        ],
      }));

      return clicksWithJobs;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return [];
    }
  },

  async getClickSummary() {
    try {
      // Buscar cliques
      const { data: clicks, error: clicksError } = await supabase
        .from("job_clicks")
        .select("job_id, is_valid, clicked_at")
        .order("clicked_at", { ascending: false });

      if (clicksError) {
        console.error("Erro ao buscar cliques:", clicksError);
        return {
          totalClicks: 0,
          validClicks: 0,
          invalidClicks: 0,
          clicksByJob: [],
        };
      }

      if (!clicks || clicks.length === 0) {
        return {
          totalClicks: 0,
          validClicks: 0,
          invalidClicks: 0,
          clicksByJob: [],
        };
      }

      // Buscar jobs correspondentes
      const jobIds = [...new Set(clicks.map((click) => click.job_id))];
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, company")
        .in("id", jobIds);

      if (jobsError) {
        console.error("Erro ao buscar jobs:", jobsError);
        return {
          totalClicks: 0,
          validClicks: 0,
          invalidClicks: 0,
          clicksByJob: [],
        };
      }

      // Criar mapa de jobs para acesso rápido
      const jobsMap = new Map();
      jobs?.forEach((job) => {
        jobsMap.set(job.id, job);
      });

      // Combinar dados
      const clicksWithJobs = clicks.map((click) => ({
        ...click,
        job: jobsMap.get(click.job_id) || {
          title: "Unknown",
          company: "Unknown",
        },
      }));

      const totalClicks = clicks.length;
      const validClicks = clicks.filter((click) => click.is_valid).length;
      const invalidClicks = totalClicks - validClicks;

      // Agrupar por vaga
      const clicksByJob = clicksWithJobs.reduce((acc, click) => {
        const jobTitle = click.job.title || "Unknown";
        const jobCompany = click.job.company || "Unknown";
        const key = `${jobTitle} at ${jobCompany}`;

        if (!acc[key]) {
          acc[key] = {
            jobTitle,
            jobCompany,
            totalClicks: 0,
            validClicks: 0,
            invalidClicks: 0,
            lastClick: null,
          };
        }

        acc[key].totalClicks++;
        if (click.is_valid) {
          acc[key].validClicks++;
        } else {
          acc[key].invalidClicks++;
        }

        if (
          !acc[key].lastClick ||
          new Date(click.clicked_at) > new Date(acc[key].lastClick)
        ) {
          acc[key].lastClick = click.clicked_at;
        }

        return acc;
      }, {} as Record<string, any>);

      return {
        totalClicks,
        validClicks,
        invalidClicks,
        clicksByJob: Object.values(clicksByJob),
      };
    } catch (error) {
      console.error("Erro ao buscar resumo:", error);
      return {
        totalClicks: 0,
        validClicks: 0,
        invalidClicks: 0,
        clicksByJob: [],
      };
    }
  },
};
