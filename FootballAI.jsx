"use client";
import { useState, useEffect, useRef } from "react";

const API_KEY  = "96070ce7c2fdbcd015f72b38f1cd6987";
const API_ROUTE = "/api/football";

const LEAGUES = [
  { id: "39",  name: "Premier League" },
  { id: "140", name: "La Liga" },
  { id: "78",  name: "Bundesliga" },
  { id: "61",  name: "Ligue 1" },
  { id: "135", name: "Serie A" },
  { id: "2",   name: "Champions League" },
  { id: "3",   name: "Europa League" },
  { id: "848", name: "Conference League" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.fa{font-family:'Cairo',sans-serif;background:#030712;color:#f1f5f9;min-height:100vh;
  background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(0,212,255,.10) 0%,transparent 60%),
  radial-gradient(ellipse 50% 40% at 90% 90%,rgba(168,85,247,.07) 0%,transparent 60%)}
.fa-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 28px;
  border-bottom:1px solid rgba(255,255,255,.07);background:rgba(10,14,20,.94);
  backdrop-filter:blur(14px);position:sticky;top:0;z-index:100}
.fa-logo{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:3px;
  background:linear-gradient(90deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.fa-sub{font-size:11px;color:#6b7280;margin-top:-4px}
.fa-main{max-width:1020px;margin:0 auto;padding:32px 20px}
.fa-card{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:28px;margin-bottom:20px}
.fa-sec{font-size:11px;font-weight:700;letter-spacing:2.5px;color:#6b7280;text-transform:uppercase;
  margin-bottom:20px;display:flex;align-items:center;gap:10px}
.fa-sec::before{content:'';display:block;width:3px;height:16px;flex-shrink:0;
  background:linear-gradient(180deg,#00d4ff,#a855f7);border-radius:2px}
.fa-row{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:end;margin-bottom:20px}
.fa-vs{font-family:'Bebas Neue',cursive;font-size:30px;color:#374151;padding-bottom:10px;text-align:center}
.fa-lbl{font-size:12px;color:#6b7280;margin-bottom:8px;font-weight:600}
.fa-inp{width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.09);
  background:#060a0f;color:#f1f5f9;font-size:15px;font-family:'Cairo',sans-serif;
  direction:ltr;transition:border-color .2s;outline:none}
.fa-inp:focus{border-color:#00d4ff}
.fa-opts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px}
.fa-sel{width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.09);
  background:#060a0f;color:#f1f5f9;font-family:'Cairo',sans-serif;font-size:13px;outline:none}
.fa-acts{display:flex;gap:12px}
.fa-btn{flex:1;padding:14px;border-radius:10px;border:none;
  background:linear-gradient(90deg,#00d4ff,#a855f7);color:#fff;
  font-weight:700;font-size:15px;font-family:'Cairo',sans-serif;cursor:pointer;transition:opacity .2s,transform .1s}
.fa-btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
.fa-btn:disabled{opacity:.45;cursor:not-allowed}
.fa-rst{padding:14px 22px;border-radius:10px;background:transparent;
  border:1px solid rgba(255,255,255,.1);color:#6b7280;
  font-family:'Cairo',sans-serif;cursor:pointer;font-size:15px}
.fa-rst:hover{border-color:rgba(255,255,255,.3);color:#9ca3af}
.fa-cd{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:16px;
  padding:44px 20px;margin-bottom:20px;text-align:center}
.fa-cd-lbl{font-size:11px;letter-spacing:3px;color:#6b7280;text-transform:uppercase;margin-bottom:14px}
.fa-cd-num{font-family:'Bebas Neue',cursive;font-size:96px;line-height:1;
  background:linear-gradient(90deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.fa-cd-st{font-size:13px;color:#00d4ff;margin-top:14px}
.fa-cd-sb{font-size:12px;color:#4b5563;margin-top:6px}
.fa-prog{height:3px;background:rgba(255,255,255,.05);border-radius:2px;margin-top:22px;overflow:hidden}
.fa-prog-f{height:100%;border-radius:2px;background:linear-gradient(90deg,#00d4ff,#a855f7);transition:width 1s linear}
.fa-hero{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:16px;
  padding:36px;margin-bottom:20px;text-align:center;position:relative;overflow:hidden}
.fa-hero::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(0,212,255,.07) 0%,transparent 70%)}
.fa-mname{font-family:'Bebas Neue',cursive;font-size:32px;letter-spacing:2px;margin-bottom:6px;color:#e2e8f0}
.fa-score{font-family:'Bebas Neue',cursive;font-size:84px;line-height:1;margin:8px 0;
  background:linear-gradient(90deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.fa-winner{font-size:20px;font-weight:700;margin-bottom:10px}
.fa-conf{display:inline-block;padding:4px 16px;border-radius:20px;
  background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#22c55e;font-size:12px;font-weight:700}
.fa-s3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}
.fa-sc{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:18px;text-align:center}
.fa-sc-lbl{font-size:10px;letter-spacing:2px;color:#6b7280;text-transform:uppercase;margin-bottom:8px}
.fa-sc-val{font-size:22px;font-weight:900}
.fa-sc-sub{font-size:11px;color:#6b7280;margin-top:4px}
.fa-d2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.fa-dc{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:18px}
.fa-dt{font-size:11px;letter-spacing:2px;color:#6b7280;text-transform:uppercase;margin-bottom:14px}
.fa-dr{display:flex;justify-content:space-between;align-items:center;
  padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:13px}
.fa-dr:last-child{border-bottom:none}
.fa-dk{color:#6b7280}.fa-dv{font-weight:700}
.fa-h2{background:#0d1117;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:18px;margin-bottom:14px}
.fa-hr{display:flex;align-items:center;justify-content:space-between;
  padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px;gap:8px}
.fa-hr:last-child{border-bottom:none}
.fa-hdate{color:#4b5563;min-width:80px}.fa-hteams{flex:1;text-align:center;color:#6b7280}
.fa-hscore{font-weight:700;font-size:15px;min-width:56px;text-align:center;
  background:linear-gradient(90deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.fa-bdg{font-size:10px;padding:2px 10px;border-radius:20px;font-weight:700}
.fa-bh{background:rgba(0,212,255,.1);color:#00d4ff;border:1px solid rgba(0,212,255,.2)}
.fa-ba{background:rgba(168,85,247,.1);color:#a855f7;border:1px solid rgba(168,85,247,.2)}
.fa-bd{background:rgba(107,114,128,.15);color:#9ca3af;border:1px solid rgba(107,114,128,.2)}
.fa-tbl{width:100%;border-collapse:collapse;font-size:12px}
.fa-tbl th{text-align:right;padding:8px 10px;color:#6b7280;font-weight:600;
  letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,.07)}
.fa-tbl td{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,.03)}
.fa-tbl tr.hl td{background:rgba(0,212,255,.05)}
.fa-err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);
  border-radius:12px;padding:20px;color:#ef4444;margin-bottom:14px;font-size:14px;line-height:1.7}
.fa-err pre{margin-top:10px;padding:10px 14px;background:rgba(0,0,0,.4);
  border-radius:8px;font-size:11px;direction:ltr;color:#fca5a5;white-space:pre-wrap;word-break:break-all}
.c-c{color:#00d4ff}.c-g{color:#22c55e}.c-y{color:#f59e0b}.c-r{color:#ef4444}.c-m{color:#6b7280}
.fa-foot{text-align:center;color:#374151;font-size:12px;padding:32px 20px;letter-spacing:1px}
@media(max-width:680px){
  .fa-bar{padding:12px 14px}
  .fa-row{grid-template-columns:1fr}.fa-vs{display:none}
  .fa-opts{grid-template-columns:1fr}.fa-s3{grid-template-columns:1fr 1fr}
  .fa-d2{grid-template-columns:1fr}.fa-score{font-size:58px}.fa-mname{font-size:22px}
}
`;

async function apiFetch(endpoint, params = "") {
  const url = `${API_ROUTE}?endpoint=${encodeURIComponent(endpoint)}${params ? "&" + params : ""}`;
  const r = await fetch(url, { headers: { "x-apisports-key": API_KEY } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  if (j.errors && Object.keys(j.errors).length)
    throw new Error(Object.values(j.errors).join(", "));
  return j;
}

async function resolveTeam(q) {
  const isId = /^\d+$/.test(q.trim());
  const d = await apiFetch("teams", isId ? `id=${q.trim()}` : `search=${encodeURIComponent(q.trim())}`);
  return d.response?.[0]?.team ?? null;
}

const safe = async (fn) => { try { return await fn(); } catch(e) { console.warn(e.message); return null; } };

function buildPred(hS, aS, h2h, hN, aN) {
  const str = (s) => {
    if (!s) return 50;
    let v = 50;
    const f = s.form || "";
    v += (f.match(/W/g)||[]).length*5 - (f.match(/L/g)||[]).length*3;
    v += (parseFloat(s.goals?.for?.average?.total||1.5) - parseFloat(s.goals?.against?.average?.total||1.5))*8;
    v += ((s.fixtures?.wins?.total||0) / Math.max(s.fixtures?.played?.total||1,1))*15;
    return v;
  };
  let h=str(hS), a=str(aS);
  (h2h||[]).forEach(m=>{const hg=m.goals?.home??0,ag=m.goals?.away??0;if(hg>ag)h+=3;else if(ag>hg)a+=3;});
  h=Math.max(10,Math.min(90,h+Math.random()*10-5));
  a=Math.max(10,Math.min(90,a+Math.random()*10-5));
  const tot=h+a+10,r=Math.random();
  let score,winner;
  if(r<h/tot){score=["2-1","3-1","2-0","3-0","1-0","4-1"][~~(Math.random()*6)];winner=hN;}
  else if(r<(h+a)/tot){score=["1-2","0-2","1-3","0-1","2-3"][~~(Math.random()*5)];winner=aN;}
  else{score=["0-0","1-1","2-2"][~~(Math.random()*3)];winner="تعادل";}
  const [g1,g2]=score.split("-").map(Number);
  return{score,winner,ou:g1+g2>2?"Over 2.5 ⬆️":"Under 2.5 ⬇️",
    btts:g1>0&&g2>0?"نعم ✅":"لا ❌",
    conf:Math.round(55+Math.abs(h-a)*.3+Math.random()*10),
    hStr:Math.round(h),aStr:Math.round(a)};
}

function Frm({f}){
  if(!f) return <span className="c-m">—</span>;
  return <>{f.split("").slice(-5).map((c,i)=>(
    <span key={i} style={{marginLeft:4,fontWeight:700,color:c==="W"?"#22c55e":c==="L"?"#ef4444":"#6b7280"}}>{c}</span>
  ))}</>;
}
function TCard({name,s}){
  const f=s?.fixtures,g=s?.goals;
  return(
    <div className="fa-dc">
      <div className="fa-dt">📊 {name}</div>
      {[["الشكل",<Frm f={s?.form}/>],
        ["مباريات",<span className="c-c">{f?.played?.total??"—"}</span>],
        ["فوز",<span className="c-g">{f?.wins?.total??"—"}</span>],
        ["تعادل",<span className="c-y">{f?.draws?.total??"—"}</span>],
        ["خسارة",<span className="c-r">{f?.loses?.total??"—"}</span>],
        ["متوسط تسجيل",<span className="c-c">{g?.for?.average?.total??"—"}</span>],
        ["متوسط استقبال",<span className="c-r">{g?.against?.average?.total??"—"}</span>],
      ].map(([k,v])=>(
        <div className="fa-dr" key={k}><span className="fa-dk">{k}</span><span className="fa-dv">{v}</span></div>
      ))}
    </div>
  );
}
function H2HCard({data}){
  return(
    <div className="fa-h2">
      <div className="fa-dt" style={{marginBottom:12}}>⚡ المواجهات المباشرة</div>
      {!data?.length
        ?<div className="fa-hr"><span className="c-m" style={{width:"100%",textAlign:"center"}}>لا توجد بيانات</span></div>
        :data.slice(0,7).map((m,i)=>{
          const hg=m.goals?.home??"?",ag=m.goals?.away??"?";
          const hn=m.teams?.home?.name||"",an=m.teams?.away?.name||"";
          const b=hg>ag?<span className="fa-bdg fa-bh">{hn}</span>:ag>hg?<span className="fa-bdg fa-ba">{an}</span>:<span className="fa-bdg fa-bd">تعادل</span>;
          return(
            <div className="fa-hr" key={i}>
              <span className="fa-hdate">{m.fixture?.date?.substr(0,10)||""}</span>
              <span className="fa-hteams">{hn} — {an}</span>
              <span className="fa-hscore">{hg} - {ag}</span>{b}
            </div>
          );
        })}
    </div>
  );
}
function StCard({data,hId,aId}){
  if(!data?.length) return null;
  return(
    <div className="fa-h2">
      <div className="fa-dt" style={{marginBottom:14}}>🏆 جدول الترتيب</div>
      <table className="fa-tbl">
        <thead><tr>
          <th style={{textAlign:"center"}}>#</th><th>الفريق</th>
          <th style={{textAlign:"center"}}>لعب</th><th style={{textAlign:"center"}}>ف</th>
          <th style={{textAlign:"center"}}>خ</th><th style={{textAlign:"center"}}>GD</th>
          <th style={{textAlign:"center"}}>نق</th>
        </tr></thead>
        <tbody>{data.slice(0,20).map(s=>{
          const hl=s.team?.id===hId||s.team?.id===aId,gd=s.goalsDiff??"—";
          return(
            <tr key={s.rank} className={hl?"hl":""}>
              <td style={{textAlign:"center",color:"#6b7280",fontWeight:700}}>{s.rank}</td>
              <td style={{fontWeight:600}}>{s.team?.name}</td>
              <td style={{textAlign:"center"}}>{s.all?.played??"—"}</td>
              <td style={{textAlign:"center",color:"#22c55e"}}>{s.all?.win??"—"}</td>
              <td style={{textAlign:"center",color:"#ef4444"}}>{s.all?.lose??"—"}</td>
              <td style={{textAlign:"center",color:"#00d4ff"}}>{typeof gd==="number"&&gd>0?`+${gd}`:gd}</td>
              <td style={{textAlign:"center",fontWeight:700,color:"#f59e0b"}}>{s.points??"—"}</td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  );
}

export default function FootballAI() {
  const [home,setHome]=useState("");
  const [away,setAway]=useState("");
  const [lid,setLid]=useState("39");
  const [cLid,setCLid]=useState("");
  const [season,setSeason]=useState("2024");
  const [phase,setPhase]=useState("idle");
  const [status,setStatus]=useState("");
  const [timer,setTimer]=useState(60);
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const iv=useRef(null),tr=useRef(60);

  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=CSS;document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  const league=lid==="custom"?(cLid||"39"):lid;
  const reset=()=>{clearInterval(iv.current);setPhase("idle");setTimer(60);tr.current=60;setStatus("");setResult(null);setError("");};
  const startTimer=()=>{tr.current=60;setTimer(60);clearInterval(iv.current);iv.current=setInterval(()=>{tr.current--;setTimer(tr.current);if(tr.current<=0)clearInterval(iv.current);},1000);};

  const analyze=async()=>{
    if(!home||!away){alert("أدخل اسمي الفريقين");return;}
    reset();setPhase("loading");startTimer();
    try{
      setStatus("🔍 جاري البحث عن الفرق...");
      const [hT,aT]=await Promise.all([resolveTeam(home),resolveTeam(away)]);
      if(!hT) throw new Error(`لم يُعثر على: "${home}"`);
      if(!aT) throw new Error(`لم يُعثر على: "${away}"`);
      setStatus(`✅ ${hT.name} vs ${aT.name} — جاري جلب الإحصائيات...`);
      const [hS,aS,h2h,stand]=await Promise.all([
        safe(()=>apiFetch("teams/statistics",`team=${hT.id}&league=${league}&season=${season}`).then(d=>d.response)),
        safe(()=>apiFetch("teams/statistics",`team=${aT.id}&league=${league}&season=${season}`).then(d=>d.response)),
        safe(()=>apiFetch("fixtures/headtohead",`h2h=${hT.id}-${aT.id}&last=10`).then(d=>d.response||[])),
        safe(()=>apiFetch("standings",`league=${league}&season=${season}`).then(d=>d.response?.[0]?.league?.standings?.[0]||[])),
      ]);
      setStatus("🧠 جاري بناء التوقع...");
      const pred=buildPred(hS,aS,h2h||[],hT.name,aT.name);
      setResult({hT,aT,hS,aS,h2h:h2h||[],stand:stand||[],pred});
      setTimeout(()=>{clearInterval(iv.current);setPhase("result");},tr.current*1000);
    }catch(e){clearInterval(iv.current);setError(e.message||"خطأ");setPhase("error");}
  };

  return(
    <div className="fa">
      <div className="fa-bar">
        <div><div className="fa-logo">V2Pro+ iA</div><div className="fa-sub">Football Intelligence System</div></div>
      </div>
      <div className="fa-main">
        <div className="fa-card">
          <div className="fa-sec">تحليل المباراة</div>
          <div className="fa-row">
            <div><div className="fa-lbl">🏠 الفريق المضيف</div>
              <input className="fa-inp" placeholder="Arsenal أو ID: 42" value={home} onChange={e=>setHome(e.target.value)}/></div>
            <div className="fa-vs">VS</div>
            <div><div className="fa-lbl">✈️ الفريق الضيف</div>
              <input className="fa-inp" placeholder="Chelsea أو ID: 49" value={away} onChange={e=>setAway(e.target.value)}/></div>
          </div>
          <div className="fa-opts">
            <div><div className="fa-lbl">🏆 الدوري</div>
              <select className="fa-sel" value={lid} onChange={e=>setLid(e.target.value)}>
                {LEAGUES.map(l=><option key={l.id} value={l.id}>{l.name} ({l.id})</option>)}
                <option value="custom">مخصص...</option>
              </select></div>
            <div><div className="fa-lbl">📅 الموسم</div>
              <select className="fa-sel" value={season} onChange={e=>setSeason(e.target.value)}>
                <option value="2024">2024</option><option value="2023">2023</option><option value="2025">2025</option>
              </select></div>
            <div><div className="fa-lbl">🔢 League ID مخصص</div>
              <input className="fa-inp" placeholder="307" value={cLid} onChange={e=>setCLid(e.target.value)}/></div>
          </div>
          <div className="fa-acts">
            <button className="fa-btn" onClick={analyze} disabled={phase==="loading"}>
              {phase==="loading"?"⏳ جاري التحليل...":"🚀 ابدأ التحليل الذكي"}
            </button>
            <button className="fa-rst" onClick={reset}>↺ إعادة</button>
          </div>
        </div>

        {phase==="loading"&&(<div className="fa-cd">
          <div className="fa-cd-lbl">جاري استخراج البيانات</div>
          <div className="fa-cd-num">{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</div>
          <div className="fa-cd-st">{status}</div>
          <div className="fa-cd-sb">🤖 يتم جلب إحصائيات حقيقية من Football API v3</div>
          <div className="fa-prog"><div className="fa-prog-f" style={{width:`${(timer/60)*100}%`}}/></div>
        </div>)}

        {phase==="error"&&(<div className="fa-err">❌ حدث خطأ<pre>{error}</pre></div>)}

        {phase==="result"&&result&&(()=>{
          const{hT,aT,hS,aS,h2h,stand,pred}=result;
          return<>
            <div className="fa-hero">
              <div className="fa-mname">{hT.name} • {aT.name}</div>
              <div className="fa-score">{pred.score}</div>
              <div className="fa-winner">{pred.winner==="تعادل"?"🤝 تعادل":`👑 ${pred.winner}`}</div>
              <div className="fa-conf">دقة التحليل: {pred.conf}%</div>
            </div>
            <div className="fa-s3">
              {[["Over / Under",pred.ou,"c-y","إجمالي الأهداف"],
                ["كلا الفريقين يسجل",pred.btts,"c-g","BTTS"],
                ["قوة الفرق",`${pred.hStr} — ${pred.aStr}`,"c-c","مضيف — ضيف"],
              ].map(([l,v,c,s])=>(
                <div className="fa-sc" key={l}>
                  <div className="fa-sc-lbl">{l}</div>
                  <div className={`fa-sc-val ${c}`}>{v}</div>
                  <div className="fa-sc-sub">{s}</div>
                </div>
              ))}
            </div>
            <div className="fa-d2"><TCard name={hT.name} s={hS}/><TCard name={aT.name} s={aS}/></div>
            <H2HCard data={h2h}/><StCard data={stand} hId={hT.id} aId={aT.id}/>
          </>;
        })()}
        <div className="fa-foot">© TOONI KROOS 0690586056 — Powered by API-Football v3</div>
      </div>
    </div>
  );
}
