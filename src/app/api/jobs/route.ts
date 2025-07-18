import { jobsService } from "@/lib/jobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de paginação
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy =
      (searchParams.get("sortBy") as "date" | "salary" | "relevance") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    // Extrair filtros da query string
    const filters: any = {};

    if (searchParams.get("query")) {
      filters.query = searchParams.get("query");
    }

    if (searchParams.get("location")) {
      filters.location = searchParams.get("location");
    }

    // Corrigir parsing de arrays
    if (searchParams.get("experience")) {
      const experience = searchParams.get("experience");
      filters.experience = Array.isArray(experience)
        ? experience
        : [experience];
    }

    if (searchParams.get("type")) {
      const type = searchParams.get("type");
      filters.type = Array.isArray(type) ? type : [type];
    }

    if (searchParams.get("category")) {
      const category = searchParams.get("category");
      filters.category = Array.isArray(category) ? category : [category];
    }

    if (searchParams.get("isRemote")) {
      filters.isRemote = searchParams.get("isRemote") === "true";
    }

    if (searchParams.get("isFeatured")) {
      filters.isFeatured = searchParams.get("isFeatured") === "true";
    }

    console.log("API Jobs - Filtros recebidos:", filters);
    console.log("API Jobs - Paginação:", { page, limit, sortBy, sortOrder });

    // Buscar jobs com paginação e filtros
    const result = await jobsService.getJobsWithPagination({
      page,
      limit,
      filters,
      sortBy,
      sortOrder,
    });

    console.log("API Jobs - Resultados:", {
      jobs: result.jobs.length,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasMore: result.hasMore,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API de jobs:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
