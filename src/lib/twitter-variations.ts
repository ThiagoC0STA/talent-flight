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

// Função para gerar hashtags mais concisas
function generateHashtags(job: Job): string {
  const locationTags = job.location
    ? job.location
        .split(",")
        .map((part) => part.trim().replace(/\s+/g, "").toLowerCase())
        .slice(0, 2) // Limitar a 2 tags de localização
    : [];

  const hashtags = [
    job.category,
    job.experience,
    "dev",
    "job",
    "hiring",
    ...locationTags,
  ]
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
    .slice(0, 6) // Limitar a 6 hashtags
    .map((tag) => `#${tag}`)
    .join(" ");

  return hashtags;
}

// Emojis mais concisos para Twitter
const emojiVariations = {
  experience: {
    intern: "🎓",
    junior: "👨‍💻",
    "junior-mid": "🚀",
    mid: "⚡",
    "mid-senior": "🔥",
    senior: "💪",
    lead: "👑",
    executive: "🎯",
  },
  location: {
    remote: "🌍",
    hybrid: "🏢",
    onsite: "📍",
  },
  type: {
    "full-time": "💼",
    "part-time": "⏰",
    contract: "📋",
    internship: "🎓",
    freelance: "💼",
  },
};

// Call-to-actions mais diretos
const ctaVariations = [
  "Apply:",
  "Check it out:",
  "Join us:",
  "Apply now:",
  "See more:",
  "Learn more:",
];

// Descrições mais concisas por categoria
const categoryDescriptions = {
  direct: {
    frontend: "Frontend dev needed!",
    backend: "Backend dev wanted!",
    fullstack: "Full-stack dev needed!",
    mobile: "Mobile dev wanted!",
    devops: "DevOps engineer needed!",
    ai: "AI/ML engineer wanted!",
    design: "UI/UX designer needed!",
    product: "Product manager wanted!",
    engineering: "Software engineer needed!",
    development: "Developer wanted!",
  },
  exciting: {
    frontend: "Build amazing UIs!",
    backend: "Scale systems!",
    fullstack: "Build everything!",
    mobile: "Create mobile apps!",
    devops: "Automate everything!",
    ai: "Build the future!",
    design: "Design experiences!",
    product: "Shape products!",
    engineering: "Solve problems!",
    development: "Code the future!",
  },
  urgent: {
    frontend: "Frontend dev URGENT!",
    backend: "Backend dev NEEDED!",
    fullstack: "Full-stack dev ASAP!",
    mobile: "Mobile dev WANTED!",
    devops: "DevOps engineer URGENT!",
    ai: "AI engineer NEEDED!",
    design: "Designer WANTED!",
    product: "Product manager URGENT!",
    engineering: "Engineer NEEDED!",
    development: "Developer WANTED!",
  },
  friendly: {
    frontend: "Frontend devs, this is for you!",
    backend: "Backend devs, join us!",
    fullstack: "Full-stack devs wanted!",
    mobile: "Mobile devs needed!",
    devops: "DevOps folks, apply!",
    ai: "AI enthusiasts wanted!",
    design: "Designers, join us!",
    product: "Product people needed!",
    engineering: "Engineers wanted!",
    development: "Developers, apply!",
  },
};

// Tech stack mais conciso
const techStackVariations = [
  "Tech: {tech}",
  "Stack: {tech}",
  "{tech}",
  "Using: {tech}",
];

// Função para obter emojis
function getEmojis(job: Job, variation: number) {
  const experienceEmoji =
    emojiVariations.experience[
      job.experience as keyof typeof emojiVariations.experience
    ] || "👨‍💻";

  let locationEmoji;
  if (job.isRemote) {
    locationEmoji = emojiVariations.location.remote;
  } else if (job.location.toLowerCase().includes("hybrid")) {
    locationEmoji = emojiVariations.location.hybrid;
  } else {
    locationEmoji = emojiVariations.location.onsite;
  }

  const typeEmoji =
    emojiVariations.type[job.type as keyof typeof emojiVariations.type] || "💼";

  const emojiOptions = [
    { experience: experienceEmoji, location: locationEmoji, type: typeEmoji },
    { experience: "🚀", location: "🌍", type: "⚡" },
    { experience: "💪", location: "📍", type: "🔥" },
    { experience: "👨‍💻", location: "🏢", type: "💼" },
  ];

  return emojiOptions[variation % emojiOptions.length];
}

// Função para gerar descrição concisa
function getDescription(job: Job, variation: number): string {
  const category = job.category || "development";

  const styles = ["direct", "exciting", "urgent", "friendly"];
  const style = styles[variation % styles.length];

  const descriptions =
    categoryDescriptions[style as keyof typeof categoryDescriptions];
  return (
    descriptions[category as keyof typeof descriptions] ||
    descriptions.development
  );
}

// Função para gerar tech stack conciso
function getTechStack(job: Job, variation: number): string | null {
  if (!job.tags || job.tags.length === 0) return null;

  // Limitar a 3 tecnologias principais
  const techStack = job.tags.slice(0, 3).join(", ");
  const template = techStackVariations[variation % techStackVariations.length];

  return template.replace("{tech}", techStack);
}

// Função para gerar call-to-action
function getCTA(variation: number): string {
  return ctaVariations[variation % ctaVariations.length];
}

// Função principal para gerar variações do Twitter
export function generateTwitterPostVariations(job: Job): string[] {
  const variations: string[] = [];
  const jobUrl = `https://www.talentflight.com/job/${slugify(
    job.title
  )}-at-${slugify(job.company)}`;
  const hashtags = generateHashtags(job);

  for (let i = 0; i < 4; i++) {
    const emojis = getEmojis(job, i);
    const description = getDescription(job, i);
    const techStack = getTechStack(job, i);
    const cta = getCTA(i);

    let post = `${emojis.experience} ${job.title}\n`;
    post += `${emojis.location} ${job.location}${job.isRemote ? " (Remote)" : ""}\n`;
    post += `${emojis.type} ${job.type}\n\n`;
    post += `${description}\n\n`;

    if (techStack) {
      post += `${techStack}\n\n`;
    }

    post += `${cta} ${jobUrl}\n\n`;
    post += `${hashtags}`;

    variations.push(post);
  }

  return variations;
}

// Função para obter uma variação aleatória
export function getRandomTwitterPost(job: Job): string {
  const variations = generateTwitterPostVariations(job);
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
}
