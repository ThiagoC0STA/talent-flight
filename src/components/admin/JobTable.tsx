import { Edit, Eye, Trash2, Linkedin, Globe, Building } from "lucide-react";
import { Job } from "@/types/job";
import Image from "next/image";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LinkedInPostModal from "./LinkedInPostModal";

function getExperienceColor(experience?: string) {
  const colors = {
    intern: "bg-green-100 text-green-800",
    junior: "bg-blue-100 text-blue-800",
    "junior-mid": "bg-cyan-100 text-cyan-800",
    mid: "bg-yellow-100 text-yellow-800",
    "mid-senior": "bg-orange-100 text-orange-800",
    senior: "bg-purple-100 text-purple-800",
    between: "bg-gray-100 text-gray-800",
  };
  if (!experience) return "bg-gray-100 text-gray-800";
  return (
    colors[experience as keyof typeof colors] || "bg-gray-100 text-gray-800"
  );
}

interface JobTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onToggleActive: (job: Job) => void;
  onToggleRemote: (job: Job) => void;
  loading?: boolean;
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

export default function JobTable({
  jobs,
  onEdit,
  onDelete,
  onToggleRemote,
  loading,
}: JobTableProps) {
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

  const [linkedInModal, setLinkedInModal] = useState<{
    isOpen: boolean;
    job: Job | null;
  }>({
    isOpen: false,
    job: null,
  });

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
      // Marcar como deletando
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

      await onDelete(deleteModal.jobId);
      // Só fecha a modal depois que o delete for completado com sucesso
      setDeleteModal({
        isOpen: false,
        jobId: "",
        jobTitle: "",
        companyName: "",
        isDeleting: false,
      });
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
      // Não fecha a modal se houver erro, mas para o loading
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleLinkedInClick = (job: Job) => {
    setLinkedInModal({
      isOpen: true,
      job,
    });
  };
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto">
            {" "}
          </div>
        </div>

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
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Job
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
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
                      <div>
                        <p className="font-medium text-gray-900">
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
                        </p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.company}
                  </td>
                  <td className="px-6 py-4">
                    {job.experience ? (
                      <span
                        className={`inline-flex text-nowrap px-2 py-1 text-xs font-medium rounded-full capitalize ${getExperienceColor(
                          job.experience
                        )}`}
                      >
                        {job.experience}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        job.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(job)}
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
                        onClick={() => handleLinkedInClick(job)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Postar no LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleRemote(job)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          job.isRemote
                            ? "text-green-600 hover:bg-green-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        title={job.isRemote ? "Marcar como não-remote" : "Marcar como remote"}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
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
                      <h3 className="font-medium text-gray-900 mb-1">
                        <a
                          href={`/job/${slugify(job.title)}-at-${slugify(
                            job.company
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-[#0476D9]"
                        >
                          {job.title}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit job"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Ver link da vaga"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleLinkedInClick(job)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Postar no LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleRemote(job)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        job.isRemote
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      title={job.isRemote ? "Marcar como não-remote" : "Marcar como remote"}
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

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {job.experience && (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getExperienceColor(
                        job.experience
                      )}`}
                    >
                      {job.experience}
                    </span>
                  )}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      job.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      {/* LinkedIn Post Modal */}
      <LinkedInPostModal
        isOpen={linkedInModal.isOpen}
        onClose={() =>
          setLinkedInModal({
            isOpen: false,
            job: null,
          })
        }
        job={linkedInModal.job}
      />
    </>
  );
}
