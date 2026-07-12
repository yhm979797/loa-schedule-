import { useMemo, useState } from "react";
import { CheckSquare2, Download, Search, Square } from "lucide-react";
import { searchRoster } from "../api/lostark";
import { useCharacters } from "../context/CharacterContext";
import CharacterCard from "../components/character/CharacterCard";

export default function Characters() {
  const { characters, addMany, removeCharacter, updateRaid, selectRaid } = useCharacters();
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await searchRoster(name);
      const list = data.characters || [];
      setResults(list);
      setSelected(new Set(list.filter((c) => c.level >= 1600).slice(0, 6).map((c) => c.id)));
      if (!list.length) setMessage("원정대 캐릭터를 찾지 못했습니다.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = () => {
    addMany(results.filter((c) => selected.has(c.id)));
    setMessage(`${selected.size}개 캐릭터를 등록했습니다.`);
    setResults([]);
    setSelected(new Set());
  };

  const toggleAll = () => {
    setSelected((prev) => prev.size === results.length ? new Set() : new Set(results.map((c) => c.id)));
  };

  const sorted = useMemo(() => [...characters].sort((a, b) => b.level - a.level), [characters]);

  return <section>
    <div className="section-title"><div><p className="eyebrow">CHARACTERS</p><h2>원정대 캐릭터 등록</h2><p className="section-sub">대표 캐릭터명만 입력하면 같은 서버 원정대를 불러옵니다.</p></div></div>

    <form className="panel search-box" onSubmit={search}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="대표 캐릭터명 입력" required />
      <button className="primary" disabled={loading}><Search size={17}/>{loading ? "조회 중" : "원정대 조회"}</button>
    </form>

    {message && <div className="notice">{message}</div>}

    {!!results.length && <div className="panel roster-picker">
      <div className="result-heading">
        <div><h3>등록할 캐릭터 선택</h3><small>{selected.size} / {results.length}명 선택</small></div>
        <button className="ghost select-all" type="button" onClick={toggleAll}>
          {selected.size === results.length ? <CheckSquare2 size={17}/> : <Square size={17}/>} 전체 선택
        </button>
      </div>

      <div className="result-grid">
        {results.map((c) => {
          const checked = selected.has(c.id);
          return <label className={`result-card ${checked ? "selected" : ""}`} key={c.id}>
            <input type="checkbox" checked={checked} onChange={() => setSelected((prev) => {
              const next = new Set(prev);
              next.has(c.id) ? next.delete(c.id) : next.add(c.id);
              return next;
            })}/>
            <div className="result-card-main">
              <b title={c.name}>{c.name}</b>
              <small>{c.job || "직업 미확인"}</small>
              <span>{c.server} · Lv.{c.level.toLocaleString()}</span>
            </div>
          </label>;
        })}
      </div>

      <div className="sticky-register">
        <button className="primary full" type="button" disabled={!selected.size} onClick={register}><Download size={17}/>{selected.size}개 캐릭터 등록</button>
      </div>
    </div>}

    <div className="section-title compact-title"><div><h2>등록된 캐릭터</h2><p className="section-sub">{characters.length}명</p></div></div>
    <div className="character-grid">
      {sorted.map((c) => <CharacterCard key={c.id} character={c} onDelete={removeCharacter} onRaidChange={updateRaid} onRaidSelect={selectRaid}/>)}
      {!characters.length && <div className="empty">캐릭터를 등록해 주세요.</div>}
    </div>
  </section>;
}
