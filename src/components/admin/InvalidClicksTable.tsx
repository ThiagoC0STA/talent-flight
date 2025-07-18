import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Calendar,
  Link,
  Copy,
} from "lucide-react";
import { trackingService } from "@/lib/jobs";

interface InvalidClickJob {
  jobId: string;
  title: string;
  company: string;
  applicationUrl: string;
  invalidClicks: number;
  totalClicks: number;
  lastInvalidClick: string;
  invalidUrls: string[];
}

export default function InvalidClicksTable() {
  const [invalidJobs, setInvalidJobs] = useState<InvalidClickJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvalidJobs();
  }, []);

  const loadInvalidJobs = async () => {
    try {
      setLoading(true);
      const jobs = await trackingService.getJobsWithInvalidClicks();
      setInvalidJobs(jobs);
    } catch (error) {
      console.error("Error loading invalid clicks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInvalidRate = (invalidClicks: number, totalClicks: number) => {
    if (totalClicks === 0) return 0;
    return ((invalidClicks / totalClicks) * 100).toFixed(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vagas com Invalid Clicks
            </h3>
            <p className="text-sm text-gray-500">Carregando...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (invalidJobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vagas com Invalid Clicks
            </h3>
            <p className="text-sm text-gray-500">
              Nenhuma vaga com cliques inválidos encontrada
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Tudo OK!</h4>
          <p className="text-gray-500">
            Não há vagas com cliques inválidos no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vagas com Invalid Clicks
            </h3>
            <p className="text-sm text-gray-500">
              {invalidJobs.length} vaga{invalidJobs.length !== 1 ? "s" : ""} com
              cliques inválidos
            </p>
          </div>
        </div>
        <button
          onClick={loadInvalidJobs}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="space-y-6">
        {invalidJobs.map((job) => (
          <div
            key={job.jobId}
            className="border border-red-200 rounded-lg p-4 bg-red-50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>

                {/* Link da vaga */}
                {job.applicationUrl && (
                  <div className="flex items-center gap-2 mb-3">
                    <Link className="w-4 h-4 text-blue-600" />
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs"
                    >
                      {truncateUrl(job.applicationUrl)}
                    </a>
                    <button
                      onClick={() => copyToClipboard(job.applicationUrl)}
                      className="p-1 hover:bg-blue-100 rounded"
                      title="Copiar link"
                    >
                      <Copy className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  {job.invalidClicks} inválido
                  {job.invalidClicks !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Links inválidos */}
            {job.invalidUrls.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Links inválidos detectados:
                </h5>
                <div className="space-y-2">
                  {job.invalidUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-red-100 rounded p-2"
                    >
                      <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-red-700 truncate flex-1">
                        {truncateUrl(url, 60)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(url)}
                        className="p-1 hover:bg-red-200 rounded flex-shrink-0"
                        title="Copiar link inválido"
                      >
                        <Copy className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <span>{job.totalClicks} total</span>
                </div>
                <div className="flex items-center gap-1 text-red-600 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {getInvalidRate(job.invalidClicks, job.totalClicks)}%
                    inválidos
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(job.lastInvalidClick)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
