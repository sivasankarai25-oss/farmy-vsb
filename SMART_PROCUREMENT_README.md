# FARMY Smart Procurement — what was added

A new module bolted onto the existing FARMY app, without touching how the rest
of FARMY works. Same Firebase project, same login, same design system.

## New files
- `src/procurement/` — types, pure date/slot/queue math (`logic.ts`), and the
  Firestore data layer (`service.ts`, `hooks.ts`, `i18n.ts` for EN/TA/ML/HI/AR).
- `src/components/procurement/` — all the screens (dashboard, slot booking,
  digital token + QR, live queue, status timeline, payment status, centre
  finder, notifications, officer/admin dashboard).

## Touched files (small, additive edits only)
- `src/firebase.ts` — exports a few extra Firestore helpers (`where`,
  `onSnapshot`, `writeBatch`, `arrayUnion`, `updateDoc`). Nothing removed.
- `src/components/Navigation.tsx` — one new bottom-nav tab, "🏪 Procurement".
- `src/App.tsx` — one new `activeTab === 'procurement'` branch.
- `src/components/HomeScreen.tsx` — one new promo card, same pattern as the
  existing Quiz card.
- `firestore.rules` — new rules appended at the end for the new collections
  only; every existing rule is untouched.
- `package.json` — added `qrcode.react` for the ticket QR code.
- `netlify.toml` — added (wasn't present before) so the build/publish/SPA
  redirect config is explicit for Netlify.

## Data model (new Firestore collections only)
`procurementProfiles`, `procurementCentres`, `procurementSlots`,
`procurementCounters`, `procurementBookings`, `procurementQueue`,
`procurementNotifications`, `procurementOfficers`.

Slot booking and token numbering happen inside one Firestore transaction, so
two farmers can never take the same last seat, and the live queue is driven
entirely by real booking documents via `onSnapshot` — no fake numbers.

## Farmer profile reuse
On first visit to Procurement, the farmer's name, phone and (if available)
district/state are pre-filled from their existing FARMY account, so nothing
is asked twice. They confirm once and it's saved to `procurementProfiles`.

## Becoming a procurement officer
An "officer" is just a signed-in user with a document at
`procurementOfficers/{uid}`. There's no second login: create that document
for a staff account from the Firebase console (or Admin SDK) and the
"🏪 Procurement" tab in their app will show the extra Centre Dashboard card.

## Before you deploy
1. `npm install` (adds `qrcode.react`).
2. Deploy the updated `firestore.rules` (`firebase deploy --only firestore:rules`),
   or Smart Procurement will show permission errors.
3. From the new Centre Dashboard → "Manage centres" → "Load 3 sample centres"
   to get started quickly, or add your real centres there.
4. Netlify: nothing else to configure — it's a static Vite build talking
   straight to your existing Firebase project from the browser.
