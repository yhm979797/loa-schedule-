import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { makeRaidSlots } from "../constants/raids";

const CharacterContext = createContext(null);
const LOCAL_KEY = "loamate-v3-characters";
const BOARD_KEY = "loamate-v3-board";

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } }
function normalize(c) {
  return {
    id: c.id || crypto.randomUUID(), name: c.name?.trim() || "이름 없음", server: c.server || "",
    job: c.job || "", level: Number(c.level) || 0,
    raids: Array.isArray(c.raids) && c.raids.length ? c.raids : makeRaidSlots(), updatedAt: Date.now(),
  };
}

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState(() => read(LOCAL_KEY, []));
  const [board, setBoard] = useState(() => read(BOARD_KEY, { id: "", title: "내 레이드표" }));
  useEffect(() => localStorage.setItem(LOCAL_KEY, JSON.stringify(characters)), [characters]);
  useEffect(() => localStorage.setItem(BOARD_KEY, JSON.stringify(board)), [board]);

  const addMany = (items) => setCharacters((prev) => {
    const map = new Map(prev.map((c) => [`${c.server}:${c.name}`, c]));
    items.map(normalize).forEach((c) => map.set(`${c.server}:${c.name}`, { ...map.get(`${c.server}:${c.name}`), ...c }));
    return [...map.values()].sort((a,b) => b.level-a.level);
  });
  const saveCharacter = (item) => setCharacters((prev) => {
    const next = normalize(item); const found = prev.some((c) => c.id === next.id);
    return found ? prev.map((c) => c.id === next.id ? next : c) : [...prev, next];
  });
  const removeCharacter = (id) => setCharacters((prev) => prev.filter((c) => c.id !== id));
  const updateRaid = (characterId, raidId, patch) => setCharacters((prev) => prev.map((c) => c.id !== characterId ? c : ({...c, raids: c.raids.map((r) => r.id === raidId ? {...r, ...patch} : r), updatedAt: Date.now()})));
  const resetAll = () => setCharacters((prev) => prev.map((c) => ({...c, raids: c.raids.map((r) => ({...r, done:false}))})));
  const progress = useMemo(() => {
    const raids = characters.flatMap((c) => c.raids || []); if (!raids.length) return 0;
    return Math.round(raids.filter((r) => r.done).length / raids.length * 100);
  }, [characters]);

  return <CharacterContext.Provider value={{characters, board, setBoard, addMany, saveCharacter, removeCharacter, updateRaid, resetAll, progress}}>{children}</CharacterContext.Provider>;
}
export const useCharacters = () => useContext(CharacterContext);
