import { Link } from "react-router-dom";
import { CheckCircle2, Coins, Users, Swords } from "lucide-react";
import { useCharacters } from "../context/CharacterContext";
import ProgressBar from "../components/common/ProgressBar";

export default function Home() {
  const { characters, totalProgress } = useCharacters();
  const goldCharacters = characters.filter((item) => item.goldCharacter);
  const totalGold = goldCharacters.reduce((sum, item) => sum + (Number(item.gold) || 0), 0);

  return (
    <section>
      <div className="hero-card">
        <p>오늘의 원정대 진행률</p>
        <strong>{totalProgress}%</strong>
        <ProgressBar value={totalProgress} />
        <span>{characters.length ? `${characters.length}개 캐릭터 관리 중` : "캐릭터를 먼저 추가해 주세요."}</span>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><Swords /><span>캐릭터</span><strong>{characters.length}</strong></div>
        <div className="stat-card"><CheckCircle2 /><span>진행률</span><strong>{totalProgress}%</strong></div>
        <div className="stat-card"><Coins /><span>예상 골드</span><strong>{totalGold.toLocaleString()}</strong></div>
        <div className="stat-card"><Users /><span>친구</span><strong>조회</strong></div>
      </div>

      <div className="section-title"><h2>빠른 메뉴</h2></div>
      <div className="quick-grid">
        <Link to="/characters">캐릭터 자동 등록</Link>
        <Link to="/todos">숙제 전체 관리</Link>
        <Link to="/friends">친구 스케줄 보기</Link>
        <Link to="/settings">Google 로그인</Link>
      </div>
    </section>
  );
}
