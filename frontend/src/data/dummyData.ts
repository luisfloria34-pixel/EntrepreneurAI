// Dummy Data for EntrepreneurAI App

export const userData = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@entrepreneur.ai',
  avatar: null,
  hustleScore: 2450,
  level: 12,
  streak: 7,
  joinedDate: '2025-01-15',
  badges: [
    { id: '1', name: 'Early Bird', icon: 'sunny', color: '#F59E0B' },
    { id: '2', name: 'First Course', icon: 'school', color: '#10B981' },
    { id: '3', name: 'Week Streak', icon: 'flame', color: '#EF4444' },
    { id: '4', name: 'Idea Maker', icon: 'bulb', color: '#8B5CF6' },
  ],
};

export const dailyTask = {
  id: '1',
  title: 'Complete Today\'s Lesson',
  description: 'Learn about market validation in 10 minutes',
  xp: 50,
  completed: false,
};

export const currentCourse = {
  id: '1',
  title: 'Startup Fundamentals',
  progress: 65,
  totalLessons: 12,
  completedLessons: 8,
  nextLesson: 'Market Research Basics',
};

export const courses = [
  {
    id: '1',
    title: 'Startup Fundamentals',
    description: 'Learn the basics of building a successful startup from idea to launch.',
    progress: 65,
    totalLessons: 12,
    duration: '2h 30m',
    level: 'Beginner',
    icon: 'rocket',
    color: '#00D4FF',
  },
  {
    id: '2',
    title: 'Digital Marketing 101',
    description: 'Master social media, SEO, and content marketing for your business.',
    progress: 30,
    totalLessons: 15,
    duration: '3h 15m',
    level: 'Beginner',
    icon: 'megaphone',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Financial Literacy',
    description: 'Understand budgeting, investing, and managing business finances.',
    progress: 0,
    totalLessons: 10,
    duration: '2h',
    level: 'Intermediate',
    icon: 'cash',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Leadership Skills',
    description: 'Develop essential leadership and team management abilities.',
    progress: 0,
    totalLessons: 8,
    duration: '1h 45m',
    level: 'Intermediate',
    icon: 'people',
    color: '#8B5CF6',
  },
  {
    id: '5',
    title: 'Sales Mastery',
    description: 'Learn persuasion techniques and close more deals.',
    progress: 0,
    totalLessons: 14,
    duration: '3h',
    level: 'Advanced',
    icon: 'trending-up',
    color: '#EF4444',
  },
];

export const lessons = [
  {
    id: '1',
    courseId: '1',
    title: 'What is Entrepreneurship?',
    description: 'Understanding the mindset and journey of an entrepreneur.',
    duration: '12 min',
    completed: true,
    order: 1,
  },
  {
    id: '2',
    courseId: '1',
    title: 'Finding Your Idea',
    description: 'How to identify problems worth solving.',
    duration: '15 min',
    completed: true,
    order: 2,
  },
  {
    id: '3',
    courseId: '1',
    title: 'Market Research Basics',
    description: 'Understanding your target audience and competition.',
    duration: '18 min',
    completed: false,
    order: 3,
  },
  {
    id: '4',
    courseId: '1',
    title: 'Building Your MVP',
    description: 'Creating a minimum viable product to test your idea.',
    duration: '20 min',
    completed: false,
    order: 4,
  },
  {
    id: '5',
    courseId: '1',
    title: 'Customer Validation',
    description: 'Getting feedback and iterating on your product.',
    duration: '14 min',
    completed: false,
    order: 5,
  },
];

export const aiChatMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: 'Hey! I\'m your AI Business Coach. Ready to help you build your entrepreneurial skills. What would you like to work on today?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    role: 'user' as const,
    content: 'I have an idea for an app but I\'m not sure if it\'s good enough.',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: 'That\'s a great place to start! Every successful company began with an idea that someone believed in. Let me help you validate it.\n\nCan you tell me:\n1. What problem does your app solve?\n2. Who would use it?\n3. Why do you think this solution is better than what exists?',
    timestamp: new Date(Date.now() - 180000),
  },
];

export const quickPrompts = [
  'Validate my business idea',
  'Help me create a pitch',
  'Marketing strategies',
  'Financial planning tips',
];

export const onboardingQuestions = [
  {
    id: '1',
    question: 'What\'s your main goal?',
    options: [
      { id: 'a', text: 'Start my first business', icon: 'rocket' },
      { id: 'b', text: 'Grow an existing idea', icon: 'trending-up' },
      { id: 'c', text: 'Learn entrepreneurship', icon: 'school' },
      { id: 'd', text: 'Build side income', icon: 'cash' },
    ],
  },
  {
    id: '2',
    question: 'How much time can you dedicate daily?',
    options: [
      { id: 'a', text: '5-10 minutes', icon: 'time' },
      { id: 'b', text: '15-30 minutes', icon: 'timer' },
      { id: 'c', text: '30-60 minutes', icon: 'hourglass' },
      { id: 'd', text: '1+ hours', icon: 'infinite' },
    ],
  },
];

export const quickActions = [
  { id: '1', title: 'Daily Challenge', icon: 'flash', color: '#F59E0B' },
  { id: '2', title: 'AI Coach', icon: 'chatbubbles', color: '#00D4FF' },
  { id: '3', title: 'Community', icon: 'people', color: '#8B5CF6' },
  { id: '4', title: 'Resources', icon: 'library', color: '#10B981' },
];
