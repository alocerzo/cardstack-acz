import { useState, useEffect, useRef } from "react";

// ─── PALETA DARK BALANCEADA ───────────────────────────────────────────────────
const C = {
  bg:          "#111318",
  surface:     "#1c1f27",
  card:        "#242830",
  cardAlt:     "#2a2e38",
  border:      "#2e3340",
  borderLight: "#3a4050",
  amex:        "#6ea8e8",
  amexDark:    "#3d7abf",
  amexLight:   "rgba(110,168,232,0.12)",
  amexGrad:    "linear-gradient(135deg,#3a5a80,#5a7fa8,#7aa0c8)",
  costco:      "#e84444",
  costcoDark:  "#b02020",
  costcoLight: "rgba(232,68,68,0.12)",
  costcoGrad:  "linear-gradient(135deg,#882020,#b83030)",
  text:        "#e8eaf0",
  textMed:     "#a8b0c0",
  muted:       "#606880",
  dim:         "#404858",
  green:       "#3ec88a",
  greenDark:   "#2a8a60",
  greenLight:  "rgba(62,200,138,0.12)",
  amber:       "#e0a030",
  amberLight:  "rgba(224,160,48,0.12)",
  purple:      "#9080e0",
  purpleLight: "rgba(144,128,224,0.12)",
  red:         "#e05050",
  shadow:      "0 4px 20px rgba(0,0,0,0.4)",
  navH:        58,
};

const fmx = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const NOW = new Date();
const CUR_MONTH = NOW.getMonth(), CUR_YEAR = NOW.getFullYear();

// ─── RESTAURANTES GDC ────────────────────────────────────────────────────────
const GDC = ["AIDA","AITANA","ALFREDO DI ROMA","ANIMAL","ANONIMO","AU PIED DE COCHON","AZUL CONDESA","AZUL HISTORICO","CAMBALACHE","CANTINETTA DEL BECCO","CARMELA Y SAL","CAROLO","CHAMBAO","CHAPULIN","CONFESSIONS","CORTILE","EL JAPONEZ","ELOISE","ENO","ENTRE FUEGOS","FARINA","FISHER'S","FISHERS","FOGO DE CHAO","FUNKY GEISHA","GUADIANA","HARRY'S","HOTARU","HUNAN","JAZAMANGO","KAMPAI","LA DOCENA","LA NACIONAL","LAMPUGA","LARDO","LE CHIQUE","LING LING","LOMA LINDA","LORETTA","LUR","MAMAZZITA","MASALA Y MAIZ","MAXIMO BISTROT","MOCHOMOS","MORIMOTO","NEGRONI","NOBU","OLIVA ENOTECA","PANGEA","PAROLE","POLPO","PORFIRIO'S","PROSECCO","PUERTO MADERO","PUJOL","QUINTONIL","ROSA NEGRA","ROSETTA","RYOSHI","SAN ANGEL INN","SEÑOR TANAKA","SESAME","SONORA GRILL","SUD 777","SUNTORY","SYLVESTRE","TABOO","TANTRA","THE CAPITAL GRILLE","THE PALM","TORI TORI","TRASTEVERE","VASTO","ZERU","ZIBU","ALCALDE","ALLIUM","CASA OAXACA","CRIOLLO","ORIGEN","PITIONA","BAGATELLE","FAUNA","LAJA","LAS MAÑANITAS","BESTIA","GALLO 71","CAO","ARCA","BANDONEON"];

// ─── CATEGORÍAS TARJETAS ─────────────────────────────────────────────────────
const CATS_COSTCO = [
  {id:"gasolina_costco",label:"Gasolina Costco",   rate:5, cap:10000,capRate:3, icon:"ti-gas-station"},
  {id:"educacion",      label:"Educación",          rate:4, cap:20000,capRate:1, icon:"ti-school"},
  {id:"costco_tienda",  label:"Compras en Costco",  rate:3, icon:"ti-shopping-cart"},
  {id:"restaurantes_c", label:"Restaurantes",       rate:2, icon:"ti-tools-kitchen-2"},
  {id:"streaming",      label:"Streaming/Internet", rate:2, icon:"ti-device-tv"},
  {id:"otros_costco",   label:"Otros",              rate:1, icon:"ti-tag"},
];
const CATS_AMEX = [
  {id:"aeromexico", label:"Vuelos Aeroméxico",  pts:4.8,  icon:"ti-plane"},
  {id:"extranjero", label:"Compras extranjero", pts:2.08, icon:"ti-world"},
  {id:"gdc",        label:"Restaurante GDC",    pts:1.6, bono:1000, icon:"ti-star"},
  {id:"otros_amex", label:"Otros (Amex)",       pts:1.6,  icon:"ti-credit-card"},
];
const ALL_CATS = [...CATS_COSTCO,...CATS_AMEX];
const getCat = id => ALL_CATS.find(c=>c.id===id);

// ─── CATEGORÍAS PRESUPUESTO ───────────────────────────────────────────────────
const BUDGET_CATS = [
  {id:"renta",       label:"Renta",           icon:"ti-home",           default:30000},
  {id:"limpieza",    label:"Limpieza",         icon:"ti-wash",           default:6000},
  {id:"internet",    label:"Internet",         icon:"ti-wifi",           default:1129},
  {id:"celular",     label:"Celular",          icon:"ti-device-mobile",  default:499},
  {id:"bebbia",      label:"Bebbia",           icon:"ti-droplet",        default:369},
  {id:"gas",         label:"Gas",              icon:"ti-flame",          default:300},
  {id:"agua",        label:"Agua",             icon:"ti-droplet-half-2", default:500},
  {id:"luz",         label:"Luz",              icon:"ti-bolt",           default:300},
  {id:"super",       label:"Super",            icon:"ti-shopping-bag",   default:7000},
  {id:"gas_taigun",  label:"Gasolina Taigun",  icon:"ti-gas-station",    default:1000},
  {id:"gas_byd",     label:"Gasolina BYD",     icon:"ti-gas-station",    default:1000},
  {id:"seguro_byd",  label:"Seguro BYD",       icon:"ti-shield-check",   default:1185},
  {id:"tags",        label:"Tags",             icon:"ti-road",           default:1000},
  {id:"gastos_mat",  label:"Gastos Matías",    icon:"ti-baby-carriage",  default:1000},
  {id:"doctor",      label:"Doctor",           icon:"ti-stethoscope",    default:3000},
  {id:"medicinas",   label:"Medicinas",        icon:"ti-pill",           default:2000},
  {id:"comida_mamba",label:"Comida Mamba",     icon:"ti-paw",            default:350},
  {id:"gastos_mamba",label:"Gastos Mamba",     icon:"ti-paw",            default:350},
  {id:"uber_eats",   label:"Uber Eats",        icon:"ti-motorbike",      default:2000},
  {id:"comida_of",   label:"Comida Oficina",   icon:"ti-building",       default:2000},
  {id:"cafe",        label:"Café",             icon:"ti-coffee",         default:500},
  {id:"restaurantes",label:"Restaurantes",     icon:"ti-tools-kitchen-2",default:2000},
  {id:"salidas",     label:"Salidas",          icon:"ti-ticket",         default:2000},
  {id:"google_one",  label:"Google One",       icon:"ti-brand-google",   default:395},
  {id:"salon",       label:"Salón Belleza",    icon:"ti-scissors",       default:0},
  {id:"shopping",    label:"Shopping",         icon:"ti-shopping-cart",  default:0},
  {id:"depa",        label:"Extras Depa",      icon:"ti-home-edit",      default:0},
  {id:"regalos",     label:"Regalos",          icon:"ti-gift",           default:0},
];

