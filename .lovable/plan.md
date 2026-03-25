

## Plan: Enhance Sound Design with Richer Audio and Mute Toggle

### Changes

#### 1. `src/constants/storageKeys.ts` — Add mute key
Add `SOUND_MUTED: 'caldi_sound_muted'` to the storage keys object.

#### 2. `src/features/learning/utils/sounds.ts` — Richer sounds + mute support
- Add `muted` property initialized from `localStorage('caldi_sound_muted')`
- Add `toggleMute()` method that flips the flag and persists to localStorage, returns new state
- Add `isMuted()` getter
- All `play*` methods early-return if muted
- **`playCorrect()`**: 3-note arpeggio F#4(370Hz) → A#4(466Hz) → C#5(554Hz), 80ms spacing, sine wave
- **`playIncorrect()`**: descending E4(330Hz) → C4(262Hz), triangle wave, 100ms spacing
- **`playLessonComplete()`**: 5-note fanfare C5(523) → E5(659) → G5(784) → C6(1047) → E6(1319), 50ms intervals, last note sustains 300ms
- **`playStreakMilestone()`**: deeper celebratory G4(392) → B4(494) → D5(587) → G5(784), 150ms each

#### 3. `src/features/learning/components/lesson/LessonComplete.tsx` — Play fanfare
Add `useEffect` on mount that calls `sounds.playLessonComplete()`.

#### 4. `src/features/learning/components/gamification/StreakMilestone.tsx` — Play streak sound
Add `useEffect` when `open` becomes true that calls `sounds.playStreakMilestone()`.

#### 5. `src/components/layout/Header.tsx` — Mute toggle button
- Import `Volume2, VolumeX` from lucide-react and `sounds` from the sound manager
- Add `isMuted` state initialized from `sounds.isMuted()`
- Add a ghost icon button (Volume2/VolumeX) placed before the user menu on desktop, and at top of mobile nav next to the language selector
- On click: call `sounds.toggleMute()` and update local state

### Files to modify
- `src/constants/storageKeys.ts`
- `src/features/learning/utils/sounds.ts`
- `src/features/learning/components/lesson/LessonComplete.tsx`
- `src/features/learning/components/gamification/StreakMilestone.tsx`
- `src/components/layout/Header.tsx`

