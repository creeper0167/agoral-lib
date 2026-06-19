import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconClass?: string;
}

export default function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  iconClass = "bg-crimson-light text-crimson",
}: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-navy-muted">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-navy">{value}</span>
          {change && (
            <span
              className={`text-xs flex items-center gap-0.5 font-medium ${
                trend === "up" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpRight size={11} />
              ) : (
                <ArrowDownRight size={11} />
              )}
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
