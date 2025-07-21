import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/lib/jobs";
import JobPagePreview from "@/components/JobPagePreview";
import JobStructuredData from "@/components/JobStructuredData";

// Função para limpar HTML e criar description perfeita
function createJobDescription(job: any): string {
  // Remover HTML tags e entidades
  let cleanDescription = job.description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&') // Decodifica entidades HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();

  // Criar description otimizada
  const baseDescription = `${job.title} position at ${job.company} in ${job.location}`;
  
  // Adicionar informações relevantes
  let additionalInfo = '';
  if (job.type) additionalInfo += ` ${job.type} position`;
  if (job.experience) additionalInfo += ` for ${job.experience} level`;
  if (job.isRemote) additionalInfo += ' with remote work options';
  
  // Pegar primeiros 100 caracteres da descrição limpa
  const descriptionSnippet = cleanDescription.substring(0, 100).replace(/\s+\w*$/, '');
  
  const fullDescription = `${baseDescription}.${additionalInfo} ${descriptionSnippet}...`;
  
  // Garantir que não passe de 160 caracteres
  return fullDescription.length > 160 
    ? fullDescription.substring(0, 157) + '...'
    : fullDescription;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const job = await jobsService.getJobById(slug);

  if (!job) {
    return {
      title: "Job Not Found - TalentFlight",
      description: "The requested job opportunity could not be found.",
    };
  }

  const title = `${job.title} at ${job.company} - ${job.location} | TalentFlight`;
  const description = createJobDescription(job);

  return {
    title,
    description,
    keywords: `${job.title}, ${job.company}, ${job.location}, ${job.type}, ${job.category}, ${job.experience}, jobs, careers, employment`,
    openGraph: {
      title,
      description,
      url: `https://talentflight.com/job/${slug}`,
      siteName: "TalentFlight",
      images: [
            {
          url: job.companyLogo || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`,
            },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [job.companyLogo || "/og-image.jpg"],
    },
    alternates: {
      canonical: `https://talentflight.com/job/${slug}`,
    },
  };
}

export default async function JobPage({ params }: any) {
  const { slug } = await params;
  const job = await jobsService.getJobById(slug);

  if (!job) {
    notFound();
  }

  // Buscar trabalhos relacionados
  const relatedJobs = await jobsService.getRelatedJobs(job, 12);

  return (
    <>
      <JobStructuredData job={job} />
      <JobPagePreview job={job} relatedJobs={relatedJobs} />
    </>
  );
}
