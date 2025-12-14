# Caldi's Cup - Product Backlog

This file tracks all discussed but unimplemented features, organized by priority and phase.

---

## Feature Backlog

| Priority | Feature | Phase | Status | Description |
|----------|---------|-------|--------|-------------|
| 🔴 High | Onboarding Flow | 2 | Not Started | Multi-step wizard explaining Caldi AI after CTA click |
| 🔴 High | Authentication System | 2 | Not Started | Guest vs. Sign-in user flow with Supabase |
| 🔴 High | User Dashboard | 2 | Not Started | Personal AI barista interface with Caldi |
| 🔴 High | Coffee Preference Quiz | 2 | Not Started | 4-6 visual card-based questions |
| 🔴 High | Results Page | 2 | Not Started | Personalized taste profile visualization |
| 🟡 Medium | Waitlist Signup | 2 | Not Started | Email capture form with validation |
| 🟡 Medium | Header Scroll Animation | 2 | Not Started | Logo fade transition on scroll past hero |
| 🟡 Medium | Mobile Navigation | 2+ | Not Started | Hamburger menu for multi-page navigation |
| 🟢 Low | Animations & Motion | 3 | Deferred | Bouncy micro-interactions and transitions |
| 🟢 Low | Dark Mode Toggle | 3 | Not Started | UI toggle with localStorage persistence |
| 🟢 Low | Testing Suite | 3 | Not Started | Unit tests per TDD mandate |
| 🟢 Low | Accessibility Audit | 3 | Not Started | ARIA labels, keyboard navigation, screen readers |
| 🟢 Low | SEO Optimization | 3 | Not Started | Meta tags, structured data, Open Graph |
| 🟢 Low | PWA Support | 4 | Not Started | Offline capability, installable app |

---

## High-Priority Feature Specifications

### 1. Onboarding Flow

**User Story**: As a new visitor, I want to understand what Caldi AI does for me before creating an account, so I can decide if it's right for my coffee journey.

**Trigger**: Click "Give Caldi AI a try!" CTA (hero or solution section)

**Acceptance Criteria**:
- [ ] Multi-step carousel/wizard (3-4 slides)
- [ ] Explains Caldi as personal AI barista
- [ ] Visual storytelling with Caldi mascot
- [ ] Skip option available
- [ ] Leads to authentication choice

**Technical Notes**:
- Route: `/onboarding`
- Component: `src/features/onboarding/`
- State: Local (no backend needed for onboarding content)

**Dependencies**: None (UI-only first)

---

### 2. Authentication System

**User Story**: As a visitor, I want to choose between trying as a guest or creating an account, so I can access Caldi at my comfort level.

**Acceptance Criteria**:
- [ ] Guest mode: Quick access with limited features
- [ ] Sign-up: Email/password registration
- [ ] Sign-in: Returning user login
- [ ] Social login (Google) - optional for MVP
- [ ] Profile creation on first sign-up

**Technical Notes**:
- Route: `/auth` (handles login/signup/guest)
- Uses Supabase Auth
- Guest sessions stored in localStorage initially
- Signed-in users persist preferences to database

**Dependencies**: Lovable Cloud / Supabase integration

**Open Questions**:
- What features are guest-only vs. signed-in only?
- Session duration for guests?

---

### 3. User Dashboard

**User Story**: As a user, I want a personal dashboard where Caldi helps me with my coffee journey, so I can get personalized recommendations and track my preferences.

**Acceptance Criteria**:
- [ ] Welcome message with user name (or "Coffee Explorer" for guests)
- [ ] Caldi AI chat/assistant interface
- [ ] Quick access to taste profile
- [ ] Recent recommendations
- [ ] Action cards for next steps

**Technical Notes**:
- Route: `/dashboard`
- Component: `src/features/dashboard/`
- Protected route (requires auth or guest session)

**Dependencies**: Authentication System

**Open Questions**:
- What are the core dashboard widgets for MVP?
- How does Caldi AI communicate (chat, cards, both)?

---

### 4. Coffee Preference Quiz

**User Story**: As a user, I want to answer questions about my coffee preferences, so Caldi can understand my taste and make personalized recommendations.

**Acceptance Criteria**:
- [ ] 4-6 questions covering:
  - Intensity preference (light to bold)
  - Flavor profile (fruity, nutty, chocolatey, earthy)
  - Brewing method (espresso, pour-over, French press, etc.)
  - Ethical/origin preferences (organic, fair trade, single origin)
  - Optional: frequency, budget
- [ ] Visual card-based selections (not dropdowns)
- [ ] Progress indicator
- [ ] Back/forward navigation
- [ ] Results lead to Results Page

**Technical Notes**:
- Route: `/quiz`
- Component: `src/features/quiz/`
- State: Local first (mock data), then persist to Supabase
- Types already defined in `src/types/coffee.ts`

**Dependencies**: None for UI; Authentication for persistence

---

### 5. Results Page

**User Story**: As a user who completed the quiz, I want to see my personalized taste profile and coffee recommendations, so I understand my preferences.

**Acceptance Criteria**:
- [ ] Visual taste profile display (radar chart or similar)
- [ ] Primary flavor characteristics
- [ ] 3-5 mock coffee recommendations
- [ ] CTA to join waitlist or continue to dashboard
- [ ] Shareable results (future)

**Technical Notes**:
- Route: `/results`
- Component: `src/features/quiz/ResultsPage.tsx`
- Uses quiz responses to generate profile
- Mock recommendations initially

**Dependencies**: Coffee Preference Quiz

---

## Development Notes

### Mandates from Knowledge File
- **UI/UX First**: Complete visual design before backend integration
- **TDD Workflow**: Write tests before implementation for complex logic
- **Animations Deferred**: Keep UI static for MVP, add motion in Phase 3
- **Security**: Zero-trust approach when handling user input

### Phase Sequence
1. ✅ Phase 1: Landing Page & Design System (Complete)
2. 🔄 Phase 2: Onboarding → Auth → Quiz → Results → Dashboard
3. ⏳ Phase 3: Polish, Animations, Dark Mode, Testing
4. ⏳ Phase 4: PWA, Advanced Features

---

*Last Updated: 2025-01-14*
