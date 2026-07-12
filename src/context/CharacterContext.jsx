import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { makeRaidSlots, raidById } from "../constants/raids";

const CharacterContext = createContext(null);
const LOCAL_KEY = "loamate-v4-characters";
const LEGACY_KEYS = ["loamate-v3-characters", "characters", "loa-characters"];
const BOARD_KEY = "loamate-v4-board";

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } }
function initialCharacters() {
  const current = read(LOCAL_KEY, null);
  if (current) return current;
  for (const key of LEGACY_KEYS) { const old = read(key, null); if (Array.isArray(old) && old.length) return old; }
  return [];
}
function normalizeRaid(r, index) {
  const found = raidById(r?.id);
  return { ...(found || {}), ...r, slotId: r?.slotId || `slot-${index + 1}`, gold: Number(r?.gold ?? found?.gold ?? 0), done: Boolean(r?.done) };
}
function normalize(c) {
  const level = Number(c.level) || 0;
  const raids = Array.isArray(c.raids) && c.raids.length ? c.raids.map(normalizeRaid) : makeRaidSlots(level);
  return { id: c.id || crypto.randomUUID(), name: c.name?.trim() || "이름 없음", server: c.server || "", job: c.job || "", level, raids, updatedAt: Date.now() };
}

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState(() => initialCharacters().map(normalize));
  const [board, setBoard] = useState(() => read(BOARD_KEY, { id: "", title: "내 레이드표" }));
  useEffect(() => localStorage.setItem(LOCAL_KEY, JSON.stringify(characters)), [characters]);
  useEffect(() => localStorage.setItem(BOARD_KEY, JSON.stringify(board)), [board]);

  const addMany = (items) => setCharacters((prev) => {
    const map = new Map(prev.map((c) => [`${c.server}:${c.name}`, c]));
    items.map(normalize).forEach((c) => {
      const key = `${c.server}:${c.name}`;
      const old = map.get(key);
      map.set(key, old ? { ...old, ...c, raids: old.raids?.length ? old.raids : c.raids } : c);
    });
    return [...map.values()].sort((a,b) => b.level-a.level);
  });
  const removeCharacter = (id) => setCharacters((prev) => prev.filter((c) => c.id !== id));
  const updateRaid = (characterId, slotId, patch) => setCharacters((prev) => prev.map((c) => c.id !== characterId ? c : ({ ...c, raids: c.raids.map((r) => r.slotId === slotId ? { ...r, ...patch } : r), updatedAt: Date.now() })));
  const selectRaid = (characterId, slotId, raidId) => {
    const selected = raidById(raidId);
    updateRaid(characterId, slotId, selected ? { ...selected, slotId, done: false } : { id: "", name: "레이드 선택", difficulty: "", minLevel: 0, gold: 0, done: false });
  };
  const resetAll = () => setCharacters((prev) => prev.map((c) => ({ ...c, raids: c.raids.map((r) => ({ ...r, done:false })) })));
  const progress = useMemo(() => {
    const raids = characters.flatMap((c) => (c.raids || []).filter((r) => r.id));
    return raids.length ? Math.round(raids.filter((r) => r.done).length / raids.length * 100) : 0;
  }, [characters]);
  const totalGold = useMemo(() => characters.flatMap((c) => c.raids || []).filter((r) => r.done).reduce((sum, r) => sum + (Number(r.gold) || 0), 0), [characters]);

  return <CharacterContext.Provider value={{characters, board, setBoard, addMany, removeCharacter, updateRaid, selectRaid, resetAll, progress, totalGold}}>{children}</CharacterContext.Provider>;
}
export const useCharacters = () => useContext(CharacterContext);
