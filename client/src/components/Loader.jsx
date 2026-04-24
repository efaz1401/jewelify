export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-ink-400">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
