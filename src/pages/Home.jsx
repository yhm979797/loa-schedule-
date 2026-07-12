import { Link } from "react-router-dom";
import { CheckCircle2, Coins, Share2, Swords } from "lucide-react";
import { useCharacters } from "../context/CharacterContext";
import ProgressBar from "../components/common/ProgressBar";
export default function Home(){
  const {characters,progress,totalGold}=useCharacters();
  const active=characters.flatMap(c=>(c.raids||[]).filter(r=>r.id));
  const done=active.filter(r=>r.done).length;
  return <section><div className="hero-card"><p>이번 주 레이드 진행률</p><strong>{progress}%</strong><ProgressBar value={progress}/><span>{done}/{active.length} 완료</span></div><div className="stat-grid four"><div className="stat-card"><Swords/><span>캐릭터</span><strong>{characters.length}</strong></div><div className="stat-card"><CheckCircle2/><span>완료 레이드</span><strong>{done}</strong></div><div className="stat-card"><Coins/><span>완료 골드</span><strong>{totalGold.toLocaleString("ko-KR")}</strong></div><div className="stat-card"><Share2/><span>공유</span><strong>공용 링크</strong></div></div><div className="quick-grid three"><Link to="/characters">캐릭터 불러오기</Link><Link to="/raids">레이드 체크하기</Link><Link to="/friends">친구에게 공유하기</Link></div></section>;
}
