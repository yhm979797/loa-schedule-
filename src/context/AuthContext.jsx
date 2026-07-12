import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth, firebaseEnabled } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) { setUser(nextUser); setLoading(false); return; }
      try { await signInAnonymously(auth); }
      catch (e) { setError(e.message); setLoading(false); }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ user, loading, error, firebaseEnabled }), [user, loading, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
