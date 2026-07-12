import { useState } from "react";
import { Search, Plus, Download } from "lucide-react";
import { searchRoster } from "../api/lostark";
import { useCharacters } from "../context/CharacterContext";
import CharacterCard from "../components/character/CharacterCard";

export default function Characters() {
  const { characters, saveCharacter, addMany, removeCharacter, toggleTask, syncing } = useCharacters();
  const [name, setName] = useState("");
  const [manual, setManual] = useState({ name: "", server: "", job: "", level: "" });
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);

  const runSearch = async () => {
    if (!name.trim()) return;
    setSearching(true);
    setMessage("");
    try {
      const data = await searchRoster(name.trim());
      setResults(data.characters);
      setSelected(Object.fromEntries(data.characters.map((item) => [item.id, true])));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSearching(false);
    }
  };

  const importSelected = async () => {
    const chosen = results.filter((item) => selected[item.id]);
    await addMany(chosen);
    setMessage(`${chosen.length}개 캐릭터를 등록했습니다.`);
    setResults([]);
  };

  const addManual = async (event) => {
    event.preventDefault();
    if (!manual.name.trim()) return;
    await saveCharacter(manual);
    setManual({ name: "", server: "", job: "", level: "" });
  };

  return (
    <section>
      <div className="section-title"><div><p className="eyebrow">AUTO SYNC</p><h2>캐릭터</h2></div></div>

      <div className="panel">
        <h3>닉네임으로 원정대 불러오기</h3>
        <div className="input-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="대표 캐릭터 닉네임" onKeyDown={(e) => e.key === "Enter" && runSearch()} />
          <button className="primary" onClick={runSearch} disabled={searching}><Search size={17} />{searching ? "조회 중" : "조회"}</button>
        </div>
        {message && <p className="message">{message}</p>}

        {results.length > 0 && (
          <div className="search-results">
            {results.map((item) => (
              <label key={item.id}>
                <input type="checkbox" checked={Boolean(selected[item.id])} onChange={() => setSelected((prev) => ({ ...prev, [item.id]: !prev[item.id] }))} />
                <span><b>{item.name}</b><small>{item.server} · {item.job} · {item.level}</small></span>
              </label>
            ))}
            <button className="primary full" onClick={importSelected} disabled={syncing}><Download size={17} />선택 캐릭터 등록</button>
          </div>
        )}
      </div>

      <form className="panel" onSubmit={addManual}>
        <h3>직접 추가</h3>
        <div className="form-grid">
          <input required value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} placeholder="캐릭터명" />
          <input value={manual.server} onChange={(e) => setManual({ ...manual, server: e.target.value })} placeholder="서버" />
          <input value={manual.job} onChange={(e) => setManual({ ...manual, job: e.target.value })} placeholder="직업" />
          <input type="number" value={manual.level} onChange={(e) => setManual({ ...manual, level: e.target.value })} placeholder="아이템 레벨" />
        </div>
        <button className="secondary" type="submit"><Plus size={17} />직접 추가</button>
      </form>

      <div className="card-list">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} onToggle={toggleTask} onDelete={removeCharacter} />
        ))}
        {!characters.length && <div className="empty">등록된 캐릭터가 없습니다.</div>}
      </div>
    </section>
  );
}
