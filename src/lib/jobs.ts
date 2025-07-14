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
  job: Omit<Job, "id" | "createdAt" | "updatedAt">
) => ({
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
});

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
    // Primeiro tenta buscar pelo ID direto (para compatibilidade)
    let { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", idOrSlug)
      .eq("is_active", true)
      .single();

    // Se não encontrou, tenta buscar por slug
    if (error && !data) {
      // Busca por título e empresa baseado no slug
      const slugParts = idOrSlug.split("-at-");
      if (slugParts.length === 2) {
        const titleSlug = slugParts[0];
        const companySlug = slugParts[1];

        // Busca por jobs que correspondem ao slug
        const result = await supabase
          .from("jobs")
          .select("*")
          .eq("is_active", true)
          .ilike("title", `%${titleSlug.replace(/-/g, " ")}%`)
          .ilike("company", `%${companySlug.replace(/-/g, " ")}%`)
          .limit(1)
          .single();

        data = result.data;
        error = result.error;
      }
    }

    if (error) {
      console.error("Error fetching job:", error);
      return null;
    }

    return mapSupabaseJobToJob(data);
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

  // Criar nova vaga
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<Job | null> {
    const supabaseJob = mapJobToSupabaseJob(job);

    const { data, error } = await supabase
      .from("jobs")
      .insert(supabaseJob)
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return null;
    }

    return mapSupabaseJobToJob(data);
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

    const { data, error } = await supabase
      .from("jobs")
      .update(supabaseUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job:", error);
      return null;
    }

    return mapSupabaseJobToJob(data);
  },

  // Deletar vaga (soft delete)
  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("jobs")
      .update({ is_active: false })
      .eq("id", id);

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

  async getClickStats(jobId?: string) {
    try {
      let query = supabase
        .from("job_clicks")
        .select(
          `
          *,
          jobs (
            title,
            company
          )
        `
        )
        .order("clicked_at", { ascending: false });

      if (jobId) {
        query = query.eq("job_id", jobId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return [];
    }
  },

  async getClickSummary() {
    try {
      const { data, error } = await supabase.from("job_clicks").select(`
          job_id,
          jobs (
            title,
            company
          ),
          is_valid,
          clicked_at
        `);

      if (error) {
        console.error("Erro ao buscar resumo:", error);
        return {
          totalClicks: 0,
          validClicks: 0,
          invalidClicks: 0,
          clicksByJob: [],
        };
      }

      const clicks = data || [];
      const totalClicks = clicks.length;
      const validClicks = clicks.filter((click) => click.is_valid).length;
      const invalidClicks = totalClicks - validClicks;

      // Agrupar por vaga
      const clicksByJob = clicks.reduce((acc, click) => {
        const jobTitle = click.jobs?.[0]?.title || "Unknown";
        const jobCompany = click.jobs?.[0]?.company || "Unknown";
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
