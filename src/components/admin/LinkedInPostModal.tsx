import { useState, useEffect } from "react";
import { X, Linkedin, RefreshCw } from "lucide-react";
import { Job } from "@/types/job";
import { generateLinkedInPostVariations } from "@/lib/linkedin-variations";
import Image from "next/image";

interface LinkedInPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function LinkedInPostModal({
  isOpen,
  onClose,
  job,
}: LinkedInPostModalProps) {
  const [postText, setPostText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [currentVariation, setCurrentVariation] = useState(0);
  const [allVariations, setAllVariations] = useState<string[]>([]);

  // Gerar post quando job mudar
  useEffect(() => {
    if (job) {
      const variations = generateLinkedInPostVariations(job);
      const randomIndex = Math.floor(Math.random() * variations.length);
      setAllVariations(variations);
      setCurrentVariation(randomIndex);
      setPostText(variations[randomIndex]);
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

  const handleNextVariation = () => {
    const nextIndex = (currentVariation + 1) % allVariations.length;
    setCurrentVariation(nextIndex);
    setPostText(allVariations[nextIndex]);
  };

  const handlePreviousVariation = () => {
    const prevIndex =
      currentVariation === 0 ? allVariations.length - 1 : currentVariation - 1;
    setCurrentVariation(prevIndex);
    setPostText(allVariations[prevIndex]);
  };

  const handleRandomVariation = () => {
    const randomIndex = Math.floor(Math.random() * allVariations.length);
    setCurrentVariation(randomIndex);
    setPostText(allVariations[randomIndex]);
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
                <Image
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
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

          {/* Variações Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Variação:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentVariation + 1} de {allVariations.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Variação anterior"
              >
                ←
              </button>
              <button
                onClick={handleRandomVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Variação aleatória"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Próxima variação"
              >
                →
              </button>
            </div>
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
