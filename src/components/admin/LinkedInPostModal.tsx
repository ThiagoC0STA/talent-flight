import { useState, useEffect } from "react";
import { X, Linkedin } from "lucide-react";
import { Job } from "@/types/job";

interface LinkedInPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

function getExperienceEmoji(experience?: string) {
  const emojis = {
    intern: "🎓",
    junior: "👨‍💻",
    "junior-mid": "👨‍💻",
    mid: "👨‍💻",
    "mid-senior": "👨‍💻",
    senior: "👨‍💻",
    lead: "👨‍💻",
    executive: "👨‍💻",
  };
  return emojis[experience as keyof typeof emojis] || "👨‍💻";
}

function getLocationEmoji(location: string) {
  if (location.toLowerCase().includes("remote")) return "🌍";
  if (location.toLowerCase().includes("hybrid")) return "🏢";
  return "📍";
}

function getTypeEmoji(type: string) {
  const emojis = {
    "full-time": "💼",
    "part-time": "⏰",
    contract: "📋",
    internship: "🎓",
    freelance: "💼",
  };
  return emojis[type as keyof typeof emojis] || "💼";
}

function generateLinkedInPost(job: Job): string {
  const experienceEmoji = getExperienceEmoji(job.experience);
  const locationEmoji = getLocationEmoji(job.location);
  const typeEmoji = getTypeEmoji(job.type);

  const jobUrl = `https://www.talentflight.com/job/${slugify(
    job.title
  )}-at-${slugify(job.company)}`;

  // Gerar hashtags baseadas na categoria e experiência
  const hashtags = [
    job.category,
    job.experience,
    "developer",
    "remotework",
    "talentflight",
    job.isRemote ? "remote" : null,
  ]
    .filter(Boolean)
    .map((tag) => `#${tag}`)
    .join(" ");

  // Gerar descrição personalizada baseada no job
  const generateJobDescription = (job: Job): string => {
    const category = job.category || "development";
    const isRemote = job.isRemote ? "remote" : "on-site";
    const hasTechStack = job.tags && job.tags.length > 0;

    // Descrições específicas por categoria - mais fluidas e feed-friendly
    const categoryDescriptions = {
      frontend: `Join ${job.company} and help build solutions that actually make a difference. You'll work on modern projects with cutting-edge frontend technologies.`,
      backend: `Join ${job.company} and help build robust systems that power real applications. You'll work with modern backend technologies and best practices.`,
      fullstack: `Join ${job.company} and help build complete solutions from frontend to backend. You'll work across the entire tech stack on exciting projects.`,
      mobile: `Join ${job.company} and help create mobile apps that users actually love. You'll work with the latest iOS and Android technologies.`,
      devops: `Join ${job.company} and help automate everything! You'll build robust pipelines and manage infrastructure at scale.`,
      ai: `Join ${job.company} and help push the boundaries of AI technology. You'll work on machine learning models that solve real problems.`,
      design: `Join ${job.company} and help design experiences that users can't live without. You'll create beautiful, intuitive interfaces.`,
      product: `Join ${job.company} and help shape the future of our products. You'll work with cross-functional teams on exciting solutions.`,
      engineering: `Join ${job.company} and help solve complex technical challenges. You'll work on innovative projects that make an impact.`,
      development: `Join ${job.company} and help build software that makes a difference. You'll work on exciting projects with modern technologies.`,
    };

    // Escolher descrição baseada no contexto
    if (
      categoryDescriptions[job.category as keyof typeof categoryDescriptions]
    ) {
      return `"${
        categoryDescriptions[job.category as keyof typeof categoryDescriptions]
      }"`;
    } else if (hasTechStack && job.tags!.includes("React")) {
      return `"Join ${job.company} and help build modern React applications that users actually love. You'll work with the latest frontend technologies."`;
    } else if (hasTechStack && job.tags!.includes("Vue")) {
      return `"Join ${job.company} and help create elegant Vue.js applications. You'll work with progressive web technologies and build scalable solutions."`;
    } else if (hasTechStack && job.tags!.includes("Node.js")) {
      return `"Join ${job.company} and help build high-performance Node.js applications. You'll work with modern backend technologies and microservices."`;
    } else if (hasTechStack && job.tags!.includes("Python")) {
      return `"Join ${job.company} and help develop powerful Python applications. You'll work on data processing, APIs, and automation solutions."`;
    } else if (
      (hasTechStack && job.tags!.includes("AI")) ||
      job.tags!.includes("Machine Learning")
    ) {
      return `"Join ${job.company} and help push the boundaries of AI technology. You'll work on machine learning models that solve real problems."`;
    } else if (isRemote) {
      return `"Join ${job.company}'s remote team and work on exciting ${category} projects from anywhere. You'll have the flexibility to work from your preferred location."`;
    } else {
      return `"Join ${job.company} and help work on exciting ${category} projects with modern technologies. You'll be part of a dynamic team building innovative solutions."`;
    }
  };

  const jobDescription = generateJobDescription(job);

  return `${experienceEmoji} ${job.title}
${locationEmoji} ${job.location}${job.isRemote ? " – Remote friendly" : ""}
${typeEmoji} ${job.type}

${jobDescription}

👉 Apply here: ${jobUrl}

${hashtags}`;
}

export default function LinkedInPostModal({
  isOpen,
  onClose,
  job,
}: LinkedInPostModalProps) {
  const [postText, setPostText] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  // Gerar post quando job mudar
  useEffect(() => {
    if (job) {
      setPostText(generateLinkedInPost(job));
    }
  }, [job]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      // Mostrar feedback visual
      const button = document.querySelector(
        "[data-copy-button]"
      ) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Copiado!";
        button.classList.add("bg-green-500");
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("bg-green-500");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 !m-0 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Linkedin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Postar no LinkedIn</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Job Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-white border"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showPreview
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showPreview
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Editar
            </button>
          </div>

          {showPreview ? (
            /* Preview do Post */
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">TF</span>
                </div>
                <div>
                  <p className="font-semibold">TalentFlight</p>
                  <p className="text-sm text-gray-500">Agora</p>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-gray-900 mb-4">
                {postText}
              </div>
            </div>
          ) : (
            /* Editor de Texto */
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-64 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu post aqui..."
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopyToClipboard}
              data-copy-button
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Copiar Texto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
