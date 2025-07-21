import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface JobAlert {
  id?: string;
  user_email: string;
  keywords: string[];
  technologies?: string[];
  locations?: string[];
  salary_range?: { min?: number; max?: number };
  experience_level?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface AlertNotification {
  id?: string;
  alert_id: string;
  job_id: string;
  sent_at?: string;
}

// Create new alert
export async function createJobAlert(alert: JobAlert) {
  const { data, error } = await supabase
    .from("job_alerts")
    .insert(alert)
    .select()
    .single();

  if (error) {
    console.error("Error creating alert:", error);
    throw error;
  }

  return data;
}

// Get active alerts
export async function getActiveAlerts() {
  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }

  return data || [];
}

// Check if job is compatible with alert
export function isJobCompatibleWithAlert(job: any, alert: JobAlert): boolean {
  // Check keywords - improved matching
  const jobText = `${job.title} ${job.description} ${job.company} ${(
    job.tags || []
  ).join(" ")}`.toLowerCase();

  const hasKeywordMatch = alert.keywords.some((keyword) => {
    const keywordLower = keyword.toLowerCase();
    const isMatch = jobText.includes(keywordLower);
    return isMatch;
  });

  if (!hasKeywordMatch) {
    return false;
  }

  // Check technologies (if specified)
  if (alert.technologies && alert.technologies.length > 0) {
    const jobTechnologies = job.technologies || [];
    const hasTechMatch = alert.technologies.some((tech) =>
      jobTechnologies.includes(tech)
    );
    if (!hasTechMatch) {
      return false;
    }
  }

  // Check location (if specified)
  if (alert.locations && alert.locations.length > 0) {
    const jobLocation = job.location?.toLowerCase() || "";
    const hasLocationMatch = alert.locations.some((location) =>
      jobLocation.includes(location.toLowerCase())
    );
    if (!hasLocationMatch) {
      return false;
    }
  }

  return true;
}

// Send alert notification
export async function sendJobAlertNotification(alert: JobAlert, job: any) {
  try {
    // Register notification
    const { error } = await supabase.from("alert_notifications").insert({
      alert_id: alert.id!,
      job_id: job.id,
    });

    if (error) {
      console.error("Error registering notification:", error);
      return false;
    }

    // Send email notification
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Job Alert - TalentFlight</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #011640 0%, #0476D9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .job-title { font-size: 24px; font-weight: bold; color: #011640; margin-bottom: 10px; }
          .company { font-size: 18px; color: #0476D9; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .cta-button { display: inline-block; background: #0476D9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .keywords { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .keyword-tag { display: inline-block; background: #0476D9; color: white; padding: 5px 10px; border-radius: 15px; margin: 2px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Job Alert</h1>
            <p>We found a job that matches your preferences!</p>
          </div>
          
          <div class="content">
            <div class="job-title">${job.title}</div>
            <div class="company">${job.company}</div>
            
            <div class="keywords">
              <strong>Matched Keywords:</strong><br>
              ${alert.keywords.map((keyword) => `<span class="keyword-tag">${keyword}</span>`).join(" ")}
            </div>
            
            <div class="details">
              <div class="detail-item">
                <span class="label">📍 Location:</span>
                <span class="value">${job.location || "Not specified"}</span>
              </div>
              <div class="detail-item">
                <span class="label">💼 Type:</span>
                <span class="value">${job.type || "Not specified"}</span>
              </div>
              <div class="detail-item">
                <span class="label">🎯 Experience:</span>
                <span class="value">${job.experience || "Not specified"}</span>
              </div>
              ${job.isRemote ? '<div class="detail-item"><span class="label">🏠 Remote:</span><span class="value">Yes</span></div>' : ""}
            </div>
            
            <p style="margin: 20px 0; line-height: 1.8;">
              ${job.description ? job.description.substring(0, 300) + "..." : "No description available"}
            </p>
            
            <div style="text-align: center;">
              <a href="${job.applicationUrl}" class="cta-button" target="_blank">
                🚀 Apply Now
              </a>
            </div>
            
            <div class="footer">
              <p>This alert was triggered because the job matches your keywords: ${alert.keywords.join(", ")}</p>
              <p>You can manage your alerts at <a href="https://talentflight.com/alerts">talentflight.com/alerts</a></p>
              <p>© 2024 TalentFlight. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: alert.user_email,
        subject: `🎯 New Job Alert: ${job.title} at ${job.company}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email notification");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

// Check and notify alerts for a new job
export async function checkAndNotifyAlerts(newJob: any) {
  try {
    const alerts = await getActiveAlerts();

    for (const alert of alerts) {
      if (isJobCompatibleWithAlert(newJob, alert)) {
        await sendJobAlertNotification(alert, newJob);
      }
    }
  } catch (error) {
    console.error("Error checking alerts:", error);
  }
}

// Deactivate alert
export async function deactivateAlert(alertId: string) {
  const { error } = await supabase
    .from("job_alerts")
    .update({ is_active: false })
    .eq("id", alertId);

  if (error) {
    console.error("Error deactivating alert:", error);
    throw error;
  }

  return true;
}

// Get alert statistics
export async function getAlertStats() {
  const { data: totalAlerts } = await supabase
    .from("job_alerts")
    .select("id", { count: "exact" });

  const { data: activeAlerts } = await supabase
    .from("job_alerts")
    .select("id", { count: "exact" })
    .eq("is_active", true);

  const { data: totalNotifications } = await supabase
    .from("alert_notifications")
    .select("id", { count: "exact" });

  return {
    totalAlerts: totalAlerts?.length || 0,
    activeAlerts: activeAlerts?.length || 0,
    totalNotifications: totalNotifications?.length || 0,
  };
}
