import React, { useState } from 'react';
import { 
  BarChart3, ShieldAlert, CheckCircle2, Building2, Users, 
  AlertTriangle, Check, ArrowRight, Eye, Search, CalendarCheck,
  Download, FileCode, ShieldCheck, Database
} from 'lucide-react';
import { ReportedIssue } from '../types';
import { AdminService } from '../services/adminService';

interface Props {
  onBackToPatient: () => void;
}

export const AdminPortalView: React.FC<Props> = ({ onBackToPatient }) => {
  const [issues, setIssues] = useState<ReportedIssue[]>(() => AdminService.getReportedIssues());
  const [selectedIssue, setSelectedIssue] = useState<ReportedIssue | null>(null);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'plano_nao_atende' | 'telefone_desatualizado' | 'horario_invalido' | 'inappropriate_review'>('ALL');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const networkMetrics = AdminService.getNetworkMetrics();

  // Successful Match Funnel Metrics
  const metrics = {
    searches: networkMetrics.successfulMatchFunnel.searches,
    resultsViewed: networkMetrics.successfulMatchFunnel.resultsViewed,
    profilesViewed: networkMetrics.successfulMatchFunnel.profilesViewed,
    appointmentRequests: networkMetrics.successfulMatchFunnel.appointmentRequests,
    confirmedAppointments: networkMetrics.successfulMatchFunnel.confirmedAppointments,
    successfulMatchRate: `${networkMetrics.successfulMatchFunnel.matchRatePercentage}%`,
    outdatedReportedCount: issues.length,
  };

  const filteredIssues = issues.filter(issue => {
    if (reportFilter === 'ALL') return true;
    return issue.issueType === reportFilter;
  });

  const handleResolveIssue = (id: string) => {
    AdminService.resolveReport(id, reviewNote);
    setIssues(AdminService.getReportedIssues());
    setSelectedIssue(null);
    setReviewNote('');
  };

  const handleExportAuditBundle = () => {
    const bundle = {
      product: 'Cliniq',
      tagline: 'Encontre quem atende seu plano. Agende sem complicação.',
      exportedAt: new Date().toISOString(),
      architectureStatus: 'Exit-Ready / Production-Hardened',
      dataClassification: 'LGPD Art. 6º, III Minimized',
      networkMetrics,
      auditQueue: issues,
      availableSpecs: [
        'ARCHITECTURE.md',
        'DATA_MODEL.md',
        'COMMERCIAL.md',
        'INTEGRATIONS.md',
        'SECURITY_LGPD.md'
      ]
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliniq_exit_ready_audit_bundle_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Pacote de Due Diligence exportado com sucesso.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in-up">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1C2421] text-white rounded-2xl px-6 py-4 animate-fade-in-up">
        <div>
          <span className="text-xs font-semibold text-[#34D399]">Painel de Governança & Qualidade</span>
          <h1 className="text-lg font-bold text-white">Cliniq Admin</h1>
          <p className="text-xs text-[#9CA3AF]">
            Monitoramento de Successful Match e auditoria do Cliniq Verified.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToPatient}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#2E3834] hover:bg-[#3E4A45] text-xs font-semibold text-white transition-colors"
        >
          Voltar para visão do paciente
        </button>
      </div>

      {/* Exit-Ready & Due Diligence Asset Banner */}
      <div className="bg-[#FAF9F5] rounded-3xl p-5 md:p-6 border border-[#0F5A47]/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0F5A47]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5A47]">
              Ativo Preparado para Aquisição & Transferência (Exit-Ready)
            </span>
          </div>
          <p className="text-xs text-[#525A56] leading-relaxed">
            Arquitetura desacoplada, modelos canônicos compatíveis com PostgreSQL/CloudSQL, ausência de credenciais expostas e documentação completa de Due Diligence (Arquitetura, Dados, Comercial, Integrações e LGPD).
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportAuditBundle}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5A47] hover:bg-[#0c4738] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Pacote de Auditoria (JSON)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-[#E8F3EE] border border-[#0F5A47]/30 text-[#0F5A47] text-xs rounded-xl flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary Product Metric: Successful Match Funnel */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6E5DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1A1C1A]">Métrica Central: Successful Match</h2>
              <span className="text-xs font-bold text-[#0F5A47] bg-[#E8F3EE] px-2 py-0.5 rounded-md">
                Meta do Produto
              </span>
            </div>
            <p className="text-xs text-[#68706D] mt-0.5">
              Paciente encontrou opção compatível com seu plano + conseguiu solicitar ou confirmar o agendamento.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#68706D] block">Taxa de Sucesso (Match Rate)</span>
            <span className="text-2xl font-black text-[#0F5A47] tabular-nums">
              {metrics.successfulMatchRate}
            </span>
          </div>
        </div>

        {/* Funnel grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
            <span className="text-[11px] text-[#68706D] block">1. Buscas</span>
            <strong className="text-lg font-bold text-[#1A1C1A] tabular-nums">{metrics.searches}</strong>
            <span className="text-[10px] text-[#838A87] block mt-0.5">100% dos fluxos</span>
          </div>

          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
            <span className="text-[11px] text-[#68706D] block">2. Resultados</span>
            <strong className="text-lg font-bold text-[#1A1C1A] tabular-nums">{metrics.resultsViewed}</strong>
            <span className="text-[10px] text-[#838A87] block mt-0.5">97% com opções</span>
          </div>

          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
            <span className="text-[11px] text-[#68706D] block">3. Perfis Vistos</span>
            <strong className="text-lg font-bold text-[#1A1C1A] tabular-nums">{metrics.profilesViewed}</strong>
            <span className="text-[10px] text-[#838A87] block mt-0.5">64% engajados</span>
          </div>

          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
            <span className="text-[11px] text-[#68706D] block">4. Solicitações</span>
            <strong className="text-lg font-bold text-[#1A1C1A] tabular-nums">{metrics.appointmentRequests}</strong>
            <span className="text-[10px] text-[#838A87] block mt-0.5">35% iniciadas</span>
          </div>

          <div className="p-3 bg-[#E8F3EE] rounded-xl border border-[#D0E2D9]">
            <span className="text-[11px] text-[#0F5A47] block font-semibold">5. Confirmados</span>
            <strong className="text-lg font-bold text-[#0F5A47] tabular-nums">{metrics.confirmedAppointments}</strong>
            <span className="text-[10px] text-[#0F5A47] block mt-0.5">Match Concluído</span>
          </div>
        </div>
      </div>

      {/* Network Health: Clinics & Professionals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clinics Health */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0F5A47]" />
            <h3 className="font-bold text-sm text-[#1A1C1A]">Clínicas Cadastradas</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
              <span className="text-[#68706D] block text-[11px]">Ativas</span>
              <strong className="text-base font-bold text-[#0F5A47] tabular-nums">42</strong>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
              <span className="text-[#68706D] block text-[11px]">Pendentes</span>
              <strong className="text-base font-bold text-[#EAB308] tabular-nums">4</strong>
            </div>
            <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA]">
              <span className="text-[#991B1B] block text-[11px]">Precisa revisão</span>
              <strong className="text-base font-bold text-[#DC2626] tabular-nums">2</strong>
            </div>
          </div>
        </div>

        {/* Professionals Health */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F5A47]" />
            <h3 className="font-bold text-sm text-[#1A1C1A]">Profissionais Credenciados</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
              <span className="text-[#68706D] block text-[11px]">Ativos auditados</span>
              <strong className="text-base font-bold text-[#0F5A47] tabular-nums">86</strong>
            </div>
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E5DF]">
              <span className="text-[#68706D] block text-[11px]">Em verificação</span>
              <strong className="text-base font-bold text-[#EAB308] tabular-nums">7</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Reported Outdated Information Queue */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6E5DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1A1C1A]">Informações Reportadas por Pacientes</h2>
            <p className="text-xs text-[#68706D]">
              Casos em que o usuário informou divergência de plano, telefone ou atendimento
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF2F2] text-[#991B1B] rounded-lg">
              {issues.filter(i => i.status === 'pendente').length} pendentes
            </span>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pb-1">
          <button
            type="button"
            onClick={() => setReportFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              reportFilter === 'ALL' ? 'bg-[#0F5A47] text-white' : 'bg-[#FAF9F5] text-[#525A56] hover:bg-[#EFEFEA]'
            }`}
          >
            Todos ({issues.length})
          </button>
          <button
            type="button"
            onClick={() => setReportFilter('plano_nao_atende')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              reportFilter === 'plano_nao_atende' ? 'bg-[#0F5A47] text-white' : 'bg-[#FAF9F5] text-[#525A56] hover:bg-[#EFEFEA]'
            }`}
          >
            Plano divergente
          </button>
          <button
            type="button"
            onClick={() => setReportFilter('telefone_desatualizado')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              reportFilter === 'telefone_desatualizado' ? 'bg-[#0F5A47] text-white' : 'bg-[#FAF9F5] text-[#525A56] hover:bg-[#EFEFEA]'
            }`}
          >
            Telefone / WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setReportFilter('horario_invalido')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              reportFilter === 'horario_invalido' ? 'bg-[#0F5A47] text-white' : 'bg-[#FAF9F5] text-[#525A56] hover:bg-[#EFEFEA]'
            }`}
          >
            Horário / Perfil
          </button>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.status === 'resolvido'
                  ? 'bg-[#F9FAF9] border-[#E5E7EB] opacity-60'
                  : 'bg-white border-[#E6E5DE] shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'pendente'
                      ? 'bg-[#FEE2E2] text-[#991B1B]'
                      : 'bg-[#E8F3EE] text-[#0F5A47]'
                  }`}>
                    {item.status === 'pendente' ? 'Pendente de checagem' : 'Revisado e atualizado'}
                  </span>
                  <span className="text-xs text-[#838A87]">· {item.reportedAt}</span>
                </div>

                <h3 className="text-sm font-bold text-[#1A1C1A]">
                  {item.clinicName} — <span className="text-[#68706D]">{item.professionalName}</span>
                </h3>
                <p className="text-xs text-[#48504C]">
                  <strong>Plano citado:</strong> {item.planReported} · <em>"{item.description}"</em>
                </p>
              </div>

              {item.status === 'pendente' && (
                <button
                  type="button"
                  onClick={() => setSelectedIssue(item)}
                  className="self-start sm:self-center px-4 py-2 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] transition-colors"
                >
                  Revisar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {selectedIssue && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedIssue(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[#1A1C1A]">Revisar Apontamento do Paciente</h3>
            <div className="p-3 bg-[#FAF9F5] rounded-xl text-xs space-y-1 text-[#48504C]">
              <p><strong>Clínica:</strong> {selectedIssue.clinicName}</p>
              <p><strong>Plano:</strong> {selectedIssue.planReported}</p>
              <p><strong>Relato:</strong> {selectedIssue.description}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-1">
                Ação tomada pela moderação Cliniq:
              </label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Ex.: Ligamos para a recepção da clínica e confirmamos a suspensão do credenciamento. Plano removido do perfil..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="flex-1 py-2 rounded-xl border border-[#D5D8D4] text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => handleResolveIssue(selectedIssue.id)}
                className="flex-1 py-2 rounded-xl bg-[#0F5A47] text-white text-xs font-semibold"
              >
                Concluir revisão e atualizar dados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
