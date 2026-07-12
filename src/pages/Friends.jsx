import { useState } from "react";
import { Copy, ExternalLink, UploadCloud } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useCharacters } from "../context/CharacterContext";

export default function Friends(){
 const {user,error:authError}=useAuth(); const {characters,board,setBoard}=useCharacters(); const [message,setMessage]=useState("");
 const ensureId=()=>board.id||crypto.randomUUID().replaceAll("-","").slice(0,12);
 const publish=async()=>{ if(!firebaseEnabled)return setMessage("Firebase 설정이 필요합니다."); if(!user)return setMessage("익명 연결 중입니다. 잠시 후 다시 눌러 주세요."); const id=ensureId(); try{await setDoc(doc(db,"publicBoards",id),{ownerUid:user.uid,title:board.title||"레이드표",characters,updatedAt:Date.now()},{merge:true}); setBoard({...board,id}); setMessage("공유 레이드표를 게시했습니다.");}catch(e){setMessage(e.message);} };
 const url=board.id?`${location.origin}/share/${board.id}`:"";
 const copy=async()=>{await navigator.clipboard.writeText(url);setMessage("공유 주소를 복사했습니다.");};
 return <section><div className="section-title"><div><p className="eyebrow">PUBLIC SHARE</p><h2>친구에게 레이드표 공유</h2></div></div><div className="panel"><label className="field-label">레이드표 제목</label><input value={board.title} onChange={e=>setBoard({...board,title:e.target.value})} placeholder="예: 현민 레이드표"/><p className="help">게시 버튼을 누르면 현재 체크 상태가 공용 링크에 올라갑니다. 이후 변경할 때마다 다시 게시하면 갱신됩니다.</p><button className="primary full" onClick={publish}><UploadCloud size={18}/>현재 레이드표 게시/갱신</button>{url&&<div className="share-link"><input readOnly value={url}/><button className="secondary" onClick={copy}><Copy size={17}/>복사</button><a className="secondary button-link" href={url} target="_blank" rel="noreferrer"><ExternalLink size={17}/>열기</a></div>}</div>{(message||authError)&&<div className="notice">{message||authError}</div>}<div className="panel info-list"><div><span>Google 로그인</span><b>사용 안 함</b></div><div><span>친구 권한</span><b>보기 전용</b></div><div><span>수정 권한</span><b>이 브라우저만</b></div></div></section>;
}
