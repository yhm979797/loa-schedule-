import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { UserPlus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, firebaseEnabled } from "../lib/firebase";
import CharacterCard from "../components/character/CharacterCard";

export default function Friends() {
  const { user, profile } = useAuth();
  const [code, setCode] = useState("");
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [friendCharacters, setFriendCharacters] = useState([]);
  const [message, setMessage] = useState("");

  const loadFriends = async () => {
    if (!firebaseEnabled || !user) return;
    const snap = await getDocs(collection(db, "users", user.uid, "friends"));
    setFriends(snap.docs.map((item) => item.data()));
  };

  useEffect(() => { loadFriends(); }, [user]);

  const addFriend = async () => {
    if (!user) return setMessage("Google 로그인이 필요합니다.");
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    const snap = await getDocs(query(collection(db, "users"), where("friendCode", "==", normalized)));
    if (snap.empty) return setMessage("친구 코드를 찾지 못했습니다.");

    const target = snap.docs[0].data();
    if (target.uid === user.uid) return setMessage("자기 자신은 추가할 수 없습니다.");

    await setDoc(doc(db, "users", user.uid, "friends", target.uid), {
      uid: target.uid,
      displayName: target.displayName,
      email: target.email || "",
      friendCode: target.friendCode,
      addedAt: Date.now(),
    });
    setCode("");
    setMessage("친구를 추가했습니다.");
    loadFriends();
  };

  const viewSchedule = async (friend) => {
    setSelected(friend);
    const snap = await getDocs(collection(db, "users", friend.uid, "characters"));
    setFriendCharacters(snap.docs.map((item) => item.data()).sort((a, b) => b.level - a.level));
  };

  const removeFriend = async (friend) => {
    await deleteDoc(doc(db, "users", user.uid, "friends", friend.uid));
    if (selected?.uid === friend.uid) {
      setSelected(null);
      setFriendCharacters([]);
    }
    loadFriends();
  };

  if (!firebaseEnabled) return <div className="empty">친구 기능은 Firebase 설정 후 사용할 수 있습니다.</div>;
  if (!user) return <div className="empty">설정 화면에서 Google 로그인 후 친구를 추가해 주세요.</div>;

  return (
    <section>
      <div className="section-title"><div><p className="eyebrow">FRIEND SCHEDULE</p><h2>친구</h2></div></div>
      <div className="panel">
        <p>내 친구 코드</p>
        <div className="friend-code">{profile?.friendCode || "불러오는 중"}</div>
        <div className="input-row">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="친구 코드 입력" />
          <button className="primary" onClick={addFriend}><UserPlus size={17} />추가</button>
        </div>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="panel friend-list">
        <h3>친구 목록</h3>
        {friends.map((friend) => (
          <div className="friend-row" key={friend.uid}>
            <button className="friend-main" onClick={() => viewSchedule(friend)}>
              <b>{friend.displayName}</b><small>{friend.friendCode}</small>
            </button>
            <button className="icon-button danger" onClick={() => removeFriend(friend)}><Trash2 size={17} /></button>
          </div>
        ))}
        {!friends.length && <div className="empty small">추가된 친구가 없습니다.</div>}
      </div>

      {selected && (
        <>
          <div className="section-title"><h2>{selected.displayName}의 스케줄</h2></div>
          <div className="card-list">
            {friendCharacters.map((character) => <CharacterCard key={character.id} character={character} readOnly />)}
            {!friendCharacters.length && <div className="empty">등록된 캐릭터가 없습니다.</div>}
          </div>
        </>
      )}
    </section>
  );
}