// ─── BENEFICIOS AMEX ─────────────────────────────────────────────────────────
const AMEX_BENEFITS = [
  {id:"bonif_am",    name:"Bonificación $10,000 MXN Aeroméxico", valor:10000, cat:"Aeroméxico",  icon:"ti-cash",              tip:"Activa en AMEX App ANTES de comprar. Requiere $30,000 MXN en AM."},
  {id:"boletos_2x1", name:"Boletos 2x1 (hasta 4/año)",           valor:6000,  cat:"Aeroméxico",  icon:"ti-ticket",            tip:"Se renuevan en septiembre. Pagas con Puntos AM Rewards."},
  {id:"ascensos",    name:"Ascensos Premier int'l (4/año)",       valor:8000,  cat:"Aeroméxico",  icon:"ti-armchair",          tip:"Rutas MX-EUA/Canadá/Sudamérica. Llama al (55) 5133 4076."},
  {id:"maleta",      name:"Maleta gratis (cada vuelo AM)",         valor:3600,  cat:"Aeroméxico",  icon:"ti-luggage",           tip:"Redímela en aeromexico.com en 'Detalles del Viaje'."},
  {id:"pp",          name:"Priority Pass ilimitado",               valor:14400, cat:"Salas VIP",   icon:"ti-armchair-2",        tip:"Activa membresía digital en la app Priority Pass."},
  {id:"centurion",   name:"Centurion Lounge (tú + esposa)",        valor:4800,  cat:"Salas VIP",   icon:"ti-building-skyscraper",tip:"Solo vuelos de salida. CDMX, Toluca, MTY + 40 globales."},
  {id:"premier_am",  name:"Salones Premier Aeroméxico",            valor:3500,  cat:"Salas VIP",   icon:"ti-plane-departure",   tip:"T2 CDMX cerrada desde feb 2025."},
  {id:"gdc_benefit", name:"Restaurantes GDC — $4,000 MXN/año",    valor:4000,  cat:"Restaurantes",icon:"ti-star",              tip:"Activa en AMEX App antes de ir. Mín. $3,000 MXN/visita."},
  {id:"seg_auto",    name:"Seguro auto rentado $75k USD",           valor:2000,  cat:"Seguros",     icon:"ti-car",               tip:"Declina CDW/LDW. Solo fuera de México."},
  {id:"seg_equip",   name:"Seguro pérdida/demora equipaje",         valor:2000,  cat:"Seguros",     icon:"ti-shield",            tip:"Demora mín. 4 hrs. Boleto pagado con la tarjeta."},
];

// ─── METAS PRECARGADAS ────────────────────────────────────────────────────────
// Ordenadas de menor a mayor plazo
const DEFAULT_GOALS = [
  {id:"caja_chica",  name:"Caja Chica",          objetivo:50000,    acumulado:56500,  plazo:1,  aportacion:0,     color:C.green,  plataforma:"DINN"},
  {id:"viaje_anual", name:"Viaje Anual",          objetivo:100000,   acumulado:0,      plazo:1,  aportacion:7979,  color:C.amex,   plataforma:"Nu"},
  {id:"reloj",       name:"Reloj Tudor",          objetivo:95000,    acumulado:63000,  plazo:1,  aportacion:2136,  color:C.muted,  plataforma:"Nu"},
  {id:"chile_2026",  name:"Viaje Chile 2026",     objetivo:40000,    acumulado:28000,  plazo:1,  aportacion:772,   color:C.costco, plataforma:"Nu"},
  {id:"emergencia",  name:"Fondo de emergencia",  objetivo:300000,   acumulado:216000, plazo:2,  aportacion:1787,  color:C.green,  plataforma:"DINN"},
  {id:"enganche",    name:"Enganche casa",         objetivo:4000000,  acumulado:348200, plazo:8,  aportacion:24792, color:C.amber,  plataforma:"Actinver Trade"},
  {id:"univ_mat",    name:"Universidad Matías",    objetivo:5000000,  acumulado:116000, plazo:18, aportacion:9338,  color:C.amex,   plataforma:"Nu + Actinver Trade"},
  {id:"retiro",      name:"Libertad financiera",   objetivo:15000000, acumulado:785700, plazo:35, aportacion:9959,  color:C.purple, plataforma:"Actinver Trade + AFORE"},
  {id:"crypto",      name:"Crypto",               objetivo:0,        acumulado:20000,  plazo:0,  aportacion:0,     color:C.amber,  plataforma:"Bitso"},
];

const DEFAULT_INCOME = [
  {id:"sueldo_alo",   label:"Sueldo Alo",     amount:74000},
  {id:"sueldo_charo", label:"Sueldo Charo",   amount:29800},
  {id:"vales_desp",   label:"Vales Despensa", amount:3430},
  {id:"vales_gas",    label:"Vales Gas",      amount:0},
];

// ─── CÁLCULOS ─────────────────────────────────────────────────────────────────
function calcCostcoCashback(purchases){
  const byMC={};
  purchases.filter(p=>p.card==="costco").forEach(p=>{
    const k=`${p.month}-${p.year}-${p.catId}`;
    byMC[k]=(byMC[k]||0)+p.amount;
  });
  return Object.entries(byMC).reduce((t,[k,amt])=>{
    const cat=getCat(k.split("-")[2]); if(!cat) return t;
    return cat.cap ? t+Math.min(amt,cat.cap)*(cat.rate/100)+Math.max(0,amt-cat.cap)*((cat.capRate||1)/100) : t+amt*(cat.rate/100);
  },0);
}
function calcAmexPoints(purchases){
  const TC=20.1;
  return Math.round(purchases.filter(p=>p.card==="amex").reduce((t,p)=>{const cat=getCat(p.catId);return t+(cat?.pts||1.6)*(p.amount/TC);},0));
}
function calcGDCBonos(purchases){
  return Math.min(purchases.filter(p=>p.card==="amex"&&p.catId==="gdc"&&p.amount>=3000).length,4)*1000;
}
function extractJSON(raw){
  try{return JSON.parse(raw);}catch{}
  let depth=0,start=-1;
  for(let i=0;i<raw.length;i++){
    if(raw[i]==="{"){if(depth===0)start=i;depth++;}
    else if(raw[i]==="}"){depth--;if(depth===0&&start>=0){try{return JSON.parse(raw.slice(start,i+1));}catch{start=-1;}}}
  }
  return null;
}

const SYSTEM_PROMPT=`Eres un asistente experto en tarjetas de crédito. El usuario tiene DOS tarjetas:

AMEX PLATINUM AEROMÉXICO:
- Vuelos Aeroméxico: 4.8 pts/USD. catId: aeromexico
- Compras extranjero/dólares: 2.08 pts/USD. catId: extranjero
- Restaurante GDC: bono $1,000 MXN al gastar $3,000+. catId: gdc
- Todo lo demás: 1.6 pts/USD. catId: otros_amex

COSTCO BANAMEX:
- Gasolina Costco: 5% (tope $10,000/mes). catId: gasolina_costco
- Educación: 4% (tope $20,000/mes). catId: educacion
- Costco tienda: 3%. catId: costco_tienda
- Restaurantes: 2% (agregador → 1%). catId: restaurantes_c
- Streaming/internet/TV: 2%. catId: streaming
- Otros: 1%. catId: otros_costco

GDC conocidos: Nobu, Quintonil, Pujol, Sonora Grill, Fisher's, Fogo de Chao, Tori Tori, Rosa Negra, Suntory, Hunan, El Japonez, Sud 777, Maximo Bistrot, Puerto Madero, Porfirio's, Cambalache, Farina, Lardo, Rosetta, Pangea, Harry's y +200 más.

REGLAS: 1) Info suficiente → recomienda directo. 2) Falta info → UNA pregunta. 3) SOLO JSON crudo sin texto extra.
4) En "reason" tutea a Alo.

Recomendación: {"recommendation":true,"card":"costco|amex","catId":"id","reason":"max 7 palabras","benefit":"ej: 5% reembolso"}
Pregunta: {"recommendation":false,"question":"pregunta tuteando a Alo"}`;

