import { RotateCcw } from "lucide-react";
import { DAILY_TASKS, WEEKLY_TASKS } from "../constants/tasks";
import { useCharacters } from "../context/CharacterContext";

function TaskSection({ title, tasks, characters, toggleTask }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="todo-table">
        {characters.map((character) => (
          <div className="todo-row" key={character.id}>
            <div><b>{character.name}</b><small>{character.job}</small></div>
            <div className="todo-checks">
              {tasks.map((task) => (
                <label key={task.key} className={character.tasks?.[task.key] ? "mini-check checked" : "mini-check"}>
                  <input type="checkbox" checked={Boolean(character.tasks?.[task.key])} onChange={() => toggleTask(character.id, task.key)} />
                  {task.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Todos() {
  const { characters, toggleTask, resetTasks } = useCharacters();

  return (
    <section>
      <div className="section-title">
        <div><p className="eyebrow">CHECK LIST</p><h2>숙제 관리</h2></div>
        <button className="ghost" onClick={() => resetTasks()}><RotateCcw size={16} />전체 초기화</button>
      </div>
      <TaskSection title="일일 숙제" tasks={DAILY_TASKS} characters={characters} toggleTask={toggleTask} />
      <TaskSection title="주간 숙제" tasks={WEEKLY_TASKS} characters={characters} toggleTask={toggleTask} />
      {!characters.length && <div className="empty">캐릭터를 먼저 등록해 주세요.</div>}
    </section>
  );
}
