import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../src/context/ThemeContext';

type Question = { title: string; answers: [string, string, string, string]; correct: number; why: string };
type Chapter = { name: string; emoji: string; questions: Question[] };
const CHAPTERS: Chapter[] = [
  { name: 'Founder Mindset', emoji: '🧠', questions: [
    { title: 'What is the best starting point for a business idea?', answers: ['A real customer problem', 'An expensive logo', 'A large office', 'A viral slogan'], correct: 0, why: 'Successful businesses solve problems people actually have.' },
    { title: 'What is an MVP?', answers: ['A complete product with every feature', 'The cheapest possible ad', 'A simple version to test demand', 'A company registration'], correct: 2, why: 'A minimum viable product tests your most important assumption quickly.' },
    { title: 'How do you validate a new idea?', answers: ['Ask only your friends', 'Talk to potential customers', 'Buy followers', 'Build for a year in secret'], correct: 1, why: 'Customer interviews and real behavior give stronger evidence than guesses.' },
  ] },
  { name: 'Marketing Master', emoji: '📣', questions: [
    { title: 'What is a target audience?', answers: ['Everyone on the internet', 'People most likely to need your offer', 'Only people who follow you', 'Your competitors'], correct: 1, why: 'A clear audience helps you make relevant products and messages.' },
    { title: 'What does conversion rate measure?', answers: ['How many people take a desired action', 'How many posts you publish', 'Your total revenue', 'The size of your team'], correct: 0, why: 'Conversions are meaningful actions such as signups or purchases.' },
    { title: 'Which message is usually stronger?', answers: ['We are the best', 'We have many features', 'We help freelancers save 3 hours a week', 'Buy now!!!'], correct: 2, why: 'Specific customer benefits are easier to understand and evaluate.' },
  ] },
  { name: 'Money & Finance', emoji: '💰', questions: [
    { title: 'You sell for €50 and variable costs are €20. Contribution margin?', answers: ['€20', '€30', '€50', '€70'], correct: 1, why: 'Contribution margin = selling price minus variable costs = €30.' },
    { title: 'What is cash flow?', answers: ['The number of customers', 'Money moving in and out', 'Only your profit', 'Your advertising budget'], correct: 1, why: 'A profitable business can still fail if it runs out of cash.' },
    { title: 'Fixed costs are €600 and contribution margin is €30. Break-even units?', answers: ['10', '15', '20', '30'], correct: 2, why: 'Break-even units = fixed costs / contribution margin = 600 / 30 = 20.' },
  ] },
  { name: 'Sales Academy', emoji: '🤝', questions: [
    { title: 'What should you do before pitching a solution?', answers: ['Understand the customer need', 'Offer a discount immediately', 'Talk without listening', 'Promise impossible results'], correct: 0, why: 'Good selling begins with understanding the problem.' },
    { title: 'A customer says the price is too high. Best first response?', answers: ['Argue with them', 'Ask about their budget and expected value', 'End the call', 'Offer 90% off'], correct: 1, why: 'Clarifying the objection helps you respond appropriately.' },
    { title: 'What makes an offer compelling?', answers: ['Vague claims', 'Clear value and trustworthy proof', 'Pressure only', 'Hidden conditions'], correct: 1, why: 'Clear benefits and evidence build trust.' },
  ] },
];
export default function BusinessQuiz() {
  const router = useRouter();
  const { colors } = useTheme();
  const [chapter, setChapter] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const selected = chapter === null ? null : CHAPTERS[chapter];
  const question = selected?.questions[index];
  const answered = choice !== null;
  const isCorrect = answered && choice === question?.correct;
  const accent = '#00D4FF';
  const start = (i: number) => { setChapter(i); setIndex(0); setChoice(null); setCorrect(0); setFinished(false); };
  const next = () => {
    if (!selected || !answered) return;
    const updated = correct + (isCorrect ? 1 : 0);
    setCorrect(updated);
    if (index + 1 === selected.questions.length) setFinished(true);
    else { setIndex(index + 1); setChoice(null); }
  };
  const card = { backgroundColor: colors.background.card, borderRadius: 18, padding: 18, marginBottom: 12 } as const;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background.primary }} contentContainerStyle={{ padding: 22, paddingTop: 64, paddingBottom: 80 }}>
      <TouchableOpacity onPress={() => chapter === null ? router.back() : setChapter(null)} style={{ marginBottom: 26 }}>
        <Ionicons name="arrow-back" size={26} color={colors.text.primary} />
      </TouchableOpacity>
      {chapter === null ? <>
        <Text style={{ fontSize: 13, fontWeight: '700', color: accent, letterSpacing: 2 }}>BUSINESS ACADEMY</Text>
        <Text style={{ fontSize: 32, fontWeight: '900', color: colors.text.primary, marginTop: 8 }}>Learn by playing 🚀</Text>
        <Text style={{ color: colors.text.secondary, marginVertical: 18 }}>Quick business challenges. Choose a chapter and test your skills.</Text>
        {CHAPTERS.map((c, i) => (
          <TouchableOpacity key={c.name} onPress={() => start(i)} style={card} accessibilityRole="button">
            <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: '800' }}>{c.emoji}  {c.name}</Text>
            <Text style={{ color: colors.text.secondary, marginTop: 8 }}>3 questions · about 2 minutes</Text>
          </TouchableOpacity>
        ))}
      </> : finished ? <>
        <Text style={{ fontSize: 54, textAlign: 'center' }}>{correct === selected!.questions.length ? '🏆' : '🎯'}</Text>
        <Text style={{ fontSize: 30, fontWeight: '900', color: colors.text.primary, textAlign: 'center', marginTop: 14 }}>Chapter complete!</Text>
        <Text style={{ fontSize: 18, color: colors.text.secondary, textAlign: 'center', marginVertical: 24 }}>{correct} / {selected!.questions.length} correct</Text>
        <Text style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: 24 }}>Practice mode: results are not yet saved to your profile or XP.</Text>
        <TouchableOpacity onPress={() => start(chapter)} style={{ ...card, backgroundColor: accent }}><Text style={{ textAlign: 'center', color: '#06121E', fontWeight: '900' }}>Try again</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setChapter(null)} style={card}><Text style={{ textAlign: 'center', color: colors.text.primary }}>All chapters</Text></TouchableOpacity>
      </> : <>
        <Text style={{ color: accent, fontWeight: '800' }}>{selected!.emoji} {selected!.name}</Text>
        <Text style={{ color: colors.text.secondary, marginTop: 12 }}>Question {index + 1} of {selected!.questions.length}</Text>
        <View style={{ height: 9, borderRadius: 9, backgroundColor: colors.background.tertiary, marginTop: 12, marginBottom: 30, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${(index + 1) / selected!.questions.length * 100}%`, backgroundColor: accent }} />
        </View>
        <Text style={{ fontSize: 25, fontWeight: '800', color: colors.text.primary, marginBottom: 26 }}>{question!.title}</Text>
        {question!.answers.map((answer, i) => {
          const chosen = choice === i;
          const showCorrect = answered && i === question!.correct;
          return <TouchableOpacity key={i} disabled={answered} onPress={() => { Haptics.selectionAsync(); setChoice(i); }}
            accessibilityRole="button" style={{ ...card, borderWidth: 2, borderColor: showCorrect ? '#22C55E' : chosen ? '#EF4444' : colors.border.default }}>
            <Text style={{ color: colors.text.primary, fontWeight: '700', fontSize: 16 }}>{String.fromCharCode(65 + i)}.  {answer}</Text>
          </TouchableOpacity>;
        })}
        {answered && <View style={{ ...card, borderColor: isCorrect ? '#22C55E' : '#F59E0B', borderWidth: 1 }}>
          <Text style={{ color: colors.text.primary, fontWeight: '800', marginBottom: 8 }}>{isCorrect ? 'Correct! 🎉' : 'Keep learning 💡'}</Text>
          <Text style={{ color: colors.text.secondary }}>{question!.why}</Text>
        </View>}
        <TouchableOpacity disabled={!answered} onPress={next} style={{ ...card, backgroundColor: answered ? accent : colors.background.tertiary, marginTop: 12 }}>
          <Text style={{ color: answered ? '#06121E' : colors.text.muted, textAlign: 'center', fontWeight: '900', fontSize: 17 }}>{index + 1 === selected!.questions.length ? 'Finish chapter' : 'Continue'}</Text>
        </TouchableOpacity>
      </>}
    </ScrollView>
  );
}
