// EntrepreneurAI Dummy Data

export const userData = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@entrepreneur.ai',
  avatar: null,
  hustleScore: 2450,
  level: 12,
  streak: 7,
  totalXP: 12450,
  coursesCompleted: 3,
  lessonsCompleted: 47,
  joinedDate: '2025-01-15',
  bio: 'Aspiring entrepreneur building the future.',
};

export const allBadges = [
  { id: '1', name: 'Early Bird', description: 'Complete a lesson before 8 AM', icon: 'sunny', color: '#F59E0B', earned: true, earnedDate: '2025-01-20' },
  { id: '2', name: 'First Course', description: 'Complete your first course', icon: 'school', color: '#10B981', earned: true, earnedDate: '2025-02-10' },
  { id: '3', name: 'Week Streak', description: 'Learn 7 days in a row', icon: 'flame', color: '#EF4444', earned: true, earnedDate: '2025-02-15' },
  { id: '4', name: 'Idea Maker', description: 'Generate 10 ideas with AI Coach', icon: 'bulb', color: '#8B5CF6', earned: true, earnedDate: '2025-02-20' },
  { id: '5', name: 'Community Star', description: 'Get 50 likes on your posts', icon: 'star', color: '#00D4FF', earned: false },
  { id: '6', name: 'Mentor', description: 'Help 10 community members', icon: 'heart', color: '#EC4899', earned: false },
  { id: '7', name: 'Marathon', description: 'Complete 100 lessons', icon: 'trophy', color: '#F59E0B', earned: false },
  { id: '8', name: 'Night Owl', description: 'Complete a lesson after midnight', icon: 'moon', color: '#6366F1', earned: false },
];

export const dailyTasks = [
  { id: '1', title: 'Complete Today\'s Lesson', description: 'Market Research Basics', xp: 50, completed: false, type: 'lesson' },
  { id: '2', title: 'Practice with AI Coach', description: 'Ask 3 questions', xp: 30, completed: true, type: 'coach' },
  { id: '3', title: 'Read Community Post', description: 'Engage with 1 post', xp: 15, completed: false, type: 'community' },
  { id: '4', title: 'Review Yesterday\'s Notes', description: 'Spaced repetition', xp: 20, completed: false, type: 'review' },
];

export const dailyChallenge = {
  id: 'dc1',
  title: 'Market Validation Sprint',
  description: 'Complete 3 market research activities and validate one business idea with the AI Coach.',
  xp: 150,
  timeLimit: '24h',
  tasks: [
    { id: 't1', title: 'Complete Market Research lesson', done: false },
    { id: 't2', title: 'Identify 3 competitors', done: false },
    { id: 't3', title: 'Validate idea with AI Coach', done: false },
  ],
  progress: 0,
};

export const courses = [
  {
    id: '1',
    title: 'Startup Fundamentals',
    description: 'Learn the basics of building a successful startup from idea to launch.',
    longDescription: 'This comprehensive course covers everything you need to know about starting a business. From ideation to execution, you\'ll learn the frameworks used by successful entrepreneurs worldwide.',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    duration: '2h 30m',
    level: 'Beginner',
    icon: 'rocket',
    color: '#00D4FF',
    instructor: 'Sarah Chen',
    rating: 4.9,
    students: 12500,
  },
  {
    id: '2',
    title: 'Digital Marketing 101',
    description: 'Master social media, SEO, and content marketing for your business.',
    longDescription: 'Learn how to reach your target audience through digital channels. This course covers social media marketing, search engine optimization, content strategy, and paid advertising.',
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
    duration: '3h 15m',
    level: 'Beginner',
    icon: 'megaphone',
    color: '#10B981',
    instructor: 'Mike Ross',
    rating: 4.8,
    students: 9800,
  },
  {
    id: '3',
    title: 'Financial Literacy',
    description: 'Understand budgeting, investing, and managing business finances.',
    longDescription: 'Take control of your finances with this essential course. Learn budgeting, cash flow management, investment basics, and how to read financial statements.',
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    duration: '2h',
    level: 'Intermediate',
    icon: 'cash',
    color: '#F59E0B',
    instructor: 'Emma Watson',
    rating: 4.7,
    students: 7200,
  },
  {
    id: '4',
    title: 'Leadership Skills',
    description: 'Develop essential leadership and team management abilities.',
    longDescription: 'Great leaders aren\'t born, they\'re made. Learn communication, delegation, motivation, and conflict resolution skills that will make you an effective leader.',
    progress: 0,
    totalLessons: 8,
    completedLessons: 0,
    duration: '1h 45m',
    level: 'Intermediate',
    icon: 'people',
    color: '#8B5CF6',
    instructor: 'David Kim',
    rating: 4.9,
    students: 6500,
  },
  {
    id: '5',
    title: 'Sales Mastery',
    description: 'Learn persuasion techniques and close more deals.',
    longDescription: 'Master the art of selling. From cold outreach to closing deals, this course teaches you proven sales techniques used by top performers.',
    progress: 0,
    totalLessons: 14,
    completedLessons: 0,
    duration: '3h',
    level: 'Advanced',
    icon: 'trending-up',
    color: '#EF4444',
    instructor: 'Jordan Bell',
    rating: 4.8,
    students: 5400,
  },
  {
    id: '6',
    title: 'Product Development',
    description: 'Build products users love with design thinking and agile methods.',
    longDescription: 'Learn how to take a product from concept to launch. Covers user research, prototyping, MVP development, and iterative improvement.',
    progress: 0,
    totalLessons: 11,
    completedLessons: 0,
    duration: '2h 20m',
    level: 'Intermediate',
    icon: 'construct',
    color: '#06B6D4',
    instructor: 'Lisa Park',
    rating: 4.6,
    students: 4800,
  },
  {
    id: '7',
    title: 'Networking & Connections',
    description: 'Build valuable relationships and expand your network.',
    longDescription: 'Your network is your net worth. Learn how to build meaningful professional relationships, attend networking events, and leverage LinkedIn.',
    progress: 0,
    totalLessons: 9,
    completedLessons: 0,
    duration: '1h 30m',
    level: 'Beginner',
    icon: 'git-network',
    color: '#EC4899',
    instructor: 'Tom Richards',
    rating: 4.5,
    students: 3900,
  },
];

