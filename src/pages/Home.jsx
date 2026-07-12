import { ArrowRight, CheckCircle2, Coins, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ProgressBar from "../components/common/ProgressBar";
import { useCharacter } from "../context/CharacterContext";
import { DAILY_TASKS, WEEKLY_TASKS } from "../constants/tasks";

export default function Home() {
  const { characters } = useCharacter();

  const goldCharacters = characters.filter((character) => character.isGoldCharacter);
  const totalDaily = characters.length * DAILY_TASKS.length;
  const completedDaily = characters.reduce(
    (sum, character) =>
      sum +
      DAILY_TASKS.filter((task) => character.dailyTodos?.[task.key]).length,
    0
  );

  const totalWeekly = characters.length * WEEKLY_TASKS.length;
  const completedWeekly = characters.reduce(
    (sum, character) =>
      sum +
      WEEKLY_TASKS.filter((task) => character.weeklyTodos?.[task.key]).length,
    0
  );

  const dailyProgress = totalDaily
    ? Math.round((completedDaily / totalDaily) * 100)
    : 0;

  const weeklyGold = goldCharacters.reduce(
    (sum, character) => sum + (Number(character.weeklyGold) || 0),
    0
  );

  return (
    <>
      <PageHeader
        title="오늘의 숙제 현황"
        description="캐릭터별 일일·주간 진행 상황을 한눈에 확인하세요."
      />

      <section className="stats-grid">
        <div className="stat-card">
          <Users size={21} />
          <span>전체 캐릭터</span>
          <strong>{characters.length}</strong>
        </div>
        <div className="stat-card">
          <Coins size={21} />
          <span>골드 캐릭터</span>
          <strong>{goldCharacters.length}</strong>
        </div>
        <div className="stat-card">
          <CheckCircle2 size={21} />
          <span>일일 숙제</span>
          <strong>{completedDaily}/{totalDaily}</strong>
        </div>
        <div className="stat-card">
          <Coins size={21} />
          <span>주간 예상 골드</span>
          <strong>{weeklyGold.toLocaleString()}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">DAILY</p>
            <h2>전체 일일 진행률</h2>
          </div>
          <strong className="large-percent">{dailyProgress}%</strong>
        </div>
        <ProgressBar value={dailyProgress} />
      </section>

      <section className="panel">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">WEEKLY</p>
            <h2>주간 숙제 현황</h2>
          </div>
          <span className="muted">{completedWeekly}/{totalWeekly} 완료</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-title-row">
          <h2>캐릭터별 오늘 진행률</h2>
          <Link className="text-link" to="/todos">
            숙제 관리 <ArrowRight size={16} />
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="empty-state">
            <p>등록된 캐릭터가 없습니다.</p>
            <Link className="button primary" to="/characters">
              캐릭터 추가하기
            </Link>
          </div>
        ) : (
          <div className="summary-list">
            {characters.map((character) => {
              const complete = DAILY_TASKS.filter(
                (task) => character.dailyTodos?.[task.key]
              ).length;
              const progress = Math.round(
                (complete / DAILY_TASKS.length) * 100
              );

              return (
                <div className="summary-item" key={character.id}>
                  <div className="summary-info">
                    <div>
                      <strong>{character.name}</strong>
                      {character.isGoldCharacter && (
                        <span className="badge gold">골드</span>
                      )}
                    </div>
                    <span>{complete}/{DAILY_TASKS.length}</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
