/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Plus, 
  Share2, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Copy,
  PlusCircle,
  FileSpreadsheet,
  Check,
  Smartphone,
  ChevronRight,
  PieChart,
  HelpCircle,
  Info,
  MapPin
} from 'lucide-react';
import { Campaign, CampaignStats, QuizQuestion, SurveyQuestion } from '../types';

interface AdminPortalProps {
  campaigns: Campaign[];
  stats: CampaignStats;
  onAddCampaign: (campaign: Campaign) => void;
  onSelectCampaign: (id: string) => void;
  activeCampaignId: string;
}

type AdminTab = 'campaigns' | 'results';

export default function AdminPortal({ 
  campaigns, 
  stats, 
  onAddCampaign, 
  onSelectCampaign,
  activeCampaignId 
}: AdminPortalProps) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@sensitech.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('results');

  // Campaign Creation Flow State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationStep, setCreationStep] = useState(1); // 1: details, 2: quiz, 3: survey, 4: sharing link

  // Form states
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignTheme, setNewCampaignTheme] = useState('Violences Basées sur le Genre (VBG) et Droits Humains');
  const [newCampaignStartDate, setNewCampaignStartDate] = useState('2026-07-10');
  const [newCampaignEndDate, setNewCampaignEndDate] = useState('2026-09-30');
  const [newCampaignThreshold, setNewCampaignThreshold] = useState(80);

  // New Quiz Questions accumulation
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'nq1',
      question: "La violence psychologique fait-elle partie des VBG définies par la législation ?",
      options: [
        "Oui, elle englobe les menaces, les humiliations et le harcèlement.",
        "Non, seules les atteintes corporelles physiques sont punies.",
        "Uniquement si elle est constatée par un huissier de justice."
      ],
      correctAnswer: "Oui, elle englobe les menaces, les humiliations et le harcèlement.",
      rationale: "La violence psychologique ou émotionnelle cause des traumatismes profonds et est explicitement reconnue comme une forme de VBG devant être combattue."
    }
  ]);
  const [currentQuizQText, setCurrentQuizQText] = useState('');
  const [currentQuizOpt1, setCurrentQuizOpt1] = useState('');
  const [currentQuizOpt2, setCurrentQuizOpt2] = useState('');
  const [currentQuizOpt3, setCurrentQuizOpt3] = useState('');
  const [currentQuizCorrect, setCurrentQuizCorrect] = useState('');
  const [currentQuizRationale, setCurrentQuizRationale] = useState('');

  // New Survey Questions accumulation
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([
    {
      id: 'ns1',
      question: "Selon vous, les victimes de VBG reçoivent-elles un accueil adéquat dans les commissariats locaux ?",
      options: [
        "Oui, l'accueil s'est beaucoup amélioré",
        "Non, elles craignent d'être jugées ou rejetées",
        "Seulement dans de rares cas d'urgence",
        "Je n'ai pas d'opinion sur ce sujet"
      ],
      isAnonymous: true // Blocked to true
    }
  ]);
  const [currentSurveyQText, setCurrentSurveyQText] = useState('');
  const [currentSurveyOpt1, setCurrentSurveyOpt1] = useState('');
  const [currentSurveyOpt2, setCurrentSurveyOpt2] = useState('');
  const [currentSurveyOpt3, setCurrentSurveyOpt3] = useState('');
  const [currentSurveyOpt4, setCurrentSurveyOpt4] = useState('');

  // Sharing states
  const [generatedShareLink, setGeneratedShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Authenticate user
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@sensitech.org' && password === 'admin123') {
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Identifiants incorrects. Veuillez utiliser admin@sensitech.org et admin123.');
    }
  };

  // Add a quiz question to list
  const handleAddQuizQuestion = () => {
    if (!currentQuizQText || !currentQuizOpt1 || !currentQuizOpt2 || !currentQuizOpt3 || !currentQuizCorrect) {
      alert("Veuillez remplir la question, les 3 options et indiquer la bonne réponse.");
      return;
    }
    const newQ: QuizQuestion = {
      id: `nq-${Date.now()}`,
      question: currentQuizQText,
      options: [currentQuizOpt1, currentQuizOpt2, currentQuizOpt3],
      correctAnswer: currentQuizCorrect,
      rationale: currentQuizRationale || "Explication d'apprentissage standard."
    };
    setQuizQuestions([...quizQuestions, newQ]);
    // reset inputs
    setCurrentQuizQText('');
    setCurrentQuizOpt1('');
    setCurrentQuizOpt2('');
    setCurrentQuizOpt3('');
    setCurrentQuizCorrect('');
    setCurrentQuizRationale('');
  };

  // Add a survey question to list
  const handleAddSurveyQuestion = () => {
    if (!currentSurveyQText || !currentSurveyOpt1 || !currentSurveyOpt2) {
      alert("Veuillez remplir au moins la question et les 2 premières options de réponses.");
      return;
    }
    const opts = [currentSurveyOpt1, currentSurveyOpt2];
    if (currentSurveyOpt3) opts.push(currentSurveyOpt3);
    if (currentSurveyOpt4) opts.push(currentSurveyOpt4);

    const newS: SurveyQuestion = {
      id: `ns-${Date.now()}`,
      question: currentSurveyQText,
      options: opts,
      isAnonymous: true // Always true by specification
    };

    setSurveyQuestions([...surveyQuestions, newS]);
    // reset inputs
    setCurrentSurveyQText('');
    setCurrentSurveyOpt1('');
    setCurrentSurveyOpt2('');
    setCurrentSurveyOpt3('');
    setCurrentSurveyOpt4('');
  };

  // Create Campaign object and save
  const handleCreateCampaignSubmit = () => {
    if (!newCampaignTitle) {
      alert("Veuillez entrer un titre pour la campagne.");
      return;
    }
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      title: newCampaignTitle,
      theme: newCampaignTheme,
      startDate: newCampaignStartDate,
      endDate: newCampaignEndDate,
      status: 'active',
      quizThreshold: Number(newCampaignThreshold),
      quizQuestions: quizQuestions.length > 0 ? quizQuestions : [],
      surveyQuestions: surveyQuestions.length > 0 ? surveyQuestions : []
    };

    onAddCampaign(newCamp);
    
    // Set simulated link
    setGeneratedShareLink(`https://sensitech.org/sensibilisation/${newCamp.id}`);
    setCreationStep(4);
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedShareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const activeCamp = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `RAPPORT EXPORT AGREGÉ - SENSTITECH\n`;
    csvContent += `Campagne : ${activeCamp.title}\n`;
    csvContent += `Thématique : ${activeCamp.theme}\n`;
    csvContent += `Période : ${activeCamp.startDate} au ${activeCamp.endDate}\n`;
    csvContent += `Participants total : ${stats.participantsCount}\n`;
    csvContent += `Taux de réussite : ${stats.successRate}%\n`;
    csvContent += `Score moyen du Quiz : ${stats.avgScore}%\n\n`;

    csvContent += `REPARTITION GENRE (AGREGEE)\n`;
    stats.genderDistribution.forEach(g => {
      csvContent += `${g.gender};${g.count};${g.percentage}%\n`;
    });
    csvContent += `\n`;

    csvContent += `REPARTITION TRANCHE D'AGE (AGREGEE)\n`;
    stats.ageDistribution.forEach(a => {
      csvContent += `${a.range};${a.count};${a.percentage}%\n`;
    });
    csvContent += `\n`;

    csvContent += `REPARTITION ZONE GEOGRAPHIQUE (AGREGEE)\n`;
    stats.regionDistribution.forEach(r => {
      csvContent += `${r.region};${r.count}\n`;
    });
    csvContent += `\n`;

    csvContent += `RESULTATS SONDAGE D'OPINION\n`;
    stats.surveySummary.forEach(s => {
      csvContent += `Question : ${s.questionText}\n`;
      s.answers.forEach(ans => {
        csvContent += `${ans.option};${ans.count};${ans.percentage}%\n`;
      });
      csvContent += `\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sensitech_rapport_${activeCamp.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedCamp = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-teal-50 rounded-2xl text-teal-700">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">SensiTech ONG</h2>
            <p className="text-sm text-slate-500">
              Espace Administrateur sécurisé de suivi de campagne
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Identifiant ou Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="admin@sensitech.org"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400">Identifiant de démo pré-rempli</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Mot de passe de démo pré-rempli : <code className="bg-slate-100 px-1 rounded">admin123</code></p>
            </div>

            <button
              id="btn-admin-login"
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
            >
              Se connecter au portail
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 flex items-start gap-2.5 text-xs text-slate-500">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Ce prototype stocke toutes ses données en mémoire locale. Aucune connexion internet ou base de données externe n'est requise.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-0 text-slate-800">
      
      {/* Top Admin Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-lg font-bold text-slate-900">Espace Administrateur ONG</h2>
          </div>
          <p className="text-xs text-slate-500">
            Campagne active : <strong className="text-slate-700 font-semibold">{selectedCamp.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Active Campaign Selector */}
          <select 
            value={activeCampaignId}
            onChange={(e) => onSelectCampaign(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <button
            id="btn-open-create-campaign"
            onClick={() => {
              setCreationStep(1);
              setShowCreateModal(true);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer une campagne
          </button>
        </div>
      </div>

      {/* Tabs Switcher Bar */}
      <div className="bg-white border-b border-slate-100 px-6 flex shrink-0">
        <button
          onClick={() => setActiveTab('results')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'results' 
              ? 'border-teal-600 text-teal-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Tableau de bord des résultats
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'campaigns' 
              ? 'border-teal-600 text-teal-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Structure de la Campagne ({campaigns.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* TAB 1: RESULTS DASHBOARD */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            
            {/* Top aggregate strict banner */}
            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
              <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-teal-900">Anonymat Absolu et Sécurité Garanti</h4>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Conformément aux normes éthiques sur les thématiques sensibles (VBG), aucune information personnelle (nom, contact) n'est enregistrée avec les réponses. <strong>Ce tableau de bord affiche exclusivement des données statistiques globales et agrégées</strong>. Aucune liste de participants individuels n'existe dans le système.
                </p>
              </div>
            </div>

            {/* KPI Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Participants Sensibilisés</span>
                  <span className="text-3xl font-black text-slate-900">{stats.participantsCount}</span>
                </div>
                <div className="p-3.5 bg-teal-50 rounded-2xl text-teal-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Taux de Réussite Moyen</span>
                  <span className="text-3xl font-black text-slate-900">{stats.successRate}%</span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Note Moyenne Quiz</span>
                  <span className="text-3xl font-black text-slate-900">{stats.avgScore}%</span>
                </div>
                <div className="p-3.5 bg-cyan-50 rounded-2xl text-cyan-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Demographics distributions charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Gender Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-teal-600" />
                  Répartition par Genre (Agrégée)
                </h4>
                
                <div className="space-y-3.5 pt-2">
                  {stats.genderDistribution.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item.gender}</span>
                        <span className="text-slate-500">{item.count} participants ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${idx === 0 ? 'bg-teal-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-teal-600" />
                  Répartition par Tranche d'âge
                </h4>

                <div className="space-y-3.5 pt-2">
                  {stats.ageDistribution.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item.range}</span>
                        <span className="text-slate-500">{item.count} participants ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-600 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Distribution par Zone (Parakou)
                </h4>

                <div className="space-y-3.5 pt-2">
                  {stats.regionDistribution.map((item, idx) => {
                    const total = stats.regionDistribution.reduce((acc, curr) => acc + curr.count, 0);
                    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.region}</span>
                          <span className="text-slate-500">{item.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-700 rounded-full" 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Survey feedback responses */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900">
                  Résultats détaillés du Sondage d'opinion anonyme
                </h4>
                
                <button
                  id="btn-export-csv"
                  onClick={handleExportCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Exporter en CSV
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stats.surveySummary.map((survey, sIdx) => (
                  <div key={survey.questionId} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      Sondage Question {sIdx + 1}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 leading-relaxed">
                      {survey.questionText}
                    </h5>

                    <div className="space-y-2 pt-1">
                      {survey.answers.map((answer, aIdx) => (
                        <div key={aIdx} className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                          <div className="flex justify-between text-[11px] font-medium text-slate-700">
                            <span>{answer.option}</span>
                            <span className="font-bold">{answer.count} votes ({answer.percentage}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full" 
                              style={{ width: `${answer.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CAMPAIGN STRUCTURE LIST */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Détail de la campagne de sensibilisation active
              </h3>
              <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full border border-teal-200">
                Statut : En cours / Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Campaign General Information Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-teal-600" />
                  Caractéristiques Générales
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Titre de l'action</span>
                    <span className="font-bold text-slate-800">{selectedCamp.title}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Thématique</span>
                    <span className="font-bold text-slate-800">{selectedCamp.theme}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Dates d'opération</span>
                    <span className="font-bold text-slate-800">Du {new Date(selectedCamp.startDate).toLocaleDateString('fr-FR')} au {new Date(selectedCamp.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Seuil de réussite exigé</span>
                    <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full inline-block">{selectedCamp.quizThreshold}% de bonnes réponses</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h5 className="text-xs font-bold text-slate-700 mb-2">Simuler la diffusion</h5>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Partagez le lien de participation auprès de la communauté via SMS ou WhatsApp pour lancer le pilote :
                    </p>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        readOnly 
                        value={`https://sensitech.org/sensibilisation/${selectedCamp.id}`}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] text-slate-600 font-mono focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://sensitech.org/sensibilisation/${selectedCamp.id}`);
                          alert("Lien copié !");
                        }}
                        className="p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] cursor-pointer"
                        title="Copier"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Module Detail */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    Quiz Éducatif ({selectedCamp.quizQuestions.length} Questions)
                  </h4>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {selectedCamp.quizQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-teal-600">Q{idx + 1}. {q.question}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold shrink-0">Correct</span>
                      </div>
                      <div className="pl-3 border-l-2 border-slate-200 text-[11px] text-slate-600 space-y-1">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={opt === q.correctAnswer ? 'text-emerald-700 font-semibold' : ''}>
                            {String.fromCharCode(65 + oIdx)}. {opt} {opt === q.correctAnswer ? '✓' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Survey Module Detail */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Sondage d'opinion ({selectedCamp.surveyQuestions.length} Questions)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCamp.surveyQuestions.map((sq, idx) => (
                  <div key={sq.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Question {idx + 1}</span>
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">Anonymat Forcé</span>
                    </div>
                    <p className="font-medium text-slate-700">{sq.question}</p>
                    <div className="text-[10px] text-slate-500 space-y-1 pl-2">
                      {sq.options.map((opt, oIdx) => (
                        <div key={oIdx}>&bull; {opt}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CREATE CAMPAIGN WIZARD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm uppercase tracking-wider">Créateur de campagne pilote</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-white/80 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>

            {/* Steps indicator */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between text-[11px] font-bold shrink-0">
              <div className="flex gap-4">
                <span className={creationStep === 1 ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'}>1. Généralités</span>
                <span className={creationStep === 2 ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'}>2. Questions Quiz</span>
                <span className={creationStep === 3 ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'}>3. Sondage</span>
                <span className={creationStep === 4 ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'}>4. Diffusion</span>
              </div>
              <span className="text-slate-500">Étape {creationStep}/4</span>
            </div>

            {/* Modal body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              
              {/* STEP 1: GENERAL INFO */}
              {creationStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Titre de la campagne</label>
                    <input 
                      type="text"
                      placeholder="Ex: Stop aux violences domestiques - Parakou Ouest"
                      value={newCampaignTitle}
                      onChange={e => setNewCampaignTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Thématique (ONG SensiTech)</label>
                    <select
                      value={newCampaignTheme}
                      onChange={e => setNewCampaignTheme(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="Violences Basées sur le Genre (VBG) et Droits Humains">Violences Basées sur le Genre (VBG) et Droits Humains</option>
                      <option value="Égalité des sexes et émancipation des filles">Égalité des sexes et émancipation des filles</option>
                      <option value="Lutte contre le mariage précoce et forcé">Lutte contre le mariage précoce et forcé</option>
                      <option value="Droits reproductifs et santé sexuelle">Droits reproductifs et santé sexuelle</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">Date de début</label>
                      <input 
                        type="date"
                        value={newCampaignStartDate}
                        onChange={e => setNewCampaignStartDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">Date de fin</label>
                      <input 
                        type="date"
                        value={newCampaignEndDate}
                        onChange={e => setNewCampaignEndDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Seuil de réussite exigé (%)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="50"
                        max="100"
                        step="10"
                        value={newCampaignThreshold}
                        onChange={e => setNewCampaignThreshold(Number(e.target.value))}
                        className="flex-1 accent-teal-600"
                      />
                      <span className="font-bold text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded border border-teal-200">{newCampaignThreshold}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Pourcentage minimal requis au quiz pour l'obtention automatique du certificat.</p>
                  </div>
                </div>
              )}

              {/* STEP 2: QUIZ CREATION */}
              {creationStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl flex gap-2 text-xs text-teal-900">
                    <Award className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
                    <p>Définissez des questions d'évaluation claires pour tester l'apprentissage de manière pédagogique.</p>
                  </div>

                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Ajouter une question</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 block">Texte de la question</label>
                      <input 
                        type="text"
                        placeholder="Ex: Quel est le numéro vert d'écoute ?"
                        value={currentQuizQText}
                        onChange={e => setCurrentQuizQText(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <input 
                        type="text" 
                        placeholder="Option A (ex: Le 136)" 
                        value={currentQuizOpt1}
                        onChange={e => setCurrentQuizOpt1(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Option B (ex: Le 112)" 
                        value={currentQuizOpt2}
                        onChange={e => setCurrentQuizOpt2(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Option C (ex: Le 118)" 
                        value={currentQuizOpt3}
                        onChange={e => setCurrentQuizOpt3(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Bonne réponse exacte</label>
                        <select
                          value={currentQuizCorrect}
                          onChange={e => setCurrentQuizCorrect(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs focus:outline-none"
                        >
                          <option value="">Sélectionner...</option>
                          {currentQuizOpt1 && <option value={currentQuizOpt1}>{currentQuizOpt1}</option>}
                          {currentQuizOpt2 && <option value={currentQuizOpt2}>{currentQuizOpt2}</option>}
                          {currentQuizOpt3 && <option value={currentQuizOpt3}>{currentQuizOpt3}</option>}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Raisonnement pédagogique (Rationale)</label>
                        <input 
                          type="text"
                          placeholder="Explication affichée après réponse"
                          value={currentQuizRationale}
                          onChange={e => setCurrentQuizRationale(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="w-full bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Insérer cette question dans le quiz
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Questions ajoutées ({quizQuestions.length})</h5>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar">
                      {quizQuestions.map((q, idx) => (
                        <div key={q.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-xs">
                          <span className="truncate max-w-[400px]">{idx + 1}. <strong>{q.question}</strong></span>
                          <button 
                            type="button" 
                            onClick={() => setQuizQuestions(quizQuestions.filter(item => item.id !== q.id))}
                            className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SURVEY CREATION */}
              {creationStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-xs text-amber-900">
                    <Lock className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <h5 className="font-bold">Anonymat Forcé Actif</h5>
                      <p className="text-[11px] leading-relaxed">Par éthique et conformité pour les questions d'avis sur les thématiques sensibles (VBG), la case "Anonyme" est cochée par défaut et ne peut pas être décochée. Vos répondants sont ainsi protégés.</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Créer une question de sondage</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 block">Intitulé de la question d'avis</label>
                      <input 
                        type="text"
                        placeholder="Ex: Avez-vous déjà assisté à des séances de médiation ?"
                        value={currentSurveyQText}
                        onChange={e => setCurrentSurveyQText(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Option 1 (ex: Oui, souvent)" 
                        value={currentSurveyOpt1}
                        onChange={e => setCurrentSurveyOpt1(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Option 2 (ex: Non, jamais)" 
                        value={currentSurveyOpt2}
                        onChange={e => setCurrentSurveyOpt2(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Option 3 (Optionnelle)" 
                        value={currentSurveyOpt3}
                        onChange={e => setCurrentSurveyOpt3(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="Option 4 (Optionnelle)" 
                        value={currentSurveyOpt4}
                        onChange={e => setCurrentSurveyOpt4(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-semibold">
                      <input type="checkbox" checked readOnly disabled className="accent-teal-600 rounded" />
                      <span>Sondage 100% Anonyme (Bloqué)</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSurveyQuestion}
                      className="w-full bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Ajouter cette question de sondage
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Questions ajoutées ({surveyQuestions.length})</h5>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar">
                      {surveyQuestions.map((s, idx) => (
                        <div key={s.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-xs">
                          <span className="truncate max-w-[400px]">{idx + 1}. <strong>{s.question}</strong></span>
                          <button 
                            type="button" 
                            onClick={() => setSurveyQuestions(surveyQuestions.filter(item => item.id !== s.id))}
                            className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SHARING LINK */}
              {creationStep === 4 && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">Campagne créée avec succès !</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      La campagne est maintenant active en ligne de manière virtuelle. Vous devez copier le lien ci-dessous et le diffuser manuellement à vos contacts (WhatsApp, SMS, Flyers imprimés).
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl max-w-md mx-auto space-y-3">
                    <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Lien unique SensiTech</span>
                    <p className="text-xs font-mono text-slate-700 bg-white border border-slate-100 p-2 rounded break-all select-all">{generatedShareLink}</p>
                    
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          Lien copié dans le presse-papier !
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copier le lien de partage
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-1 bg-teal-50 p-3 rounded-xl border border-teal-100 text-teal-900 w-44">
                      <Smartphone className="w-6 h-6 text-teal-600" />
                      <span className="text-[10px] font-bold">Diffusion WhatsApp/SMS</span>
                      <span className="text-[9px] text-teal-800">Partage direct et immédiat</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 bg-cyan-50 p-3 rounded-xl border border-cyan-100 text-cyan-900 w-44">
                      <Users className="w-6 h-6 text-cyan-600" />
                      <span className="text-[10px] font-bold">Anonymat Garanti</span>
                      <span className="text-[9px] text-cyan-800">Aucun compte requis</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
              {creationStep > 1 && creationStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCreationStep(prev => prev - 1)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer"
                >
                  Précédent
                </button>
              ) : (
                <div></div>
              )}

              {creationStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCreationStep(prev => prev + 1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : creationStep === 3 ? (
                <button
                  type="button"
                  onClick={handleCreateCampaignSubmit}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  Enregistrer et Finaliser
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    // Force focus/tab update to Campaigns
                    setActiveTab('campaigns');
                  }}
                  className="bg-teal-600 text-white text-xs font-bold py-2 px-5 rounded-lg cursor-pointer"
                >
                  Fermer & Retourner au Tableau
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