// ─── LOGOS ────────────────────────────────────────────────────────────────────
const BanamexLogo=({size=20,color="white"})=>{
  const s=size,cx=s/2,cy=s/2,r=s*0.38;
  const pts=Array.from({length:5},(_,i)=>{const a=(i*72-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">{pts.map((p,i)=>{const next=pts[(i+2)%5];const mid=[(p[0]+next[0])/2,(p[1]+next[1])/2];return<path key={i} d={`M ${p[0].toFixed(1)} ${p[1].toFixed(1)} Q ${mid[0].toFixed(1)} ${(mid[1]-s*0.04).toFixed(1)} ${next[0].toFixed(1)} ${next[1].toFixed(1)}`} stroke={color} strokeWidth={size*0.13} strokeLinecap="round" fill="none"/>;})}</svg>);
};

// ─── SHARED ───────────────────────────────────────────────────────────────────
const SL=({children,style={}})=><div style={{fontSize:10,color:C.muted,fontFamily:"monospace",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase",fontWeight:600,...style}}>{children}</div>;

const PBar=({pct,color,h=4})=><div style={{background:C.border,borderRadius:100,height:h,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,Math.max(0,pct))}%`,background:color,borderRadius:100,transition:"width 0.5s"}}/></div>;

const CardBadge=({card,small})=>{const isA=card==="amex";return<span style={{display:"inline-flex",alignItems:"center",gap:3,background:isA?C.amexLight:C.costcoLight,border:`1px solid ${isA?"rgba(110,168,232,0.3)":"rgba(232,68,68,0.3)"}`,color:isA?C.amex:C.costco,borderRadius:5,padding:small?"2px 6px":"3px 9px",fontSize:small?10:11,fontFamily:"monospace",fontWeight:700,letterSpacing:0.5}}>{isA?"✦ AMEX":"◈ COSTCO"}</span>;};

// ─── RECO CARD ────────────────────────────────────────────────────────────────
function RecoCard({card,catId,reason,benefit,onRegister}){
  const isA=card==="amex"; const accent=isA?C.amex:C.costco;
  const cat=getCat(catId);
  const [msiTab,setMsiTab]=useState(false);
  const [amount,setAmount]=useState("");
  const [meses,setMeses]=useState(null);
  const [done,setDone]=useState(false);
  const iS={background:C.cardAlt,border:`1px solid ${C.borderLight}`,color:C.text,borderRadius:8,outline:"none",fontFamily:"monospace",boxSizing:"border-box"};
  const reg=()=>{
    const n=parseFloat(amount);if(!n||n<=0)return;
    onRegister({card,catId,amount:n,isMSI:msiTab&&!!meses,mesesTotal:meses,mesesRestantes:meses,pagoMensual:meses?Math.round(n/meses):0});
    setDone(true);
  };
  return(
    <div style={{background:C.surface,border:`1.5px solid ${accent}`,borderRadius:14,overflow:"hidden",marginTop:4,maxWidth:"92%",boxShadow:C.shadow}}>
      <div style={{background:isA?C.amexGrad:C.costcoGrad,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
        {isA?(<svg width="32" height="23" viewBox="0 0 44 32" fill="none"><rect width="44" height="32" rx="4" fill="#1a3a5c"/><text x="22" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black,sans-serif" letterSpacing="-0.5">AMEX</text></svg>):(<BanamexLogo size={26} color="white"/>)}
        <div><div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.95)",fontFamily:"monospace",letterSpacing:1}}>{isA?"AMEX PLATINUM":"COSTCO BANAMEX"}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.65)",fontFamily:"monospace"}}>{isA?"Aeroméxico":"Banamex Visa"}</div></div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:18,fontWeight:800,color:"white",fontFamily:"monospace",lineHeight:1}}>{benefit}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontFamily:"monospace"}}>{reason}</div>
        </div>
      </div>
      <div style={{padding:"10px 14px"}}>
        {!done?(
          <>
            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:10}}>
              {["Contado","MSI"].map((l,i)=>{const active=i===0?!msiTab:msiTab;return(<button key={l} onClick={()=>setMsiTab(i===1)} style={{flex:1,padding:"6px",textAlign:"center",fontSize:11,color:active?accent:C.muted,background:"none",border:"none",borderBottom:`2px solid ${active?accent:"transparent"}`,cursor:"pointer",fontFamily:"monospace",fontWeight:active?700:400}}>{l}</button>);})}
            </div>
            {msiTab?(
              <>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginBottom:5}}>Monto total de la compra</div>
                <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:12}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" style={{...iS,width:"100%",padding:"8px 8px 8px 20px",fontSize:13}}/></div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginBottom:6}}>Meses sin intereses</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {[3,6,9,12,18,24].map(m=><button key={m} onClick={()=>setMeses(m)} style={{padding:"4px 10px",borderRadius:20,fontSize:11,border:`1px solid ${meses===m?accent:C.border}`,color:meses===m?accent:C.muted,background:meses===m?C.amexLight:C.card,cursor:"pointer",fontFamily:"monospace",fontWeight:meses===m?700:400}}>{m}</button>)}
                </div>
                {amount&&meses&&<div style={{fontSize:12,color:C.textMed,marginBottom:8,fontFamily:"monospace"}}>{fmx(Math.round(parseFloat(amount)/meses))}/mes × {meses} meses</div>}
                <button onClick={reg} disabled={!amount||!meses} style={{width:"100%",background:amount&&meses?accent:"#333",border:"none",color:amount&&meses?"#fff":C.muted,padding:"8px",borderRadius:8,fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:amount&&meses?"pointer":"default"}}>Agregar a MSI tracker</button>
              </>
            ):(
              <div style={{display:"flex",gap:8}}>
                <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} onKeyDown={e=>e.key==="Enter"&&reg()} placeholder="Monto gastado" style={{...iS,width:"100%",padding:"8px 8px 8px 20px",fontSize:13}}/></div>
                <button onClick={reg} disabled={!amount} style={{background:amount?accent:"#333",border:"none",color:amount?"#fff":C.muted,padding:"8px 14px",borderRadius:8,fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:amount?"pointer":"default"}}>Registrar</button>
              </div>
            )}
          </>
        ):(
          <div style={{fontSize:13,color:C.green,fontFamily:"monospace",display:"flex",alignItems:"center",gap:6}}><i className="ti ti-check"/> {msiTab?"MSI registrado":"Registrado"} — {fmx(parseFloat(amount))}</div>
        )}
      </div>
    </div>
  );
}

// ─── QUICK ADD ────────────────────────────────────────────────────────────────
function QuickAdd({onAdd}){
  const [card,setCard]=useState("costco");
  const [catId,setCatId]=useState("gasolina_costco");
  const [amount,setAmount]=useState("");
  const [isMSI,setIsMSI]=useState(false);
  const [meses,setMeses]=useState(null);
  const cats=card==="amex"?CATS_AMEX:CATS_COSTCO;
  const iS={background:C.cardAlt,border:`1px solid ${C.borderLight}`,color:C.text,borderRadius:8,outline:"none",fontFamily:"monospace",boxSizing:"border-box"};
  const add=()=>{
    const n=parseFloat(amount);if(!n||n<=0)return;
    onAdd({card,catId,amount:n,isMSI:isMSI&&!!meses,mesesTotal:meses,mesesRestantes:meses,pagoMensual:meses?Math.round(n/meses):0});
    setAmount("");setMeses(null);setIsMSI(false);
  };
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {["amex","costco"].map(c=>(
          <button key={c} onClick={()=>{setCard(c);setCatId(c==="amex"?"aeromexico":"gasolina_costco");}} style={{flex:1,background:card===c?(c==="amex"?C.amexLight:C.costcoLight):C.card,border:`1px solid ${card===c?(c==="amex"?C.amex:C.costco):C.border}`,color:card===c?(c==="amex"?C.amex:C.costco):C.muted,borderRadius:8,padding:"8px",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>
            {c==="amex"?"✦ AMEX":"◈ COSTCO"}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <select value={catId} onChange={e=>setCatId(e.target.value)} style={{...iS,flex:2,padding:"8px 10px",fontSize:12}}>{cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
        <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:12}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!isMSI&&add()} placeholder="Monto" style={{...iS,width:"100%",padding:"8px 8px 8px 18px",fontSize:12}}/></div>
        {!isMSI&&<button onClick={add} disabled={!amount} style={{background:amount?(card==="amex"?C.amex:C.costco):"#333",border:"none",color:amount?"#fff":C.muted,padding:"8px 14px",borderRadius:8,fontFamily:"monospace",fontSize:15,fontWeight:700,cursor:amount?"pointer":"default"}}>+</button>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:isMSI?10:0}}>
        <button onClick={()=>{setIsMSI(!isMSI);setMeses(null);}} style={{background:isMSI?C.amberLight:"none",border:`1px solid ${isMSI?C.amber:C.border}`,color:isMSI?C.amber:C.muted,borderRadius:20,padding:"4px 12px",fontSize:11,fontFamily:"monospace",cursor:"pointer",fontWeight:isMSI?700:400}}>MSI</button>
        {isMSI&&<span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Selecciona meses</span>}
      </div>
      {isMSI&&(
        <>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
            {[3,6,9,12,18,24].map(m=><button key={m} onClick={()=>setMeses(m)} style={{padding:"4px 10px",borderRadius:20,fontSize:11,border:`1px solid ${meses===m?C.amber:C.border}`,color:meses===m?C.amber:C.muted,background:meses===m?C.amberLight:C.card,cursor:"pointer",fontFamily:"monospace",fontWeight:meses===m?700:400}}>{m}</button>)}
          </div>
          {amount&&meses&&<div style={{fontSize:11,color:C.textMed,fontFamily:"monospace",marginBottom:8}}>{fmx(Math.round(parseFloat(amount)/meses))}/mes × {meses} meses</div>}
          <button onClick={add} disabled={!amount||!meses} style={{width:"100%",background:amount&&meses?C.amber:"#333",border:"none",color:amount&&meses?"#000":C.muted,padding:"8px",borderRadius:8,fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:amount&&meses?"pointer":"default"}}>Agregar a MSI tracker</button>
        </>
      )}
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
function EditModal({purchase,onSave,onClose}){
  const [card,setCard]=useState(purchase.card);
  const [catId,setCatId]=useState(purchase.catId);
  const [amount,setAmount]=useState(String(purchase.amount));
  const cats=card==="amex"?CATS_AMEX:CATS_COSTCO;
  useEffect(()=>{if(!cats.find(c=>c.id===catId))setCatId(cats[0].id);},[card]);
  const iS={width:"100%",background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:"monospace",outline:"none",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderLight}`,borderRadius:16,padding:22,width:"100%",maxWidth:340,boxShadow:C.shadow}}>
        <SL>Editar compra</SL>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["amex","costco"].map(c=><button key={c} onClick={()=>setCard(c)} style={{flex:1,background:card===c?(c==="amex"?C.amexLight:C.costcoLight):C.card,border:`1px solid ${card===c?(c==="amex"?C.amex:C.costco):C.border}`,color:card===c?(c==="amex"?C.amex:C.costco):C.muted,borderRadius:8,padding:"8px",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>{c==="amex"?"✦ AMEX":"◈ COSTCO"}</button>)}
        </div>
        <select value={catId} onChange={e=>setCatId(e.target.value)} style={{...iS,marginBottom:12}}>{cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
        <div style={{position:"relative",marginBottom:18}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...iS,paddingLeft:22}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>onSave({...purchase,card,catId,amount:parseFloat(amount)||0,label:getCat(catId)?.label||catId})} style={{flex:2,background:C.amex,border:"none",color:"#fff",borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:"pointer"}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MSI MODAL ────────────────────────────────────────────────────────────
function AddMSIModal({onSave,onClose}){
  const [name,setName]=useState("");
  const [card,setCard]=useState("amex");
  const [amount,setAmount]=useState("");
  const [meses,setMeses]=useState(null);
  const iS={width:"100%",background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:"monospace",outline:"none",boxSizing:"border-box"};
  const save=()=>{
    const n=parseFloat(amount);if(!n||!meses||!name.trim())return;
    onSave({id:Date.now()+"msi",name:name.trim(),card,amount:n,mesesTotal:meses,mesesRestantes:meses,pagoMensual:Math.round(n/meses)});
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderLight}`,borderRadius:16,padding:22,width:"100%",maxWidth:340,boxShadow:C.shadow}}>
        <SL>Agregar MSI existente</SL>
        <div style={{fontSize:10,color:C.muted,marginBottom:8}}>Para compras que ya tienes a meses y quieres trackear</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre (ej: Dyson)" style={{...iS,marginBottom:10}}/>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {["amex","costco"].map(c=><button key={c} onClick={()=>setCard(c)} style={{flex:1,background:card===c?(c==="amex"?C.amexLight:C.costcoLight):C.card,border:`1px solid ${card===c?(c==="amex"?C.amex:C.costco):C.border}`,color:card===c?(c==="amex"?C.amex:C.costco):C.muted,borderRadius:8,padding:"7px",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>{c==="amex"?"✦ AMEX":"◈ COSTCO"}</button>)}
        </div>
        <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Monto total" style={{...iS,paddingLeft:22}}/></div>
        <SL style={{marginBottom:6}}>Meses restantes</SL>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {[3,6,9,12,15,18,24].map(m=><button key={m} onClick={()=>setMeses(m)} style={{padding:"4px 10px",borderRadius:20,fontSize:11,border:`1px solid ${meses===m?C.amber:C.border}`,color:meses===m?C.amber:C.muted,background:meses===m?C.amberLight:C.card,cursor:"pointer",fontFamily:"monospace",fontWeight:meses===m?700:400}}>{m}</button>)}
        </div>
        {amount&&meses&&<div style={{fontSize:11,color:C.textMed,fontFamily:"monospace",marginBottom:10}}>{fmx(Math.round(parseFloat(amount)/meses))}/mes × {meses} meses restantes</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,cursor:"pointer"}}>Cancelar</button>
          <button onClick={save} disabled={!name||!amount||!meses} style={{flex:2,background:name&&amount&&meses?C.amber:"#333",border:"none",color:name&&amount&&meses?"#000":C.muted,borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:name&&amount&&meses?"pointer":"default"}}>Agregar</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("tarjetas");
  const [cardSub,setCardSub]=useState("asistente");
  const [gastosSub,setGastosSub]=useState("presupuesto");
  const [messages,setMessages]=useState([{role:"assistant",type:"text",content:"Hola Alo! 👋🏽 ¿Qué estás pagando?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [purchases,setPurchases]=useState([]);
  const [msiList,setMsiList]=useState([
    {id:"dyson",   name:"Dyson",         card:"amex",amount:15300,mesesTotal:15,mesesRestantes:11,pagoMensual:1020},
    {id:"sam_cel", name:"Samsung Cel",   card:"amex",amount:25950,mesesTotal:15,mesesRestantes:10,pagoMensual:1730},
    {id:"sam_tab", name:"Samsung Tablet",card:"amex",amount:21600,mesesTotal:9, mesesRestantes:1, pagoMensual:2400},
  ]);
  const [goals,setGoals]=useState(DEFAULT_GOALS);
  const [income,setIncome]=useState(DEFAULT_INCOME);
  const [budget,setBudget]=useState(()=>Object.fromEntries(BUDGET_CATS.map(c=>[c.id,c.default])));
  const [editP,setEditP]=useState(null);
  const [showAddMSI,setShowAddMSI]=useState(false);
  const [notif,setNotif]=useState({pagos:true,presupuesto80:true,metas:false,resumen:true});
  const chatRef=useRef(null);

  useEffect(()=>{try{const s=localStorage.getItem("apex_v2");if(s){const p=JSON.parse(s);if(p.purchases)setPurchases(p.purchases);if(p.msiList)setMsiList(p.msiList);if(p.goals)setGoals(p.goals);if(p.income)setIncome(p.income);if(p.budget)setBudget(p.budget);}}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem("apex_v2",JSON.stringify({purchases,msiList,goals,income,budget}));}catch{};},[purchases,msiList,goals,income,budget]);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[messages,loading]);

  const addPurchase=({card,catId,amount,isMSI,mesesTotal,mesesRestantes,pagoMensual})=>{
    const cat=getCat(catId);
    setPurchases(prev=>[{id:Date.now(),card,catId,amount,label:cat?.label||catId,month:CUR_MONTH,year:CUR_YEAR,date:new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short"})},...prev]);
    if(isMSI&&mesesTotal){
      setMsiList(prev=>[...prev,{id:Date.now()+"msi",name:cat?.label||catId,card,amount,mesesTotal,mesesRestantes,pagoMensual}]);
    }
  };

  const send=async()=>{
    const text=input.trim();if(!text||loading)return;
    setInput("");
    const userMsg={role:"user",type:"text",content:text};
    setMessages(prev=>[...prev,userMsg]);setLoading(true);
    try{
      const history=[...messages,userMsg].filter(m=>m.type==="text"||m.type==="question").slice(-10).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}));
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:300,system:SYSTEM_PROMPT,messages:history})});
      const data=await res.json();
      const raw=data.content?.map(b=>b.text||"").join("").trim()||"{}";
      let parsed=extractJSON(raw);
      if(Array.isArray(parsed))parsed=parsed[0];
      if(parsed?.recommendation){setMessages(prev=>[...prev,{role:"assistant",type:"recommendation",card:parsed.card,catId:parsed.catId,reason:parsed.reason,benefit:parsed.benefit}]);}
      else{setMessages(prev=>[...prev,{role:"assistant",type:"question",content:parsed?.question||"¿Puedes darme más detalles?"}]);}
    }catch{setMessages(prev=>[...prev,{role:"assistant",type:"text",content:"Error al conectar. Intenta de nuevo."}]);}
    setLoading(false);
  };

  // Stats
  const costcoCashback=calcCostcoCashback(purchases);
  const amexPts=calcAmexPoints(purchases);
  const gdcBonos=calcGDCBonos(purchases);
  const amexPtsMXN=Math.round(amexPts*0.17);
  const thisMo=purchases.filter(p=>p.month===CUR_MONTH&&p.year===CUR_YEAR);
  const totalIncome=income.reduce((s,i)=>s+(i.amount||0),0);
  const totalBudget=Object.values(budget).reduce((s,v)=>s+(v||0),0);
  const msiMonthly=msiList.filter(m=>m.mesesRestantes>0).reduce((s,m)=>s+m.pagoMensual,0);
  const thisMoGastos=thisMo.reduce((s,p)=>s+p.amount,0)+msiMonthly;
  const saldoDisp=totalIncome-thisMoGastos;
  const budgetPct=totalBudget>0?Math.round((thisMoGastos/totalBudget)*100):0;
  const iS={background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,borderRadius:8,outline:"none",fontFamily:"monospace",boxSizing:"border-box"};

  const NAVTABS=[
    {id:"tarjetas",  icon:"ti-credit-card",       label:"Tarjetas"},
    {id:"resumen",   icon:"ti-layout-dashboard",   label:"Resumen"},
    {id:"metas",     icon:"ti-target",             label:"Metas"},
    {id:"gastos",    icon:"ti-wallet",             label:"Gastos"},
    {id:"config",    icon:"ti-settings",           label:"Config"},
  ];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:840,margin:"0 auto",paddingBottom:C.navH+8}}>

      {/* HEADER MINIMALISTA */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 16px 12px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:C.text,letterSpacing:-0.5,lineHeight:1}}>APEX <span style={{color:C.dim,fontWeight:400,fontSize:13,letterSpacing:0}}>· ACZ</span></div>
            <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",letterSpacing:1.5,marginTop:1}}>{MONTHS[CUR_MONTH].toUpperCase()} {CUR_YEAR}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{fontSize:11,color:saldoDisp>=0?C.green:C.red,fontFamily:"monospace",fontWeight:700,textAlign:"right"}}>
              <div style={{fontSize:9,color:C.muted,fontWeight:400}}>disponible</div>
              {fmx(saldoDisp)}
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:"12px 16px 0"}}>

        {/* ══ TARJETAS ══ */}
        {tab==="tarjetas"&&(
          <div>
            {/* Sub-tabs */}
            <div style={{display:"flex",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:14,overflow:"hidden"}}>
              {[["asistente","Asistente"],["beneficios","Beneficios"],["tracker","Tracker"]].map(([t,l])=>(
                <button key={t} onClick={()=>setCardSub(t)} style={{flex:1,padding:"9px",background:cardSub===t?C.amexLight:"none",border:"none",borderBottom:`2px solid ${cardSub===t?C.amex:"transparent"}`,color:cardSub===t?C.amex:C.muted,cursor:"pointer",fontSize:11,fontFamily:"monospace",fontWeight:cardSub===t?700:400}}>{l}</button>
              ))}
            </div>

            {cardSub==="asistente"&&(
              <div>
                <div ref={chatRef} style={{height:390,overflowY:"auto",marginBottom:12,display:"flex",flexDirection:"column",gap:10,padding:"4px 0"}}>
                  {messages.map((m,i)=>(
                    <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
                      {m.type==="recommendation"?(
                        <RecoCard card={m.card} catId={m.catId} reason={m.reason} benefit={m.benefit} onRegister={addPurchase}/>
                      ):(
                        <div style={{maxWidth:"82%",background:m.role==="user"?C.amexLight:C.surface,border:`1px solid ${m.role==="user"?"rgba(110,168,232,0.2)":C.border}`,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",fontSize:13,lineHeight:1.7,color:C.text}}>{m.content}</div>
                      )}
                    </div>
                  ))}
                  {loading&&<div style={{display:"flex"}}><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px 14px 14px 4px",padding:"10px 16px"}}><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.amex,opacity:0.5,animation:`bounce 1s ${i*0.15}s infinite`}}/>)}</div></div></div>}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ej: voy a cenar en Nobu..." style={{flex:1,background:C.surface,border:`1px solid ${C.borderLight}`,color:C.text,padding:"11px 14px",borderRadius:10,fontSize:13,outline:"none"}}/>
                  <button onClick={send} disabled={loading||!input.trim()} style={{background:input.trim()?C.amex:"#333",border:"none",color:input.trim()?"#fff":C.muted,padding:"11px 18px",borderRadius:10,fontSize:16,fontWeight:700,cursor:input.trim()?"pointer":"default"}}>→</button>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["Gasolina Costco","Cena en Quintonil","Vuelo a Miami","Netflix","Despensa Costco","Colegiatura","¿Es GDC?","Amazon.com"].map(q=>(
                    <button key={q} onClick={()=>setInput(q)} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.textMed,padding:"5px 10px",borderRadius:20,fontSize:11,fontFamily:"monospace",cursor:"pointer"}}>{q}</button>
                  ))}
                </div>
              </div>
            )}

            {cardSub==="beneficios"&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                <SL>Beneficios Amex Platinum · informativos</SL>
                {Object.entries(AMEX_BENEFITS.reduce((g,b)=>{(g[b.cat]=g[b.cat]||[]).push(b);return g;},{})).map(([cat,items])=>(
                  <div key={cat} style={{marginBottom:14}}>
                    <div style={{fontSize:10,color:C.amex,fontFamily:"monospace",letterSpacing:1,marginBottom:6,fontWeight:600}}>{cat.toUpperCase()}</div>
                    {items.map(b=>(
                      <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{flex:1,marginRight:10}}>
                          <div style={{fontSize:12,color:C.text,marginBottom:2,fontWeight:500}}><i className={`ti ${b.icon}`} style={{fontSize:12,marginRight:5,color:C.amex}}/>{b.name}</div>
                          <div style={{fontSize:10,color:C.muted,lineHeight:1.5}}>💡 {b.tip}</div>
                        </div>
                        <div style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:C.amex,flexShrink:0}}>{fmx(b.valor)}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {cardSub==="tracker"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                    <div style={{fontSize:9,color:C.costco,fontFamily:"monospace",letterSpacing:1,marginBottom:5,fontWeight:700}}>◈ REEMBOLSO COSTCO</div>
                    <div style={{fontSize:24,fontWeight:800,color:C.costco,fontFamily:"monospace",lineHeight:1,marginBottom:3}}>{fmx(costcoCashback)}</div>
                    <PBar pct={(costcoCashback/754)*100} color={C.costco}/>
                    <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginTop:3}}>{costcoCashback>=754?`✓ +${fmx(costcoCashback-754)} neto`:`Faltan ${fmx(754-costcoCashback)}`}</div>
                  </div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                    <div style={{fontSize:9,color:C.amex,fontFamily:"monospace",letterSpacing:1,marginBottom:5,fontWeight:700}}>✦ VALOR AMEX</div>
                    <div style={{fontSize:22,fontWeight:800,color:C.amex,fontFamily:"monospace",lineHeight:1,marginBottom:2}}>{fmx(amexPtsMXN+gdcBonos)}</div>
                    <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{amexPts.toLocaleString()} pts</div>
                    {gdcBonos>0&&<div style={{fontSize:10,color:C.amex,fontFamily:"monospace"}}>+{fmx(gdcBonos)} GDC</div>}
                  </div>
                </div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                  <SL>Desglose Costco</SL>
                  {CATS_COSTCO.map(cat=>{
                    const total=purchases.filter(p=>p.card==="costco"&&p.catId===cat.id).reduce((s,p)=>s+p.amount,0);
                    if(!total)return null;
                    const cb=cat.cap?Math.min(total,cat.cap)*(cat.rate/100)+Math.max(0,total-cat.cap)*((cat.capRate||1)/100):total*(cat.rate/100);
                    return(<div key={cat.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}><span style={{color:C.textMed}}><i className={`ti ${cat.icon}`} style={{fontSize:11,marginRight:5}}/>{cat.label} <span style={{fontSize:10,color:C.muted}}>({cat.rate}%)</span></span><div><span style={{color:C.costco,fontFamily:"monospace",fontWeight:700}}>{fmx(cb)}</span><span style={{color:C.dim,fontSize:10,fontFamily:"monospace",marginLeft:5}}>/{fmx(total)}</span></div></div>);
                  })}
                  {!purchases.some(p=>p.card==="costco")&&<div style={{color:C.dim,fontSize:12,textAlign:"center",padding:"12px 0"}}>Sin compras Costco registradas</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ RESUMEN ══ */}
        {tab==="resumen"&&(
          <div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12}}>
              <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",letterSpacing:1.5,marginBottom:6}}>SALDO DISPONIBLE — {MONTHS[CUR_MONTH]} {CUR_YEAR}</div>
              <div style={{fontSize:40,fontWeight:800,color:saldoDisp>=0?C.green:C.red,fontFamily:"monospace",lineHeight:1,marginBottom:4}}>{fmx(saldoDisp)}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{fmx(totalIncome)} ingresos · {fmx(thisMoGastos)} gastados</div>
              <PBar pct={budgetPct} color={budgetPct>90?C.red:budgetPct>75?C.amber:C.amex} h={6}/>
              <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginTop:4}}>{budgetPct}% del presupuesto</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[{l:"Ingresos",v:fmx(totalIncome),c:C.green},{l:"Gastado",v:fmx(thisMoGastos),c:C.red},{l:"Presupuesto",v:fmx(totalBudget),c:C.textMed},{l:"Ahorro estimado",v:fmx(Math.max(0,totalIncome-thisMoGastos)),c:C.amex}].map((s,i)=>(
                <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
                  <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>{s.l.toUpperCase()}</div>
                  <div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
              <SL>Top categorías</SL>
              {BUDGET_CATS.filter(c=>budget[c.id]>0).sort((a,b)=>(budget[b.id]||0)-(budget[a.id]||0)).slice(0,6).map(cat=>{
                const gastado=thisMo.filter(p=>p.label===cat.label).reduce((s,p)=>s+p.amount,0);
                const bud=budget[cat.id]||0; const pct=bud>0?Math.round((gastado/bud)*100):0;
                return(<div key={cat.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text}}><i className={`ti ${cat.icon}`} style={{fontSize:11,marginRight:5,color:C.muted}}/>{cat.label}</span><span style={{fontSize:11,color:pct>80?C.red:C.muted,fontFamily:"monospace"}}>{fmx(gastado)}/{fmx(bud)}</span></div><PBar pct={pct} color={pct>90?C.red:pct>75?C.amber:C.amex}/></div>);
              })}
            </div>
            {msiMonthly>0&&<div style={{background:C.amberLight,border:`1px solid ${C.amber}`,borderRadius:12,padding:14}}><div style={{fontSize:10,color:C.amber,fontWeight:700,fontFamily:"monospace",marginBottom:4}}>MSI ACTIVOS</div><div style={{fontSize:18,fontWeight:800,color:C.amber,fontFamily:"monospace"}}>{fmx(msiMonthly)}/mes</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{msiList.filter(m=>m.mesesRestantes>0).length} compromisos activos</div></div>}
          </div>
        )}

        {/* ══ METAS ══ */}
        {tab==="metas"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>INVERTIDO TOTAL</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.amex}}>{fmx(goals.reduce((s,g)=>s+g.acumulado,0))}</div></div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>APORTACIÓN/MES</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.textMed}}>{fmx(goals.reduce((s,g)=>s+g.aportacion,0))}</div></div>
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14}}>
              <SL>Progreso de metas</SL>
              {[...goals].sort((a,b)=>a.plazo-b.plazo).map(g=>{
                const pct=g.objetivo>0?Math.round((g.acumulado/g.objetivo)*100):100;
                return(
                  <div key={g.id} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:500,color:C.text}}>{g.name}</div>
                        <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginTop:1}}>{g.plataforma}{g.plazo>0?` · ${g.plazo}a`:""}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:g.color}}>{g.objetivo>0?`${pct}%`:"∞"}</div>
                        {g.aportacion>0&&<div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{fmx(g.aportacion)}/mes</div>}
                      </div>
                    </div>
                    {g.objetivo>0&&<PBar pct={pct} color={g.color} h={5}/>}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:C.muted,fontFamily:"monospace"}}>
                      <span>{fmx(g.acumulado)} acumulado</span>
                      {g.objetivo>0&&<span>meta: {fmx(g.objetivo)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>{}} style={{width:"100%"}}>Actualizar saldos con screenshot ↗</button>
          </div>
        )}

        {/* ══ GASTOS ══ */}
        {tab==="gastos"&&(
          <div>
            <div style={{display:"flex",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:14,overflow:"hidden"}}>
              {[["presupuesto","Presupuesto"],["agregar","+ Agregar"],["historial","Historial"],["msi","MSI"],["importar","Importar"]].map(([t,l])=>(
                <button key={t} onClick={()=>setGastosSub(t)} style={{flex:1,padding:"8px 3px",background:gastosSub===t?C.amexLight:"none",border:"none",borderBottom:`2px solid ${gastosSub===t?C.amex:"transparent"}`,color:gastosSub===t?C.amex:C.muted,cursor:"pointer",fontSize:10,fontFamily:"monospace",fontWeight:gastosSub===t?700:400}}>{l}</button>
              ))}
            </div>

            {gastosSub==="presupuesto"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>PRESUPUESTO</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.textMed}}>{fmx(totalBudget)}</div></div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>GASTADO</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.red}}>{fmx(thisMoGastos)}</div></div>
                </div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                  <SL>Por categoría — {MONTHS[CUR_MONTH]}</SL>
                  {BUDGET_CATS.filter(c=>budget[c.id]>0).map(cat=>{
                    const gastado=thisMo.filter(p=>p.label===cat.label).reduce((s,p)=>s+p.amount,0);
                    const bud=budget[cat.id]||0; const pct=bud>0?Math.round((gastado/bud)*100):0;
                    return(<div key={cat.id} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text}}><i className={`ti ${cat.icon}`} style={{fontSize:11,marginRight:5,color:C.muted}}/>{cat.label}</span><div><span style={{fontSize:12,fontWeight:600,fontFamily:"monospace",color:pct>90?C.red:pct>75?C.amber:C.textMed}}>{fmx(gastado)}</span><span style={{fontSize:10,color:C.dim,fontFamily:"monospace"}}> /{fmx(bud)}</span></div></div><PBar pct={pct} color={pct>90?C.red:pct>75?C.amber:C.amex}/></div>);
                  })}
                </div>
              </div>
            )}

            {gastosSub==="agregar"&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <SL>Registro rápido</SL>
                <QuickAdd onAdd={addPurchase}/>
              </div>
            )}

            {gastosSub==="historial"&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
                <SL>Historial ({purchases.length} compras)</SL>
                {purchases.length===0&&<div style={{color:C.dim,fontSize:12,textAlign:"center",padding:"24px 0"}}>Sin compras registradas</div>}
                {purchases.map(p=>{
                  const cat=getCat(p.catId);const isA=p.card==="amex";
                  return(<div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:isA?C.amexLight:C.costcoLight,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${cat?.icon||"ti-tag"}`} style={{fontSize:14,color:isA?C.amex:C.costco}}/></div>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:C.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{cat?.label||p.catId}</div><div style={{display:"flex",gap:6,alignItems:"center"}}><CardBadge card={p.card} small/><span style={{fontSize:10,color:C.dim,fontFamily:"monospace"}}>{p.date}</span></div></div>
                    <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:isA?C.amex:C.costco,flexShrink:0}}>{fmx(p.amount)}</div>
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={()=>setEditP(p)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>✎</button>
                      <button onClick={()=>setPurchases(prev=>prev.filter(x=>x.id!==p.id))} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>✕</button>
                    </div>
                  </div>);
                })}
              </div>
            )}

            {gastosSub==="msi"&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>COMPROMISO/MES</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.red}}>{fmx(msiMonthly)}</div></div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}><div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:3}}>ACTIVOS</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:C.textMed}}>{msiList.filter(m=>m.mesesRestantes>0).length}</div></div>
                </div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <SL style={{marginBottom:0}}>MSI activos</SL>
                    <button onClick={()=>setShowAddMSI(true)} style={{background:C.amberLight,border:`1px solid ${C.amber}`,color:C.amber,borderRadius:8,padding:"4px 10px",fontSize:11,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>+ Agregar existente</button>
                  </div>
                  {msiList.filter(m=>m.mesesRestantes>0).map(m=>{
                    const pct=Math.round(((m.mesesTotal-m.mesesRestantes)/m.mesesTotal)*100);
                    const col=m.mesesRestantes<=2?C.green:m.mesesRestantes<=5?C.amber:C.red;
                    return(<div key={m.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <div><div style={{fontSize:12,fontWeight:500,color:C.text}}>{m.name}</div><CardBadge card={m.card} small/></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:C.text}}>{fmx(m.pagoMensual)}/mes</div><div style={{fontSize:10,fontFamily:"monospace",color:col}}>{m.mesesRestantes} de {m.mesesTotal} restantes</div></div>
                      </div>
                      <PBar pct={pct} color={col}/>
                    </div>);
                  })}
                  {msiList.filter(m=>m.mesesRestantes<=0).length>0&&(
                    <>{msiList.filter(m=>m.mesesRestantes<=0).map(m=><div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",opacity:0.4,fontSize:12,borderTop:`1px solid ${C.border}`}}><span style={{color:C.text}}>{m.name}</span><span style={{color:C.muted,fontFamily:"monospace"}}>completado</span></div>)}</>
                  )}
                </div>
              </div>
            )}

            {gastosSub==="importar"&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
                <SL>Importar movimientos</SL>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {[{id:"pdf",l:"PDF",sub:"Estado de cuenta",icon:"ti-file-text",c:C.amex},{id:"ss",l:"Screenshot",sub:"Últimos movimientos",icon:"ti-screenshot",c:C.costco}].map(t=>(
                    <label key={t.id} style={{padding:"14px 10px",borderRadius:10,border:`0.5px solid ${C.border}`,background:C.card,cursor:"pointer",textAlign:"center",display:"block"}}>
                      <i className={`ti ${t.icon}`} style={{fontSize:24,color:t.c,display:"block",marginBottom:5}}/>
                      <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"monospace"}}>{t.l}</div>
                      <div style={{fontSize:10,color:C.muted}}>{t.sub}</div>
                      <input type="file" accept={t.id==="pdf"?"application/pdf":"image/*"} style={{display:"none"}}/>
                    </label>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  {[{n:"1",t:"Selecciona tipo",act:true},{n:"2",t:"Sube archivo",act:false},{n:"3",t:"Confirma",act:false}].map(s=>(
                    <div key={s.n} style={{display:"flex",alignItems:"center",gap:5,flex:1}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:s.act?C.amex:C.card,border:`1px solid ${s.act?C.amex:C.border}`,color:s.act?"#fff":C.muted,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.n}</div>
                      <span style={{fontSize:10,color:s.act?C.text:C.muted,fontFamily:"monospace"}}>{s.t}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px",textAlign:"center",opacity:0.4}}>
                  <div style={{fontSize:12,color:C.muted}}>Sube un archivo para ver la vista previa</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ CONFIG ══ */}
        {tab==="config"&&(
          <div>
            {/* Ingresos */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14}}>
              <SL><i className="ti ti-cash" style={{fontSize:11,marginRight:5}}/>Ingresos mensuales</SL>
              {income.map((ing,idx)=>(
                <div key={ing.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <input value={ing.label} onChange={e=>setIncome(p=>p.map((x,i)=>i===idx?{...x,label:e.target.value}:x))} style={{...iS,flex:2,padding:"7px 10px",fontSize:12}}/>
                  <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:7,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:11}}>$</span><input type="number" value={ing.amount} onChange={e=>setIncome(p=>p.map((x,i)=>i===idx?{...x,amount:parseFloat(e.target.value)||0}:x))} style={{...iS,paddingLeft:16,padding:"7px 7px 7px 16px",fontSize:12}}/></div>
                  <button onClick={()=>setIncome(p=>p.filter((_,i)=>i!==idx))} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 9px",cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              ))}
              <button onClick={()=>setIncome(p=>[...p,{id:Date.now()+"i",label:"Nuevo ingreso",amount:0}])} style={{width:"100%",marginTop:4}}>+ Agregar</button>
              <div style={{marginTop:10,padding:"9px 12px",background:C.card,borderRadius:8,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:C.muted}}>Total</span>
                <span style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:C.green}}>{fmx(income.reduce((s,i)=>s+(i.amount||0),0))}</span>
              </div>
            </div>
            {/* Presupuesto */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14}}>
              <SL><i className="ti ti-wallet" style={{fontSize:11,marginRight:5}}/>Presupuesto por categoría</SL>
              {BUDGET_CATS.map(cat=>(
                <div key={cat.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <i className={`ti ${cat.icon}`} style={{fontSize:13,color:C.muted,width:16,flexShrink:0}}/>
                  <span style={{fontSize:11,color:C.text,flex:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.label}</span>
                  <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:7,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:11}}>$</span><input type="number" value={budget[cat.id]||0} onChange={e=>setBudget(p=>({...p,[cat.id]:parseFloat(e.target.value)||0}))} style={{...iS,paddingLeft:16,padding:"6px 6px 6px 16px",fontSize:11}}/></div>
                </div>
              ))}
              <div style={{marginTop:8,padding:"9px 12px",background:C.card,borderRadius:8,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:C.muted}}>Total</span>
                <span style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:C.textMed}}>{fmx(Object.values(budget).reduce((s,v)=>s+(v||0),0))}</span>
              </div>
            </div>
            {/* Metas */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14}}>
              <SL><i className="ti ti-target" style={{fontSize:11,marginRight:5}}/>Metas de inversión</SL>
              <div style={{fontSize:10,color:C.muted,marginBottom:10,lineHeight:1.6}}>Los cambios aquí se reflejan en tiempo real en la sección Metas.</div>
              {goals.map((g,idx)=>(
                <div key={g.id} style={{marginBottom:10,padding:12,background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <input value={g.name} onChange={e=>setGoals(p=>p.map((x,i)=>i===idx?{...x,name:e.target.value}:x))} style={{...iS,flex:1,padding:"6px 8px",fontSize:12,marginRight:8}}/>
                    <button onClick={()=>setGoals(p=>p.filter((_,i)=>i!==idx))} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:11}}>✕</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[{l:"Acumulado",k:"acumulado"},{l:"Objetivo",k:"objetivo"},{l:"Aportación/mes",k:"aportacion"},{l:"Plazo (años)",k:"plazo"}].map(f=>(
                      <div key={f.k}>
                        <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:2}}>{f.l.toUpperCase()}</div>
                        <div style={{position:"relative"}}>{f.k!=="plazo"&&<span style={{position:"absolute",left:7,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:11}}>$</span>}<input type="number" value={g[f.k]} onChange={e=>setGoals(p=>p.map((x,i)=>i===idx?{...x,[f.k]:parseFloat(e.target.value)||0}:x))} style={{...iS,paddingLeft:f.k!=="plazo"?16:10,padding:`6px 6px 6px ${f.k!=="plazo"?16:8}px`,fontSize:11,width:"100%"}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={()=>setGoals(p=>[...p,{id:Date.now()+"g",name:"Nueva meta",objetivo:0,acumulado:0,plazo:1,aportacion:0,color:C.amex,plataforma:"-"}])} style={{width:"100%",marginTop:4}}>+ Agregar meta</button>
            </div>
            {/* Notificaciones */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
              <SL><i className="ti ti-bell" style={{fontSize:11,marginRight:5}}/>Notificaciones push</SL>
              {[{k:"pagos",l:"Fechas de pago",s:"3 días antes del vencimiento"},{k:"presupuesto80",l:"Alerta de presupuesto",s:"Al llegar al 80% de cualquier categoría"},{k:"metas",l:"Aportaciones a metas",s:"Recordatorio mensual"},{k:"resumen",l:"Resumen del mes",s:"Día 1 de cada mes"}].map(n=>(
                <div key={n.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div><div style={{fontSize:12,fontWeight:500,color:C.text}}>{n.l}</div><div style={{fontSize:10,color:C.muted}}>{n.s}</div></div>
                  <button onClick={()=>setNotif(p=>({...p,[n.k]:!p[n.k]}))} style={{width:42,height:24,borderRadius:12,background:notif[n.k]?C.amex:C.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:notif[n.k]?21:3,transition:"left 0.2s"}}/>
                  </button>
                </div>
              ))}
              <div style={{marginTop:12,padding:"10px 12px",background:C.amexLight,borderRadius:8,fontSize:11,color:C.amex,lineHeight:1.5}}>
                <i className="ti ti-info-circle" style={{marginRight:5}}/>Requiere instalar APEX como PWA en Android: menú del navegador → "Agregar a pantalla de inicio".
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAVBAR */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:840,background:C.surface,borderTop:`1px solid ${C.border}`,height:C.navH,display:"flex",zIndex:200,boxShadow:"0 -4px 20px rgba(0,0,0,0.3)"}}>
        {NAVTABS.map(({id,icon,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"none",border:"none",borderTop:`2px solid ${tab===id?C.amex:"transparent"}`,color:tab===id?C.amex:C.muted,cursor:"pointer",padding:"6px 0",transition:"all 0.15s"}}>
            <i className={`ti ${icon}`} style={{fontSize:20}}/>
            <span style={{fontSize:9,fontFamily:"monospace",fontWeight:tab===id?700:400,letterSpacing:0.5}}>{label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {editP&&<EditModal purchase={editP} onSave={p=>{setPurchases(prev=>prev.map(x=>x.id===p.id?p:x));setEditP(null);}} onClose={()=>setEditP(null)}/>}
      {showAddMSI&&<AddMSIModal onSave={m=>{setMsiList(p=>[...p,m]);setShowAddMSI(false);}} onClose={()=>setShowAddMSI(false)}/>}

      <div style={{textAlign:"center",padding:"16px 16px 4px",color:C.dim,fontSize:9,fontFamily:"monospace",letterSpacing:1.5}}>APEX · ACZ · powered by Claude AI</div>

      <style>{`*{box-sizing:border-box;}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}select{outline:none;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );

}
