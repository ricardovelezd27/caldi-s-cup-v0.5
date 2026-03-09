export interface BaristaRank {
  id: string;
  name: string;
  minXP: number;
  icon: string;
  colorClass: string;
}

export const BARISTA_RANKS: BaristaRank[] = [
  { id: "novice", name: "Novice", minXP: 0, icon: "📄", colorClass: "text-slate-400" },
  { id: "green_apron", name: "Green Apron", minXP: 100, icon: "🎽", colorClass: "text-emerald-500" },
  { id: "bronze_tamper", name: "Bronze Tamper", minXP: 500, icon: "🤎", colorClass: "text-amber-700" },
  { id: "silver_pitcher", name: "Silver Pitcher", minXP: 1500, icon: "🤍", colorClass: "text-slate-300" },
  { id: "gold_portafilter", name: "Gold Portafilter", minXP: 3000, icon: "💛", colorClass: "text-yellow-500" },
  { id: "coffee_master", name: "Coffee Master", minXP: 5000, icon: "🖤", colorClass: "text-stone-900" },
];
