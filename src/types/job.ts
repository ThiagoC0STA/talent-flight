import { BaseEntity } from "./common";

export interface Job extends BaseEntity {
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: JobCategory;
  experience?: ExperienceLevel;
  salary?: SalaryRange;
  description: string;
  requirements?: string[];
  benefits?: string[];
  isRemote?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  applicationUrl?: string;
  companyLogo?: string;
  company_logo?: string;
  tags?: string[];
  slug?: string;
}

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

export type JobCategory =
  | "engineering"
  | "design"
  | "marketing"
  | "sales"
  | "product"
  | "data"
  | "operations"
  | "finance"
  | "hr"
  | "development"
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "devops"
  | "ai"
  | "other";

export type ExperienceLevel =
  | "intern"
  | "junior"
  | "junior-mid"
  | "mid"
  | "mid-senior"
  | "senior"
  | "between";

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
  period?: "hourly" | "monthly" | "yearly";
}

export interface JobFilters {
  query?: string;
  location?: string;
  category?: JobCategory[];
  type?: JobType[];
  experience?: ExperienceLevel[];
  salary?: {
    min?: number;
    max?: number;
  };
  isRemote?: boolean;
  isFeatured?: boolean;
}

export interface JobSearchParams {
  page: number;
  limit: number;
  filters: JobFilters;
  sortBy?: "date" | "salary" | "relevance";
  sortOrder?: "asc" | "desc";
}
