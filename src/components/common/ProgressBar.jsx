export default function ProgressBar({ value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="progress-track" aria-label={`진행률 ${safeValue}%`}>
      <div
        className="progress-value"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
