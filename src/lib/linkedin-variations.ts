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

// Função para gerar hashtags
function generateHashtags(job: Job): string {
  const locationTags = job.location
    ? job.location
        .split(",")
        .map((part) => part.trim().replace(/\s+/g, "").toLowerCase())
    : [];

  const hashtags = [
    job.category,
    job.experience,
    "developer",
    "work",
    "hiring",
    "job",
    "talentflight",
    "techjobs",
    "tech",
    ...locationTags,
  ]
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
    .map((tag) => `#${tag}`)
    .join(" ");

  return hashtags;
}

// Objetos de variações de emojis
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

// Objetos de variações de call-to-action
const ctaVariations = [
  "👉 Apply here",
  "🚀 Join us",
  "💼 Explore this role",
  "⚡ Check it out",
  "🎯 Apply now",
  "🔥 Don't miss this",
];

// Objetos de variações de descrições por categoria
const categoryDescriptions = {
  technical: {
    frontend:
      "Building pixel-perfect interfaces with modern frameworks. You'll craft user experiences that users actually love.",
    backend:
      "Architecting robust systems that scale. You'll work with cutting-edge backend technologies and microservices.",
    fullstack:
      "Mastering both frontend and backend. You'll build complete solutions from database to UI.",
    mobile:
      "Creating mobile apps that users can't put down. You'll work with the latest iOS and Android technologies.",
    devops:
      "Automating everything! You'll build CI/CD pipelines and manage infrastructure at scale.",
    ai: "Pushing the boundaries of AI. You'll develop machine learning models that solve real-world problems.",
    design:
      "Crafting beautiful, intuitive interfaces. You'll create experiences that users can't live without.",
    product:
      "Shaping the future of products. You'll work with cross-functional teams on innovative solutions.",
    engineering:
      "Solving complex technical challenges. You'll work on innovative projects that make an impact.",
    development:
      "Building software that makes a difference. You'll work on exciting projects with modern technologies.",
  },
  inspirational: {
    frontend:
      "Transform ideas into beautiful, interactive experiences. Join a team that values creativity and innovation.",
    backend:
      "Build the foundation that powers amazing applications. Your code will touch thousands of users every day.",
    fullstack:
      "Be the bridge between frontend and backend. Create seamless experiences from database to user interface.",
    mobile:
      "Bring apps to life on millions of devices. Your work will be in the hands of users worldwide.",
    devops:
      "Enable teams to ship faster and more reliably. You'll be the backbone of our development process.",
    ai: "Shape the future with artificial intelligence. Your algorithms will solve problems we haven't even thought of yet.",
    design:
      "Create experiences that users fall in love with. Your designs will define how people interact with technology.",
    product:
      "Drive product strategy and user experience. You'll help build products that users can't live without.",
    engineering:
      "Engineer solutions to complex problems. Your work will have a lasting impact on our technology.",
    development:
      "Write code that changes the world. Join a team that's building the future of technology.",
  },
  direct: {
    frontend:
      "We need a frontend developer who knows their way around modern frameworks. React, Vue, or Angular experience required.",
    backend:
      "Looking for a backend developer to build scalable APIs and microservices. Node.js, Python, or Java experience preferred.",
    fullstack:
      "Full-stack developer needed to work across the entire tech stack. You'll handle both frontend and backend development.",
    mobile:
      "Mobile developer wanted for iOS and Android development. Experience with React Native, Flutter, or native development.",
    devops:
      "DevOps engineer needed to manage our infrastructure and deployment pipelines. AWS, Docker, and Kubernetes experience.",
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
  friendly: {
    frontend:
      "Hey frontend developers! We're looking for someone who loves creating beautiful user interfaces. Sound like you?",
    backend:
      "Backend developers, this one's for you! We need someone who enjoys building robust systems that scale.",
    fullstack:
      "Full-stack developers, we see you! Join us and work across the entire tech stack on exciting projects.",
    mobile:
      "Mobile developers, where are you? We're building apps that users actually love to use.",
    devops:
      "DevOps folks, we need your expertise! Help us automate everything and keep our systems running smoothly.",
    ai: "AI enthusiasts, this is your chance! We're working on cutting-edge machine learning projects.",
    design:
      "Designers, we need your creative vision! Help us create interfaces that users can't resist.",
    product:
      "Product people, join us! We're building products that solve real problems for real users.",
    engineering:
      "Engineers, we want you! Join our team and work on challenging, impactful projects.",
    development:
      "Developers, this could be your next adventure! Join us and build something amazing together.",
  },
  mysterious: {
    frontend:
      "Ever wondered what it's like to build interfaces that millions of users interact with daily?",
    backend:
      "What if you could architect systems that handle millions of requests without breaking a sweat?",
    fullstack:
      "Imagine being the person who can build anything from database to user interface. Sound exciting?",
    mobile:
      "What if your code ran on devices in people's pockets around the world?",
    devops:
      "Ever thought about being the person who makes sure everything just works?",
    ai: "What if you could teach machines to think and solve problems humans can't?",
    design:
      "Ever dreamed of creating experiences that users can't imagine living without?",
    product: "What if you could shape the future of how people use technology?",
    engineering:
      "Ever wanted to solve problems that haven't been solved before?",
    development:
      "What if you could write code that changes how people work and live?",
  },
};

// Objetos de variações de tech stack
const techStackVariations = [
  "Tech stack: {tech}",
  "Technologies: {tech}",
  "Stack: {tech}",
  "Using: {tech}",
  "Built with: {tech}",
  "Tech: {tech}",
];

// Função para obter emojis baseados no contexto
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

  // Variações de emojis baseadas no número da variação
  const emojiOptions = [
    { experience: experienceEmoji, location: locationEmoji, type: typeEmoji },
    { experience: "🚀", location: "🌍", type: "⚡" },
    { experience: "💪", location: "📍", type: "🔥" },
    { experience: "👨‍💻", location: "🏢", type: "💼" },
    { experience: "🎯", location: "🌍", type: "🎓" },
    { experience: "⚡", location: "📍", type: "💼" },
  ];

  return emojiOptions[variation % emojiOptions.length];
}

