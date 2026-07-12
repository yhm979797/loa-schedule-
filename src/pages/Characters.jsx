import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import CharacterCard from "../components/character/CharacterCard";
import CharacterDialog from "../components/character/CharacterDialog";
import { useCharacter } from "../context/CharacterContext";

export default function Characters() {
  const {
    characters,
    addCharacter,
    updateCharacter,
    removeCharacter,
    toggleTodo,
  } = useCharacter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("level");

  const visibleCharacters = useMemo(() => {
    let result = [...characters];

    if (filter === "gold") {
      result = result.filter((character) => character.isGoldCharacter);
    }

    result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "ko");
      return (b.level || 0) - (a.level || 0);
    });

    return result;
  }, [characters, filter, sort]);

  const openAdd = () => {
    setEditingCharacter(null);
    setDialogOpen(true);
  };

  const openEdit = (character) => {
    setEditingCharacter(character);
    setDialogOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, data);
    } else {
      addCharacter(data);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("이 캐릭터를 삭제할까요?")) {
      removeCharacter(id);
    }
  };

  return (
    <>
      <PageHeader
        title="캐릭터 관리"
        description="캐릭터를 등록하고 숙제 현황을 관리하세요."
        action={
          <button className="button primary" onClick={openAdd}>
            <Plus size={18} />
            캐릭터 추가
          </button>
        }
      />

      <div className="toolbar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">전체 캐릭터</option>
          <option value="gold">골드 캐릭터만</option>
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="level">레벨 높은 순</option>
          <option value="name">이름 순</option>
        </select>
      </div>

      <div className="character-grid">
        {visibleCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onToggleTodo={toggleTodo}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {visibleCharacters.length === 0 && (
        <div className="empty-state panel">
          <p>조건에 맞는 캐릭터가 없습니다.</p>
          <button className="button primary" onClick={openAdd}>
            첫 캐릭터 추가하기
          </button>
        </div>
      )}

      <CharacterDialog
        open={dialogOpen}
        title={editingCharacter ? "캐릭터 수정" : "캐릭터 추가"}
        initialValue={editingCharacter}
        onSubmit={handleSubmit}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
