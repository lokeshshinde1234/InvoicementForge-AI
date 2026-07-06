const tones = {
  ink: "text-ink",
  teal: "text-teal",
  amber: "text-amber",
  coral: "text-coral"
};

export function StatTile({ label, value, tone = "ink" }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tones[tone] || tones.ink}`}>{value}</p>
    </div>
  );
}
