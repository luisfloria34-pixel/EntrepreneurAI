// Onboarding Survey Questions Data

export interface SurveyOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: SurveyOption[];
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'age',
    question: 'Wie alt bist du?',
    subtitle: 'Damit wir den Content für dich anpassen können',
    type: 'single',
    options: [
      { id: 'under15', label: 'Unter 15', emoji: '🧒' },
      { id: '15-17', label: '15–17', emoji: '🎓' },
      { id: '18-20', label: '18–20', emoji: '🚀' },
      { id: '21-25', label: '21–25', emoji: '💼' },
      { id: 'over25', label: 'Über 25', emoji: '🏆' },
    ],
  },
  {
    id: 'situation',
    question: 'Was machst du gerade?',
    subtitle: 'Deine aktuelle Lebenssituation',
    type: 'single',
    options: [
      { id: 'school', label: 'Schule', emoji: '📚' },
      { id: 'training', label: 'Ausbildung', emoji: '🔧' },
      { id: 'university', label: 'Studium', emoji: '🎓' },
      { id: 'work', label: 'Arbeit', emoji: '💼' },
      { id: 'nothing', label: 'Nichts / Orientierung', emoji: '🧭' },
    ],
  },
  {
    id: 'time',
    question: 'Wie viel Zeit kannst du realistisch investieren?',
    subtitle: 'Sei ehrlich – lieber weniger und durchziehen',
    type: 'single',
    options: [
      { id: '15-30min', label: '15–30 Minuten pro Tag', emoji: '⚡' },
      { id: '30-60min', label: '30–60 Minuten pro Tag', emoji: '🔥' },
      { id: '1-2h', label: '1–2 Stunden pro Tag', emoji: '💪' },
      { id: '2h+', label: 'Mehr als 2 Stunden', emoji: '🚀' },
    ],
  },
  {
    id: 'productive',
    question: 'Wann bist du am produktivsten?',
    subtitle: 'Wir passen deine Tasks daran an',
    type: 'single',
    options: [
      { id: 'morning', label: 'Morgens', emoji: '🌅' },
      { id: 'afternoon', label: 'Nach Schule/Arbeit', emoji: '☀️' },
      { id: 'evening', label: 'Abends', emoji: '🌙' },
      { id: 'varies', label: 'Unterschiedlich', emoji: '🔄' },
    ],
  },
  {
    id: 'budget',
    question: 'Mit wie viel Geld könntest du starten?',
    subtitle: 'Keine Sorge – 0€ ist völlig okay',
    type: 'single',
    options: [
      { id: '0', label: '0 €', emoji: '🆓' },
      { id: '1-50', label: '1–50 €', emoji: '💶' },
      { id: '50-200', label: '50–200 €', emoji: '💰' },
      { id: '200+', label: 'Mehr als 200 €', emoji: '🏦' },
    ],
  },
  {
    id: 'goal',
    question: 'Was ist dein Hauptziel?',
    subtitle: 'Was treibt dich an?',
    type: 'single',
    options: [
      { id: 'earn', label: 'Erstes eigenes Geld verdienen', emoji: '💵' },
      { id: 'independent', label: 'Online selbstständig werden', emoji: '🌐' },
      { id: 'skills', label: 'Skills lernen (Marketing, Verkauf, etc.)', emoji: '📈' },
      { id: 'freedom', label: 'Freiheit & Unabhängigkeit', emoji: '🦅' },
      { id: 'unsure', label: 'Ich weiß es noch nicht', emoji: '🤔' },
    ],
  },
  {
    id: 'personality',
    question: 'Was trifft eher auf dich zu?',
    subtitle: 'Sei ehrlich zu dir selbst',
    type: 'single',
    options: [
      { id: 'distracted', label: 'Motiviert, aber schnell abgelenkt', emoji: '🦋' },
      { id: 'planner', label: 'Ziehe durch, wenn ich einen Plan habe', emoji: '📋' },
      { id: 'pressure', label: 'Brauche Druck & klare Aufgaben', emoji: '⏰' },
      { id: 'unmotivated', label: 'Verliere oft Motivation', emoji: '😔' },
    ],
  },
  {
    id: 'coachStyle',
    question: 'Wie soll dich die AI behandeln?',
    subtitle: 'Dein persönlicher Coach-Style',
    type: 'single',
    options: [
      { id: 'friendly', label: 'Locker & freundlich', emoji: '😊' },
      { id: 'direct', label: 'Direkt & ehrlich', emoji: '💬' },
      { id: 'strict', label: 'Streng wie ein Coach', emoji: '🏋️' },
      { id: 'mixed', label: 'Mischung aus allem', emoji: '🎭' },
    ],
  },
  {
    id: 'interests',
    question: 'Was interessiert dich am meisten?',
    subtitle: 'Wähle alle, die auf dich zutreffen',
    type: 'multi',
    options: [
      { id: 'social', label: 'Social Media', emoji: '📱' },
      { id: 'business', label: 'Online Business', emoji: '💻' },
      { id: 'design', label: 'Design & Branding', emoji: '🎨' },
      { id: 'sales', label: 'Verkaufen / Reden', emoji: '🗣️' },
      { id: 'tech', label: 'Technik / KI', emoji: '🤖' },
      { id: 'finance', label: 'Geld & Investments', emoji: '📊' },
    ],
  },
  {
    id: 'experience',
    question: 'Hast du schon mal online Geld verdient?',
    subtitle: 'Egal wie viel – alles zählt',
    type: 'single',
    options: [
      { id: 'never', label: 'Nein, noch nie', emoji: '🆕' },
      { id: 'some', label: 'Ja, ein bisschen', emoji: '✨' },
      { id: 'regular', label: 'Ja, regelmäßig', emoji: '💎' },
    ],
  },
  {
    id: 'problem',
    question: 'Was ist dein größtes Problem?',
    subtitle: 'Wir helfen dir dabei',
    type: 'single',
    options: [
      { id: 'start', label: 'Ich weiß nicht, wo ich anfangen soll', emoji: '🚦' },
      { id: 'finish', label: 'Ich fange an, ziehe aber nicht durch', emoji: '🏃' },
      { id: 'fear', label: 'Ich habe Angst zu scheitern', emoji: '😰' },
      { id: 'ideas', label: 'Ich habe zu viele Ideen', emoji: '💡' },
      { id: 'plan', label: 'Mir fehlt ein klarer Plan', emoji: '🗺️' },
    ],
  },
  {
    id: 'proofOfWork',
    question: 'Wärst du bereit, Beweise hochzuladen?',
    subtitle: 'Proof-of-Work zeigt deinen echten Fortschritt',
    type: 'single',
    options: [
      { id: 'yes', label: 'Ja, safe', emoji: '✅' },
      { id: 'maybe', label: 'Ja, wenn es hilft', emoji: '🤷' },
      { id: 'reluctant', label: 'Eher ungern', emoji: '😬' },
      { id: 'no', label: 'Nein', emoji: '❌' },
    ],
  },
  {
    id: 'success30',
    question: 'Was wäre für dich ein Erfolg in 30 Tagen?',
    subtitle: 'Dein erstes großes Ziel',
    type: 'single',
    options: [
      { id: 'income', label: 'Erste Einnahmen', emoji: '💰' },
      { id: 'plan', label: 'Ein fertiger Plan', emoji: '📝' },
      { id: 'skill', label: 'Ein Skill, den ich wirklich kann', emoji: '🎯' },
      { id: 'discipline', label: 'Mehr Disziplin', emoji: '⚡' },
      { id: 'clarity', label: 'Klarheit, was ich will', emoji: '🔮' },
    ],
  },
];

