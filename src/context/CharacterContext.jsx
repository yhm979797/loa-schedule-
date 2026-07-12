import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { ALL_TASKS, emptyTasks } from "../constants/tasks";

const CharacterContext = createContext(null);
const LOCAL_KEY = "loamate-v2-characters";

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function normalizeCharacter(character) {
  return {
    id: character.id || crypto.randomUUID(),
    name: character.name?.trim() || "이름 없음",
    job: character.job || "",
    level: Number(character.level) || 0,
    server: character.server || "",
    goldCharacter: Boolean(character.goldCharacter),
    gold: Number(character.gold) || 0,
    tasks: { ...emptyTasks(), ...(character.tasks || {}) },
    updatedAt: Date.now(),
  };
}

export function CharacterProvider({ children }) {
  const { user } = useAuth();
  const [characters, setCharacters] = useState(loadLocal);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!firebaseEnabled || !user) {
      setCharacters(loadLocal());
      return;
    }

    const ref = collection(db, "users", user.uid, "characters");
    return onSnapshot(ref, (snapshot) => {
      const cloud = snapshot.docs.map((item) => item.data());
      setCharacters(cloud.sort((a, b) => b.level - a.level));
    });
  }, [user]);

  useEffect(() => {
    if (!firebaseEnabled || !user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(characters));
    }
  }, [characters, user]);

  const saveCharacter = async (character) => {
    const next = normalizeCharacter(character);
    if (firebaseEnabled && user) {
      await setDoc(doc(db, "users", user.uid, "characters", next.id), next);
    } else {
      setCharacters((prev) => {
        const exists = prev.some((item) => item.id === next.id);
        return exists
          ? prev.map((item) => (item.id === next.id ? next : item))
          : [...prev, next];
      });
    }
    return next;
  };

  const addMany = async (items) => {
    const unique = items
      .map(normalizeCharacter)
      .filter((item, index, array) =>
        array.findIndex((x) => x.name === item.name && x.server === item.server) === index
      );

    if (firebaseEnabled && user) {
      setSyncing(true);
      const batch = writeBatch(db);
      unique.forEach((item) => {
        batch.set(doc(db, "users", user.uid, "characters", item.id), item, { merge: true });
      });
      await batch.commit();
      setSyncing(false);
    } else {
      setCharacters((prev) => {
        const map = new Map(prev.map((item) => [`${item.server}:${item.name}`, item]));
        unique.forEach((item) => map.set(`${item.server}:${item.name}`, { ...map.get(`${item.server}:${item.name}`), ...item }));
        return [...map.values()];
      });
    }
  };

  const removeCharacter = async (id) => {
    if (firebaseEnabled && user) {
      await deleteDoc(doc(db, "users", user.uid, "characters", id));
    } else {
      setCharacters((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const patchCharacter = async (id, patch) => {
    const current = characters.find((item) => item.id === id);
    if (!current) return;
    await saveCharacter({ ...current, ...patch, id });
  };

  const toggleTask = async (id, taskKey) => {
    const current = characters.find((item) => item.id === id);
    if (!current) return;
    await patchCharacter(id, {
      tasks: { ...current.tasks, [taskKey]: !current.tasks?.[taskKey] },
    });
  };

  const resetTasks = async (keys = ALL_TASKS.map((task) => task.key)) => {
    for (const character of characters) {
      const tasks = { ...character.tasks };
      keys.forEach((key) => (tasks[key] = false));
      await patchCharacter(character.id, { tasks });
    }
  };

  const totalProgress = useMemo(() => {
    if (!characters.length) return 0;
    const total = characters.length * ALL_TASKS.length;
    const done = characters.reduce(
      (sum, item) => sum + ALL_TASKS.filter((task) => item.tasks?.[task.key]).length,
      0
    );
    return Math.round((done / total) * 100);
  }, [characters]);

  return (
    <CharacterContext.Provider
      value={{
        characters,
        syncing,
        totalProgress,
        saveCharacter,
        addMany,
        removeCharacter,
        patchCharacter,
        toggleTask,
        resetTasks,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacters = () => useContext(CharacterContext);
