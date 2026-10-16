# EntrepreneurAI 2.0 — Business learning game

## Implemented on this branch
- Business Academy practice screen at `frontend/app/business-quiz.tsx`: four chapters, 12 multiple-choice questions, explanations, progress indicator, result screen.
- Entry points in Dashboard and Courses; authenticated route registration.
- Fixed broken `getIsPro()` reference in Courses and aligned free-course locking for available and in-progress courses.
- Profile counters now query lesson progress and completed daily tasks.
- Lesson video/PDF HTTPS links open with native Linking and basic error feedback.
- Removed unverified onboarding marketing numbers.

## IMPORTANT: not finished or tested
- Quiz is explicitly **practice-only**: no XP, streak, or profile persistence. This prevents client-awarded XP cheating until a secure server-side completion mechanism exists.
- Build/typecheck/device testing was not possible in this execution environment. Treat changes as unverified.
- Existing lesson XP awarding uses several client-driven operations and should be migrated to a server-side transaction before connecting quiz results.
- Premium / RevenueCat configuration and Supabase Edge Function deployment remain outstanding.
- Four chapters are a first playable slice, not the entire planned curriculum.

## Next implementation phases
1. **Stability**: run `cd frontend && npm ci && npx tsc --noEmit`, Expo native builds and smoke tests; fix issues before merge.
2. **Progress engine**: create authoritative lesson and quiz attempts, unique completion rewards, server-validated XP, mastery scores, streaks, and test coverage.
3. **Learning paths**: add chapter/level/prerequisite models, more exercises (ordering, calculations, scenario decisions), progress resume, review scheduling and accessibility.
4. **Gamification**: streak recovery, daily goals, achievements, optional leagues with anti-cheat and privacy controls.
5. **Startup simulator**: sandbox company state, fictional budget, decision outcomes and replayable scenarios.
6. **AI mentor**: coach with lesson context, feedback rubrics and moderated community features.
7. **Content**: full curriculum authored and checked by qualified reviewers, localized for supported languages.
8. **Release**: RevenueCat and Supabase configuration, privacy and subscription disclosures, TestFlight/Play internal testing.

## Design principles
Keep the existing premium screen; use the current cyan/purple/dark visual language; prioritize 2–5 minute lessons, clear feedback and meaningful progress. Do not claim real customers, revenue, courses or testimonials without evidence.
