import { Trash2 } from "lucide-react";
import { ALL_TASKS } from "../../constants/tasks";
import ProgressBar from "../common/ProgressBar";

export default function CharacterCard({
  character,
  onToggle,
  onDelete,
  readOnly = false,
}) {
  const done = ALL_TASKS.filter((task) => character.tasks?.[task.key]).length;
  const progress = Math.round((done / ALL_TASKS.length) * 100);

  return (
    <article className="character-card">
      <div className="character-head">
        <div>
          <div className="character-title">
            <h3>{character.name}</h3>
            {character.goldCharacter && <span className="badge gold">골드</span>}
          </div>
          <p>{character.server || "서버 미지정"} · {character.job || "직업 미지정"} · {character.level || 0}</p>
        </div>
        {!readOnly && (
          <button className="icon-button danger" onClick={() => onDelete(character.id)} aria-label="삭제">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <ProgressBar value={progress} />
      <div className="task-grid">
        {ALL_TASKS.map((task) => (
          <label key={task.key} className={character.tasks?.[task.key] ? "task done" : "task"}>
            <input
              type="checkbox"
              checked={Boolean(character.tasks?.[task.key])}
              disabled={readOnly}
              onChange={() => onToggle?.(character.id, task.key)}
            />
            <span>{task.label}</span>
          </label>
        ))}
      </div>
    </article>
  );
}
