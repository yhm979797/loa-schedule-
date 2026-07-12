import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { searchRoster } from "../api/lostark";
import { useCharacters } from "../context/CharacterContext";
import CharacterCard from "../components/character/CharacterCard";

export default function Characters() {
  const { characters, addMany, removeCharacter, updateRaid, selectRaid } = useCharacters();
  const [name,setName]=useState(""); const [results,setResults]=useState([]); const [selected,setSelected]=useState(new Set()); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  const search = async (e) => { e.preventDefault(); setLoading(true); setMessage(""); try { const data=await searchRoster(name); setResults(data.characters||[]); setSelected(new Set((data.characters||[]).slice(0,6).map(c=>c.id))); } catch(err){setMessage(err.message);} finally{setLoading(false);} };
  const register = () => { addMany(results.filter(c=>selected.has(c.id))); setMessage("선택한 캐릭터를 등록했습니다."); };
  const selectedCount = selected.size;
  const sorted = useMemo(() => [...characters].sort((a,b)=>b.level-a.level), [characters]);
  return <section>
    <div className="section-title"><div><p className="eyebrow">CHARACTERS</p><h2>캐릭터 등록</h2></div></div>
    <form className="panel search-box" onSubmit={search}><input value={name} onChange={e=>setName(e.target.value)} placeholder="대표 캐릭터명" required/><button className="primary" disabled={loading}><Search size={17}/>{loading?"조회 중":"원정대 조회"}</button></form>
    {message && <div className="notice">{message}</div>}
    {!!results.length && <div className="panel"><div className="result-heading"><h3>등록할 캐릭터 선택</h3><span>{selectedCount}명 선택</span></div><div className="result-list">{results.map(c=><label key={c.id}><input type="checkbox" checked={selected.has(c.id)} onChange={()=>setSelected(prev=>{const n=new Set(prev); n.has(c.id)?n.delete(c.id):n.add(c.id); return n;})}/><span><b>{c.name}</b><small>{c.server} · {c.job} · {c.level.toLocaleString()}</small></span></label>)}</div><button className="secondary full" onClick={register}><Download size={17}/>선택 캐릭터 등록</button></div>}
    <div className="character-grid">{sorted.map(c=><CharacterCard key={c.id} character={c} onDelete={removeCharacter} onRaidChange={updateRaid} onRaidSelect={selectRaid}/>)}{!characters.length&&<div className="empty">캐릭터를 등록해 주세요.</div>}</div>
  </section>;
}
