/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  Smartphone, 
  Monitor, 
  Layers, 
  HeartHandshake, 
  Info,
  BookOpen,
  Share2,
  Users
} from 'lucide-react';

import { Campaign, CampaignStats } from './types';
import { INITIAL_CAMPAIGNS, INITIAL_STATS } from './mockData';
import AdminPortal from './components/AdminPortal';
import ParticipantView from './components/ParticipantView';
import PhoneFrame from './components/PhoneFrame';

export default function App() {
  // Application State
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('camp-1');
  
  // Stats state for each campaign (stored as map or managed dynamically)
  const [campaignStats, setCampaignStats] = useState<{ [key: string]: CampaignStats }>({
    'camp-1': INITIAL_STATS
  });

  // Presentation Mode: 'dual' | 'admin' | 'participant'
  const [viewMode, setViewMode] = useState<'dual' | 'admin' | 'participant'>('dual');

  // Handle addition of a new campaign from the Admin Portal wizard
  const handleAddCampaign = (newCamp: Campaign) => {
    setCampaigns(prev => [newCamp, ...prev]);
    setActiveCampaignId(newCamp.id);
    
    // Initialize empty statistical summary for the brand new campaign
    const freshStats: CampaignStats = {
      participantsCount: 0,
      avgScore: 0,
      successRate: 0,
      ageDistribution: [
        { range: "15-24 ans", count: 0, percentage: 0 },
        { range: "25-40 ans", count: 0, percentage: 0 },
        { range: "40 ans et +", count: 0, percentage: 0 }
      ],
      regionDistribution: [
        { region: "Parakou Centre", count: 0 },
        { region: "Parakou Nord", count: 0 },
        { region: "Parakou Sud", count: 0 }
      ],
      genderDistribution: [
        { gender: "Femmes", count: 0, percentage: 0 },
        { gender: "Hommes", count: 0, percentage: 0 }
      ],
      surveySummary: newCamp.surveyQuestions.map(sq => ({
        questionId: sq.id,
        questionText: sq.question,
        answers: sq.options.map(opt => ({ option: opt, count: 0, percentage: 0 }))
      }))
    };

    setCampaignStats(prev => ({
      ...prev,
      [newCamp.id]: freshStats
    }));
  };

  const handleSelectCampaign = (id: string) => {
    setActiveCampaignId(id);
  };

  // Get active stats and active campaign
  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
  const activeStats = campaignStats[activeCampaignId] || {
    participantsCount: 0,
    avgScore: 0,
    successRate: 0,
    ageDistribution: [],
    regionDistribution: [],
    genderDistribution: [],
    surveySummary: []
  };

  // When a participant completes the interactive quiz & survey in the live phone preview,
  // we update the aggregate stats in-memory in real-time.
  const handleParticipantComplete = (participantData: {
    score: number;
    totalQuestions: number;
    passed: boolean;
    gender: string;
    age: string;
    region: string;
    surveyAnswers: { [key: string]: string };
  }) => {
    const currentStats = campaignStats[activeCampaignId] || activeStats;
    const prevCount = currentStats.participantsCount;
    const newCount = prevCount + 1;

    // Recalculate average score
    const newScorePercent = Math.round((participantData.score / participantData.totalQuestions) * 100);
    const newAvgScore = prevCount === 0 
      ? newScorePercent 
      : Math.round(((currentStats.avgScore * prevCount) + newScorePercent) / newCount);

    // Recalculate success rate
    const prevPassedCount = Math.round((currentStats.successRate / 100) * prevCount);
    const newPassedCount = prevPassedCount + (participantData.passed ? 1 : 0);
    const newSuccessRate = Math.round((newPassedCount / newCount) * 100);

    // Update gender distribution
    const updatedGender = currentStats.genderDistribution.map(g => {
      let isMatch = g.gender === 'Femmes' && participantData.gender === 'Femme';
      if (!isMatch) isMatch = g.gender === 'Hommes' && participantData.gender === 'Homme';
      
      const newCountForGender = g.count + (isMatch ? 1 : 0);
      return {
        ...g,
        count: newCountForGender,
        percentage: 0 // Will recalculate below
      };
    });
    // Adjust percentages
    const totalGenderCount = updatedGender.reduce((acc, curr) => acc + curr.count, 0);
    const finalGender = updatedGender.map(g => ({
      ...g,
      percentage: totalGenderCount > 0 ? Math.round((g.count / totalGenderCount) * 100) : 0
    }));

    // Update age distribution
    const updatedAge = currentStats.ageDistribution.map(a => {
      const isMatch = a.range === participantData.age;
      const newCountForAge = a.count + (isMatch ? 1 : 0);
      return {
        ...a,
        count: newCountForAge,
        percentage: 0
      };
    });
    const totalAgeCount = updatedAge.reduce((acc, curr) => acc + curr.count, 0);
    const finalAge = updatedAge.map(a => ({
      ...a,
      percentage: totalAgeCount > 0 ? Math.round((a.count / totalAgeCount) * 100) : 0
    }));

    // Update region distribution
    const finalRegion = currentStats.regionDistribution.map(r => {
      const isMatch = r.region === participantData.region;
      return {
        ...r,
        count: r.count + (isMatch ? 1 : 0)
      };
    });

    // Update survey answers summaries
    const finalSurveySummary = currentStats.surveySummary.map(survey => {
      const participantAnswer = participantData.surveyAnswers[survey.questionId];
      const updatedAnswers = survey.answers.map(ans => {
        const isMatch = ans.option === participantAnswer;
        return {
          ...ans,
          count: ans.count + (isMatch ? 1 : 0),
          percentage: 0
        };
      });

      const totalAnswers = updatedAnswers.reduce((acc, curr) => acc + curr.count, 0);
      const finalAnswers = updatedAnswers.map(ans => ({
        ...ans,
        percentage: totalAnswers > 0 ? Math.round((ans.count / totalAnswers) * 100) : 0
      }));

      return {
        ...survey,
        answers: finalAnswers
      };
    });

    // Update State
    setCampaignStats(prev => ({
      ...prev,
      [activeCampaignId]: {
        participantsCount: newCount,
        avgScore: newAvgScore,
        successRate: newSuccessRate,
        genderDistribution: finalGender,
        ageDistribution: finalAge,
        regionDistribution: finalRegion,
        surveySummary: finalSurveySummary
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-teal-500 selection:text-white">
      
      {/* Dynamic Top App Banner */}
      <header className="bg-slate-950 border-b border-slate-800 py-3.5 px-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 text-slate-950 p-2 rounded-xl shadow-md shrink-0 font-black tracking-tight text-sm flex items-center justify-center">
            ST
          </div>
          <div className="space-y-0.5">
            <h1 className="text-white text-base font-extrabold tracking-tight flex items-center gap-2">
              SensiTech <span className="text-teal-400 text-xs font-bold px-2 py-0.5 bg-teal-950 border border-teal-800/60 rounded-full">DÉMO PILOTE</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Prototype interactif d'évaluation d'impact en milieu sensible (ONG & Anonymat strict)
            </p>
          </div>
        </div>

        {/* Navigation / Switch View Modes */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('dual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'dual' 
                ? 'bg-teal-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vue côte-à-côte"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vue Double</span>
          </button>
          
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'admin' 
                ? 'bg-teal-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Portail Administrateur"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Espace Admin</span>
          </button>

          <button
            onClick={() => setViewMode('participant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'participant' 
                ? 'bg-teal-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Simulation Mobile Participant"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vue Mobile</span>
          </button>
        </div>

      </header>

      {/* Helper Instructional Banner (Only visible in 'dual' mode to guide client) */}
      {viewMode === 'dual' && (
        <div className="bg-gradient-to-r from-teal-950 to-slate-950 border-b border-teal-900/40 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-xs text-teal-100">
              <strong className="text-white">Comment tester ce prototype ?</strong> Jouez le rôle du participant sur le smartphone virtuel de droite. Vos réponses impacteront instantanément le tableau de bord à gauche !
            </p>
          </div>
          <div className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg">
            Sexe, Âge et Zone sont recueillis de manière dissociée pour respecter l'anonymat.
          </div>
        </div>
      )}

      {/* Main Dynamic View Layout */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* VIEW 1: DUAL MODE (SIDE BY SIDE) */}
        {viewMode === 'dual' && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            
            {/* Left side: Admin Portal */}
            <div className="flex-1 flex flex-col min-h-0 lg:border-r border-slate-800">
              <AdminPortal 
                campaigns={campaigns}
                stats={activeStats}
                onAddCampaign={handleAddCampaign}
                onSelectCampaign={handleSelectCampaign}
                activeCampaignId={activeCampaignId}
              />
            </div>

            {/* Right side: Mobile Simulation */}
            <div className="w-full lg:w-[460px] bg-slate-950 flex flex-col items-center justify-center p-6 border-t lg:border-t-0 border-slate-800 shrink-0 overflow-y-auto">
              <div className="space-y-4 w-full">
                <div className="text-center space-y-1">
                  <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest bg-teal-950 px-2.5 py-1 rounded-full border border-teal-900/50">
                    Aperçu Mobile Participant
                  </span>
                  <p className="text-[10px] text-slate-500">Simule la vue d'un smartphone 3G d'entrée de gamme</p>
                </div>

                <PhoneFrame>
                  <ParticipantView 
                    campaign={activeCampaign}
                    onComplete={handleParticipantComplete}
                  />
                </PhoneFrame>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: FULL WIDTH ADMIN PORTAL */}
        {viewMode === 'admin' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            <AdminPortal 
              campaigns={campaigns}
              stats={activeStats}
              onAddCampaign={handleAddCampaign}
              onSelectCampaign={handleSelectCampaign}
              activeCampaignId={activeCampaignId}
            />
          </div>
        )}

        {/* VIEW 3: CENTERED SMARTPHONE FOR PARTICIPANTS */}
        {viewMode === 'participant' && (
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-md w-full space-y-5">
              <div className="text-center space-y-2">
                <h3 className="text-white text-base font-bold">Vue Smartphone - Participant</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Utilisez cet écran pour tester le parcours d'un citoyen répondant de manière totalement confidentielle au questionnaire.
                </p>
              </div>

              <PhoneFrame>
                <ParticipantView 
                  campaign={activeCampaign}
                  onComplete={handleParticipantComplete}
                />
              </PhoneFrame>
            </div>
          </div>
        )}

      </main>

      {/* Prototype Status Bar Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-6 py-2.5 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>SensiTech Pilote MVP &mdash; Thématique Sensible VBG</span>
        </div>
        <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Statut : Prêt pour évaluation client
        </div>
      </footer>

    </div>
  );
}
