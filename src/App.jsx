import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Raids from "./pages/Raids";
import Friends from "./pages/Friends";
import Share from "./pages/Share";
import Settings from "./pages/Settings";
export default function App(){return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="/characters" element={<Characters/>}/><Route path="/raids" element={<Raids/>}/><Route path="/friends" element={<Friends/>}/><Route path="/share/:boardId" element={<Share/>}/><Route path="/settings" element={<Settings/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
