# Release checklist (integration branch)

## Server-side AI (required before testing)
1. Apply `supabase/migrations/20261016_ai_daily_usage.sql` to the correct Supabase project.
2. Deploy `supabase/functions/ai-coach/index.ts` as the `ai-coach` Edge Function. Keep JWT verification enabled.
3. Configure server-only secrets: `GROQ_API_KEY`, `REVENUECAT_SECRET_API_KEY` (RevenueCat legacy v1 secret key for the subscriber endpoint), `REVENUECAT_ENTITLEMENT_ID` (must match the configured entitlement).
4. Never put the Groq key or RevenueCat secret in `EXPO_PUBLIC_*`. Rotate the old Groq key if it has ever been embedded in a distributed build or committed elsewhere.
5. Verify free-user quota, Pro entitlement, concurrent requests, sign-out and sign-in, image uploads, and the UTC reset boundary.
6. Current quota is consumed before the AI provider responds; failed provider requests still count. Consider a reservation/refund strategy if needed.

## Purchases (not yet ready for production)
1. Configure `EXPO_PUBLIC_REVENUECAT_IOS_KEY` and `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` in EAS.
2. Verify package identifiers for weekly/yearly/lifetime and exact entitlement identifier.
3. Verify subscription trial eligibility and show exact introductory terms only when offered.
4. Set explicit iOS bundle identifier and Android package name in Expo config.
5. Test on native builds with Apple/Google sandbox. Expo Go is insufficient for native in-app purchases.
6. Confirm user switching and purchases restoration, and ensure server-side entitlement checks agree with client state.

## Content and compliance
- Replace lesson video/PDF placeholders with working resources.
- Confirm every advertised premium feature actually exists.
- Remove or verify any remaining fabricated social proof and testimonials.
- Check Terms/Privacy links and subscription disclosures.
- Run `npx tsc --noEmit`, lint, native builds, and device regression tests.

**Important:** This branch contains implementation drafts and is not validated for production. Do not merge before checks pass.
