import { Coins, Trash2 } from "lucide-react";
import { getAvailableRaids } from "../../constants/raids";

const formatGold = (value) => Number(value || 0).toLocaleString("ko-KR");

export default function CharacterCard({ character, onDelete, onRaidChange, onRaidSelect, readOnly = false }) {
  const available = getAvailableRaids(character.level);
  const selectedIds = new Set((character.raids || []).map((r) => r.id).filter(Boolean));
  const earned = (character.raids || []).filter((r) => r.done).reduce((sum, r) => sum + Number(r.gold || 0), 0);

  return <article className="character-card">
    <div className="character-head">
      <div className="character-summary">
        <h3 title={character.name}>{character.name}</h3>
        <p>{character.server} · {character.job || "직업 미확인"}</p>
        <span>아이템 레벨 {character.level.toLocaleString()}</span>
      </div>
      <div className="character-actions">
        <div className="gold-total"><Coins size={15}/>{formatGold(earned)} G</div>
        {!readOnly && onDelete && <button className="icon-button danger" onClick={() => onDelete(character.id)} aria-label={`${character.name} 삭제`}><Trash2 size={17}/></button>}
      </div>
    </div>

    <div className="raid-list">
      {(character.raids || []).map((raid) => <div className={`raid-row ${raid.done ? "done" : ""}`} key={raid.slotId}>
        <input className="raid-check" type="checkbox" checked={Boolean(raid.done)} disabled={readOnly || !raid.id} onChange={(e) => onRaidChange(character.id, raid.slotId, { done: e.target.checked })}/>
        <div className="raid-main">
          {readOnly
            ? <><strong title={raid.name}>{raid.shortName || raid.name}</strong><small>{raid.difficulty || "미선택"}</small></>
            : <select className="raid-select" value={raid.id || ""} onChange={(e) => onRaidSelect(character.id, raid.slotId, e.target.value)}>
                <option value="">레이드 선택</option>
                {available.map((item) => <option key={item.id} value={item.id} disabled={selectedIds.has(item.id) && item.id !== raid.id}>{item.shortName || item.name} · {item.difficulty} · {formatGold(item.gold)}G</option>)}
              </select>}
        </div>
        <div className="raid-meta"><span className="difficulty">{raid.difficulty || "-"}</span><b>{formatGold(raid.gold)} G</b></div>
        <span className={`status ${raid.done ? "complete" : ""}`}>{raid.done ? "완료" : "미완료"}</span>
      </div>)}
    </div>
  </article>;
}