// Hustle Types
export const hustleTypes = {
  sprinter: {
    id: 'sprinter',
    name: 'Der Sprinter',
    emoji: '🏃',
    description: 'Du willst schnell starten und Ergebnisse sehen. Action ist dein zweiter Vorname.',
    color: '#F59E0B',
  },
  builder: {
    id: 'builder',
    name: 'Der Builder',
    emoji: '🏗️',
    description: 'Du magst Systeme und Struktur. Mit einem Plan bist du unaufhaltbar.',
    color: '#10B981',
  },
  creator: {
    id: 'creator',
    name: 'Der Creator',
    emoji: '🎨',
    description: 'Kreativität ist deine Stärke. Social Media und Branding liegen dir im Blut.',
    color: '#8B5CF6',
  },
  closer: {
    id: 'closer',
    name: 'Der Closer',
    emoji: '🤝',
    description: 'Kommunikation und Überzeugung sind deine Superkräfte. Du bringst Deals zum Abschluss.',
    color: '#EF4444',
  },
};

// Business Models
export const businessModels = {
  themePages: { id: 'themePages', name: 'Theme Pages', emoji: '📱', minBudget: 0 },
  affiliate: { id: 'affiliate', name: 'Affiliate Marketing', emoji: '🔗', minBudget: 0 },
  smmaLight: { id: 'smmaLight', name: 'SMMA Light', emoji: '📈', minBudget: 0 },
  basics: { id: 'basics', name: 'Freelance Basics', emoji: '💼', minBudget: 0 },
  smma: { id: 'smma', name: 'Social Media Marketing Agency', emoji: '🚀', minBudget: 50 },
  copywriting: { id: 'copywriting', name: 'Copywriting', emoji: '✍️', minBudget: 0 },
  closing: { id: 'closing', name: 'High-Ticket Closing', emoji: '📞', minBudget: 0 },
  aiServices: { id: 'aiServices', name: 'AI-basierte Services', emoji: '🤖', minBudget: 50 },
  dropshipping: { id: 'dropshipping', name: 'Dropshipping', emoji: '📦', minBudget: 200 },
  amazonFba: { id: 'amazonFba', name: 'Amazon FBA', emoji: '📦', minBudget: 200 },
  branding: { id: 'branding', name: 'Personal Branding', emoji: '🎨', minBudget: 0 },
};

export type OnboardingAnswers = {
  [key: string]: string | string[];
};

export interface HustleProfile {
  hustleType: typeof hustleTypes[keyof typeof hustleTypes];
  businessModel: typeof businessModels[keyof typeof businessModels];
  businessModelReason: string;
  coachStyle: string;
  coachStyleEmoji: string;
  dailyTasks: number;
  routineSuggestion: string;
  strengths: string[];
  weaknesses: string[];
  goal30Days: string;
  firstTodos: string[];
  hustleScore: number;
}
