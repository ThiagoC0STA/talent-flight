import { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "full-time",
    category: "engineering",
    experience: "senior",
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "We are looking for a Senior Frontend Engineer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern web technologies.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of CSS-in-JS and responsive design",
      "Experience with testing frameworks (Jest, React Testing Library)",
    ],
    benefits: [
      "Competitive salary and equity",
      "Flexible work hours and remote options",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Professional development budget",
    ],
    isRemote: true,
    isFeatured: true,
    isActive: true,
    applicationUrl: "https://techcorp.com/careers/frontend-engineer",
    companyLogo: "/logos/techcorp.png",
    tags: ["React", "TypeScript", "Frontend", "Remote"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "full-time",
    category: "design",
    experience: "mid",
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Join our design team to create beautiful and functional user experiences. You will work closely with product managers and engineers to design intuitive interfaces.",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma and design tools",
      "Strong portfolio showcasing UX/UI work",
      "Experience with design systems",
      "Knowledge of user research methods",
    ],
    benefits: [
      "Creative and collaborative environment",
      "Latest design tools and resources",
      "Conference and workshop opportunities",
      "Flexible PTO policy",
      "Team events and activities",
    ],
    isRemote: false,
    isFeatured: true,
    isActive: true,
    applicationUrl: "https://designstudio.com/careers/product-designer",
    companyLogo: "/logos/designstudio.png",
    tags: ["UI/UX", "Figma", "Product Design", "Design Systems"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "DataFlow",
    location: "Austin, TX",
    type: "full-time",
    category: "data",
    experience: "senior",
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Help us build the future of data analytics. You will develop machine learning models and data pipelines to drive business insights.",
    requirements: [
      "5+ years of experience in data science",
      "Strong Python programming skills",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Knowledge of SQL and data warehousing",
      "Experience with cloud platforms (AWS, GCP)",
    ],
    benefits: [
      "Cutting-edge technology stack",
      "Research and publication opportunities",
      "Competitive benefits package",
      "Professional development support",
      "Flexible work arrangements",
    ],
    isRemote: true,
    isFeatured: false,
    isActive: true,
    applicationUrl: "https://dataflow.com/careers/data-scientist",
    companyLogo: "/logos/dataflow.png",
    tags: ["Python", "Machine Learning", "Data Science", "Remote"],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Los Angeles, CA",
    type: "full-time",
    category: "marketing",
    experience: "mid",
    salary: {
      min: 70000,
      max: 100000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Drive our marketing strategy and campaigns. You will be responsible for brand awareness, lead generation, and customer acquisition.",
    requirements: [
      "3+ years of marketing experience",
      "Experience with digital marketing channels",
      "Knowledge of marketing analytics tools",
      "Strong communication skills",
      "Experience with CRM systems",
    ],
    benefits: [
      "Dynamic and fast-paced environment",
      "Opportunity for career growth",
      "Performance-based bonuses",
      "Health and wellness benefits",
      "Team building activities",
    ],
    isRemote: false,
    isFeatured: false,
    isActive: true,
    applicationUrl: "https://growthco.com/careers/marketing-manager",
    companyLogo: "/logos/growthco.png",
    tags: ["Digital Marketing", "Growth", "Analytics", "Brand"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "full-time",
    category: "engineering",
    experience: "senior",
    salary: {
      min: 110000,
      max: 160000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Build and maintain our cloud infrastructure. You will work on CI/CD pipelines, monitoring, and automation.",
    requirements: [
      "5+ years of DevOps experience",
      "Strong knowledge of AWS/Azure/GCP",
      "Experience with Docker and Kubernetes",
      "Knowledge of infrastructure as code",
      "Experience with monitoring tools",
    ],
    benefits: [
      "Competitive salary and benefits",
      "Remote work options",
      "Latest tools and technologies",
      "Professional certification support",
      "Flexible work hours",
    ],
    isRemote: true,
    isFeatured: true,
    isActive: true,
    applicationUrl: "https://cloudtech.com/careers/devops-engineer",
    companyLogo: "/logos/cloudtech.png",
    tags: ["DevOps", "AWS", "Kubernetes", "Remote"],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    title: "Sales Representative",
    company: "SalesPro",
    location: "Chicago, IL",
    type: "full-time",
    category: "sales",
    experience: "entry",
    salary: {
      min: 45000,
      max: 65000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Join our sales team and help grow our customer base. You will be responsible for prospecting, qualifying leads, and closing deals.",
    requirements: [
      "1+ years of sales experience",
      "Strong communication skills",
      "Goal-oriented mindset",
      "Experience with CRM systems",
      "Ability to work in a team environment",
    ],
    benefits: [
      "Competitive commission structure",
      "Sales training and development",
      "Health and dental insurance",
      "401(k) matching",
      "Performance bonuses",
    ],
    isRemote: false,
    isFeatured: false,
    isActive: true,
    applicationUrl: "https://salespro.com/careers/sales-representative",
    companyLogo: "/logos/salespro.png",
    tags: ["Sales", "B2B", "CRM", "Commission"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
];

export function getFeaturedJobs(): Job[] {
  return jobs.filter((job) => job.isFeatured);
}

export function getAllJobs(): Job[] {
  return jobs.filter((job) => job.isActive);
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

export function searchJobs(query: string): Job[] {
  const lowercaseQuery = query.toLowerCase();
  return jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(lowercaseQuery) ||
      job.company.toLowerCase().includes(lowercaseQuery) ||
      job.location.toLowerCase().includes(lowercaseQuery) ||
      job.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
