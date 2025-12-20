import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingAnswers, HustleProfile, hustleTypes, businessModels } from '../data/surveyData';

const STORAGE_KEYS = {
  ANSWERS: '@entrepreneurai_onboarding_answers',
  CURRENT_STEP: '@entrepreneurai_current_step',
  PROFILE: '@entrepreneurai_profile',
  COMPLETED: '@entrepreneurai_onboarding_completed',
};

interface OnboardingContextType {
  answers: OnboardingAnswers;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  profile: HustleProfile | null;
  calculateProfile: () => HustleProfile;
  resetOnboarding: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  isCompleted: boolean;
  setCompleted: (completed: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [profile, setProfile] = useState<HustleProfile | null>(null);
  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const [savedAnswers, savedStep, savedProfile, savedCompleted] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ANSWERS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_STEP),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.COMPLETED),
      ]);

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedStep) {
        setCurrentStepState(parseInt(savedStep));
      }
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedCompleted === 'true') {
        setIsCompleted(true);
      }
    } catch (error) {
      console.log('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAnswer = async (questionId: string, answer: string | string[]) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(newAnswers));
    } catch (error) {
      console.log('Error saving answer:', error);
    }
  };

  const setCurrentStep = async (step: number) => {
    setCurrentStepState(step);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
    } catch (error) {
      console.log('Error saving step:', error);
    }
  };

  const setCompleted = async (completed: boolean) => {
    setIsCompleted(completed);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED, completed.toString());
    } catch (error) {
      console.log('Error saving completed status:', error);
    }
  };

  const calculateProfile = (): HustleProfile => {
    // Calculate Hustle Type based on interests and personality
    const interests = (answers.interests as string[]) || [];
    const goal = answers.goal as string;
    const personality = answers.personality as string;
    const problem = answers.problem as string;
    
    let hustleType = hustleTypes.builder; // default
    
    // Creator: Design/Social focused
    if (interests.includes('design') || (interests.includes('social') && !interests.includes('sales'))) {
      hustleType = hustleTypes.creator;
    }
    // Closer: Sales-focused
    else if (interests.includes('sales')) {
      hustleType = hustleTypes.closer;
    }
    // Sprinter: Quick results, easily distracted (needs small wins)
    else if (goal === 'earn' || personality === 'distracted' || personality === 'unmotivated') {
      hustleType = hustleTypes.sprinter;
    }
    // Builder: Structured, planner type
    else if (personality === 'planner' || problem === 'plan') {
      hustleType = hustleTypes.builder;
    }

    // Calculate Business Model based on budget + interests
    const budget = answers.budget as string;
    let businessModel = businessModels.basics;
    let businessModelReason = '';

    const budgetValue = budget === '0' ? 0 : budget === '1-50' ? 25 : budget === '50-200' ? 100 : 300;

    // Budget 0€ -> Keine Dropshipping/FBA (Important rule!)
    if (interests.includes('sales')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.smma;
        businessModelReason = 'Deine Verkaufs-Skills + Budget = perfekt für SMMA';
      } else {
        businessModel = businessModels.closing;
        businessModelReason = 'Du kannst reden – High-Ticket Closing braucht 0€ Startkapital und passt zu deinen Skills';
      }
    } else if (interests.includes('design') || interests.includes('social')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.branding;
        businessModelReason = 'Kreativität + Budget = Personal Branding Business mit Skalierungspotenzial';
      } else {
        businessModel = businessModels.themePages;
        businessModelReason = 'Theme Pages sind perfekt für kreative Köpfe ohne Budget – nur Zeit investieren!';
      }
    } else if (interests.includes('tech')) {
      if (budgetValue >= 50) {
        businessModel = businessModels.aiServices;
        businessModelReason = 'Technik-Interesse + KI = zukunftssichere AI-Services mit hoher Nachfrage';
      } else {
        businessModel = businessModels.affiliate;
        businessModelReason = 'Starte mit Tech-Affiliate und baue parallel AI-Skills auf';
      }
    } else if (interests.includes('finance')) {
      if (budgetValue >= 200) {
        // Still no Dropshipping/FBA if budget is 0 - only recommend if enough budget
        businessModel = businessModels.smma;
        businessModelReason = 'Mit Finanz-Know-how kannst du SMMA für Finanzdienstleister machen';
      } else {
        businessModel = businessModels.affiliate;
        businessModelReason = 'Finance Affiliate – perfekt für dein Interesse ohne Startkapital';
      }
    } else if (budgetValue >= 200) {
      // Only suggest capital-intensive models with enough budget
      businessModel = businessModels.smma;
      businessModelReason = 'Mit deinem Budget kannst du direkt mit SMMA größer starten';
    } else if (budgetValue >= 50) {
      businessModel = businessModels.copywriting;
      businessModelReason = 'Copywriting ist der schnellste Weg zu ersten Einnahmen mit wenig Budget';
    } else {
      businessModel = businessModels.affiliate;
      businessModelReason = 'Affiliate Marketing – 0€ Start, unbegrenztes Potential';
    }

    // Coach Style based on personality and Q8 answer
    const coachStyleAnswer = answers.coachStyle as string;
    const needsMoreStructure = personality === 'distracted' || personality === 'unmotivated' || problem === 'finish';
    
    let finalCoachStyle = coachStyleAnswer;
    // Override for people who need more structure
    if (needsMoreStructure && (coachStyleAnswer === 'friendly' || !coachStyleAnswer)) {
      finalCoachStyle = 'strict'; // Force stricter coach for distracted/unmotivated
    }

    const coachStyleMap: { [key: string]: { style: string; emoji: string } } = {
      friendly: { style: 'Locker & Supportive', emoji: '😊' },
      direct: { style: 'Direkt & Ehrlich', emoji: '💬' },
      strict: { style: 'Streng & Fordernd', emoji: '🏋️' },
      mixed: { style: 'Flexibel & Anpassend', emoji: '🎭' },
    };
    const coachData = coachStyleMap[finalCoachStyle] || coachStyleMap.mixed;

    // Daily Tasks based on time (Q3) - smaller tasks for distracted people
    const time = answers.time as string;
    let baseTaskCount = time === '2h+' ? 10 : time === '1-2h' ? 7 : time === '30-60min' ? 5 : 3;
    
    // Reduce tasks for people who struggle with follow-through
    if (personality === 'distracted' || problem === 'finish') {
      baseTaskCount = Math.max(2, baseTaskCount - 2); // Smaller, more focused tasks
    }

    const timeMap: { [key: string]: string } = {
      '15-30min': 'Morgens: 1 Mini-Task | Abends: 2 fokussierte Tasks',
      '30-60min': 'Morgens: 2 Tasks | Mittags: 1 Task | Abends: 2 Tasks',
      '1-2h': 'Morgens: 2 Deep-Work Tasks | Nachmittags: 3 Tasks | Abends: Review',
      '2h+': 'Morgens: 3 Tasks | Nachmittags: 4 Tasks | Abends: 2 Tasks + Planung',
    };
    const routineSuggestion = timeMap[time] || timeMap['30-60min'];

    // Strengths & Weaknesses based on personality + problem
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Personality-based strengths/weaknesses
    if (personality === 'planner') {
      strengths.push('Du denkst strategisch und planst voraus');
      strengths.push('Du ziehst Dinge durch, wenn du einen Plan hast');
    } else if (personality === 'distracted') {
      strengths.push('Du bist motiviert und voller Energie');
      weaknesses.push('Ablenkungen lenken dich vom Ziel ab');
      weaknesses.push('Du brauchst kleinere, konkrete Tasks');
    } else if (personality === 'pressure') {
      strengths.push('Du lieferst unter Druck deine beste Arbeit');
      strengths.push('Deadlines motivieren dich');
      weaknesses.push('Ohne Druck fehlt dir der Antrieb');
    } else {
      weaknesses.push('Motivation aufzubauen ist deine größte Challenge');
      weaknesses.push('Kleine Erfolge werden dir helfen');
    }

    // Problem-based additions
    if (problem === 'start') {
      weaknesses.push('Der erste Schritt fällt dir schwer');
    } else if (problem === 'finish') {
      weaknesses.push('Durchhalten bis zum Ende ist deine Challenge');
    } else if (problem === 'fear') {
      weaknesses.push('Angst vorm Scheitern blockiert dich');
      strengths.push('Du denkst Risiken durch – das ist auch eine Stärke');
    } else if (problem === 'ideas') {
      strengths.push('Du hast viele kreative Ideen');
      weaknesses.push('Fokus auf EINE Sache fehlt');
    } else if (problem === 'plan') {
      weaknesses.push('Dir fehlt ein klarer Fahrplan');
    }

    // Interest-based strengths
    if (interests.includes('tech')) {
      strengths.push('Technisches Verständnis ist ein Mega-Vorteil');
    }
    if (interests.includes('social')) {
      strengths.push('Social Media Know-how ist Gold wert');
    }

    // Ensure at least 1 strength and 1 weakness
    if (strengths.length === 0) strengths.push('Du bist hier – das ist der erste Schritt');
    if (weaknesses.length === 0) weaknesses.push('Noch keine klaren Schwächen erkannt');

    // 30 Day Goal from Q13
    const goalMap: { [key: string]: string } = {
      income: '💰 Erste Einnahmen generieren',
      plan: '📝 Klaren Business-Plan erstellen',
      skill: '🎯 Einen Skill wirklich meistern',
      discipline: '⚡ Tägliche Routine etablieren',
      clarity: '🔮 Klarheit über deinen Weg gewinnen',
    };
    const goal30Days = goalMap[answers.success30 as string] || goalMap.clarity;

    // First 3 Todos based on business model
    const todosByModel: { [key: string]: string[] } = {
      themePages: [
        'Nische für deine Theme Page auswählen',
        'Instagram Account erstellen & Bio optimieren',
        'Erste 9 Posts mit Canva vorbereiten',
      ],
      affiliate: [
        'Bei Digistore24 oder Amazon PartnerNet anmelden',
        'Produkt/Nische auswählen, die dich interessiert',
        'Ersten Content-Plan erstellen',
      ],
      smmaLight: [
        'Portfolio-Seite erstellen (Carrd.co)',
        '10 lokale Businesses in deiner Stadt recherchieren',
        'Erstes Angebot formulieren',
      ],
      smma: [
        'SMMA-Grundlagen Lektion 1 abschließen',
        'Nische definieren (z.B. Restaurants, Gyms)',
        'Outreach-Script vorbereiten',
      ],
      copywriting: [
        'Copywriting-Basics lernen (Headlines, CTAs)',
        'Ersten Sales-Text für ein Beispielprodukt schreiben',
        'Portfolio mit 3 Beispielen aufbauen',
      ],
      closing: [
        'Closing-Grundlagen lernen (SPIN Selling)',
        'Dein Closing-Script erstellen und üben',
        'Ersten Remote Closer Job suchen',
      ],
      aiServices: [
        'ChatGPT/Claude advanced prompting lernen',
        'Service-Angebot definieren (z.B. AI Content)',
        'Erste 3 potenzielle Kunden ansprechen',
      ],
      branding: [
        'Personal Brand Konzept erstellen (Werte, Zielgruppe)',
        'Social Media Profile optimieren',
        'Content-Strategie für 30 Tage planen',
      ],
      basics: [
        'Skill-Assessment machen: Was kannst du gut?',
        'Fiverr/Upwork Profil erstellen',
        'Ersten günstigen Gig anbieten',
      ],
      dropshipping: [
        'Store-Plattform wählen (Shopify)',
        'Winning Product recherchieren',
        'Supplier auf AliExpress finden',
      ],
      amazonFba: [
        'Amazon Seller Account erstellen',
        'Produkt-Recherche mit Jungle Scout starten',
        'Lieferanten auf Alibaba kontaktieren',
      ],
    };
    const firstTodos = todosByModel[businessModel.id] || todosByModel.basics;

    // Proof-of-Work Readiness (Q12)
    const proofOfWorkMap: { [key: string]: { level: string; description: string } } = {
      yes: { level: 'Hoch', description: 'Du bist ready für Accountability!' },
      maybe: { level: 'Mittel', description: 'Wir starten sanft mit Proof-of-Work' },
      reluctant: { level: 'Niedrig', description: 'Kleine Beweise, großer Fortschritt' },
      no: { level: 'Minimal', description: 'Self-Tracking ohne Upload' },
    };
    const proofOfWork = proofOfWorkMap[answers.proofOfWork as string] || proofOfWorkMap.maybe;

    // Hustle Score calculation
    let hustleScore = 50;
    if (answers.experience === 'regular') hustleScore += 20;
    else if (answers.experience === 'some') hustleScore += 10;
    if (personality === 'planner') hustleScore += 10;
    if (personality === 'pressure') hustleScore += 5;
    if (answers.proofOfWork === 'yes') hustleScore += 10;
    else if (answers.proofOfWork === 'maybe') hustleScore += 5;
    if (time === '2h+') hustleScore += 10;
    else if (time === '1-2h') hustleScore += 5;
    if (budgetValue >= 200) hustleScore += 5;
    if (interests.length >= 3) hustleScore += 5;
    hustleScore = Math.min(hustleScore, 100);

    const calculatedProfile: HustleProfile = {
      hustleType,
      businessModel,
      businessModelReason,
      coachStyle: coachData.style,
      coachStyleEmoji: coachData.emoji,
      dailyTasks: baseTaskCount,
      routineSuggestion,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      goal30Days,
      firstTodos,
      hustleScore,
      proofOfWorkLevel: proofOfWork.level,
      proofOfWorkDescription: proofOfWork.description,
    };

    setProfile(calculatedProfile);
    
    // Save profile to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(calculatedProfile)).catch(console.log);
    
    return calculatedProfile;
  };

  const resetOnboarding = async () => {
    setAnswers({});
    setProfile(null);
    setCurrentStepState(1);
    setIsCompleted(false);
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ANSWERS,
        STORAGE_KEYS.CURRENT_STEP,
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.COMPLETED,
      ]);
    } catch (error) {
      console.log('Error resetting onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider value={{ 
      answers, 
      setAnswer, 
      profile, 
      calculateProfile, 
      resetOnboarding,
      currentStep,
      setCurrentStep,
      isLoading,
      isCompleted,
      setCompleted,
    }}>
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
