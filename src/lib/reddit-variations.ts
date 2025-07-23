import { Job } from "@/types/job";

// Função utilitária para slugify
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

// Subreddits relevantes para tech jobs
const relevantSubreddits = [
  "r/cscareerquestions",
  "r/forhire",
  "r/jobbit",
  "r/remotejobs",
  "r/techjobs",
  "r/programming",
  "r/webdev",
  "r/reactjs",
  "r/node",
  "r/python",
];

// Função para gerar subreddits baseados no job
function generateSubreddits(job: Job): string[] {
  const subreddits = ["r/cscareerquestions", "r/forhire"];

  if (job.isRemote) {
    subreddits.push("r/remotejobs");
  }

  if (job.category === "frontend") {
    subreddits.push("r/webdev", "r/reactjs");
  } else if (job.category === "backend") {
    subreddits.push("r/node", "r/python");
  } else if (job.category === "ai") {
    subreddits.push("r/MachineLearning", "r/artificial");
  }

  return subreddits.slice(0, 3); // Limitar a 3 subreddits
}

// Função para adaptar o tom baseado no subreddit
function getToneForSubreddit(
  subreddit: string
): "direct" | "casual" | "discursive" | "detailed" {
  switch (subreddit) {
    case "r/forhire":
      return "direct";
    case "r/cscareerquestions":
      return "discursive";
    case "r/remotejobs":
      return "casual";
    case "r/webdev":
    case "r/reactjs":
    case "r/node":
    case "r/python":
      return "detailed";
    default:
      return "casual";
  }
}

// Títulos mais casuais para Reddit
const titleVariations = {
  direct: {
    frontend: "Frontend Developer needed",
    backend: "Backend Developer wanted",
    fullstack: "Full-stack Developer needed",
    mobile: "Mobile Developer wanted",
    devops: "DevOps Engineer needed",
    ai: "AI/ML Engineer wanted",
    design: "UI/UX Designer needed",
    product: "Product Manager wanted",
    engineering: "Software Engineer needed",
    development: "Developer wanted",
  },
  casual: {
    frontend: "Looking for a Frontend Dev",
    backend: "Need a Backend Dev",
    fullstack: "Full-stack Dev needed",
    mobile: "Mobile Dev wanted",
    devops: "DevOps Engineer needed",
    ai: "AI Engineer wanted",
    design: "UI/UX Designer needed",
    product: "Product Manager wanted",
    engineering: "Software Engineer needed",
    development: "Developer needed",
  },
  discursive: {
    frontend: "Found this Frontend position and thought it might interest you",
    backend: "Came across this Backend opportunity",
    fullstack: "Full-stack role that might be interesting",
    mobile: "Mobile Dev opportunity I found",
    devops: "DevOps position that could be interesting",
    ai: "AI/ML Engineer opportunity",
    design: "UI/UX Designer role that looks interesting",
    product: "Product Manager opportunity",
    engineering: "Software Engineer position I found",
    development: "Developer opportunity that might interest you",
  },
  urgent: {
    frontend: "URGENT: Frontend Dev needed",
    backend: "URGENT: Backend Dev wanted",
    fullstack: "URGENT: Full-stack Dev needed",
    mobile: "URGENT: Mobile Dev wanted",
    devops: "URGENT: DevOps Engineer needed",
    ai: "URGENT: AI Engineer wanted",
    design: "URGENT: Designer needed",
    product: "URGENT: Product Manager wanted",
    engineering: "URGENT: Software Engineer needed",
    development: "URGENT: Developer wanted",
  },
  friendly: {
    frontend: "Hey frontend devs! We're hiring",
    backend: "Backend devs, we need you!",
    fullstack: "Full-stack devs wanted!",
    mobile: "Mobile devs, join us!",
    devops: "DevOps folks needed!",
    ai: "AI enthusiasts wanted!",
    design: "Designers, we need you!",
    product: "Product people wanted!",
    engineering: "Engineers, join us!",
    development: "Developers wanted!",
  },
};

