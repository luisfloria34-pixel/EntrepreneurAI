import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingAnswers, HustleProfile, hustleTypes, businessModels } from '../data/surveyData';

interface OnboardingContextType {
  answers: OnboardingAnswers;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  profile: HustleProfile | null;
  calculateProfile: () => HustleProfile;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [profile, setProfile] = useState<HustleProfile | null>(null);

  const setAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateProfile = (): HustleProfile => {
    // Calculate Hustle Type
    const interests = (answers.interests as string[]) || [];
    const goal = answers.goal as string;
    const personality = answers.personality as string;
    
    let hustleType = hustleTypes.builder; // default
    
    if (interests.includes('social') || interests.includes('design')) {
      hustleType = hustleTypes.creator;
    } else if (interests.includes('sales')) {
      hustleType = hustleTypes.closer;
    } else if (goal === 'earn' || personality === 'distracted') {
      hustleType = hustleTypes.sprinter;
    } else if (personality === 'planner') {
      hustleType = hustleTypes.builder;
    }

    // Calculate Business Model based on budget + interests
    const budget = answers.budget as string;
    let businessModel = businessModels.basics;
    let businessModelReason = '';

    const budgetValue = budget === '0' ? 0 : budget === '1-50' ? 25 : budget === '50-200' ? 100 : 300;

    if (interests.includes('sales')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.smma;
        businessModelReason = 'Deine Verkaufs-Skills + Budget = perfekt für SMMA';
      } else {
        businessModel = businessModels.closing;
        businessModelReason = 'Du kannst reden – Closing braucht 0€ Startkapital';
      }
    } else if (interests.includes('design') || interests.includes('social')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.branding;
        businessModelReason = 'Kreativität + Budget = Personal Branding Business';
      } else {
        businessModel = businessModels.themePages;
        businessModelReason = 'Theme Pages sind perfekt für kreative Köpfe ohne Budget';
      }
    } else if (interests.includes('tech')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.aiServices;
        businessModelReason = 'Technik-Interesse + KI = zukunftssichere Services';
      } else {
        businessModel = businessModels.affiliate;
        businessModelReason = 'Starte mit Affiliate und baue Tech-Skills auf';
      }
    } else if (budgetValue >= 200) {
      businessModel = businessModels.smma;
      businessModelReason = 'Mit deinem Budget kannst du direkt größer starten';
    } else if (budgetValue >= 50) {
      businessModel = businessModels.copywriting;
      businessModelReason = 'Copywriting ist der schnellste Weg zu ersten Einnahmen';
    } else {
      businessModel = businessModels.affiliate;
      businessModelReason = 'Affiliate Marketing – 0€ Start, unbegrenztes Potential';
    }

    // Coach Style
    const coachStyleMap: { [key: string]: { style: string; emoji: string } } = {
      friendly: { style: 'Locker & Supportive', emoji: '😊' },
      direct: { style: 'Direkt & Ehrlich', emoji: '💬' },
      strict: { style: 'Streng & Fordernd', emoji: '🏋️' },
      mixed: { style: 'Flexibel & Anpassend', emoji: '🎭' },
    };
    const coachData = coachStyleMap[answers.coachStyle as string] || coachStyleMap.mixed;

    // Daily Tasks based on time
    const timeMap: { [key: string]: { tasks: number; routine: string } } = {
      '15-30min': { tasks: 3, routine: '3 fokussierte Mini-Tasks pro Tag' },
      '30-60min': { tasks: 5, routine: '4-5 strukturierte Tasks pro Tag' },
      '1-2h': { tasks: 7, routine: '5-7 Deep-Work Tasks pro Tag' },
      '2h+': { tasks: 10, routine: '8+ Tasks mit Projekt-Fokus' },
    };
    const timeData = timeMap[answers.time as string] || timeMap['30-60min'];

    // Strengths & Weaknesses based on personality + problem
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (personality === 'planner') {
      strengths.push('Du denkst strategisch');
      strengths.push('Du ziehst Dinge durch');
    } else if (personality === 'distracted') {
      strengths.push('Du bist motiviert');
      weaknesses.push('Ablenkung ist dein Feind');
    } else if (personality === 'pressure') {
      strengths.push('Du funktionierst unter Druck');
      weaknesses.push('Du brauchst externe Motivation');
    } else {
      weaknesses.push('Motivation aufbauen ist key');
    }

    const problem = answers.problem as string;
    if (problem === 'start') {
      weaknesses.push('Der erste Schritt fällt dir schwer');
    } else if (problem === 'finish') {
      weaknesses.push('Durchhalten ist deine Challenge');
    } else if (problem === 'fear') {
      weaknesses.push('Angst vorm Scheitern blockiert dich');
    } else if (problem === 'ideas') {
      strengths.push('Du hast viele Ideen');
      weaknesses.push('Fokus auf EINE Sache fehlt');
    }

    if (strengths.length === 0) strengths.push('Du bist hier – das ist der erste Schritt');
    if (weaknesses.length === 0) weaknesses.push('Noch keine klaren Schwächen erkannt');

    // 30 Day Goal
    const goalMap: { [key: string]: string } = {
      income: '💰 Erste Einnahmen generieren',
      plan: '📝 Klaren Business-Plan erstellen',
      skill: '🎯 Einen Skill meistern',
      discipline: '⚡ Tägliche Routine etablieren',
      clarity: '🔮 Klarheit über deinen Weg gewinnen',
    };
    const goal30Days = goalMap[answers.success30 as string] || goalMap.clarity;

    // First 3 Todos based on business model
    const todosByModel: { [key: string]: string[] } = {
      themePages: [
        'Nische für Theme Page auswählen',
        'Instagram Account erstellen',
        'Erste 9 Posts vorbereiten',
      ],
      affiliate: [
        'Affiliate-Netzwerk beitreten',
        'Produkt zum Bewerben auswählen',
        'Content-Plan erstellen',
      ],
      smmaLight: [
        'Portfolio-Seite erstellen',
        '10 lokale Businesses recherchieren',
        'Erstes Angebot formulieren',
      ],
      smma: [
        'SMMA-Grundlagen lernen (Lektion 1)',
        'Nische definieren',
        'Outreach-Script vorbereiten',
      ],
      copywriting: [
        'Copywriting-Basics lernen',
        'Ersten Sales-Text schreiben',
        'Portfolio aufbauen',
      ],
      closing: [
        'Closing-Techniken studieren',
        'Script üben',
        'Ersten Closer-Job suchen',
      ],
      aiServices: [
        'AI-Tools kennenlernen',
        'Service-Angebot definieren',
        'Erste Kunden ansprechen',
      ],
      branding: [
        'Personal Brand Konzept erstellen',
        'Social Media Profile optimieren',
        'Content-Strategie planen',
      ],
      basics: [
        'Skill-Assessment machen',
        'Freelancer-Profil erstellen',
        'Ersten Gig suchen',
      ],
      dropshipping: [
        'Store-Plattform wählen',
        'Produkt recherchieren',
        'Supplier finden',
      ],
      amazonFba: [
        'Amazon Seller Account erstellen',
        'Produkt-Recherche starten',
        'Lieferanten kontaktieren',
      ],
    };
    const firstTodos = todosByModel[businessModel.id] || todosByModel.basics;

    // Hustle Score (dummy calculation)
    let hustleScore = 50;
    if (answers.experience === 'regular') hustleScore += 20;
    else if (answers.experience === 'some') hustleScore += 10;
    if (personality === 'planner') hustleScore += 10;
    if (answers.proofOfWork === 'yes') hustleScore += 10;
    if (answers.time === '2h+') hustleScore += 10;
    else if (answers.time === '1-2h') hustleScore += 5;
    hustleScore = Math.min(hustleScore, 100);

    const calculatedProfile: HustleProfile = {
      hustleType,
      businessModel,
      businessModelReason,
      coachStyle: coachData.style,
      coachStyleEmoji: coachData.emoji,
      dailyTasks: timeData.tasks,
      routineSuggestion: timeData.routine,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      goal30Days,
      firstTodos,
      hustleScore,
    };

    setProfile(calculatedProfile);
    return calculatedProfile;
  };

  const resetOnboarding = () => {
    setAnswers({});
    setProfile(null);
  };

  return (
    <OnboardingContext.Provider value={{ answers, setAnswer, profile, calculateProfile, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
