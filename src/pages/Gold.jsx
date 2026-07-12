import PageHeader from "../components/common/PageHeader";
import { useCharacter } from "../context/CharacterContext";

export default function Gold() {
  const { characters, updateCharacter } = useCharacter();
  const goldCharacters = characters.filter((character) => character.isGoldCharacter);
  const totalGold = goldCharacters.reduce(
    (sum, character) => sum + (Number(character.weeklyGold) || 0),
    0
  );

  return (
    <>
      <PageHeader
        title="골드 관리"
        description="골드 획득 캐릭터의 주간 예상 수익을 관리하세요."
      />

      <section className="hero-card">
        <span>이번 주 예상 골드</span>
        <strong>{totalGold.toLocaleString()} G</strong>
        <p>{goldCharacters.length}개 캐릭터 기준</p>
      </section>

      <div className="gold-list">
        {goldCharacters.map((character) => (
          <section className="panel gold-row" key={character.id}>
            <div>
              <h2>{character.name}</h2>
              <p className="muted">
                {character.job || "직업 미입력"}
                {character.level ? ` · Lv.${character.level}` : ""}
              </p>
            </div>

            <label className="gold-input">
              <input
                type="number"
                min="0"
                value={character.weeklyGold}
                onChange={(event) =>
                  updateCharacter(character.id, {
                    weeklyGold: Number(event.target.value) || 0,
                  })
                }
              />
              <span>G</span>
            </label>
          </section>
        ))}
      </div>

      {goldCharacters.length === 0 && (
        <div className="empty-state panel">
          <p>골드 획득 캐릭터가 없습니다.</p>
        </div>
      )}
    </>
  );
}
