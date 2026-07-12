import { NavLink } from "react-router-dom";
import { Home, Swords, ListChecks, Share2, Settings } from "lucide-react";
const items=[["/","홈",Home],["/characters","캐릭터",Swords],["/raids","레이드",ListChecks],["/friends","공유",Share2],["/settings","설정",Settings]];
export default function BottomNav(){return <nav className="bottom-nav">{items.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"}><Icon size={19}/><span>{label}</span></NavLink>)}</nav>}
