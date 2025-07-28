import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      company,
      description,
      applicationUrl,
      location,
      isRemote,
      technologies,
      salary,
    } = body;

    // Validate required fields
    if (!title || !company || !description || !applicationUrl) {
      return NextResponse.json(
        {
          error: "Required fields: title, company, description, applicationUrl",
        },
        { status: 400 }
      );
    }

    // Insert job
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        title,
        company,
        description,
        application_url: applicationUrl,
        location: location || "Remote",
        is_remote: isRemote || false,
        technologies: technologies || [],
        salary: salary || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting job:", error);
      return NextResponse.json(
        { error: "Error creating job" },
        { status: 500 }
      );
    }

    // Check and notify alerts (in background) - DISABLED FOR MANUAL CONTROL
    // try {
    //   await checkAndNotifyAlerts(job);
    // } catch (alertError) {
    //   console.error("Error checking alerts:", alertError);
    //   // Don't fail job creation due to alert errors
    // }

    return NextResponse.json({
      success: true,
      job,
      message: "Job created successfully!",
    });
  } catch (error) {
    console.error("Error in jobs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const company = searchParams.get("company") || "";
    const location = searchParams.get("location") || "";
    const isRemote = searchParams.get("remote") || "";
    const technologies = searchParams.get("technologies") || "";
    const experience = searchParams.get("experience") || "";
    const type = searchParams.get("type") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") || "";

    // Build base query for counting total
    let countQuery = supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Build query for fetching jobs
    let jobsQuery = supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply filters to both queries
    if (search) {
      const searchFilter = `title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`;
      countQuery = countQuery.or(searchFilter);
      jobsQuery = jobsQuery.or(searchFilter);
    }

    if (company) {
      countQuery = countQuery.eq("company", company);
      jobsQuery = jobsQuery.eq("company", company);
    }

    if (location) {
      countQuery = countQuery.eq("location", location);
      jobsQuery = jobsQuery.eq("location", location);
    }

    if (isRemote === "true") {
      countQuery = countQuery.eq("is_remote", true);
      jobsQuery = jobsQuery.eq("is_remote", true);
    }

    if (technologies) {
      const techArray = technologies.split(",").map((t) => t.trim());
      countQuery = countQuery.overlaps("technologies", techArray);
      jobsQuery = jobsQuery.overlaps("technologies", techArray);
    }

    // Apply additional filters if they exist in the database
    if (experience) {
      // Assuming experience is stored as a field in the jobs table
      countQuery = countQuery.eq("experience", experience);
      jobsQuery = jobsQuery.eq("experience", experience);
    }

    if (type) {
      // Assuming type is stored as a field in the jobs table
      countQuery = countQuery.eq("type", type);
      jobsQuery = jobsQuery.eq("type", type);
    }

    if (category) {
      // Assuming category is stored as a field in the jobs table
      countQuery = countQuery.eq("category", category);
      jobsQuery = jobsQuery.eq("category", category);
    }

    if (featured === "true") {
      // Assuming featured is stored as a field in the jobs table
      countQuery = countQuery.eq("is_featured", true);
      jobsQuery = jobsQuery.eq("is_featured", true);
    }

    // Get total count first
    const { count: total, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting jobs:", countError);
      return NextResponse.json(
        { error: "Error counting jobs" },
        { status: 500 }
      );
    }

    // Apply pagination to jobs query
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    jobsQuery = jobsQuery.range(from, to);

    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      return NextResponse.json(
        { error: "Error fetching jobs" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((total || 0) / limit);

    return NextResponse.json({
      jobs: jobs || [],
      total: total || 0,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error in jobs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
