import { LucideIcon, BookOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-16 h-16 bg-parchment rounded-2xl border border-border flex items-center justify-center mb-5">
        <Icon size={28} className="text-border" />
      </div>
      <h3 className="font-bold text-navy text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-navy-muted text-sm max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
