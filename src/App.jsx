import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Todos from "./pages/Todos";
import Friends from "./pages/Friends";
import Gold from "./pages/Gold";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/gold" element={<Gold />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
