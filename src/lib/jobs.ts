import { SearchHistory } from "@/types/common";
import { Job } from "@/types/job";
import { supabase } from "./supabase";

// Função para corrigir dados inconsistentes no banco
const fixInconsistentData = (data: any[]): any[] => {
  return data.map((job) => {
    // Corrigir valores de experiência inconsistentes
    let fixedExperience = job.experience;
    if (job.experience) {
      const experience = job.experience.toLowerCase();
      if (experience === "executive" || experience === "lead") {
        fixedExperience = "senior";
      } else if (
        ![
          "intern",
          "junior",
          "junior-mid",
          "mid",
          "mid-senior",
          "senior",
          "between",
        ].includes(experience)
      ) {
        fixedExperience = "mid"; // Default para valores desconhecidos
      }
    }

    return {
      ...job,
      experience: fixedExperience,
    };
  });
};

// Converter dados do Supabase para o formato da aplicação
const mapSupabaseJobToJob = (supabaseJob: any): Job => {
  // Corrigir dados inconsistentes antes do mapeamento
  const fixedJob = fixInconsistentData([supabaseJob])[0];

  return {
    id: fixedJob.id,
    title: fixedJob.title,
    company: fixedJob.company,
    location: fixedJob.location,
    type: fixedJob.type as any,
    category: fixedJob.category as any,
    experience: fixedJob.experience as any,
    salary: {
      min: fixedJob.salary_min,
      max: fixedJob.salary_max,
      currency: fixedJob.salary_currency,
      period: fixedJob.salary_period as any,
    },
    description: fixedJob.description,
    requirements: fixedJob.requirements || [],
    benefits: fixedJob.benefits || [],
    isRemote: fixedJob.is_remote,
    isFeatured: fixedJob.is_featured,
    isActive: fixedJob.is_active,
    applicationUrl: fixedJob.application_url,
    companyLogo: fixedJob.company_logo,
    tags: fixedJob.tags || [],
    slug: fixedJob.slug,
    createdAt: new Date(fixedJob.created_at),
    updatedAt: new Date(fixedJob.updated_at),
  };
};

