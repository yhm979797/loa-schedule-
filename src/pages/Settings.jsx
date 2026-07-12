import { LogIn, LogOut, Cloud, HardDrive } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, profile, login, logout, firebaseEnabled } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section>
      <div className="section-title"><div><p className="eyebrow">APP SETTINGS</p><h2>설정</h2></div></div>

      <div className="panel account-card">
        <div className="account-icon">{user ? <Cloud /> : <HardDrive />}</div>
        <div>
          <h3>{user ? profile?.displayName : "로컬 저장 모드"}</h3>
          <p>{user ? user.email : "이 브라우저에만 데이터가 저장됩니다."}</p>
        </div>
      </div>

      {!firebaseEnabled && (
        <div className="notice">
          Firebase 환경변수가 없습니다. README의 설정 순서대로 `.env`를 만들면 Google 로그인과 친구 기능이 활성화됩니다.
        </div>
      )}

      {user ? (
        <button className="secondary full" onClick={logout}><LogOut size={18} />로그아웃</button>
      ) : (
        <button className="primary full" onClick={handleLogin} disabled={!firebaseEnabled}><LogIn size={18} />Google로 로그인</button>
      )}

      <div className="panel info-list">
        <div><span>저장 방식</span><b>{user ? "Firebase 클라우드" : "LocalStorage"}</b></div>
        <div><span>친구 기능</span><b>{user ? "사용 가능" : "로그인 필요"}</b></div>
        <div><span>버전</span><b>2.0.0</b></div>
      </div>
    </section>
  );
}
