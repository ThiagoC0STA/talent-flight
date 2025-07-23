import { useState, useEffect } from "react";
import { X, MessageSquare, RefreshCw, Mail, CheckCircle } from "lucide-react";
import { Job } from "@/types/job";
import { generateRedditPostVariations, generateRedditPostForSubreddit } from "@/lib/reddit-variations";
import { checkAndNotifyAlerts } from "@/lib/jobAlerts";
import { postHistoryManager } from "@/lib/post-history";
import Image from "next/image";

interface RedditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function RedditPostModal({
  isOpen,
  onClose,
  job,
}: RedditPostModalProps) {
  const [postText, setPostText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [currentVariation, setCurrentVariation] = useState(0);
  const [allVariations, setAllVariations] = useState<string[]>([]);
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);
  const [alertsSent, setAlertsSent] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>("");
  const [showSubredditWarning, setShowSubredditWarning] = useState(false);

  // Gerar post quando job mudar
  useEffect(() => {
    if (job) {
      const variations = generateRedditPostVariations(job);
      const randomIndex = Math.floor(Math.random() * variations.length);
      setAllVariations(variations);
      setCurrentVariation(randomIndex);
      setPostText(variations[randomIndex]);
    }
  }, [job]);

  // Verificar cooldown quando subreddit mudar
  useEffect(() => {
    if (selectedSubreddit && job) {
      const hasCooldown = postHistoryManager.hasSubredditCooldown(selectedSubreddit);
      const hasRecentPost = postHistoryManager.hasRecentPost(job, 'reddit', selectedSubreddit);
      setShowSubredditWarning(hasCooldown || hasRecentPost);
    } else {
      setShowSubredditWarning(false);
    }
  }, [selectedSubreddit, job]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      
      // Registrar no histórico se tiver subreddit selecionado
      if (job && selectedSubreddit) {
        postHistoryManager.registerPost(job, 'reddit', selectedSubreddit);
      }
      
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

  const handleSubredditChange = (subreddit: string) => {
    setSelectedSubreddit(subreddit);
    if (job && subreddit) {
      const post = generateRedditPostForSubreddit(job, subreddit);
      setPostText(post);
    }
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

  // Função para converter markdown básico para HTML
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 !m-0 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Post to Reddit</h2>
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
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showPreview
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Editar
            </button>
          </div>

          {/* Subreddit Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subreddit (optional):
            </label>
            <div className="flex flex-wrap gap-2">
              {["r/cscareerquestions", "r/forhire", "r/remotejobs", "r/webdev", "r/reactjs", "r/node", "r/python"].map((subreddit) => (
                <button
                  key={subreddit}
                  onClick={() => handleSubredditChange(subreddit)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubreddit === subreddit
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {subreddit}
                </button>
              ))}
            </div>
            {showSubredditWarning && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ Warning: This subreddit has active cooldown or recent similar post
                </p>
              </div>
            )}
          </div>

          {/* Variações Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Variation:</span>
              <span className="text-sm font-medium text-gray-900">
                {currentVariation + 1} of {allVariations.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Previous variation"
              >
                ←
              </button>
              <button
                onClick={handleRandomVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Random variation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextVariation}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Next variation"
              >
                →
              </button>
            </div>
          </div>

          {showPreview ? (
            /* Preview do Post do Reddit */
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">TF</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">TalentFlight</p>
                  <p className="text-xs text-gray-500">Posted by u/TalentFlight</p>
                </div>
              </div>

              <div 
                className="whitespace-pre-wrap text-gray-900 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(postText) }}
              />
            </div>
          ) : (
            /* Text Editor */
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-64 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder="Type your Reddit post here... (Markdown supported)"
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopyToClipboard}
              data-copy-button
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Copy Post
            </button>
            
            <button
              onClick={handleSendAlerts}
              disabled={isSendingAlerts || alertsSent}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                alertsSent
                  ? "bg-green-100 text-green-700"
                  : isSendingAlerts
                  ? "bg-orange-100 text-orange-700"
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