import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface VariableOption {
  value: string;
  label: string;
  label_es?: string;
}

interface VariableRange {
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface Variable {
  id: string;
  name: string;
  name_es?: string;
  type: "select" | "range";
  options?: VariableOption[];
  range?: VariableRange;
}

interface ValidCombination {
  [key: string]: string | number;
}

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function RecipeBuildingForm({ data, onChange }: Props) {
  const update = (patch: Record<string, any>) => onChange({ ...data, ...patch });

  const variables: Variable[] = data.variables ?? [];
  const validCombinations: ValidCombination[] = data.valid_combinations ?? [];

  const updateVariable = (index: number, patch: Partial<Variable>) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], ...patch };
    update({ variables: updated });
  };

  const addVariable = () => {
    update({
      variables: [
        ...variables,
        { id: `var_${Date.now()}`, name: "", type: "select", options: [] },
      ],
    });
  };

  const removeVariable = (index: number) => {
    const updated = variables.filter((_, i) => i !== index);
    update({ variables: updated });
  };

  const addOption = (varIndex: number) => {
    const v = variables[varIndex];
    const opts = [...(v.options ?? []), { value: "", label: "" }];
    updateVariable(varIndex, { options: opts });
  };

  const updateOption = (varIndex: number, optIndex: number, patch: Partial<VariableOption>) => {
    const v = variables[varIndex];
    const opts = [...(v.options ?? [])];
    opts[optIndex] = { ...opts[optIndex], ...patch };
    updateVariable(varIndex, { options: opts });
  };

  const removeOption = (varIndex: number, optIndex: number) => {
    const v = variables[varIndex];
    const opts = (v.options ?? []).filter((_, i) => i !== optIndex);
    updateVariable(varIndex, { options: opts });
  };

  const addCombination = () => {
    const combo: ValidCombination = {};
    variables.forEach((v) => (combo[v.id] = ""));
    update({ valid_combinations: [...validCombinations, combo] });
  };

  const updateCombination = (cIndex: number, key: string, value: string) => {
    const updated = [...validCombinations];
    updated[cIndex] = { ...updated[cIndex], [key]: value };
    update({ valid_combinations: updated });
  };

  const removeCombination = (cIndex: number) => {
    update({ valid_combinations: validCombinations.filter((_, i) => i !== cIndex) });
  };

  return (
    <div className="space-y-4">
      {/* Method */}
      <div className="space-y-1">
        <Label>Method Name</Label>
        <Input value={data.method ?? ""} onChange={(e) => update({ method: e.target.value })} placeholder="e.g. Pour Over" />
      </div>

      {/* Instruction */}
      <div className="grid grid-cols-1 gap-2">
        <div className="space-y-1">
          <Label>Instruction (EN)</Label>
          <Textarea value={data.instruction ?? ""} onChange={(e) => update({ instruction: e.target.value })} className="min-h-[60px]" />
        </div>
        <div className="space-y-1">
          <Label>Instruction (ES)</Label>
          <Textarea value={data.instruction_es ?? ""} onChange={(e) => update({ instruction_es: e.target.value })} className="min-h-[60px]" />
        </div>
      </div>

      {/* Variables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Variables</Label>
          <Button type="button" variant="outline" size="sm" onClick={addVariable}>
            <Plus className="h-3 w-3 mr-1" /> Add Variable
          </Button>
        </div>

        {variables.map((v, vi) => (
          <div key={vi} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Variable #{vi + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeVariable(vi)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">ID</Label>
                <Input value={v.id} onChange={(e) => updateVariable(vi, { id: e.target.value })} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={v.type} onValueChange={(val) => updateVariable(vi, { type: val as "select" | "range" })}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="range">Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Name (EN)</Label>
                <Input value={v.name} onChange={(e) => updateVariable(vi, { name: e.target.value })} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Name (ES)</Label>
                <Input value={v.name_es ?? ""} onChange={(e) => updateVariable(vi, { name_es: e.target.value })} className="text-xs" />
              </div>
            </div>

            {v.type === "select" && (
              <div className="space-y-2 pl-2 border-l-2 border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Options</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addOption(vi)}>
                    <Plus className="h-3 w-3 mr-1" /> Option
                  </Button>
                </div>
                {(v.options ?? []).map((opt, oi) => (
                  <div key={oi} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 items-end">
                    <div>
                      <Label className="text-[10px]">Value</Label>
                      <Input value={opt.value} onChange={(e) => updateOption(vi, oi, { value: e.target.value })} className="text-xs h-7" />
                    </div>
                    <div>
                      <Label className="text-[10px]">Label EN</Label>
                      <Input value={opt.label} onChange={(e) => updateOption(vi, oi, { label: e.target.value })} className="text-xs h-7" />
                    </div>
                    <div>
                      <Label className="text-[10px]">Label ES</Label>
                      <Input value={opt.label_es ?? ""} onChange={(e) => updateOption(vi, oi, { label_es: e.target.value })} className="text-xs h-7" />
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeOption(vi, oi)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {v.type === "range" && (
              <div className="grid grid-cols-4 gap-2 pl-2 border-l-2 border-border">
                <div className="space-y-1">
                  <Label className="text-[10px]">Min</Label>
                  <Input type="number" value={v.range?.min ?? 0} onChange={(e) => updateVariable(vi, { range: { ...v.range!, min: Number(e.target.value) } })} className="text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Max</Label>
                  <Input type="number" value={v.range?.max ?? 100} onChange={(e) => updateVariable(vi, { range: { ...v.range!, max: Number(e.target.value) } })} className="text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Step</Label>
                  <Input type="number" value={v.range?.step ?? 1} onChange={(e) => updateVariable(vi, { range: { ...v.range!, step: Number(e.target.value) } })} className="text-xs h-7" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Unit</Label>
                  <Input value={v.range?.unit ?? ""} onChange={(e) => updateVariable(vi, { range: { ...v.range!, unit: e.target.value } })} className="text-xs h-7" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Valid Combinations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Valid Combinations</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCombination}>
            <Plus className="h-3 w-3 mr-1" /> Add Combination
          </Button>
        </div>

        {validCombinations.map((combo, ci) => (
          <div key={ci} className="border border-border rounded-lg p-2 space-y-1 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Combo #{ci + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeCombination(ci)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {variables.map((v) => (
                <div key={v.id} className="space-y-1">
                  <Label className="text-[10px]">{v.name || v.id}</Label>
                  <Input
                    value={String(combo[v.id] ?? "")}
                    onChange={(e) => updateCombination(ci, v.id, e.target.value)}
                    className="text-xs h-7"
                    placeholder={v.type === "range" ? "number" : "option value"}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="grid grid-cols-1 gap-2">
        <div className="space-y-1">
          <Label>Explanation (EN)</Label>
          <Textarea value={data.explanation ?? ""} onChange={(e) => update({ explanation: e.target.value })} className="min-h-[60px]" />
        </div>
        <div className="space-y-1">
          <Label>Explanation (ES)</Label>
          <Textarea value={data.explanation_es ?? ""} onChange={(e) => update({ explanation_es: e.target.value })} className="min-h-[60px]" />
        </div>
      </div>
    </div>
  );
}
