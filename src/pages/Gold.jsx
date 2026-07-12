import { useCharacters } from "../context/CharacterContext";

export default function Gold() {
  const { characters, patchCharacter } = useCharacters();
  const total = characters.filter((item) => item.goldCharacter).reduce((sum, item) => sum + (Number(item.gold) || 0), 0);

  return (
    <section>
      <div className="section-title"><div><p className="eyebrow">WEEKLY GOLD</p><h2>골드</h2></div></div>
      <div className="hero-card compact">
        <p>이번 주 예상 골드</p>
        <strong>{total.toLocaleString()}</strong>
      </div>
      <div className="panel">
        {characters.map((character) => (
          <div className="gold-row" key={character.id}>
            <label>
              <input type="checkbox" checked={character.goldCharacter} onChange={(e) => patchCharacter(character.id, { goldCharacter: e.target.checked })} />
              <span><b>{character.name}</b><small>{character.job}</small></span>
            </label>
            <input type="number" min="0" value={character.gold || ""} placeholder="예상 골드" onChange={(e) => patchCharacter(character.id, { gold: Number(e.target.value) })} />
          </div>
        ))}
        {!characters.length && <div className="empty">캐릭터를 먼저 등록해 주세요.</div>}
      </div>
    </section>
  );
}
