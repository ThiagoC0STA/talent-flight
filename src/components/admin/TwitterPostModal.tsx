import { useState, useEffect } from "react";
import { X, Twitter, RefreshCw, Mail, CheckCircle } from "lucide-react";
import { Job } from "@/types/job";
import { generateTwitterPostVariations } from "@/lib/twitter-variations";
import { checkAndNotifyAlerts } from "@/lib/jobAlerts";
import Image from "next/image";

interface TwitterPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function TwitterPostModal({
  isOpen,
  onClose,
  job,
}: TwitterPostModalProps) {
  const [postText, setPostText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [currentVariation, setCurrentVariation] = useState(0);
  const [allVariations, setAllVariations] = useState<string[]>([]);
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);
  const [alertsSent, setAlertsSent] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Gerar post quando job mudar
  useEffect(() => {
    if (job) {
      const variations = generateTwitterPostVariations(job);
      const randomIndex = Math.floor(Math.random() * variations.length);
      setAllVariations(variations);
      setCurrentVariation(randomIndex);
      setPostText(variations[randomIndex]);
    }
  }, [job]);

  // Atualizar contador de caracteres
  useEffect(() => {
    setCharCount(postText.length);
  }, [postText]);

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

  const handleSendAlerts = async () => {
    if (!job || isSendingAlerts) return;
    
    setIsSendingAlerts(true);
    try {
      await checkAndNotifyAlerts(job);
      setAlertsSent(true);
      // Reset after 3 seconds
      setTimeout(() => setAlertsSent(false), 3000);
    } catch (error) {
      console.error("Erro ao enviar alerts:", error);
    } finally {
      setIsSendingAlerts(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 !m-0 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Twitter className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">Post to Twitter/X</h2>
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
                  unoptimized
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain bg-white border"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
                <p className="text-xs text-gray-500">{job.location}</p>
              </div>
            </div>
          </div>

          {/* Character Count */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showPreview
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !showPreview
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Edit
              </button>
            </div>
            <div className={`text-xs font-medium ${
              charCount > 280 ? 'text-red-500' : 
              charCount > 260 ? 'text-yellow-500' : 'text-gray-500'
            }`}>
              {charCount}/280
            </div>
          </div>

          {/* Variações Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Variation:</span>
              <span className="text-xs font-medium text-gray-900">
                {currentVariation + 1} of {allVariations.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousVariation}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                title="Previous variation"
              >
                ←
              </button>
              <button
                onClick={handleRandomVariation}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                title="Random variation"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <button
                onClick={handleNextVariation}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                title="Next variation"
              >
                →
              </button>
            </div>
          </div>

          {showPreview ? (
            /* Preview do Tweet */
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">TF</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">TalentFlight</p>
                  <p className="text-xs text-gray-500">Now</p>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-gray-900 text-sm mb-3">
                {postText}
              </div>
            </div>
          ) : (
            /* Editor de Texto */
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-48 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Type your tweet here..."
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopyToClipboard}
              data-copy-button
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Copy Tweet
            </button>
            
            <button
              onClick={handleSendAlerts}
              disabled={isSendingAlerts || alertsSent}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                alertsSent
                  ? "bg-green-100 text-green-700"
                  : isSendingAlerts
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              {alertsSent ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Sent!
                </>
              ) : isSendingAlerts ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Alerts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 