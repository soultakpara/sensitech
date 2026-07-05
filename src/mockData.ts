/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Campaign, CampaignStats } from './types';

export const INITIAL_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: "Qu'est-ce qu'une Violence Basée sur le Genre (VBG) ?",
    options: [
      "Une violence exercée spécifiquement contre une personne en raison de son genre.",
      "Un conflit de voisinage ordinaire lié à des limites de terrain.",
      "Uniquement des disputes verbales temporaires au sein d'un couple."
    ],
    correctAnswer: "Une violence exercée spécifiquement contre une personne en raison de son genre.",
    rationale: "Les VBG désignent tout acte nuisible dirigé contre un individu en raison de son identité de genre. Elles découlent d'inégalités de pouvoir et touchent disproportionnellement les femmes et les filles."
  },
  {
    id: 'q2',
    question: "Quelle forme de violence consiste à priver délibérément une personne de ses ressources financières ou d'opportunités d'emploi ?",
    options: [
      "La violence psychologique ou verbale.",
      "La violence économique.",
      "Le harcèlement moral uniquement."
    ],
    correctAnswer: "La violence économique.",
    rationale: "La violence économique comprend le contrôle des ressources financières, l'interdiction de travailler ou d'étudier, ou la privation de besoins essentiels pour maintenir la victime sous dépendance."
  },
  {
    id: 'q3',
    question: "Le mariage d'une jeune fille de moins de 18 ans est-il considéré comme une violence ?",
    options: [
      "Non, si les parents estiment que cela protège l'honneur de la famille.",
      "Oui, c'est un mariage précoce/forcé, une violation grave des droits humains et une forme de VBG.",
      "Seulement s'il n'y a pas de fête ou de dot traditionnelle."
    ],
    correctAnswer: "Oui, c'est un mariage précoce/forcé, une violation grave des droits humains et une forme de VBG.",
    rationale: "Le mariage d'enfants prive les jeunes filles de leur éducation, compromet leur santé physique et psychologique, et constitue une forme d'abus sexuel et d'exploitation forcée."
  },
  {
    id: 'q4',
    question: "Vers quel numéro vert gratuit officiel peut-on s'orienter au Bénin pour signaler des VBG et obtenir un soutien immédiat ?",
    options: [
      "Le numéro vert national de signalement et d'écoute : le 136.",
      "Le numéro général de météo ou d'information : le 112.",
      "Le service d'assistance de l'annuaire téléphonique."
    ],
    correctAnswer: "Le numéro vert national de signalement et d'écoute : le 136.",
    rationale: "Au Bénin, le numéro vert gratuit 136 est dédié à la dénonciation, à l'écoute et à l'orientation des victimes de violences basées sur le genre (VBG) de manière anonyme et confidentielle."
  },
  {
    id: 'q5',
    question: "Est-il possible de signaler une violence sexuelle ou physique tout en conservant un anonymat absolu ?",
    options: [
      "Non, la victime doit obligatoirement être exposée au grand public.",
      "Oui, la loi et les centres de prise en charge garantissent la confidentialité et l'anonymat pour protéger la victime.",
      "Seulement si l'auteur des violences donne sa permission par écrit."
    ],
    correctAnswer: "Oui, la loi et les centres de prise en charge garantissent la confidentialité et l'anonymat pour protéger la victime.",
    rationale: "Le respect absolu de la vie privée et de la confidentialité est l'un des principes directeurs fondamentaux de la prise en charge des survivantes de VBG pour assurer leur sécurité et leur dignité."
  }
];

export const INITIAL_SURVEY_QUESTIONS = [
  {
    id: 's1',
    question: "Pensez-vous que les violences basées sur le genre (VBG) sont fréquentes dans votre zone d'habitation ?",
    options: [
      "Très fréquentes",
      "Modérément fréquentes",
      "Rares ou inexistantes",
      "Je ne préfère pas me prononcer"
    ],
    isAnonymous: true
  },
  {
    id: 's2',
    question: "Vous sentez-vous capable d'identifier et de signaler en toute sécurité un cas de violence autour de vous ?",
    options: [
      "Oui, je connais les canaux de signalement (comme le 136)",
      "Oui, mais je crains pour ma sécurité ou ma réputation",
      "Non, je ne sais pas comment faire ou vers qui me tourner",
      "Non, je préfère ne pas intervenir"
    ],
    isAnonymous: true
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: "Ensemble contre les VBG - Parakou",
    theme: "Violences Basées sur le Genre (VBG) et Droits Humains",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: 'active',
    quizThreshold: 80, // %
    quizQuestions: INITIAL_QUIZ_QUESTIONS,
    surveyQuestions: INITIAL_SURVEY_QUESTIONS
  }
];

export const INITIAL_STATS: CampaignStats = {
  participantsCount: 47,
  avgScore: 82, // %
  successRate: 78, // % des participants ont réussi
  ageDistribution: [
    { range: "15-24 ans", count: 25, percentage: 53 },
    { range: "25-40 ans", count: 17, percentage: 36 },
    { range: "40 ans et +", count: 5, percentage: 11 }
  ],
  regionDistribution: [
    { region: "Parakou Centre", count: 21 },
    { region: "Parakou Nord", count: 18 },
    { region: "Parakou Sud", count: 8 }
  ],
  genderDistribution: [
    { gender: "Femmes", count: 28, percentage: 60 },
    { gender: "Hommes", count: 19, percentage: 40 }
  ],
  surveySummary: [
    {
      questionId: 's1',
      questionText: "Pensez-vous que les violences basées sur le genre (VBG) sont fréquentes dans votre zone d'habitation ?",
      answers: [
        { option: "Très fréquentes", count: 22, percentage: 47 },
        { option: "Modérément fréquentes", count: 14, percentage: 30 },
        { option: "Rares ou inexistantes", count: 6, percentage: 13 },
        { option: "Je ne préfère pas me prononcer", count: 5, percentage: 10 }
      ]
    },
    {
      questionId: 's2',
      questionText: "Vous sentez-vous capable d'identifier et de signaler en toute sécurité un cas de violence autour de vous ?",
      answers: [
        { option: "Oui, je connais les canaux de signalement (comme le 136)", count: 19, percentage: 40 },
        { option: "Oui, mais je crains pour ma sécurité ou ma réputation", count: 16, percentage: 34 },
        { option: "Non, je ne sais pas comment faire ou vers qui me tourner", count: 8, percentage: 17 },
        { option: "Non, je préfère ne pas intervenir", count: 4, percentage: 9 }
      ]
    }
  ]
};