// Converter dados da aplicação para o formato do Supabase
const mapJobToSupabaseJob = (
  job: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: Date | string;
  }
) => {
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
  async getAllJobs(limit?: number, offset?: number): Promise<Job[]> {
    let query = supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }

    return data.map(mapSupabaseJobToJob);
  },

  // Nova função para buscar jobs com paginação e filtros - ULTRA OTIMIZADA
  async getJobsWithPagination(params: {
    page: number;
    limit: number;
    filters?: any;
    sortBy?: "date" | "salary" | "relevance";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    jobs: Job[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  }> {
    const {
      page,
      limit,
      filters = {},
      sortBy = "date",
      sortOrder = "desc",
    } = params;
    const offset = (page - 1) * limit;

    // Otimização máxima: selecionar apenas campos essenciais
    let query = supabase
      .from("jobs")
      .select(
        `
        id,
        title,
        company,
        location,
        type,
        category,
        experience,
        salary_min,
        salary_max,
        salary_currency,
        salary_period,
        description,
        requirements,
        benefits,
        is_remote,
        is_featured,
        is_active,
        application_url,
        company_logo,
        tags,
        created_at,
        updated_at
      `,
        { count: "exact" }
      )
      .eq("is_active", true);

    // Aplicar filtros de forma otimizada
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

    // Aplicar ordenação
    let orderBy = "created_at";
    if (sortBy === "salary") {
      orderBy = "salary_min";
    } else if (sortBy === "relevance") {
      orderBy = "created_at"; // Para relevância, mantém por data
    }

    query = query.order(orderBy, { ascending: sortOrder === "asc" });

    // Aplicar paginação
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching jobs with pagination:", error);
      return {
        jobs: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
        hasMore: false,
      };
    }

    const jobs = data.map(mapSupabaseJobToJob);
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      jobs,
      total,
      totalPages,
      currentPage: page,
      hasMore,
    };
  },

  async getJobsCount(): Promise<number> {
    const { count, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching jobs count:", error);
      return 0;
    }

    return count || 0;
  },

  // Nova função para buscar apenas estatísticas dos jobs - ULTRA OTIMIZADA
  async getJobsStats(): Promise<{
    totalJobs: number;
    totalCompanies: number;
    remoteJobs: number;
  }> {
    try {
      // Otimização máxima: usar apenas count para total de jobs
      const [countResult, companiesResult] = await Promise.all([
        supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("jobs")
          .select("company, is_remote")
          .eq("is_active", true)
          .limit(1000), // Limitar para performance
      ]);

      if (countResult.error) {
        console.error("Error fetching jobs count:", countResult.error);
        return { totalJobs: 0, totalCompanies: 0, remoteJobs: 0 };
      }

      if (companiesResult.error) {
        console.error("Error fetching companies:", companiesResult.error);
        return { totalJobs: 0, totalCompanies: 0, remoteJobs: 0 };
      }

      // Calcular estatísticas de forma otimizada
      const totalJobs = countResult.count || 0;
      const uniqueCompanies = new Set(
        companiesResult.data.map((job) => job.company)
      ).size;
      const remoteJobs = companiesResult.data.filter(
        (job) => job.is_remote
      ).length;

      return {
        totalJobs,
        totalCompanies: uniqueCompanies,
        remoteJobs,
      };
    } catch (error) {
      console.error("Error in getJobsStats:", error);
      return { totalJobs: 0, totalCompanies: 0, remoteJobs: 0 };
    }
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

  // Buscar trabalhos relacionados
  async getRelatedJobs(currentJob: Job, limit: number = 12): Promise<Job[]> {
    try {
      // Buscar vagas com mesma categoria ou tags similares
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .neq("id", currentJob.id); // Excluir a vaga atual

      // Filtrar por categoria se existir
      if (currentJob.category) {
        query = query.eq("category", currentJob.category);
      }

      // Se não encontrou por categoria, buscar por tags similares
      let { data, error } = await query.limit(limit);

      if (error) {
        console.error("Error fetching related jobs by category:", error);
        data = [];
      }

      // Se não encontrou vagas suficientes, buscar por tags
      if (!data || data.length < limit) {
        const remainingLimit = limit - (data?.length || 0);

        if (currentJob.tags && currentJob.tags.length > 0) {
          // Buscar vagas que tenham pelo menos uma tag em comum
          const tagConditions = currentJob.tags.map(
            (tag) => `tags.cs.{${tag}}`
          );

          const { data: tagData, error: tagError } = await supabase
            .from("jobs")
            .select("*")
            .eq("is_active", true)
            .neq("id", currentJob.id)
            .or(tagConditions.join(","))
            .limit(remainingLimit);

          if (!tagError && tagData) {
            // Combinar resultados únicos
            const existingIds = new Set(data?.map((job) => job.id) || []);
            const newJobs = tagData.filter((job) => !existingIds.has(job.id));
            data = [...(data || []), ...newJobs];
          }
        }
      }

      // Se ainda não encontrou vagas suficientes, buscar por localização
      if (!data || data.length < limit) {
        const remainingLimit = limit - (data?.length || 0);

        if (currentJob.location) {
          const { data: locationData, error: locationError } = await supabase
            .from("jobs")
            .select("*")
            .eq("is_active", true)
            .neq("id", currentJob.id)
            .ilike("location", `%${currentJob.location.split(",")[0].trim()}%`)
            .limit(remainingLimit);

          if (!locationError && locationData) {
            const existingIds = new Set(data?.map((job) => job.id) || []);
            const newJobs = locationData.filter(
              (job) => !existingIds.has(job.id)
            );
            data = [...(data || []), ...newJobs];
          }
        }
      }

      // Se ainda não encontrou vagas suficientes, buscar vagas recentes
      if (!data || data.length < limit) {
        const remainingLimit = limit - (data?.length || 0);

        const { data: recentData, error: recentError } = await supabase
          .from("jobs")
          .select("*")
          .eq("is_active", true)
          .neq("id", currentJob.id)
          .order("created_at", { ascending: false })
          .limit(remainingLimit);

        if (!recentError && recentData) {
          const existingIds = new Set(data?.map((job) => job.id) || []);
          const newJobs = recentData.filter((job) => !existingIds.has(job.id));
          data = [...(data || []), ...newJobs];
        }
      }

      // Mapear e retornar os resultados
      const relatedJobs = (data || []).map(mapSupabaseJobToJob);

      // Ordenar por relevância (categoria > tags > localização > data)
      return relatedJobs.slice(0, limit);
    } catch (error) {
      console.error("Error fetching related jobs:", error);
      return [];
    }
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

  // Função para limpar dados inconsistentes no banco
  async cleanInconsistentData(): Promise<boolean> {
    try {
      // Buscar todos os jobs com dados inconsistentes
      const { data: inconsistentJobs, error: fetchError } = await supabase
        .from("jobs")
        .select("id, experience")
        .or("experience.eq.executive,experience.eq.lead");

      if (fetchError) {
        console.error("Erro ao buscar dados inconsistentes:", fetchError);
        return false;
      }

      if (!inconsistentJobs || inconsistentJobs.length === 0) {
        return true;
      }

      // Atualizar cada job inconsistente
      for (const job of inconsistentJobs) {
        let newExperience = job.experience;

        if (job.experience === "executive" || job.experience === "lead") {
          newExperience = "senior";
        }

        const { error: updateError } = await supabase
          .from("jobs")
          .update({ experience: newExperience })
          .eq("id", job.id);

        if (updateError) {
          console.error(`Erro ao atualizar job ${job.id}:`, updateError);
        }
      }

      return true;
    } catch (error) {
      console.error("Erro na limpeza de dados:", error);
      return false;
    }
  },

  // Buscar vagas com filtros
  async searchJobs(filters: any): Promise<Job[]> {
    let query = supabase.from("jobs").select("*").eq("is_active", true);

    // Aplicar filtros
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,company.ilike.%${filters.query}%,location.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
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

    let results = data.map(mapSupabaseJobToJob);

    // Busca adicional por tags se houver query
    if (filters.query) {
      const tagResults = results.filter(
        (job) =>
          job.tags &&
          job.tags.some((tag) =>
            tag.toLowerCase().includes(filters.query.toLowerCase())
          )
      );

      // Combinar resultados únicos
      const allResults = [...results, ...tagResults];
      const uniqueResults = allResults.filter(
        (job, index, self) => index === self.findIndex((j) => j.id === job.id)
      );

      results = uniqueResults;
    }

    return results;
  },

  // Buscar vagas com filtros para admin (inclui inativas)
  async searchJobsAdmin(filters: any): Promise<Job[]> {
    let query = supabase.from("jobs").select("*");

    // Aplicar filtros
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,company.ilike.%${filters.query}%,location.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
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

    let results = data.map(mapSupabaseJobToJob);

    // Busca adicional por tags se houver query
    if (filters.query) {
      const tagResults = results.filter(
        (job) =>
          job.tags &&
          job.tags.some((tag) =>
            tag.toLowerCase().includes(filters.query.toLowerCase())
          )
      );

      // Combinar resultados únicos
      const allResults = [...results, ...tagResults];
      const uniqueResults = allResults.filter(
        (job, index, self) => index === self.findIndex((j) => j.id === job.id)
      );

      results = uniqueResults;
    }

    return results;
  },

  // Criar nova vaga
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Date | string;
    }
  ): Promise<Job | null> {
    // Gerar slug
    const slug = `${slugify(job.title)}-at-${slugify(job.company)}`;
    const supabaseJob = { ...mapJobToSupabaseJob(job), slug };

    const { data, error } = await supabase
      .from("jobs")
      .insert(supabaseJob)
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return null;
    }

    const createdJob = mapSupabaseJobToJob(data);

    // Check and notify alerts (in background) - DISABLED FOR MANUAL CONTROL
    // try {
    //   const { checkAndNotifyAlerts } = await import("@/lib/jobAlerts");
    //   await checkAndNotifyAlerts(createdJob);
    // } catch (alertError) {
    //   console.error("Error checking alerts:", alertError);
    //   // Don't fail job creation due to alert errors
    // }

    return createdJob;
  },

  // Atualizar vaga
  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
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

    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update(supabaseUpdates)
      .eq("id", id)
      .select();

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

      // Buscar registros de vagas importadas
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

      // Criar arrays de títulos e empresas para busca em lote
      const titles = importedJobs.map((job) => job.job_title);
      const companies = importedJobs.map((job) => job.company_name);

      // Buscar todas as vagas em uma única query usando OR
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .or(
          `title.in.(${titles.map((t) => `"${t}"`).join(",")}),company.in.(${companies.map((c) => `"${c}"`).join(",")})`
        );

      if (jobsError) {
        console.error("Erro ao buscar jobs:", jobsError);
        return [];
      }

      if (!jobsData) return [];

      // Mapear jobs para manter a ordem de importação
      const jobsMap = new Map();
      jobsData.forEach((job) => {
        const key = `${job.title}-${job.company}`;
        jobsMap.set(key, mapSupabaseJobToJob(job));
      });

      // Retornar jobs na ordem de importação
      const importedJobsData: Job[] = [];
      for (const importedJob of importedJobs) {
        const key = `${importedJob.job_title}-${importedJob.company_name}`;
        const job = jobsMap.get(key);
        if (job) {
          importedJobsData.push(job);
        }
      }

      return importedJobsData;
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
      const clicksByJob = clicksWithJobs.reduce(
        (acc, click) => {
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
        },
        {} as Record<string, any>
      );

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

  // Nova função para buscar vagas com invalid clicks
  async getJobsWithInvalidClicks(): Promise<
    {
      jobId: string;
      title: string;
      company: string;
      applicationUrl: string;
      invalidClicks: number;
      totalClicks: number;
      lastInvalidClick: string;
      invalidUrls: string[];
    }[]
  > {
    try {
      // Buscar todos os cliques inválidos
      const { data: invalidClicks, error: clicksError } = await supabase
        .from("job_clicks")
        .select("job_id, application_url, clicked_at")
        .eq("is_valid", false)
        .order("clicked_at", { ascending: false });

      if (clicksError) {
        console.error("Erro ao buscar cliques inválidos:", clicksError);
        return [];
      }

      if (!invalidClicks || invalidClicks.length === 0) {
        return [];
      }

      // Agrupar por job_id
      const jobClicksMap = new Map<
        string,
        {
          invalidClicks: number;
          lastClick: string;
          invalidUrls: Set<string>;
        }
      >();

      invalidClicks.forEach((click) => {
        const jobId = click.job_id;
        const current = jobClicksMap.get(jobId) || {
          invalidClicks: 0,
          lastClick: click.clicked_at,
          invalidUrls: new Set<string>(),
        };

        jobClicksMap.set(jobId, {
          invalidClicks: current.invalidClicks + 1,
          lastClick:
            new Date(click.clicked_at) > new Date(current.lastClick)
              ? click.clicked_at
              : current.lastClick,
          invalidUrls: current.invalidUrls.add(click.application_url),
        });
      });

      // Buscar jobs correspondentes
      const jobIds = Array.from(jobClicksMap.keys());
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, company, application_url")
        .in("id", jobIds);

      if (jobsError) {
        console.error("Erro ao buscar jobs:", jobsError);
        return [];
      }

      // Buscar total de cliques para cada job
      const { data: allClicks, error: allClicksError } = await supabase
        .from("job_clicks")
        .select("job_id")
        .in("job_id", jobIds);

      if (allClicksError) {
        console.error("Erro ao buscar total de cliques:", allClicksError);
        return [];
      }

      // Contar total de cliques por job
      const totalClicksMap = new Map<string, number>();
      allClicks.forEach((click) => {
        const jobId = click.job_id;
        totalClicksMap.set(jobId, (totalClicksMap.get(jobId) || 0) + 1);
      });

      // Combinar dados
      const result = jobs.map((job) => {
        const clickData = jobClicksMap.get(job.id);
        const totalClicks = totalClicksMap.get(job.id) || 0;

        return {
          jobId: job.id,
          title: job.title,
          company: job.company,
          applicationUrl: job.application_url,
          invalidClicks: clickData?.invalidClicks || 0,
          totalClicks,
          lastInvalidClick: clickData?.lastClick || "",
          invalidUrls: Array.from(clickData?.invalidUrls || []),
        };
      });

      // Ordenar por número de cliques inválidos (maior primeiro)
      return result.sort((a, b) => b.invalidClicks - a.invalidClicks);
    } catch (error) {
      console.error("Erro ao buscar vagas com cliques inválidos:", error);
      return [];
    }
  },
};
