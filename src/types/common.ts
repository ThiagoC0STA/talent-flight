export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchHistory {
  id: string;
  query: string;
  sources: string[];
  resultsCount: number;
  results?: any[];
  createdAt: Date;
  userId: string;
  imported?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  category?: string;
  type?: string;
  experience?: string;
  salary?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "password" | "search" | "number";
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
