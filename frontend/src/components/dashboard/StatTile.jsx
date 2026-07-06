import { ArrowUpRight } from "lucide-react";

const tones = {
  ink: "bg-slate-900 text-white",
  teal: "bg-teal-700 text-white",
  amber: "bg-amber-600 text-white",
  coral: "bg-rose-600 text-white",
  blue: "bg-blue-700 text-white"
};

export function StatTile({ label, value, icon: Icon, tone = "ink", caption = "Updated now", trend = "Live" }) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone] || tones.ink}`}>
            <Icon size={19} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-slate-500">{caption}</p>
        <span className="inline-flex items-center gap-1 text-xs font-black text-teal-700">
          {trend}
          <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}
