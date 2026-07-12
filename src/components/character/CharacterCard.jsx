import { Pencil, Trash2 } from "lucide-react";
import { DAILY_TASKS } from "../../constants/tasks";
import ProgressBar from "../common/ProgressBar";

export default function CharacterCard({
  character,
  onToggleTodo,
  onEdit,
  onDelete,
}) {
  const completed = DAILY_TASKS.filter(
    (task) => character.dailyTodos?.[task.key]
  ).length;
  const progress = Math.round((completed / DAILY_TASKS.length) * 100);

  return (
    <article className={`character-card ${character.isGoldCharacter ? "gold" : ""}`}>
      <div className="character-card-top">
        <div>
          <div className="character-title-row">
            <h3>{character.name}</h3>
            {character.isGoldCharacter && <span className="badge gold">골드</span>}
          </div>
          <p className="muted">
            {character.job || "직업 미입력"}
            {character.level ? ` · Lv.${character.level}` : ""}
            {character.server ? ` · ${character.server}` : ""}
          </p>
        </div>

        <div className="card-actions">
          <button className="icon-button" onClick={() => onEdit(character)}>
            <Pencil size={17} />
          </button>
          <button className="icon-button danger" onClick={() => onDelete(character.id)}>
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="task-list compact">
        {DAILY_TASKS.map((task) => (
          <label key={task.key} className="task-check">
            <input
              type="checkbox"
              checked={Boolean(character.dailyTodos?.[task.key])}
              onChange={() => onToggleTodo(character.id, "daily", task.key)}
            />
            <span>{task.label}</span>
          </label>
        ))}
      </div>

      <div className="progress-row">
        <span>{completed}/{DAILY_TASKS.length} 완료</span>
        <strong>{progress}%</strong>
      </div>
      <ProgressBar value={progress} />
    </article>
  );
}
