
## Remove "Mi Perfil" from Desktop Top Bar

### Problem
The "My Profile" nav link appears in the desktop header alongside the avatar bubble menu, which already has a "Profile" option in its dropdown. This is redundant and clutters the navigation.

### Change
**File**: `src/components/layout/Header.tsx`

Remove the `{user && <NavLink to={ROUTES.profile}>...</NavLink>}` block from the **desktop navigation section only** (the `hidden md:flex` div).

Keep the equivalent "My Profile" link in the **mobile Sheet nav** — mobile users don't have access to the avatar dropdown, so it remains necessary there.

### Scope
- 1 file changed
- ~8 lines removed
- Zero impact on mobile navigation, auth flow, or any other feature