// Função para gerar descrição baseada na variação
function getDescription(job: Job, variation: number): string {
  const category = job.category || "development";
  const hasTechStack = job.tags && job.tags.length > 0;

  // Escolher estilo baseado na variação
  const styles = [
    "technical",
    "inspirational",
    "direct",
    "friendly",
    "mysterious",
  ];
  const style = styles[variation % styles.length];

  const descriptions =
    categoryDescriptions[style as keyof typeof categoryDescriptions];
  const baseDescription =
    descriptions[category as keyof typeof descriptions] ||
    descriptions.development;

  // Personalizar baseado em tech stack específico
  if (hasTechStack && job.tags!.includes("React")) {
    return `"${baseDescription} React experience is a plus!"`;
  } else if (hasTechStack && job.tags!.includes("Node.js")) {
    return `"${baseDescription} Node.js experience preferred."`;
  } else if (hasTechStack && job.tags!.includes("Python")) {
    return `"${baseDescription} Python experience is a plus!"`;
  } else if (hasTechStack && job.tags!.includes("AI")) {
    return `"${baseDescription} AI/ML experience is a plus!"`;
  }

  return `"${baseDescription}"`;
}

// Função para gerar tech stack
function getTechStack(job: Job, variation: number): string | null {
  if (!job.tags || job.tags.length === 0) return null;

  const techStack = job.tags.slice(0, 5).join(", ");
  const template = techStackVariations[variation % techStackVariations.length];

  return template.replace("{tech}", techStack);
}

// Função para gerar call-to-action
function getCTA(variation: number): string {
  return ctaVariations[variation % ctaVariations.length];
}

// Função principal para gerar variações
export function generateLinkedInPostVariations(job: Job): string[] {
  const variations: string[] = [];
  const jobUrl = `https://www.talentflight.com/job/${slugify(
    job.title
  )}-at-${slugify(job.company)}`;
  const hashtags = generateHashtags(job);

  for (let i = 0; i < 6; i++) {
    const emojis = getEmojis(job, i);
    const description = getDescription(job, i);
    const techStack = getTechStack(job, i);
    const cta = getCTA(i);

    let post = `${emojis.experience} ${job.title}\n`;
    post += `${emojis.location} ${job.location}${
      job.isRemote ? " – Remote friendly" : ""
    }\n`;
    post += `${emojis.type} ${job.type}\n\n`;
    post += `${description}\n\n`;

    if (techStack) {
      post += `${techStack}\n\n`;
    }

    post += `${cta}: ${jobUrl}\n\n`;
    post += `${hashtags}`;

    variations.push(post);
  }

  return variations;
}

// Função para obter uma variação aleatória
export function getRandomLinkedInPost(job: Job): string {
  const variations = generateLinkedInPostVariations(job);
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
}
