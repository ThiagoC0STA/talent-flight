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

    let query = supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`
      );
    }

    if (company) {
      query = query.eq("company", company);
    }

    if (location) {
      query = query.eq("location", location);
    }

    if (isRemote === "true") {
      query = query.eq("is_remote", true);
    }

    if (technologies) {
      const techArray = technologies.split(",").map((t) => t.trim());
      query = query.overlaps("technologies", techArray);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
      return NextResponse.json(
        { error: "Error fetching jobs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      jobs: jobs || [],
      total: 12, // Fixed value for now
      page,
      limit,
      totalPages: Math.ceil(12 / limit),
    });
  } catch (error) {
    console.error("Error in jobs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
