"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  ChevronDown,
  Linkedin,
  Calendar,
  Building,
  MapPin,
  Edit,
  Eye,
  Globe,
  AlertTriangle,
  Twitter,
  MessageSquare,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { Job } from "@/types/job";
import { jobsService, trackingService } from "@/lib/jobs";
import Image from "next/image";
import LinkedInPostModal from "./LinkedInPostModal";
import TwitterPostModal from "./TwitterPostModal";
import RedditPostModal from "./RedditPostModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

interface ImportedHistoryTabProps {
  onImportJob?: (
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  onEdit?: (job: Job) => void;
  isSubmitting?: boolean;
}

export default function ImportedHistoryTab({
  onEdit,
}: ImportedHistoryTabProps) {
  const [importedJobs, setImportedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedJobForLinkedIn, setSelectedJobForLinkedIn] =
    useState<Job | null>(null);
  const [selectedJobForTwitter, setSelectedJobForTwitter] =
    useState<Job | null>(null);
  const [selectedJobForReddit, setSelectedJobForReddit] =
    useState<Job | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
    companyName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    jobId: "",
    jobTitle: "",
    companyName: "",
    isDeleting: false,
  });

  const [clearHistoryModal, setClearHistoryModal] = useState<{
    isOpen: boolean;
    isClearing: boolean;
  }>({
    isOpen: false,
    isClearing: false,
  });

  useEffect(() => {
    loadImportedJobs();
  }, []);

  // Cache para evitar re-renders desnecessários
  const memoizedStats = useMemo(() => {
    return {
      total: importedJobs.length,
      remote: importedJobs.filter((j) => j.isRemote).length,
      featured: importedJobs.filter((j) => j.isFeatured).length,
      active: importedJobs.filter((j) => j.isActive).length,
    };
  }, [importedJobs]);

  const loadImportedJobs = async () => {
    setLoading(true);
    try {
      const importedJobsList = await trackingService.getImportedJobsList(50);
      setImportedJobs(importedJobsList);
    } catch (error) {
      console.error("Erro ao carregar vagas importadas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const updatedJob = await jobsService.updateJob(job.id, {
        isActive: !job.isActive,
      });
      if (updatedJob) {
        setImportedJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === job.id ? updatedJob : j))
        );
      }
    } catch (error) {
      console.error("Erro ao alterar status da vaga:", error);
    }
  };

  const handleToggleRemote = async (job: Job) => {
    try {
      const updatedJob = await jobsService.updateJob(job.id, {
        isRemote: !job.isRemote,
      });
      if (updatedJob) {
        setImportedJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === job.id ? updatedJob : j))
        );
      }
    } catch (error) {
      console.error("Erro ao alterar status remote da vaga:", error);
    }
  };

  const handleDeleteClick = (job: Job) => {
    setDeleteModal({
      isOpen: true,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await jobsService.deleteJob(deleteModal.jobId);
      await loadImportedJobs();
      setDeleteModal({
        isOpen: false,
        jobId: "",
        jobTitle: "",
        companyName: "",
        isDeleting: false,
      });
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleClearHistory = async () => {
    try {
      setClearHistoryModal((prev) => ({ ...prev, isClearing: true }));
      const success = await trackingService.clearImportedHistory();
      if (success) {
        await loadImportedJobs();
        setClearHistoryModal({
          isOpen: false,
          isClearing: false,
        });
      } else {
        console.error("Erro ao limpar histórico");
        setClearHistoryModal((prev) => ({ ...prev, isClearing: false }));
      }
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      setClearHistoryModal((prev) => ({ ...prev, isClearing: false }));
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleLinkedInPost = (job: Job) => {
    setSelectedJobForLinkedIn(job);
  };

  const handleTwitterPost = (job: Job) => {
    setSelectedJobForTwitter(job);
  };

  const handleRedditPost = (job: Job) => {
    setSelectedJobForReddit(job);
  };

  const filteredJobs = useMemo(() => {
    return importedJobs.filter((job) => {
      if (filter === "all") return true;
      if (filter === "category" && job.category) return true;
      if (filter === "type" && job.type) return true;
      if (filter === "remote" && job.isRemote) return true;
      if (filter === "featured" && job.isFeatured) return true;
      return false;
    });
  }, [importedJobs, filter]);

  const stats = memoizedStats;

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#011640] mb-2">
            Imported History
          </h2>
          <p className="text-gray-600">View and manage your imported jobs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setClearHistoryModal({ isOpen: true, isClearing: false })
            }
            className="btn-outline flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4" />
            Clear History
          </button>
          <button
            onClick={loadImportedJobs}
            disabled={loading}
            className="btn-outline flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-[#0476D9]">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Imported</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">
            {stats.remote}
          </div>
          <div className="text-sm text-gray-600">Remote</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {stats.featured}
          </div>
          <div className="text-sm text-gray-600">Featured</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "all"
                ? "bg-[#0476D9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter("remote")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "remote"
                ? "bg-[#0476D9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Remote Only
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "featured"
                ? "bg-[#0476D9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Featured Only
          </button>
        </div>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No imported jobs found</h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "Import some jobs to see them here."
                : `No imported jobs found for the selected filter.`}
            </p>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {job.companyLogo ? (
                        <div className="flex-shrink-0">
                          <Image
                            src={job.companyLogo}
                            alt={`${job.company} logo`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-200"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 text-xs font-medium">
                            {job.company.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <a
                              href={`/job/${slugify(job.title)}-at-${slugify(
                                job.company
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-[#0476D9] cursor-pointer"
                            >
                              {job.title}
                            </a>
                          </h3>
                          {job.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                              Featured
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              Remote
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              job.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.type && (
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {job.type}
                      </span>
                    )}
                    {job.category && (
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize">
                        {job.category}
                      </span>
                    )}
                    {job.experience && (
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 capitalize">
                        {job.experience}
                      </span>
                    )}
                    {job.salary && (
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                        ${job.salary.min?.toLocaleString()} - $
                        {job.salary.max?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Botão para expandir/recolher */}
                  <button
                    onClick={() => toggleExpanded(job.id)}
                    className="text-[#0476D9] hover:text-[#0366C4] text-sm font-medium flex items-center gap-2"
                  >
                    {expandedItems.has(job.id)
                      ? "Hide details"
                      : "View details"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.has(job.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onEdit?.(job)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit job"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                    title="Ver link da vaga"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleLinkedInPost(job)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Postar no LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTwitterPost(job)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Postar no Twitter/X"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRedditPost(job)}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                    title="Postar no Reddit"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(job)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      job.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                    title={job.isActive ? "Desativar vaga" : "Ativar vaga"}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleRemote(job)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      job.isRemote
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    title={
                      job.isRemote
                        ? "Marcar como não-remote"
                        : "Marcar como remote"
                    }
                  >
                    {job.isRemote ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(job)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {expandedItems.has(job.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Description
                      </h4>
                      <div
                        className="text-sm text-gray-600 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Requirements
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-[#0476D9] mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Benefits
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.tags && job.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                      {job.applicationUrl && (
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline inline-flex items-center gap-2 px-4 py-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Apply Now
                        </a>
                      )}
                      <button
                        onClick={() => handleLinkedInPost(job)}
                        className="btn-primary inline-flex items-center gap-2 px-4 py-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        Post to LinkedIn
                      </button>
                      <button
                        onClick={() => handleTwitterPost(job)}
                        className="btn-outline inline-flex items-center gap-2 px-4 py-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                      >
                        <Twitter className="w-4 h-4" />
                        Post to Twitter/X
                      </button>
                      <button
                        onClick={() => handleRedditPost(job)}
                        className="btn-outline inline-flex items-center gap-2 px-4 py-2 text-orange-500 border-orange-500 hover:bg-orange-50"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Post to Reddit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* LinkedIn Post Modal */}
      {selectedJobForLinkedIn && (
        <LinkedInPostModal
          job={selectedJobForLinkedIn}
          onClose={() => setSelectedJobForLinkedIn(null)}
          isOpen={!!selectedJobForLinkedIn}
        />
      )}

      {/* Twitter Post Modal */}
      {selectedJobForTwitter && (
        <TwitterPostModal
          job={selectedJobForTwitter}
          onClose={() => setSelectedJobForTwitter(null)}
          isOpen={!!selectedJobForTwitter}
        />
      )}

      {/* Reddit Post Modal */}
      {selectedJobForReddit && (
        <RedditPostModal
          job={selectedJobForReddit}
          onClose={() => setSelectedJobForReddit(null)}
          isOpen={!!selectedJobForReddit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            jobId: "",
            jobTitle: "",
            companyName: "",
            isDeleting: false,
          })
        }
        onConfirm={handleConfirmDelete}
        jobTitle={deleteModal.jobTitle}
        companyName={deleteModal.companyName}
        isLoading={deleteModal.isDeleting}
      />

      {/* Clear History Confirmation Modal */}
      {clearHistoryModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Clear Imported History
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to clear all imported job history? This will
              remove all records of imported jobs but will not delete the actual
              jobs from your database.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setClearHistoryModal({ isOpen: false, isClearing: false })
                }
                disabled={clearHistoryModal.isClearing}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                disabled={clearHistoryModal.isClearing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {clearHistoryModal.isClearing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
