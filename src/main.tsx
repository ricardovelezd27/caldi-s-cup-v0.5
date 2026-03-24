import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
