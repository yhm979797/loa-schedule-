import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";
import CharacterCard from "../components/character/CharacterCard";
export default function Share(){ const {boardId}=useParams(); const [data,setData]=useState(null); const [error,setError]=useState(""); useEffect(()=>{ if(!firebaseEnabled){setError("공유 기능 설정이 완료되지 않았습니다.");return;} return onSnapshot(doc(db,"publicBoards",boardId),s=>{if(!s.exists())setError("공유 레이드표를 찾지 못했습니다."); else setData(s.data());},e=>setError(e.message));},[boardId]); return <section><div className="section-title"><div><p className="eyebrow">PUBLIC BOARD</p><h2>{data?.title||"공유 레이드표"}</h2></div></div>{error&&<div className="notice">{error}</div>}<div className="character-grid">{(data?.characters||[]).map(c=><CharacterCard key={c.id} character={c} readOnly/> )}</div>{data&&<p className="share-updated">마지막 갱신: {new Date(data.updatedAt).toLocaleString()}</p>}</section> }
