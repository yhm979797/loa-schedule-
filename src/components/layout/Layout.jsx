import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useAuth } from "../../context/AuthContext";
export default function Layout(){const {loading}=useAuth(); if(loading)return <div className="center-screen">공유 기능 연결 중...</div>; return <div className="app-shell"><header className="topbar"><div><p className="eyebrow">LOST ARK RAID BOARD</p><h1>LoaMate <span>V5</span></h1></div></header><main className="page-content"><Outlet/></main><BottomNav/></div>}
