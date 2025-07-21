import { Suspense } from "react";

import { jobsService } from "@/lib/jobs";
import JobsPageClient from "./JobsPageClient";

// Função para carregar dados no servidor
async function getInitialData() {
  try {
    // Carregar jobs iniciais
    const jobs = await jobsService.getAllJobs();
    const activeJobs = jobs.filter((job) => job.isActive).slice(0, 12); // Primeiros 12 jobs

    // Carregar stats
    const stats = {
      totalJobs: jobs.filter((job) => job.isActive).length,
      totalCompanies: new Set(jobs.map((job) => job.company)).size,
      remoteJobs: jobs.filter((job) => job.isActive && job.isRemote).length,
    };

    return {
      initialJobs: activeJobs,
      stats,
      totalJobs: jobs.filter((job) => job.isActive).length,
    };
      } catch (error) {
    console.error("Erro ao carregar dados iniciais:", error);
    return {
      initialJobs: [],
      stats: { totalJobs: 0, totalCompanies: 0, remoteJobs: 0 },
      totalJobs: 0,
    };
  }
}

export default async function JobsPage() {
  const { initialJobs, stats, totalJobs } = await getInitialData();

  return (
    <Suspense fallback={<div></div>}>
      <JobsPageClient
        initialJobs={initialJobs}
        initialStats={stats}
        totalJobs={totalJobs}
      />
    </Suspense>
  );
}
