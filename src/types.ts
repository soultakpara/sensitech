/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  rationale: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
  isAnonymous: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'draft' | 'archived';
  quizThreshold: number; // e.g., 80% (which means 4 out of 5 questions)
  quizQuestions: QuizQuestion[];
  surveyQuestions: SurveyQuestion[];
}

export interface AgeDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface RegionDistribution {
  region: string;
  count: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

export interface CampaignStats {
  participantsCount: number;
  avgScore: number;
  successRate: number; // % of participants who passed the quiz (>= threshold)
  ageDistribution: AgeDistribution[];
  regionDistribution: RegionDistribution[];
  genderDistribution: GenderDistribution[];
  surveySummary: {
    questionId: string;
    questionText: string;
    answers: { option: string; count: number; percentage: number }[];
  }[];
}

export interface CertificateRequest {
  id: string;
  campaignId: string;
  recipientName: string;
  phoneNumber: string; // clearly marked as separate and optional
  email?: string;
  dateRequested: string;
  isDelivered: boolean;
}
