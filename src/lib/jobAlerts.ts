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
  last_email_sent?: string;
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

// Get all alerts (for admin)
export async function getAllAlerts() {
  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all alerts:", error);
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

// Configuração dinâmica de rate limit
const RATE_LIMIT_MINUTES = 60; // 1 email por 60 minutos
const RATE_LIMIT_PER_DAY = 3; // máximo 3 emails por dia (exemplo, pode ajustar)

// Cache simples de rate limit por request
const rateLimitCache = new Map<string, boolean>();

// Função otimizada de rate limit
async function checkRateLimit(
  userEmail: string,
  alertId: string
): Promise<boolean> {
  const now = new Date();
  const windowAgo = new Date(now.getTime() - RATE_LIMIT_MINUTES * 60 * 1000);
  const cacheKey = `${userEmail}_${alertId}`;

  if (rateLimitCache.has(cacheKey)) {
    return rateLimitCache.get(cacheKey)!;
  }

  // Busca pelo campo last_email_sent
  const { data: alert, error: alertError } = await supabase
    .from("job_alerts")
    .select("id, last_email_sent")
    .eq("id", alertId)
    .single();

  if (alertError || !alert) {
    console.error("❌ Error getting alert for rate limit check:", alertError);
    rateLimitCache.set(cacheKey, false);
    return false; // Permitir envio em caso de erro
  }

  // Checa se já enviou email na janela de tempo
  if (alert.last_email_sent) {
    const lastEmailTime = new Date(alert.last_email_sent);
    if (lastEmailTime > windowAgo) {
      rateLimitCache.set(cacheKey, true);
      return true; // Rate limit hit
    }
  }

  // Checa se já enviou muitos emails hoje
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const { data: todayNotifications, error: notifError } = await supabase
    .from("alert_notifications")
    .select("id")
    .eq("alert_id", alertId)
    .gte("sent_at", startOfDay.toISOString());
  if (
    !notifError &&
    todayNotifications &&
    todayNotifications.length >= RATE_LIMIT_PER_DAY
  ) {
    rateLimitCache.set(cacheKey, true);
    return true;
  }

  // Fallback: checa notificações recentes
  const { data: recentNotifications, error: notificationError } = await supabase
    .from("alert_notifications")
    .select("sent_at")
    .eq("alert_id", alertId)
    .gte("sent_at", windowAgo.toISOString())
    .limit(1);
  if (
    !notificationError &&
    recentNotifications &&
    recentNotifications.length > 0
  ) {
    rateLimitCache.set(cacheKey, true);
    return true;
  }

  rateLimitCache.set(cacheKey, false);
  return false;
}

// Send alert notification
export async function sendJobAlertNotification(alert: JobAlert, job: any) {
  try {
    const hasRecentEmail = await checkRateLimit(alert.user_email, alert.id!);
    if (hasRecentEmail) {
      return false;
    }

    // Register notification
    const { error } = await supabase.from("alert_notifications").insert({
      alert_id: alert.id!,
      job_id: job.id,
      sent_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error registering notification:", error);
      return false;
    }

    // Update last_email_sent in the alert
    const currentTime = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("job_alerts")
      .update({ last_email_sent: currentTime })
      .eq("id", alert.id);

    if (updateError) {
      console.error("❌ Error updating last_email_sent:", updateError);
      // Don't fail the email send, just log the error
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

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      console.log("[EMAIL] Response não é JSON" + e);
    }

    if (!response.ok) {
      console.error(
        "[EMAIL] Failed to send email notification",
        response.status,
        responseBody
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

// Batch processing otimizado
export async function checkAndNotifyAlerts(newJob: any) {
  try {
    console.log(
      `\n🔔 Checking alerts for job: ${newJob.title} at ${newJob.company}`
    );
    const alerts = await getActiveAlerts();
    console.log(`📊 Found ${alerts.length} active alerts`);

    // Filtra os alerts compatíveis
    const compatibleAlerts = alerts.filter((alert) =>
      isJobCompatibleWithAlert(newJob, alert)
    );
    console.log(
      `🔎 ${compatibleAlerts.length} alerts are compatible with this job`
    );

    // Checa rate limit em batch
    const rateLimitResults = await Promise.all(
      compatibleAlerts.map(async (alert) => ({
        alert,
        isLimited: await checkRateLimit(alert.user_email, alert.id!),
      }))
    );

    // Separa os que podem receber email
    const alertsToSend = rateLimitResults
      .filter((r) => !r.isLimited)
      .map((r) => r.alert);
    const alertsSkipped = rateLimitResults
      .filter((r) => r.isLimited)
      .map((r) => r.alert);

    // Envia emails em paralelo
    const sendResults = await Promise.all(
      alertsToSend.map((alert) => sendJobAlertNotification(alert, newJob))
    );

    console.log(
      `📧 Summary: ${sendResults.filter(Boolean).length} emails sent, ${alertsSkipped.length} skipped (rate limited)`
    );
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

// Get rate limiting statistics
export async function getRateLimitStats() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Alerts that would be rate limited
  const { data: rateLimitedAlerts, error: rateLimitError } = await supabase
    .from("job_alerts")
    .select("id, user_email, last_email_sent")
    .eq("is_active", true)
    .not("last_email_sent", "is", null)
    .gte("last_email_sent", oneHourAgo.toISOString());

  // Total active alerts
  const { data: totalActiveAlerts, error: totalError } = await supabase
    .from("job_alerts")
    .select("id", { count: "exact" })
    .eq("is_active", true);

  // Emails sent in last 24 hours
  const { data: emailsLast24h, error: emailsError } = await supabase
    .from("alert_notifications")
    .select("id", { count: "exact" })
    .gte("sent_at", oneDayAgo.toISOString());

  if (rateLimitError || totalError || emailsError) {
    console.error("Error getting rate limit stats:", {
      rateLimitError,
      totalError,
      emailsError,
    });
    return null;
  }

  return {
    rateLimitedAlerts: rateLimitedAlerts?.length || 0,
    totalActiveAlerts: totalActiveAlerts?.length || 0,
    emailsLast24h: emailsLast24h?.length || 0,
    rateLimitPercentage: totalActiveAlerts?.length
      ? (
          ((rateLimitedAlerts?.length || 0) / totalActiveAlerts.length) *
          100
        ).toFixed(1)
      : "0",
  };
}

// Métricas avançadas para admin
export async function getAdvancedRateLimitStats() {
  const now = new Date();
  const windowAgo = new Date(now.getTime() - RATE_LIMIT_MINUTES * 60 * 1000);
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  // Quantos alerts estão rate limited agora
  const { data: rateLimitedAlerts } = await supabase
    .from("job_alerts")
    .select("id, last_email_sent")
    .eq("is_active", true)
    .not("last_email_sent", "is", null)
    .gte("last_email_sent", windowAgo.toISOString());

  // Quantos alerts atingiram o limite diário
  const { data: dailyLimitedAlerts } = await supabase
    .from("alert_notifications")
    .select("alert_id")
    .gte("sent_at", startOfDay.toISOString());

  // Total de alerts ativos
  const { data: totalActiveAlerts } = await supabase
    .from("job_alerts")
    .select("id")
    .eq("is_active", true);

  return {
    rateLimitedNow: rateLimitedAlerts?.length || 0,
    dailyLimited: dailyLimitedAlerts?.length || 0,
    totalActive: totalActiveAlerts?.length || 0,
    rateLimitWindowMinutes: RATE_LIMIT_MINUTES,
    rateLimitPerDay: RATE_LIMIT_PER_DAY,
  };
}