// Descrições mais casuais para Reddit
const descriptionVariations = {
  direct: {
    frontend: "We're looking for a frontend developer to join our team.",
    backend: "Need a backend developer to help scale our systems.",
    fullstack: "Full-stack developer needed to work on exciting projects.",
    mobile: "Mobile developer wanted for iOS/Android development.",
    devops: "DevOps engineer needed to manage our infrastructure.",
    ai: "AI/ML engineer wanted for cutting-edge projects.",
    design: "UI/UX designer needed to create amazing experiences.",
    product: "Product manager wanted to drive product strategy.",
    engineering: "Software engineer needed to solve complex problems.",
    development: "Developer wanted to join our growing team.",
  },
  casual: {
    frontend: "Hey! We need a frontend dev to help us build cool stuff.",
    backend: "Looking for a backend dev to make our systems rock.",
    fullstack: "Need a full-stack dev to work on awesome projects.",
    mobile: "Want a mobile dev to build apps people love.",
    devops: "DevOps engineer needed to keep everything running smoothly.",
    ai: "AI engineer wanted to work on the future of tech.",
    design: "Designer needed to make our products look amazing.",
    product: "Product manager wanted to shape our product strategy.",
    engineering: "Engineer needed to solve interesting problems.",
    development: "Developer wanted to join our awesome team.",
  },
  detailed: {
    frontend:
      "We're a growing company looking for a frontend developer. You'll work with modern frameworks and help build user experiences that users actually love.",
    backend:
      "Backend developer needed to help scale our systems. You'll work with cutting-edge technologies and microservices.",
    fullstack:
      "Full-stack developer wanted to work across the entire tech stack. You'll handle both frontend and backend development.",
    mobile:
      "Mobile developer needed for iOS and Android development. Experience with React Native, Flutter, or native development preferred.",
    devops:
      "DevOps engineer to manage our infrastructure and deployment pipelines. AWS, Docker, and Kubernetes experience helpful.",
    ai: "AI/ML engineer to develop machine learning models and algorithms. Python, TensorFlow, or PyTorch experience required.",
    design:
      "UI/UX designer to create beautiful, user-friendly interfaces. Figma, Sketch, or Adobe Creative Suite experience.",
    product:
      "Product manager to drive product strategy and development. Experience with agile methodologies and user research.",
    engineering:
      "Software engineer to build robust, scalable applications. Strong programming fundamentals and problem-solving skills.",
    development:
      "Developer to join our growing team. You'll work on exciting projects with modern technologies and best practices.",
  },
  discursive: {
    frontend:
      "Found this position and thought it might interest those looking for remote work or wanting to work with frontend. The company seems to have a modern stack.",
    backend:
      "Came across this backend opportunity that might be interesting for those looking for jobs. Seems to be a company with cool projects.",
    fullstack:
      "Full-stack position I found. Might be interesting for those wanting to work with the full stack or just starting in the field.",
    mobile:
      "Mobile dev opportunity that might interest you. The company seems to have interesting projects and the stack is modern.",
    devops:
      "DevOps position that could be interesting for those in the field. The company seems to have well-structured infrastructure.",
    ai: "AI/ML Engineer opportunity I found. Might be interesting for those in the machine learning field.",
    design:
      "UI/UX Designer position that might interest you. The company seems to value design and user experience.",
    product:
      "Product Manager opportunity I found. Might be interesting for those in the product field.",
    engineering:
      "Software Engineer position that could be interesting. The company seems to have challenging projects.",
    development:
      "Developer opportunity I found. Might be interesting for those looking for tech jobs.",
  },
};

// Tech stack mais casual
const techStackVariations = [
  "Tech stack: {tech}",
  "Using: {tech}",
  "Stack: {tech}",
  "Technologies: {tech}",
  "Built with: {tech}",
];

// Call-to-actions mais casuais
const ctaVariations = [
  "Apply here:",
  "Check it out:",
  "More details:",
  "Apply now:",
  "Learn more:",
];

// Função para gerar título
function getTitle(job: Job, variation: number, subreddit?: string): string {
  const category = job.category || "development";

  let style: keyof typeof titleVariations;
  if (subreddit) {
    const tone = getToneForSubreddit(subreddit);
    style = tone as keyof typeof titleVariations;
  } else {
    const styles = ["direct", "casual", "urgent", "friendly"];
    style = styles[variation % styles.length] as keyof typeof titleVariations;
  }

  const titles = titleVariations[style];
  return titles[category as keyof typeof titles] || titles.development;
}

// Função para gerar descrição
function getDescription(
  job: Job,
  variation: number,
  subreddit?: string
): string {
  const category = job.category || "development";

  let style: keyof typeof descriptionVariations;
  if (subreddit) {
    const tone = getToneForSubreddit(subreddit);
    style = tone as keyof typeof descriptionVariations;
  } else {
    const styles = ["direct", "casual", "detailed"];
    style = styles[
      variation % styles.length
    ] as keyof typeof descriptionVariations;
  }

  const descriptions = descriptionVariations[style];
  return (
    descriptions[category as keyof typeof descriptions] ||
    descriptions.development
  );
}

// Função para gerar tech stack
function getTechStack(job: Job, variation: number): string | null {
  if (!job.tags || job.tags.length === 0) return null;

  const techStack = job.tags.slice(0, 4).join(", ");
  const template = techStackVariations[variation % techStackVariations.length];

  return template.replace("{tech}", techStack);
}

// Função para gerar call-to-action
function getCTA(variation: number): string {
  return ctaVariations[variation % ctaVariations.length];
}

// Função principal para gerar variações do Reddit
export function generateRedditPostVariations(
  job: Job,
  targetSubreddit?: string
): string[] {
  const variations: string[] = [];
  const jobUrl = `https://www.talentflight.com/job/${slugify(
    job.title
  )}-at-${slugify(job.company)}`;

  // Se não especificar subreddit, usar os padrões
  const subreddits = targetSubreddit
    ? [targetSubreddit]
    : generateSubreddits(job);

  for (let i = 0; i < 4; i++) {
    const subreddit = subreddits[i % subreddits.length];
    const title = getTitle(job, i, subreddit);
    const description = getDescription(job, i, subreddit);
    const techStack = getTechStack(job, i);
    const cta = getCTA(i);

    let post = `**${title}**\n\n`;
    post += `${description}\n\n`;
    post += `**Location:** ${job.location}${job.isRemote ? " (Remote friendly)" : ""}\n`;
    post += `**Type:** ${job.type}\n`;
    post += `**Experience:** ${job.experience}\n\n`;

    if (techStack) {
      post += `${techStack}\n\n`;
    }

    post += `${cta} ${jobUrl}`;

    variations.push(post);
  }

  return variations;
}

// Função para gerar post específico para um subreddit
export function generateRedditPostForSubreddit(
  job: Job,
  subreddit: string
): string {
  const variations = generateRedditPostVariations(job, subreddit);
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
}

// Função para obter uma variação aleatória
export function getRandomRedditPost(job: Job): string {
  const variations = generateRedditPostVariations(job);
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
}
