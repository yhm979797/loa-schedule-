import { CheckCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ProgressBar from "../components/common/ProgressBar";
import { DAILY_TASKS, WEEKLY_TASKS } from "../constants/tasks";
import { useCharacter } from "../context/CharacterContext";

export default function Todos() {
  const { characters, toggleTodo, setAllTodos, resetTodos } = useCharacter();
  const [tab, setTab] = useState("daily");

  const tasks = tab === "daily" ? DAILY_TASKS : WEEKLY_TASKS;
  const todoField = tab === "daily" ? "dailyTodos" : "weeklyTodos";

  return (
    <>
      <PageHeader
        title="숙제 관리"
        description="일일과 주간 숙제를 캐릭터별로 체크하세요."
      />

      <div className="tab-row">
        <button
          className={`tab-button ${tab === "daily" ? "active" : ""}`}
          onClick={() => setTab("daily")}
        >
          일일 숙제
        </button>
        <button
          className={`tab-button ${tab === "weekly" ? "active" : ""}`}
          onClick={() => setTab("weekly")}
        >
          주간 숙제
        </button>
      </div>

      <div className="toolbar">
        <button className="button secondary" onClick={() => setAllTodos(tab, true)}>
          <CheckCheck size={18} />
          전체 완료
        </button>
        <button className="button ghost" onClick={() => resetTodos(tab)}>
          <RotateCcw size={18} />
          전체 초기화
        </button>
      </div>

      <div className="todo-character-list">
        {characters.map((character) => {
          const complete = tasks.filter(
            (task) => character[todoField]?.[task.key]
          ).length;
          const progress = Math.round((complete / tasks.length) * 100);

          return (
            <section className="panel" key={character.id}>
              <div className="section-title-row">
                <div>
                  <h2>{character.name}</h2>
                  <p className="muted">
                    {character.job || "직업 미입력"}
                    {character.level ? ` · Lv.${character.level}` : ""}
                  </p>
                </div>
                <strong>{complete}/{tasks.length}</strong>
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <label key={task.key} className="task-check">
                    <input
                      type="checkbox"
                      checked={Boolean(character[todoField]?.[task.key])}
                      onChange={() => toggleTodo(character.id, tab, task.key)}
                    />
                    <span>{task.label}</span>
                  </label>
                ))}
              </div>

              <ProgressBar value={progress} />
            </section>
          );
        })}
      </div>

      {characters.length === 0 && (
        <div className="empty-state panel">
          <p>먼저 캐릭터를 등록하세요.</p>
        </div>
      )}
    </>
  );
}
