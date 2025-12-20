// Profile Mock Data - Premium Profile Screen
import { colors } from '../theme';

export const profileData = {
  // Basic Info
  id: 'user_001',
  name: 'Alex Johnson',
  email: 'alex@entrepreneur.ai',
  handle: '@alexhustle',
  avatar: null,
  bio: 'Building the future, one hustle at a time.',
  statusEmoji: '🚀',
  statusText: 'On a 7-day streak!',
  joinedDate: '2025-01-15',
  
  // Mission / Goal
  mission: {
    text: 'Launch my first paid product and make 100€ online.',
    deadline: '2025-07-15',
    progress: 65,
    daysLeft: 24,
  },
  
  // Stats
  stats: {
    hustleScore: 2450,
    currentStreak: 7,
    bestStreak: 14,
    lessonsDone: 47,
    tasksDone: 89,
    proofsUploaded: 12,
  },
  
  // Proof of Work
  proofs: [
    { id: 'p1', type: 'image', thumbnail: null, title: 'Landing Page', date: '2025-06-18' },
    { id: 'p2', type: 'image', thumbnail: null, title: 'First Sale', date: '2025-06-15' },
    { id: 'p3', type: 'image', thumbnail: null, title: 'MVP Screenshot', date: '2025-06-10' },
    { id: 'p4', type: 'video', thumbnail: null, title: 'Pitch Video', date: '2025-06-08' },
  ],
  totalProofs: 12,
  
  // Badges
  badges: [
    { id: 'b1', name: 'Early Bird', emoji: '🌅', color: '#F59E0B', earned: true, earnedDate: '2025-01-20' },
    { id: 'b2', name: 'First Course', emoji: '🎓', color: '#10B981', earned: true, earnedDate: '2025-02-10' },
    { id: 'b3', name: 'Week Streak', emoji: '🔥', color: '#EF4444', earned: true, earnedDate: '2025-02-15' },
    { id: 'b4', name: 'Idea Machine', emoji: '💡', color: '#8B5CF6', earned: true, earnedDate: '2025-02-20' },
    { id: 'b5', name: 'Proof Master', emoji: '📸', color: '#00D4FF', earned: true, earnedDate: '2025-03-01' },
    { id: 'b6', name: 'Community Star', emoji: '⭐', color: '#EC4899', earned: false },
    { id: 'b7', name: 'Mentor', emoji: '🧑‍🏫', color: '#06B6D4', earned: false },
    { id: 'b8', name: 'Marathon', emoji: '🏆', color: '#F59E0B', earned: false },
    { id: 'b9', name: 'Night Owl', emoji: '🦉', color: '#6366F1', earned: false },
    { id: 'b10', name: 'Perfectionist', emoji: '💎', color: '#14B8A6', earned: false },
  ],
  
  // Certificates
  certificates: [
    { 
      id: 'c1', 
      name: 'Startup Fundamentals', 
      status: 'completed',
      completedDate: '2025-05-20',
      courseId: '1',
    },
    { 
      id: 'c2', 
      name: 'Digital Marketing 101', 
      status: 'in_progress',
      progress: 67,
      courseId: '2',
      lessonsLeft: 5,
    },
    { 
      id: 'c3', 
      name: 'Financial Literacy', 
      status: 'locked',
      courseId: '3',
    },
  ],
  
  // Social Stats
  followers: 234,
  following: 156,
  communityPosts: 18,
  likes: 892,
};

export const settingsGroups = [
  {
    title: 'Account',
    items: [
      { id: 's1', title: 'Edit Profile', icon: 'person-outline', route: '/settings/edit-profile' },
      { id: 's2', title: 'Notifications', icon: 'notifications-outline', route: '/settings/notifications' },
      { id: 's3', title: 'Privacy & Security', icon: 'shield-outline', route: '/settings/privacy' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 's4', title: 'Learning Goals', icon: 'flag-outline', route: '/settings/goals' },
      { id: 's5', title: 'App Language', icon: 'language-outline', route: '/settings/language' },
      { id: 's6', title: 'Theme', icon: 'moon-outline', route: '/settings/theme' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 's7', title: 'Help Center', icon: 'help-circle-outline', route: '/settings/help' },
      { id: 's8', title: 'About', icon: 'information-circle-outline', route: '/settings/about' },
      { id: 's9', title: 'Rate the App', icon: 'star-outline', route: '/settings/rate' },
    ],
  },
];
