export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  description: string;
  applyUrl: string;
  createdAt: string;
  slug: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  tags?: string[];
}
