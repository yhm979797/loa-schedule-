import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createDefaultDailyTodos,
  createDefaultWeeklyTodos,
} from "../constants/tasks";

const STORAGE_KEY = "loamate-characters";
const SETTINGS_KEY = "loamate-settings";

const CharacterContext = createContext(null);

const normalizeCharacter = (character) => ({
  id: character.id ?? crypto.randomUUID(),
  name: character.name ?? "",
  job: character.job ?? "",
  level: Number(character.level) || 0,
  server: character.server ?? "",
  isGoldCharacter: Boolean(character.isGoldCharacter),
  weeklyGold: Number(character.weeklyGold) || 0,
  dailyTodos: {
    ...createDefaultDailyTodos(),
    ...(character.dailyTodos ?? character.todos ?? {}),
  },
  weeklyTodos: {
    ...createDefaultWeeklyTodos(),
    ...(character.weeklyTodos ?? {}),
  },
});

const loadCharacters = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeCharacter) : [];
  } catch {
    return [];
  }
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { dailyResetHour: 6, weeklyResetDay: 3 };
    return {
      dailyResetHour: 6,
      weeklyResetDay: 3,
      ...JSON.parse(raw),
    };
  } catch {
    return { dailyResetHour: 6, weeklyResetDay: 3 };
  }
};

export function CharacterProvider({ children }) {
  const [characters, setCharacters] = useState(loadCharacters);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addCharacter = (character) => {
    setCharacters((current) => [
      ...current,
      normalizeCharacter({
        ...character,
        id: crypto.randomUUID(),
      }),
    ]);
  };

  const updateCharacter = (id, updates) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === id
          ? normalizeCharacter({ ...character, ...updates, id })
          : character
      )
    );
  };

  const removeCharacter = (id) => {
    setCharacters((current) =>
      current.filter((character) => character.id !== id)
    );
  };

  const toggleTodo = (id, type, key) => {
    const todoField = type === "weekly" ? "weeklyTodos" : "dailyTodos";

    setCharacters((current) =>
      current.map((character) =>
        character.id === id
          ? {
              ...character,
              [todoField]: {
                ...character[todoField],
                [key]: !character[todoField]?.[key],
              },
            }
          : character
      )
    );
  };

  const setAllTodos = (type, checked) => {
    const todoField = type === "weekly" ? "weeklyTodos" : "dailyTodos";

    setCharacters((current) =>
      current.map((character) => ({
        ...character,
        [todoField]: Object.fromEntries(
          Object.keys(character[todoField]).map((key) => [key, checked])
        ),
      }))
    );
  };

  const resetTodos = (type) => setAllTodos(type, false);

  const clearAllData = () => {
    setCharacters([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const importData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error("올바른 캐릭터 백업 파일이 아닙니다.");
    }
    setCharacters(data.map(normalizeCharacter));
  };

  const value = useMemo(
    () => ({
      characters,
      settings,
      addCharacter,
      updateCharacter,
      removeCharacter,
      toggleTodo,
      setAllTodos,
      resetTodos,
      setSettings,
      clearAllData,
      importData,
    }),
    [characters, settings]
  );

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);

  if (!context) {
    throw new Error("useCharacter는 CharacterProvider 안에서 사용해야 합니다.");
  }

  return context;
}
