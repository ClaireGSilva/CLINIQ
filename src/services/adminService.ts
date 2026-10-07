/**
 * Admin & Governance Service
 * 
 * Manages Cliniq Verified audit queue, user report triage, and the Successful Match funnel metrics.
 */

import { ReportedIssue, Clinic, Professional } from '../types';
import { INITIAL_REPORTED_ISSUES, DEMO_CLINICS, MOCK_PROFESSIONALS } from '../data/demoData';

const ADMIN_REPORTS_KEY = 'cliniq_admin_reports_v1';

export interface NetworkHealthMetrics {
  totalClinics: number;
  activeClinics: number;
  pendingClinics: number;
  reportedClinics: number;
  totalProviders: number;
  activeProviders: number;
  pendingProviders: number;
  successfulMatchFunnel: {
    searches: number;
    resultsViewed: number;
    profilesViewed: number;
    appointmentRequests: number;
    confirmedAppointments: number;
    matchRatePercentage: number;
  };
}

export class AdminService {
  static getReportedIssues(): ReportedIssue[] {
    try {
      const stored = localStorage.getItem(ADMIN_REPORTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return INITIAL_REPORTED_ISSUES;
  }

  static saveReportedIssues(issues: ReportedIssue[]): void {
    try {
      localStorage.setItem(ADMIN_REPORTS_KEY, JSON.stringify(issues));
    } catch {
      // Ignore
    }
  }

  static submitUserReport(data: Omit<ReportedIssue, 'id' | 'reportedAt' | 'status'>): ReportedIssue {
    const newReport: ReportedIssue = {
      ...data,
      id: `rep-${Date.now()}`,
      reportedAt: 'Agora',
      status: 'pendente',
    };
    const current = this.getReportedIssues();
    this.saveReportedIssues([newReport, ...current]);
    return newReport;
  }

  static resolveReport(id: string, note?: string): void {
    const current = this.getReportedIssues();
    const updated = current.map(item => item.id === id ? { ...item, status: 'resolvido' as const } : item);
    this.saveReportedIssues(updated);
  }

  static getNetworkMetrics(): NetworkHealthMetrics {
    const reports = this.getReportedIssues();
    const pendingReportsCount = reports.filter(r => r.status === 'pendente').length;

    return {
      totalClinics: DEMO_CLINICS.length + 36, // Scaled for demo
      activeClinics: DEMO_CLINICS.length + 34,
      pendingClinics: 2,
      reportedClinics: pendingReportsCount,
      totalProviders: MOCK_PROFESSIONALS.length + 80,
      activeProviders: MOCK_PROFESSIONALS.length + 76,
      pendingProviders: 4,
      successfulMatchFunnel: {
        searches: 1420,
        resultsViewed: 1380,
        profilesViewed: 890,
        appointmentRequests: 312,
        confirmedAppointments: 248,
        matchRatePercentage: 79.5,
      },
    };
  }
}
