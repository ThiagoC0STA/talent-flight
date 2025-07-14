"use client";

import { useState, useEffect } from "react";
import { BarChart3, MousePointer, CheckCircle, XCircle, Calendar, Building2 } from "lucide-react";
import { trackingService } from "@/lib/jobs";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";

interface ClickSummary {
  totalClicks: number;
  validClicks: number;
  invalidClicks: number;
  clicksByJob: Array<{
    jobTitle: string;
    jobCompany: string;
    totalClicks: number;
    validClicks: number;
    invalidClicks: number;
    lastClick: string | null;
  }>;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<ClickSummary>({
    totalClicks: 0,
    validClicks: 0,
    invalidClicks: 0,
    clicksByJob: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await trackingService.getClickSummary();
      setSummary(data);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#011640]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F3F7FA] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#011640] mb-6 text-center">
            Acesso Negado
          </h1>
          <p className="text-[#010D26] text-center">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversionRate = () => {
    if (summary.totalClicks === 0) return 0;
    return ((summary.validClicks / summary.totalClicks) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#011640] mb-2">
            Analytics de Candidaturas
          </h1>
          <p className="text-[#010D26]">
            Acompanhe o desempenho dos links de aplicação
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#011640]">Carregando estatísticas...</p>
          </div>
        ) : (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#010D26] mb-1">Total de Cliques</p>
                    <p className="text-3xl font-bold text-[#011640]">{summary.totalClicks}</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-[#0476D9]" />
                </div>  
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#010D26] mb-1">Cliques Válidos</p>
                    <p className="text-3xl font-bold text-green-600">{summary.validClicks}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#010D26] mb-1">Cliques Inválidos</p>
                    <p className="text-3xl font-bold text-red-600">{summary.invalidClicks}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#010D26] mb-1">Taxa de Conversão</p>
                    <p className="text-3xl font-bold text-[#0476D9]">{getConversionRate()}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-[#0476D9]" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#010D26] mb-1">Vagas com Problemas</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {summary.clicksByJob.filter(job => 
                        job.invalidClicks > 0 && job.invalidClicks >= job.validClicks
                      ).length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-orange-600" />
                </div>
              </Card>
            </div>

            {/* Vagas com Problemas */}
            {summary.clicksByJob.filter(job => 
              job.invalidClicks > 0 && job.invalidClicks >= job.validClicks
            ).length > 0 && (
              <Card className="p-6 mb-6 border-l-4 border-orange-500">
                <h2 className="text-xl font-semibold text-[#011640] mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  Vagas que Precisam de Atenção
                </h2>
                <div className="space-y-3">
                  {summary.clicksByJob
                    .filter(job => job.invalidClicks > 0 && job.invalidClicks >= job.validClicks)
                    .map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#011640]">{job.jobTitle}</p>
                          <p className="text-sm text-[#010D26]">{job.jobCompany}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-orange-600">
                            {job.invalidClicks} cliques inválidos
                          </p>
                          <p className="text-xs text-[#010D26]">
                            Taxa: {((job.validClicks / job.totalClicks) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {/* Tabela de Vagas */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#011640] mb-6">
                Desempenho por Vaga
              </h2>
              
              {summary.clicksByJob.length === 0 ? (
                <div className="text-center py-8">
                  <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-[#010D26]">Nenhum clique registrado ainda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5EAF1]">
                        <th className="text-left py-3 px-4 text-[#011640] font-semibold">Vaga</th>
                        <th className="text-center py-3 px-4 text-[#011640] font-semibold">Total</th>
                        <th className="text-center py-3 px-4 text-[#011640] font-semibold">Válidos</th>
                        <th className="text-center py-3 px-4 text-[#011640] font-semibold">Inválidos</th>
                        <th className="text-center py-3 px-4 text-[#011640] font-semibold">Taxa</th>
                        <th className="text-center py-3 px-4 text-[#011640] font-semibold">Último Clique</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.clicksByJob.map((job, index) => {
                        const conversionRate = job.totalClicks > 0 
                          ? ((job.validClicks / job.totalClicks) * 100).toFixed(1)
                          : '0.0';
                        
                        return (
                          <tr key={index} className="border-b border-[#E5EAF1] hover:bg-[#F3F7FA]">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-[#011640]">{job.jobTitle}</p>
                                <p className="text-sm text-[#010D26] flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {job.jobCompany}
                                </p>
                              </div>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span className="font-semibold text-[#011640]">{job.totalClicks}</span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span className="text-green-600 font-semibold">{job.validClicks}</span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span className="text-red-600 font-semibold">{job.invalidClicks}</span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span className={`font-semibold ${
                                parseFloat(conversionRate) >= 80 ? 'text-green-600' :
                                parseFloat(conversionRate) >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {conversionRate}%
                              </span>
                            </td>
                            <td className="text-center py-4 px-4">
                              <span className="text-sm text-[#010D26] flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(job.lastClick)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
} 