export default function ProgressBar({ value }) {
  return (
    <div className="progress" aria-label={`진행률 ${value}%`}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
