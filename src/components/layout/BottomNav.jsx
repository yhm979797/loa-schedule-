import { NavLink } from "react-router-dom";
import { Home, Swords, ListChecks, Users, Coins, Settings } from "lucide-react";

const items = [
  ["/", "홈", Home],
  ["/characters", "캐릭터", Swords],
  ["/todos", "숙제", ListChecks],
  ["/friends", "친구", Users],
  ["/gold", "골드", Coins],
  ["/settings", "설정", Settings],
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
