import CharacterForm from "./CharacterForm";

export default function CharacterDialog({
  open,
  title,
  initialValue,
  onSubmit,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section
        className="dialog-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <CharacterForm
          initialValue={initialValue}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </section>
    </div>
  );
}
