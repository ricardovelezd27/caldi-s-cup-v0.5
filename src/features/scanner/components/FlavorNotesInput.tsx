import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FlavorNotesInputProps {
  value: string[];
  onChange: (notes: string[]) => void;
}

export function FlavorNotesInput({ value, onChange }: FlavorNotesInputProps) {
  const [input, setInput] = useState("");

  const addNote = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNote();
    }
  };

  const removeNote = (note: string) => {
    onChange(value.filter((n) => n !== note));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((note) => (
          <Badge
            key={note}
            variant="secondary"
            className="gap-1 px-2 py-1 text-sm border-2 border-border"
          >
            {note}
            <button
              type="button"
              onClick={() => removeNote(note)}
              className="ml-1 hover:text-destructive"
              aria-label={`Remove ${note}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addNote}
        placeholder="Type a flavor note and press Enter"
      />
    </div>
  );
}
