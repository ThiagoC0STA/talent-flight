import { Job } from "@/types/job";

interface PostHistory {
  jobId: string;
  platform: "linkedin" | "twitter" | "reddit";
  subreddit?: string;
  title: string;
  postedAt: Date;
}

// Simular localStorage para persistência
const STORAGE_KEY = "talentflight_post_history";

export class PostHistoryManager {
  private history: PostHistory[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.history = JSON.parse(stored).map((item: any) => ({
            ...item,
            postedAt: new Date(item.postedAt),
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar histórico de posts:", error);
        this.history = [];
      }
    }
  }

  private saveHistory() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
      } catch (error) {
        console.error("Erro ao salvar histórico de posts:", error);
      }
    }
  }

  // Gerar hash único para o post
  private generatePostHash(
    job: Job,
    platform: string,
    subreddit?: string
  ): string {
    const content = `${job.title}-${job.company}-${platform}-${subreddit || ""}`;
    return btoa(content).replace(/[^a-zA-Z0-9]/g, "");
  }

  // Verificar se já foi postado recentemente
  public hasRecentPost(
    job: Job,
    platform: string,
    subreddit?: string,
    daysLimit: number = 7
  ): boolean {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);

    return this.history.some(
      (post) =>
        post.jobId === job.id &&
        post.platform === platform &&
        (subreddit ? post.subreddit === subreddit : true) &&
        post.postedAt > cutoffDate
    );
  }

  // Verificar cooldown por subreddit (72h)
  public hasSubredditCooldown(subreddit: string): boolean {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 72);

    return this.history.some(
      (post) =>
        post.platform === "reddit" &&
        post.subreddit === subreddit &&
        post.postedAt > cutoffDate
    );
  }

  // Registrar novo post
  public registerPost(job: Job, platform: string, subreddit?: string) {
    const newPost: PostHistory = {
      jobId: job.id,
      platform: platform as "linkedin" | "twitter" | "reddit",
      subreddit,
      title: job.title,
      postedAt: new Date(),
    };

    this.history.push(newPost);
    this.saveHistory();
  }

  // Limpar histórico antigo (mais de 30 dias)
  public cleanupOldHistory() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    this.history = this.history.filter((post) => post.postedAt > cutoffDate);
    this.saveHistory();
  }

  // Obter estatísticas
  public getStats() {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: this.history.length,
      last7Days: this.history.filter((post) => post.postedAt > last7Days)
        .length,
      last30Days: this.history.filter((post) => post.postedAt > last30Days)
        .length,
      byPlatform: {
        linkedin: this.history.filter((post) => post.platform === "linkedin")
          .length,
        twitter: this.history.filter((post) => post.platform === "twitter")
          .length,
        reddit: this.history.filter((post) => post.platform === "reddit")
          .length,
      },
    };
  }
}

// Instância global
export const postHistoryManager = new PostHistoryManager();
