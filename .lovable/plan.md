

# Plan: Validate Required Environment Variables at Startup

## Change

### `src/main.tsx`

Before mounting React, check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present and non-empty. If either is missing, render a plain HTML error message to `#root` and return early — no React mount.

```ts
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;
const missing = requiredVars.filter(key => !import.meta.env[key]);

if (missing.length > 0) {
  document.getElementById("root")!.innerHTML = `
    <div style="font-family:system-ui;padding:2rem;text-align:center">
      <h1>App configuration error</h1>
      <p>Missing environment variables: ${missing.join(', ')}</p>
      <p>Please check your .env.local file.</p>
    </div>`;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
```

| File | Change |
|------|--------|
| `src/main.tsx` | Add env var validation guard before React mount |

