import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { loading } = useAuth();
  if (loading) return <div className="center-screen">로그인 상태 확인 중...</div>;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">LOST ARK SCHEDULE</p>
          <h1>LoaMate <span>V2</span></h1>
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