export const courseLessons: { [key: string]: typeof lessons } = {
  '1': [
    { id: '1-1', courseId: '1', title: 'What is Entrepreneurship?', description: 'Understanding the mindset and journey of an entrepreneur.', duration: '12 min', completed: true, order: 1 },
    { id: '1-2', courseId: '1', title: 'Finding Your Idea', description: 'How to identify problems worth solving.', duration: '15 min', completed: true, order: 2 },
    { id: '1-3', courseId: '1', title: 'Market Research Basics', description: 'Understanding your target audience and competition.', duration: '18 min', completed: true, order: 3 },
    { id: '1-4', courseId: '1', title: 'Building Your MVP', description: 'Creating a minimum viable product to test your idea.', duration: '20 min', completed: true, order: 4 },
    { id: '1-5', courseId: '1', title: 'Customer Validation', description: 'Getting feedback and iterating on your product.', duration: '14 min', completed: true, order: 5 },
    { id: '1-6', courseId: '1', title: 'Business Model Canvas', description: 'Mapping out your business strategy.', duration: '16 min', completed: true, order: 6 },
    { id: '1-7', courseId: '1', title: 'Funding Options', description: 'Bootstrapping, angels, and VCs explained.', duration: '22 min', completed: true, order: 7 },
    { id: '1-8', courseId: '1', title: 'Building Your Team', description: 'How to find and recruit co-founders.', duration: '18 min', completed: true, order: 8 },
    { id: '1-9', courseId: '1', title: 'Legal Basics', description: 'Incorporation, contracts, and IP protection.', duration: '15 min', completed: false, order: 9 },
    { id: '1-10', courseId: '1', title: 'Launch Strategy', description: 'Planning and executing your product launch.', duration: '20 min', completed: false, order: 10 },
    { id: '1-11', courseId: '1', title: 'Growth Hacking', description: 'Rapid experimentation for growth.', duration: '17 min', completed: false, order: 11 },
    { id: '1-12', courseId: '1', title: 'Scaling Your Startup', description: 'From startup to scaleup: next steps.', duration: '19 min', completed: false, order: 12 },
  ],
  '2': [
    { id: '2-1', courseId: '2', title: 'Digital Marketing Overview', description: 'Introduction to online marketing channels.', duration: '10 min', completed: true, order: 1 },
    { id: '2-2', courseId: '2', title: 'Social Media Fundamentals', description: 'Choosing the right platforms.', duration: '14 min', completed: true, order: 2 },
    { id: '2-3', courseId: '2', title: 'Content Strategy', description: 'Creating content that converts.', duration: '18 min', completed: true, order: 3 },
    { id: '2-4', courseId: '2', title: 'SEO Basics', description: 'Ranking higher in search results.', duration: '20 min', completed: true, order: 4 },
    { id: '2-5', courseId: '2', title: 'Email Marketing', description: 'Building and nurturing your list.', duration: '16 min', completed: true, order: 5 },
    { id: '2-6', courseId: '2', title: 'Paid Advertising', description: 'Facebook, Google, and TikTok ads.', duration: '22 min', completed: false, order: 6 },
    { id: '2-7', courseId: '2', title: 'Analytics & Tracking', description: 'Measuring what matters.', duration: '15 min', completed: false, order: 7 },
    { id: '2-8', courseId: '2', title: 'Influencer Marketing', description: 'Partnering with creators.', duration: '13 min', completed: false, order: 8 },
  ],
};

