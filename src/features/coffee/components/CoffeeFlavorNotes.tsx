import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Coffee } from "../types";

interface CoffeeFlavorNotesProps {
  coffee: Coffee;
  isAuthenticated?: boolean;
  userFlavorNotes?: string[];
  onUserFlavorNotesChange?: (notes: string[]) => void;
}

export function CoffeeFlavorNotes({
  coffee,
  isAuthenticated = false,
  userFlavorNotes,
  onUserFlavorNotesChange,
}: CoffeeFlavorNotesProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allKnownNotes, setAllKnownNotes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const displayNotes = userFlavorNotes && userFlavorNotes.length > 0
    ? userFlavorNotes
    : coffee.flavorNotes;

  // Fetch all known flavor notes from the database for autocomplete
  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from("coffees")
        .select("flavor_notes");

      if (data) {
        const noteSet = new Set<string>();
        data.forEach((row) => {
          (row.flavor_notes ?? []).forEach((n: string) => noteSet.add(n.toLowerCase()));
        });
        setAllKnownNotes(Array.from(noteSet).sort());
      }
    };
    fetchNotes();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const query = input.trim().toLowerCase();
    const filtered = allKnownNotes.filter(
      (note) => note.includes(query) && !displayNotes.includes(note)
    );
    setSuggestions(filtered.slice(0, 6));
  }, [input, allKnownNotes, displayNotes]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addNote = (note?: string) => {
    const trimmed = (note ?? input).trim().toLowerCase();
    if (trimmed && !displayNotes.includes(trimmed)) {
      onUserFlavorNotesChange?.([...displayNotes, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeNote = (note: string) => {
    onUserFlavorNotesChange?.(displayNotes.filter((n) => n !== note));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addNote(suggestions[0]);
      } else {
        addNote();
      }
    }
  };

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        Flavor Notes
      </h3>

      {displayNotes.length === 0 && !isAuthenticated && (
        <p className="text-sm text-muted-foreground italic">No flavor notes detected for this coffee.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {displayNotes.map((note, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-sm capitalize gap-1"
          >
            {note}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => removeNote(note)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${note}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* User input for adding flavor notes */}
      {isAuthenticated && (
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Add a flavor note…"
            className="text-sm"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-20 top-full mt-1 w-full border-2 border-border rounded-md bg-card shadow-md max-h-40 overflow-y-auto"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm capitalize hover:bg-secondary/20 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addNote(s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
