import {
  CalendarCheck2,
  Coins,
  House,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "홈", icon: House, end: true },
  { to: "/characters", label: "캐릭터", icon: Users },
  { to: "/todos", label: "숙제", icon: CalendarCheck2 },
  { to: "/gold", label: "골드", icon: Coins },
  { to: "/settings", label: "설정", icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
