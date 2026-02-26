import { Construction } from "lucide-react";

interface Props {
  title: string;
}

export default function AdminComingSoonPage({ title }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-muted-foreground">
      <Construction className="h-12 w-12" />
      <h2 className="font-heading text-2xl">{title}</h2>
      <p className="text-sm">This section is under construction.</p>
    </div>
  );
}
