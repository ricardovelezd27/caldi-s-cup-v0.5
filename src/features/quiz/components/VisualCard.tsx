import { cn } from '@/lib/utils';
import { CoffeeTribe } from '../types/tribe';
import { TRIBES } from '../data/tribes';
import { 
  Coffee, Check, Sparkles, LineChart, Camera, Heart,
  Key, Map, PartyPopper, Home, Zap, FileSearch, Smile, Shield,
  Gem, FolderTree, Palette, Grid3X3, Gift, Wrench, Ticket, HeartHandshake
} from 'lucide-react';
import { ComponentType } from 'react';

// Map icon names to components
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Sparkles,
  LineChart,
  Camera,
  Heart,
  Key,
  Map,
  PartyPopper,
  Home,
  Zap,
  FileSearch,
  Smile,
  Shield,
  Gem,
  FolderTree,
  Palette,
  Grid3x3: Grid3X3,
  Gift,
  Wrench,
  Ticket,
  HeartHandshake,
  Coffee,
};

interface VisualCardProps {
  id: string;
  label: string;
  tribe: CoffeeTribe;
  iconName: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const VisualCard = ({ 
  label, 
  tribe, 
  iconName, 
  isSelected, 
  onSelect 
}: VisualCardProps) => {
  const tribeData = TRIBES[tribe];
  const IconComponent = iconMap[iconName] || Coffee;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 md:p-6 rounded-lg border-4 transition-all duration-200 active:scale-[0.98]",
        "min-h-[140px] md:min-h-[160px] w-full",
        "hover:shadow-[6px_6px_0px_0px_hsl(var(--border))]",
        isSelected
          ? "border-primary bg-primary/10 shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
          : "border-border bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))] hover:border-primary/50"
      )}
    >
      {/* Icon with tribe color background */}
      <div className={cn(
        "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3",
        "border-2 border-border",
        tribeData.bgClass
      )}>
        <IconComponent className={cn("w-7 h-7 md:w-8 md:h-8", tribeData.colorClass)} />
      </div>

      {/* Label */}
      <span className={cn(
        "font-medium text-sm md:text-base text-center leading-tight",
        isSelected ? "text-primary font-bold" : "text-foreground"
      )}>
        {label}
      </span>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </button>
  );
};
