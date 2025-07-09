import { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    tags: ["Frontend", "React", "TypeScript", "Remote"],
    description: `# Senior Frontend Developer

We're looking for a senior frontend developer to join our product team.

## Responsibilities:
- Develop modern and responsive user interfaces
- Work with React, TypeScript, and Next.js
- Collaborate with designers and other developers
- Participate in code reviews and mentor junior developers

## Requirements:
- 5+ years of experience with React
- Strong knowledge of TypeScript
- Experience with Next.js is a plus
- Good communication and teamwork skills

## Benefits:
- Remote work
- Health insurance
- Meal allowance
- Flexible hours`,
    applyUrl: "https://techcorp.com/careers/frontend-dev",
    createdAt: "2024-01-15",
    slug: "senior-frontend-developer-techcorp",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "New York, NY",
    tags: ["Design", "UX", "UI", "Figma"],
    description: `# UX/UI Designer

Join our design team to create amazing experiences.

## Responsibilities:
- Create wireframes and prototypes
- Develop user interfaces
- Conduct user research
- Collaborate with developers

## Requirements:
- 3+ years of experience in UX/UI
- Proficient in Figma
- Portfolio with relevant projects
- Knowledge of design systems`,
    applyUrl: "https://designstudio.com/careers/ux-designer",
    createdAt: "2024-01-14",
    slug: "ux-ui-designer-designstudio",
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "DataFlow",
    location: "Austin, TX",
    tags: ["Backend", "Python", "Django", "PostgreSQL"],
    description: `# Backend Engineer

Develop robust and scalable systems for our platform.

## Responsibilities:
- Develop RESTful APIs
- Optimize database performance
- Implement automated tests
- Maintain infrastructure

## Requirements:
- 4+ years with Python
- Experience with Django or Flask
- Knowledge of PostgreSQL
- Familiarity with Docker`,
    applyUrl: "https://dataflow.com/careers/backend-engineer",
    createdAt: "2024-01-13",
    slug: "backend-engineer-dataflow",
  },
  {
    id: "4",
    title: "Product Manager",
    company: "InnovateLab",
    location: "Seattle, WA",
    tags: ["Product", "Management", "Strategy"],
    description: `# Product Manager

Lead the development of innovative products.

## Responsibilities:
- Define product roadmap
- Analyze data and metrics
- Coordinate with cross-functional teams
- Prioritize features

## Requirements:
- 5+ years in product management
- Experience with agile methodologies
- Analytical skills
- Team leadership`,
    applyUrl: "https://innovatelab.com/careers/product-manager",
    createdAt: "2024-01-12",
    slug: "product-manager-innovatelab",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Denver, CO",
    tags: ["DevOps", "AWS", "Docker", "Kubernetes"],
    description: `# DevOps Engineer

Automate and optimize our cloud infrastructure.

## Responsibilities:
- Manage AWS infrastructure
- Implement CI/CD pipelines
- Monitor systems
- Optimize costs

## Requirements:
- 3+ years in DevOps
- Experience with AWS
- Knowledge of Docker/Kubernetes
- Familiarity with Terraform`,
    applyUrl: "https://cloudtech.com/careers/devops-engineer",
    createdAt: "2024-01-11",
    slug: "devops-engineer-cloudtech",
  },
  {
    id: "6",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Boston, MA",
    tags: ["Mobile", "React Native", "iOS", "Android"],
    description: `# Mobile Developer

Develop amazing mobile apps for millions of users.

## Responsibilities:
- Develop iOS and Android apps
- Optimize performance
- Implement native features
- Maintain clean code

## Requirements:
- 3+ years with React Native
- Experience with iOS/Android
- Knowledge of REST APIs
- Familiarity with testing`,
    applyUrl: "https://appworks.com/careers/mobile-developer",
    createdAt: "2024-01-10",
    slug: "mobile-developer-appworks",
  },
];

export const getAllJobs = (): Job[] => {
  return jobs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getJobBySlug = (slug: string): Job | undefined => {
  return jobs.find((job) => job.slug === slug);
};

export const getFeaturedJobs = (): Job[] => {
  return jobs.slice(0, 6);
};
