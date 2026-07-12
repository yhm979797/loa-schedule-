import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "../lib/firebase";

const AuthContext = createContext(null);

const makeFriendCode = (uid) =>
  `LOA-${uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", nextUser.uid);
      const snap = await getDoc(ref);
      const data = {
        uid: nextUser.uid,
        displayName: nextUser.displayName || "LoaMate 사용자",
        email: nextUser.email || "",
        photoURL: nextUser.photoURL || "",
        friendCode: makeFriendCode(nextUser.uid),
        updatedAt: Date.now(),
      };

      if (!snap.exists()) {
        await setDoc(ref, data);
        setProfile(data);
      } else {
        const merged = { ...data, ...snap.data() };
        await setDoc(ref, merged, { merge: true });
        setProfile(merged);
      }
      setLoading(false);
    });
  }, []);

  const login = async () => {
    if (!firebaseEnabled) throw new Error("Firebase 설정이 필요합니다.");
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const logout = async () => {
    if (firebaseEnabled) await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, profile, loading, login, logout, firebaseEnabled }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
