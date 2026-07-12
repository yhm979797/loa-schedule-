import { RotateCcw } from "lucide-react";
import { useCharacters } from "../context/CharacterContext";
import CharacterCard from "../components/character/CharacterCard";
export default function Raids(){ const {characters,updateRaid,selectRaid,resetAll,totalGold}=useCharacters(); return <section><div className="section-title"><div><p className="eyebrow">RAID CHECK</p><h2>레이드 체크</h2><p className="section-sub">완료 골드 {totalGold.toLocaleString("ko-KR")} G</p></div><button className="ghost" onClick={resetAll}><RotateCcw size={16}/>전체 초기화</button></div><div className="character-grid">{characters.map(c=><CharacterCard key={c.id} character={c} onRaidChange={updateRaid} onRaidSelect={selectRaid}/>)}</div>{!characters.length&&<div className="empty">캐릭터를 먼저 등록해 주세요.</div>}</section> }
