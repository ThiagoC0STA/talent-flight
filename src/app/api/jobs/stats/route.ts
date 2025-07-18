import { jobsService } from "@/lib/jobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Buscar apenas as estatísticas necessárias
    const stats = await jobsService.getJobsStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro na API de stats de jobs:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
