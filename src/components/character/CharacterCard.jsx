import { Trash2 } from "lucide-react";

export default function CharacterCard({ character, onDelete, onRaidChange, readOnly=false }) {
  return <article className="character-card">
    <div className="character-head">
      <div><h3>{character.name}</h3><p>{character.server} · {character.job} · Lv.{character.level.toLocaleString()}</p></div>
      {!readOnly && <button className="icon-button danger" onClick={() => onDelete(character.id)} aria-label="삭제"><Trash2 size={17}/></button>}
    </div>
    <div className="raid-list">
      {(character.raids || []).map((raid) => <div className={`raid-row ${raid.done ? "done" : ""}`} key={raid.id}>
        <input type="checkbox" checked={Boolean(raid.done)} disabled={readOnly} onChange={(e) => onRaidChange(character.id, raid.id, {done:e.target.checked})}/>
        {readOnly ? <span>{raid.name}</span> : <input className="raid-name" value={raid.name} onChange={(e) => onRaidChange(character.id, raid.id, {name:e.target.value})}/>} 
        <b>{raid.done ? "완료" : "미완료"}</b>
      </div>)}
    </div>
  </article>;
}
