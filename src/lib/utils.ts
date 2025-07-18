import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(salary?: {
  min?: number;
  max?: number;
  currency?: string;
  period?: string;
}): string {
  if (!salary || salary.min == null || salary.max == null) {
    return "Negotiable";
  }
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };
  const period =
    salary.period === "yearly"
      ? "year"
      : salary.period === "monthly"
      ? "month"
      : salary.period === "hourly"
      ? "hour"
      : "";
  if (salary.min === salary.max) {
    return `${formatNumber(salary.min)}${period ? "/" + period : ""}`;
  }
  return `${formatNumber(salary.min)} - ${formatNumber(salary.max)}${
    period ? "/" + period : ""
  }`;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateJobSlug(jobTitle: string, companyName: string) {
  const titleSlug = generateSlug(jobTitle);
  const companySlug = generateSlug(companyName);
  return `${titleSlug}-at-${companySlug}`;
}

export function htmlToText(html: string): string {
  if (typeof window === "undefined") {
    // SSR: regex simples
    return html.replace(/<[^>]+>/g, "");
  } else {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
}

// Funções de otimização de performance
export const performanceUtils = {
  // Debounce para evitar chamadas excessivas
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle para limitar frequência de chamadas
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};
