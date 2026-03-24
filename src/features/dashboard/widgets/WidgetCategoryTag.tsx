interface WidgetCategoryTagProps {
  label: string;
}

export function WidgetCategoryTag({ label }: WidgetCategoryTagProps) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">
      {label}
    </span>
  );
}