export const lessons = courseLessons['1'];

export const communityPosts = [
  {
    id: '1',
    author: { id: 'u1', name: 'Jessica Miller', avatar: null, level: 15 },
    content: 'Just launched my first MVP! After 3 months of learning on EntrepreneurAI, I finally built a simple meal planning app. The market research lessons really helped me validate the idea. Thanks everyone for the support! 🚀',
    likes: 47,
    comments: 12,
    timestamp: new Date(Date.now() - 3600000 * 2),
    liked: false,
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Marcus Chen', avatar: null, level: 23 },
    content: 'Pro tip: When doing customer interviews, always ask "Tell me about the last time you..." instead of hypotheticals. You\'ll get much better insights! Learned this from the Customer Validation lesson.',
    likes: 89,
    comments: 23,
    timestamp: new Date(Date.now() - 3600000 * 5),
    liked: true,
  },
  {
    id: '3',
    author: { id: 'u3', name: 'Sarah Thompson', avatar: null, level: 8 },
    content: 'Looking for a co-founder for my EdTech startup idea! Need someone with technical skills. DM me if interested. Currently going through the Building Your Team lesson.',
    likes: 23,
    comments: 8,
    timestamp: new Date(Date.now() - 3600000 * 12),
    liked: false,
  },
  {
    id: '4',
    author: { id: 'u4', name: 'David Park', avatar: null, level: 31 },
    content: 'Milestone: Hit 10,000 users on my SaaS product today! Started with the idea from the Startup Fundamentals course 6 months ago. Never give up on your dreams! 💪',
    likes: 156,
    comments: 34,
    timestamp: new Date(Date.now() - 3600000 * 24),
    liked: true,
  },
];

export const postComments = [
  { id: 'c1', postId: '1', author: { id: 'u5', name: 'Tom Wilson', level: 12 }, content: 'Congrats! What stack did you use?', timestamp: new Date(Date.now() - 3600000), likes: 5 },
  { id: 'c2', postId: '1', author: { id: 'u6', name: 'Emily Rose', level: 9 }, content: 'This is so inspiring! I\'m just starting out.', timestamp: new Date(Date.now() - 1800000), likes: 3 },
  { id: 'c3', postId: '1', author: { id: 'u1', name: 'Jessica Miller', level: 15 }, content: 'Thanks everyone! Used React Native and Firebase.', timestamp: new Date(Date.now() - 900000), likes: 8 },
];

export const analyticsData = {
  weeklyXP: [120, 85, 150, 200, 95, 180, 220],
  weeklyStreak: [1, 2, 3, 4, 5, 6, 7],
  monthlyProgress: [
    { month: 'Jan', xp: 1200, lessons: 15 },
    { month: 'Feb', xp: 1850, lessons: 22 },
    { month: 'Mar', xp: 2100, lessons: 28 },
    { month: 'Apr', xp: 1600, lessons: 18 },
    { month: 'May', xp: 2400, lessons: 31 },
    { month: 'Jun', xp: 2800, lessons: 35 },
  ],
  categoryBreakdown: [
    { category: 'Business', hours: 12, color: '#00D4FF' },
    { category: 'Marketing', hours: 8, color: '#10B981' },
    { category: 'Finance', hours: 4, color: '#F59E0B' },
    { category: 'Leadership', hours: 3, color: '#8B5CF6' },
  ],
  streakCalendar: generateStreakCalendar(),
};

function generateStreakCalendar() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.3,
      xp: Math.floor(Math.random() * 200) + 50,
    });
  }
  return days;
}

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
  'Validate my idea',
  'Create a pitch',
  'Marketing help',
  'Financial tips',
];

export const suggestedPrompts = [
  { id: '1', category: 'Ideas', prompt: 'Help me brainstorm business ideas in the wellness space', icon: 'bulb' },
  { id: '2', category: 'Validation', prompt: 'How do I validate if my idea has market demand?', icon: 'checkmark-circle' },
  { id: '3', category: 'Marketing', prompt: 'Create a social media content calendar for my startup', icon: 'megaphone' },
  { id: '4', category: 'Finance', prompt: 'How much runway do I need before launching?', icon: 'cash' },
  { id: '5', category: 'Pitch', prompt: 'Help me create a 60-second elevator pitch', icon: 'mic' },
  { id: '6', category: 'Growth', prompt: 'What are the best growth hacking strategies?', icon: 'trending-up' },
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
  { id: '1', title: 'Challenge', icon: 'flash', color: '#F59E0B', route: '/challenge' },
  { id: '2', title: 'AI Coach', icon: 'chatbubbles', color: '#00D4FF', route: '/(tabs)/coach' },
  { id: '3', title: 'Community', icon: 'people', color: '#8B5CF6', route: '/community' },
  { id: '4', title: 'Analytics', icon: 'stats-chart', color: '#10B981', route: '/analytics' },
];
