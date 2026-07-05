/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ChevronRight, 
  Award, 
  Phone, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  MapPin, 
  Calendar,
  AlertTriangle,
  BookmarkCheck,
  Send
} from 'lucide-react';
import { Campaign, QuizQuestion, SurveyQuestion } from '../types';

interface ParticipantViewProps {
  campaign: Campaign;
  onComplete: (data: {
    score: number;
    totalQuestions: number;
    passed: boolean;
    gender: string;
    age: string;
    region: string;
    surveyAnswers: { [key: string]: string };
  }) => void;
}

type Step = 'welcome' | 'demographics' | 'consent' | 'survey' | 'quiz' | 'quiz_feedback' | 'results' | 'certificate_request' | 'certificate_final';

export default function ParticipantView({ campaign, onComplete }: ParticipantViewProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  
  // Demographics (Anonymous)
  const [demoGender, setDemoGender] = useState<string>('');
  const [demoAge, setDemoAge] = useState<string>('');
  const [demoRegion, setDemoRegion] = useState<string>('');
  
  // Survey responses
  const [currentSurveyIdx, setCurrentSurveyIdx] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<{ [key: string]: string }>({});

  // Quiz responses
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  // Certificate info (Separated)
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactAgreed, setContactAgreed] = useState(false);
  const [certCode, setCertCode] = useState('');

  const totalSurveyQuestions = campaign.surveyQuestions.length;
  const totalQuizQuestions = campaign.quizQuestions.length;

  const handleStart = () => {
    setCurrentStep('consent');
  };

  const handleConsentAccept = () => {
    setCurrentStep('demographics');
  };

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoGender && demoAge && demoRegion) {
      setCurrentStep('survey');
    }
  };

  const handleSurveyAnswer = (option: string) => {
    const questionId = campaign.surveyQuestions[currentSurveyIdx].id;
    setSurveyAnswers(prev => ({ ...prev, [questionId]: option }));

    if (currentSurveyIdx < totalSurveyQuestions - 1) {
      setCurrentSurveyIdx(prev => prev + 1);
    } else {
      setCurrentStep('quiz');
    }
  };

  const handleQuizAnswerSelect = (option: string) => {
    if (showAnswerResult) return; // Prevent clicking after validation
    setSelectedQuizOption(option);
  };

  const handleValidateAnswer = () => {
    if (!selectedQuizOption) return;
    
    const currentQuestion = campaign.quizQuestions[currentQuizIdx];
    const isCorrect = selectedQuizOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedQuizOption }));
    setShowAnswerResult(true);
  };

  const handleNextQuizQuestion = () => {
    setShowAnswerResult(false);
    setSelectedQuizOption('');

    if (currentQuizIdx < totalQuizQuestions - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Finished quiz!
      setCurrentStep('results');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedQuizOption('');
    setQuizAnswers({});
    setQuizScore(0);
    setShowAnswerResult(false);
    setCurrentStep('consent');
  };

  // Submit anonymous responses to parent (for real-time update in Admin portal)
  const scorePercent = Math.round((quizScore / totalQuizQuestions) * 100);
  const passed = scorePercent >= campaign.quizThreshold;

  const handleTriggerCompleteCallback = () => {
    onComplete({
      score: quizScore,
      totalQuestions: totalQuizQuestions,
      passed,
      gender: demoGender,
      age: demoAge,
      region: demoRegion,
      surveyAnswers,
    });
  };

  const handleRequestCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientName.trim().length < 3) return;

    // Generate a random visual-friendly certificate code (e.g., ST-2026-XXXX)
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCertCode(`ST-2026-${rand}`);
    
    // Trigger anonymous telemetry submission when they finish their session
    handleTriggerCompleteCallback();
    
    setCurrentStep('certificate_final');
  };

  return (
    <div className="flex flex-col min-h-full font-sans bg-slate-50 text-slate-800">
      
      {/* Top Brand Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-teal-300" />
          <span className="font-bold tracking-tight text-sm">SensiTech Pilote</span>
        </div>
        <div className="bg-teal-900/40 text-teal-200 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border border-teal-500/20">
          Anonymat Garanti
        </div>
      </div>

      {/* Main Screen Content with Slide Transitions */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-2">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 mx-auto mb-2 shadow-sm">
                  <BookmarkCheck className="w-10 h-10" />
                </div>
                
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                    {campaign.theme}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
                    {campaign.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Campagne de sensibilisation et d'éducation active
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="font-semibold text-sm text-slate-900">Pourquoi participer ?</h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Cette campagne vous aide à comprendre les droits fondamentaux, à identifier les violences basées sur le genre (VBG) et à connaître les dispositifs d'aide au Bénin (comme le <strong className="text-teal-700 font-bold">136</strong>).
                  </p>
                  
                  <div className="border-t border-dashed border-slate-100 pt-3 flex gap-2 items-start text-[11px] text-slate-500">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Actif du {new Date(campaign.startDate).toLocaleDateString('fr-FR')} au {new Date(campaign.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2.5 items-start">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-amber-900">Sécurité et Anonymat</h4>
                    <p className="text-[11px] text-amber-800 leading-normal">
                      Aucune donnée d'identité (nom, téléphone, etc.) n'est collectée pendant vos réponses aux questions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="btn-start-campaign"
                  onClick={handleStart}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Démarrer la sensibilisation
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONSENT */}
          {currentStep === 'consent' && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3>Engagement de Confidentialité</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Avant de commencer, nous souhaitons vous réaffirmer que SensiTech respecte scrupuleusement votre vie privée.
                </p>

                <div className="bg-white rounded-2xl p-4 border-2 border-teal-100 shadow-sm space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Vos réponses au sondage d'opinion sont anonymisées.
                    </p>
                  </div>
                  
                  <div className="flex gap-2.5 items-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Vos scores au quiz n'ont aucune influence sur votre statut social ou légal.
                    </p>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Si vous demandez un certificat à la fin, vos coordonnées seront stockées de manière strictement séparée et ne pourront jamais être reliées à vos réponses.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex gap-2 items-center text-[11px] text-teal-800">
                  <UserCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Aucun compte à créer. Pas d'adresse e-mail exigée.</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  id="btn-accept-consent"
                  onClick={handleConsentAccept}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  Je comprends et je continue
                </button>
                <button
                  id="btn-cancel-consent"
                  onClick={() => setCurrentStep('welcome')}
                  className="w-full bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Retour
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DEMOGRAPHICS (ANONYMOUS) */}
          {currentStep === 'demographics' && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <form onSubmit={handleDemographicsSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 pt-1">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full">
                      Étape 1 de 3
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Profil Général Anonyme
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Ces données nous aident à analyser l'impact géographique sans vous identifier.
                    </p>
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Sexe</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Femme', 'Homme', 'Autre'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setDemoGender(g)}
                          className={`py-2 px-3 border text-xs font-semibold rounded-lg text-center transition-all cursor-pointer ${
                            demoGender === g 
                              ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-200' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Tranche d'âge</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['15-24 ans', '25-40 ans', '40 ans et +'].map(ageRange => (
                        <button
                          key={ageRange}
                          type="button"
                          onClick={() => setDemoAge(ageRange)}
                          className={`py-2 px-3 border text-xs font-semibold rounded-lg text-center transition-all cursor-pointer ${
                            demoAge === ageRange 
                              ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-200' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {ageRange}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Area Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Zone d'habitation (Parakou)</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Parakou Centre', 'Parakou Nord', 'Parakou Sud'].map(region => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setDemoRegion(region)}
                          className={`py-2.5 px-4 border text-xs font-semibold rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                            demoRegion === region 
                              ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-200' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {region}
                          </span>
                          {demoRegion === region && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="btn-submit-demographics"
                    type="submit"
                    disabled={!demoGender || !demoAge || !demoRegion}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      demoGender && demoAge && demoRegion
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continuer vers le sondage
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: ANONYMOUS SURVEY */}
          {currentStep === 'survey' && (
            <motion.div
              key="survey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-1">
                <div className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full">
                      Étape 2 de 3 : Sondage d'opinion
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Question {currentSurveyIdx + 1} / {totalSurveyQuestions}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-950 mt-2 leading-relaxed">
                    {campaign.surveyQuestions[currentSurveyIdx].question}
                  </h3>
                </div>

                {/* Question Options */}
                <div className="space-y-2 pt-1">
                  {campaign.surveyQuestions[currentSurveyIdx].options.map((option, idx) => {
                    const isSelected = surveyAnswers[campaign.surveyQuestions[currentSurveyIdx].id] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSurveyAnswer(option)}
                        className={`w-full p-3.5 border-2 text-xs font-medium rounded-xl text-left transition-all cursor-pointer block ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                            : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 shadow-sm'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-amber-50/75 border border-amber-200 rounded-xl flex gap-2 items-start text-[11px] text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Vos avis permettent à l'ONG d'adapter son aide sans jamais connaître votre identité.</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
                <span>Campagne active : Parakou</span>
                <span>Anonymat strict</span>
              </div>
            </motion.div>
          )}

          {/* STEP 5: QUIZ */}
          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-1">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full text-[9px]">
                      Étape 3 de 3 : Quiz Éducatif
                    </span>
                    <span className="font-medium text-slate-500">
                      {currentQuizIdx + 1} / {totalQuizQuestions}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 transition-all duration-300" 
                      style={{ width: `${((currentQuizIdx) / totalQuizQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-semibold text-slate-950 leading-relaxed">
                    {campaign.quizQuestions[currentQuizIdx].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {campaign.quizQuestions[currentQuizIdx].options.map((option, idx) => {
                    const isSelected = selectedQuizOption === option;
                    
                    let btnStyle = 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 shadow-sm';
                    if (showAnswerResult) {
                      const isCorrect = option === campaign.quizQuestions[currentQuizIdx].correctAnswer;
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-2 ring-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-200';
                      } else {
                        btnStyle = 'bg-white border-slate-100 opacity-60 text-slate-400';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-teal-50 border-teal-500 text-teal-800 font-semibold ring-2 ring-teal-200';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showAnswerResult}
                        onClick={() => handleQuizAnswerSelect(option)}
                        className={`w-full p-3.5 border text-xs font-medium rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-bold text-slate-400 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Educational feedback inline */}
                {showAnswerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      selectedQuizOption === campaign.quizQuestions[currentQuizIdx].correctAnswer
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-100 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {selectedQuizOption === campaign.quizQuestions[currentQuizIdx].correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bonne réponse !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Mauvaise réponse</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700">
                      {campaign.quizQuestions[currentQuizIdx].rationale}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action button */}
              <div className="pt-4">
                {!showAnswerResult ? (
                  <button
                    id="btn-validate-answer"
                    disabled={!selectedQuizOption}
                    onClick={handleValidateAnswer}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      selectedQuizOption
                        ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Valider la réponse
                  </button>
                ) : (
                  <button
                    id="btn-next-quiz"
                    onClick={handleNextQuizQuestion}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    {currentQuizIdx < totalQuizQuestions - 1 ? 'Question suivante' : 'Voir mon résultat'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 6: RESULTS */}
          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-1">
                <div className="text-center space-y-1.5">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                    Évaluation Terminée
                  </span>
                  
                  <div className="relative inline-flex items-center justify-center mt-2">
                    {/* Circle chart */}
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center bg-white shadow-inner">
                      <span className="text-2xl font-black text-slate-900">{quizScore}/{totalQuizQuestions}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{scorePercent}% Requis</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1.5 rounded-full shadow border-2 border-white">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">
                    {passed ? "Félicitations, Seuil Atteint !" : "Merci pour votre participation"}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-2">
                  <p className="text-xs leading-relaxed text-slate-600 text-center">
                    {passed 
                      ? "Vous avez démontré une excellente maîtrise des connaissances fondamentales sur la lutte contre les violences basées sur le genre (VBG)."
                      : `Vous avez obtenu un score de ${scorePercent}%. Le seuil de réussite est fixé à ${campaign.quizThreshold}%. N'hésitez pas à relire pour vous perfectionner !`}
                  </p>
                </div>

                {/* Success certificate promotion */}
                {passed ? (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <Award className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-teal-900">Certificat de Réussite SensiTech</h4>
                        <p className="text-[11px] text-teal-800 leading-normal">
                          En tant que participant méritant, vous pouvez obtenir un certificat officiel nominatif de sensibilisation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-teal-700/5 px-2.5 py-1.5 rounded text-[10px] text-teal-900 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Saisie séparée pour un anonymat absolu des réponses</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-xl p-3 flex gap-2 items-start text-[11px] text-slate-600">
                    <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>Rappelez-vous : en cas de besoin, d'écoute ou de signalement de violences au Bénin, le numéro d'appel gratuit et confidentiel est le <strong className="text-slate-800">136</strong>.</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                {passed ? (
                  <button
                    id="btn-go-to-certificate"
                    onClick={() => {
                      // Submit the stats anonymized immediately before typing name
                      handleTriggerCompleteCallback();
                      setCurrentStep('certificate_request');
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Demander mon Certificat
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="btn-retry-quiz"
                    onClick={handleRestartQuiz}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Recommencer le quiz
                  </button>
                )}
                
                <button
                  id="btn-finish-survey"
                  onClick={() => {
                    handleTriggerCompleteCallback();
                    alert("Participation enregistrée avec succès de manière anonyme ! Merci.");
                    handleRestartQuiz();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Terminer sans certificat
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: CERTIFICATE REQUEST (SEPARATED STEP) */}
          {currentStep === 'certificate_request' && (
            <motion.div
              key="certificate_request"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between"
            >
              <form onSubmit={handleRequestCertificateSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 pt-1">
                  
                  {/* Visual separation banner */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Garantie d'Anonymat des Réponses
                    </h4>
                    <p className="text-[10px] text-amber-800 leading-normal">
                      Vos réponses au quiz et sondage sont <strong>déjà enregistrées anonymement</strong>. Les données saisies ci-dessous ne seront jamais corrélées ou reliées à vos réponses. Elles servent uniquement à remplir le document de certificat.
                    </p>
                  </div>

                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Informations pour le Certificat
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Remplissez ces champs pour générer votre document de participation.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Prénom et Nom de famille <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Amadou DIALLO"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      Ce nom sera écrit tel quel sur le certificat imprimable.
                    </p>
                  </div>

                  {/* Optional Phone/SMS delivery field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Numéro de téléphone <span className="text-slate-400 font-normal">(Optionnel)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="Ex: +229 90 00 00 00"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Facultatif, permet de recevoir un lien de téléchargement par SMS.
                    </p>
                  </div>

                  {/* Checkbox agreement */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="agree"
                      required
                      checked={contactAgreed}
                      onChange={e => setContactAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="agree" className="text-[11px] text-slate-600 leading-normal select-none cursor-pointer">
                      J'accepte que ces coordonnées soient utilisées exclusivement pour la délivrance du certificat de sensibilisation et conservées séparément.
                    </label>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    id="btn-generate-cert"
                    type="submit"
                    disabled={recipientName.trim().length < 3 || !contactAgreed}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      recipientName.trim().length >= 3 && contactAgreed
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Générer mon certificat
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('results')}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                  >
                    Annuler et retourner au score
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 8: FINAL CERTIFICATE */}
          {currentStep === 'certificate_final' && (
            <motion.div
              key="certificate_final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pt-1">
                <div className="text-center border-b border-slate-100 pb-2">
                  <div className="inline-flex p-2 bg-emerald-50 rounded-full text-emerald-600 mb-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Certificat Prêt !
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Code d'homologation : {certCode}
                  </p>
                </div>

                {/* Simulated Certificate Graphic Representation */}
                <div className="bg-white border-8 border-teal-800 rounded-lg p-4 shadow-md relative overflow-hidden select-none">
                  {/* Subtle Background Watermark Seal */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                    <Award className="w-40 h-40 text-teal-900" />
                  </div>

                  <div className="text-center space-y-2 relative z-10">
                    <span className="text-[8px] font-bold text-teal-800 uppercase tracking-widest block">
                      SensiTech ONG &middot; Bénin
                    </span>
                    
                    <h4 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                      Certificat de Réussite
                    </h4>
                    
                    <p className="text-[8px] text-slate-400 italic">
                      Décerné solennellement à
                    </p>

                    <h5 className="text-sm font-bold text-teal-700 border-b border-dashed border-teal-200 pb-1 inline-block px-4">
                      {recipientName}
                    </h5>

                    <p className="text-[8px] text-slate-500 leading-normal max-w-xs mx-auto">
                      Pour avoir complété avec succès le module de sensibilisation et d'évaluation portant sur la thématique :
                    </p>

                    <p className="text-[10px] font-bold text-slate-800 px-2 py-0.5 bg-slate-50 rounded-full inline-block">
                      {campaign.theme}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2 items-center border-t border-slate-100 mt-2">
                      <div className="text-left space-y-0.5">
                        <p className="text-[6px] uppercase text-slate-400 font-semibold">Délivré le</p>
                        <p className="text-[8px] font-bold text-slate-700">{new Date().toLocaleDateString('fr-FR')}</p>
                        <p className="text-[6px] uppercase text-slate-400 font-semibold mt-1">Lieu</p>
                        <p className="text-[8px] font-bold text-slate-700">Pilote Parakou</p>
                      </div>

                      {/* Fake QR code generation */}
                      <div className="flex justify-end">
                        <div className="p-1 border border-slate-200 bg-white rounded shadow-sm">
                          {/* Simulated high contrast QR Code using simple pixels with pure CSS/HTML */}
                          <div className="w-12 h-12 flex flex-wrap bg-slate-900 p-0.5">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 ${
                                  (i % 3 === 0 || i % 7 === 0 || i < 12 || i > 52 || (i > 24 && i < 32)) 
                                    ? 'bg-slate-900' 
                                    : 'bg-white'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl space-y-1.5 text-xs text-teal-900">
                  <div className="flex gap-2 items-start">
                    <Phone className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-[11px]">Envoi par SMS effectué !</h4>
                      <p className="text-[10px] text-teal-800 leading-normal">
                        {phoneNumber 
                          ? `Un lien unique a été envoyé au ${phoneNumber}.` 
                          : "Vous n'avez pas saisi de numéro de téléphone. Vous pouvez télécharger le document directement ci-dessous."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  id="btn-download-cert"
                  onClick={() => {
                    alert(`Téléchargement simulé du Certificat de ${recipientName} au format PDF.`);
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le certificat (PDF)
                </button>
                
                <button
                  id="btn-reset-full"
                  onClick={() => {
                    setRecipientName('');
                    setPhoneNumber('');
                    setContactAgreed(false);
                    handleRestartQuiz();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recommencer une sensibilisation
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
