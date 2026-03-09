
# Plan: Global Gamification & "Duolingo for Coffee" Model

We are elevating the gamification system from just the learning module to a global app-wide feature. Every meaningful interaction will now contribute to the user's XP and Daily Streak. 

Here is the plan to establish the standards and database foundation:

## 1. Create Documentation Standard
I will create a new file at `docs/GAMIFICATION_STANDARD.md` to serve as the source of truth for all future development. It will include:

**The Core Philosophy**
* "Every meaningful user action must be rewarded with XP to drive Current User Retention Rate (CURR)."

**XP Action Dictionary**
A centralized mapping of actions to their XP rewards, for example:
* `complete_lesson`: 15 XP
* `scan_coffee_bag`: 10 XP
* `log_brew_recipe`: 20 XP
* `rate_coffee`: 5 XP
* `perfect_lesson_bonus`: 5 XP

**Implementation Rule**
* "Whenever a new feature is built, the developer MUST hook its success state into the global `useXP` and `useStreak` hooks to reward the user."

## 2. Database Schema Updates (Migration)
Currently, XP and streaks are isolated within the `learning_user_streaks` table. To make this global, I will generate a Supabase SQL migration that performs the following:

**A. Create `user_xp_logs` table**
To create an audit trail of all XP-generating actions:
* `id` (uuid, primary key)
* `user_id` (uuid, references `auth.users`)
* `action_type` (text - e.g., 'scan_coffee', 'complete_lesson')
* `xp_amount` (integer)
* `created_at` (timestamp)
* **RLS Policies**: Enable Row Level Security so users can only view their own XP logs.

**B. Update `profiles` table**
To make streak and XP data globally accessible across the app without joining learning-specific tables:
* Add `total_xp` (integer, default: 0)
* Add `current_streak` (integer, default: 0)

*Note on Architecture:* Once these columns are added, a subsequent task will be to refactor the existing `update_streak_and_xp` database RPC (which currently updates `learning_user_streaks`) to update the global `profiles` table and insert a record into the new `user_xp_logs` table.

---
Let me know if you approve this foundation so I can generate the markdown file and the SQL migration!
