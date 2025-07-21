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
  // Check keywords
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  const hasKeywordMatch = alert.keywords.some((keyword) =>
    jobText.includes(keyword.toLowerCase())
  );

  if (!hasKeywordMatch) return false;

  // Check technologies (if specified)
  if (alert.technologies && alert.technologies.length > 0) {
    const jobTechnologies = job.technologies || [];
    const hasTechMatch = alert.technologies.some((tech) =>
      jobTechnologies.includes(tech)
    );
    if (!hasTechMatch) return false;
  }

  // Check location (if specified)
  if (alert.locations && alert.locations.length > 0) {
    const jobLocation = job.location?.toLowerCase() || "";
    const hasLocationMatch = alert.locations.some((location) =>
      jobLocation.includes(location.toLowerCase())
    );
    if (!hasLocationMatch) return false;
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
      return;
    }

    // Here you can integrate with email service (Resend, SendGrid, etc.)
    console.log(
      `Notification sent to ${alert.user_email} about job: ${job.title}`
    );

    // For now, just log. Later we can integrate with real email
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
