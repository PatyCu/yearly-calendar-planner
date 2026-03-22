const shortcuts = [
  { keys: "⇧+click", label: "½ day PTO", color: "bg-orange-400/50" },
  { keys: "Ctrl+click", label: "Confirmed PTO", color: "bg-red-400" },
  { keys: "⌘+click", label: "Remote", color: "bg-cyan-400" },
];

export default function ShortcutsLegend() {
  return (
    <div className="border border-dashed border-gray-400 rounded-md px-4 py-2 inline-flex gap-6 text-xs text-gray-600 self-start">
      {shortcuts.map(({ keys, label, color }) => (
        <div key={keys} className="flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${color}`} />
          <kbd className="font-mono bg-gray-100 border border-gray-300 rounded px-1 py-0.5 text-gray-700">{keys}</kbd>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
