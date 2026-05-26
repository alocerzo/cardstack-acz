import { useState, useEffect, useRef } from "react";

// ─── PALETA ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#f0f2f6", surface:"#ffffff", card:"#f7f8fa",
  border:"#e0e4ed", borderLight:"#c8cedd",
  amex:"#2d6eb5", amexDark:"#1a4e8a", amexLight:"#e4ecf7",
  amexGlow:"rgba(45,110,181,0.09)",
  amexGrad:"linear-gradient(135deg,#7ea8d8,#b8cfe8,#d4e2f0)",
  costco:"#E8192C", costcoDark:"#aa1020", costcoLight:"#fdeced",
  costcoGlow:"rgba(232,25,44,0.08)",
  costcoGrad:"linear-gradient(135deg,#E8192C,#c01020)",
  text:"#1a2535", textMed:"#3d4f68", muted:"#7a8ea8", dim:"#b8c8d8",
  green:"#18916a", greenLight:"rgba(24,145,106,0.1)",
  blue:"#2d6eb5", shadow:"0 2px 12px rgba(28,40,65,0.07)",
};

const fmx = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n);
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const NOW = new Date();
const CUR_MONTH = NOW.getMonth(), CUR_YEAR = NOW.getFullYear();

// ─── RESTAURANTES GDC ────────────────────────────────────────────────────────
const GDC = [
  "AIDA","AITANA","ALFREDO DI ROMA","ANIMAL","ANONIMO","AU PIED DE COCHON",
  "AZUL CONDESA","AZUL HISTORICO","BELLA AURORA","BISTRO 99","BLANCO CASTELAR",
  "BLANCO COLIMA","BOTANICO","CACHAVA","CAFE NIN","CAMBALACHE","CANTINETTA DEL BECCO",
  "CARMELA Y SAL","CARMELO","CAROLO","CASA PORTUGUESA","CHAMBAO","CHAPULIN","COLMILLO",
  "CONFESSIONS","CORTILE","COSTA GUADIANA","CUERNO","DECRAB","EM","EL JAPONEZ",
  "ELOISE CHIC CUISINE","ENO","ENTRE FUEGOS","ESTIATORIO NOSTOS","FARINA","FISHER'S",
  "FISHERS","FOGO DE CHAO","FONICO","FORNERIA DEL BECCO","FRATELLI LA BUFALA",
  "FRED'S HOUSE","FUNKY GEISHA","GALANGA THAI HOUSE","GALEA","GUADIANA","HARRY'S",
  "HOTARU","HUNAN","HUSET","ILIO'S","JAZAMANGO","KAMPAI","KOLI","KULTURA","KUMOTO",
  "LA CATARINA","LA DOCENA","LA EMBAJADA","LA MARI","LA NACIONAL","LA PARADA",
  "LA REYNITA","LA RURAL ARGENTINA","LA TERCERA RONDA","LAMPUGA","LARDO","LE CHIQUE",
  "LING LING","LOMA LINDA","LORETTA CHIC BISTROT","L'OSTERIA DEL BECCO","LUR",
  "MAMAZZITA","MASALA Y MAÍZ","MAXIMO BISTROT","MILK PIZZERIA","MOCHOMOS",
  "MOLINO EL PUJOL","MORIMOTO","NEGRONI","NECTAR","NICO'S","NOBU","OLIVA ENOTECA",
  "PANADERIA ROSETTA","PANGEA","PAROLE","PARRILLA URBANA","POLPO","PORFIRIO'S",
  "PROSECCO","PUEBLO VIEJO","PUERTO MADERO","PUJOL","QUINTONIL","ROCASAL",
  "ROSA NEGRA","ROSETTA","RYOSHI","SAN ANGEL INN","SEÑOR TANAKA","SEÑORA TANAKA",
  "SESAME","SHU","SIBAU","SKIN JOINT","SONORA GRILL","SUD 777","SUNTORY","SYLVESTRE",
  "TABOO","TANTRA","THE CAPITAL GRILLE","THE PALM","TICUCHI","TORA","TORI TORI",
  "TRASTEVERE","ULTRAMARINOS DE MAR","VASTO","ZERU","ZIBU","ATRIO","BARRICA DE FUEGO",
  "BOVINE","COCINOTECA","ALCALDE","ALLIUM","BRUNA","ALFONSINA","CASA OAXACA","CRIOLLO",
  "LAS QUINCE LETRAS","LOS DANZANTES","ORIGEN","PITIONA","AUGURIO","INTRO","MOYUELO",
  "CERVO","BECCO AL MARE","ARCA","BANDONEON","BAGATELLE","ACRE","ANIMALON",
  "CONCHAS DE PIEDRA","DECKMAN'S","FAUNA","LAJA","CRAFT LOS CABOS","MANZANILLA",
  "LAS MAÑANITAS","BARDOT","BESTIA","GALLO 71","HOLSTEIN'S","CAO",
];

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
const CATS_COSTCO = [
  {id:"gasolina_costco", label:"Gasolina Costco",   rate:5, cap:10000, capRate:3, icon:"⛽"},
  {id:"educacion",       label:"Educación",          rate:4, cap:20000, capRate:1, icon:"🎓"},
  {id:"costco_tienda",   label:"Compras en Costco",  rate:3, icon:"🛒"},
  {id:"restaurantes_c",  label:"Restaurantes",       rate:2, icon:"🍽️"},
  {id:"streaming",       label:"Streaming / Internet", rate:2, icon:"📺"},
  {id:"otros_costco",    label:"Otros",              rate:1, icon:"🏷️"},
];
const CATS_AMEX = [
  {id:"aeromexico",  label:"Vuelos Aeroméxico",  pts:4.8,  icon:"✈️"},
  {id:"extranjero",  label:"Compras extranjero", pts:2.08, icon:"🌍"},
  {id:"gdc",         label:"Restaurante GDC",    pts:1.6, bono:1000, icon:"⭐"},
  {id:"otros_amex",  label:"Otros (Amex)",       pts:1.6,  icon:"💳"},
];
const ALL_CATS = [...CATS_COSTCO, ...CATS_AMEX];
const getCat = id => ALL_CATS.find(c => c.id === id);

// ─── BENEFICIOS AMEX ─────────────────────────────────────────────────────────
const AMEX_BENEFITS = [
  {id:"bonif_am",    name:"Bonificación $10,000 MXN Aeroméxico", valor:10000, valorUso:10000, max:1,    icon:"💰", cat:"✈️ Aeroméxico", tip:"Activa en AMEX App ANTES de comprar. Requiere $30,000 MXN en AM."},
  {id:"boletos_2x1", name:"Boletos 2x1 (hasta 4/año)",           valor:6000,  valorUso:1500,  max:4,    icon:"🎫", cat:"✈️ Aeroméxico", tip:"Se renuevan en tu aniversario de septiembre."},
  {id:"ascensos",    name:"Ascensos Premier int'l (4/año)",       valor:8000,  valorUso:2000,  max:4,    icon:"⬆️", cat:"✈️ Aeroméxico", tip:"Solo rutas MX-EUA/Canadá/Sudamérica. Llama al (55) 5133 4076."},
  {id:"maleta",      name:"Maleta gratis (cada vuelo AM)",         valor:3600,  valorUso:300,   max:null, icon:"🧳", cat:"✈️ Aeroméxico", tip:"Redímela en aeromexico.com en 'Detalles del Viaje'."},
  {id:"pp",          name:"Priority Pass ilimitado",               valor:14400, valorUso:400,   max:null, icon:"🛋️", cat:"🛋️ Salas VIP",  tip:"Activa tu membresía digital en la app Priority Pass."},
  {id:"centurion",   name:"Centurion Lounge (tú + esposa gratis)", valor:4800,  valorUso:600,   max:null, icon:"✦",  cat:"🛋️ Salas VIP",  tip:"Solo vuelos de salida ese día. CDMX, Toluca, MTY + 40 globales."},
  {id:"premier_am",  name:"Salones Premier Aeroméxico",            valor:3500,  valorUso:350,   max:null, icon:"🛫", cat:"🛋️ Salas VIP",  tip:"T2 CDMX cerrada temporalmente desde feb 2025."},
  {id:"gdc_benefit", name:"Restaurantes GDC — $4,000 MXN/año",    valor:4000,  valorUso:1000,  max:4,    icon:"⭐", cat:"🍽️ Restaurantes", tip:"Activa en AMEX App ANTES de ir. Gasto mínimo $3,000 MXN/visita."},
  {id:"seg_auto",    name:"Seguro auto rentado $75k USD",           valor:2000,  valorUso:500,   max:null, icon:"🚗", cat:"🛡️ Seguros",     tip:"Declina CDW/LDW de la arrendadora. Excluye México."},
  {id:"seg_equip",   name:"Seguro pérdida/demora equipaje",         valor:2000,  valorUso:2000,  max:1,    icon:"🛡️", cat:"🛡️ Seguros",     tip:"Solo si el boleto se pagó con la tarjeta. Demora mín. 4 hrs."},
];

// ─── CÁLCULOS ─────────────────────────────────────────────────────────────────
function calcCostcoCashback(purchases) {
  const byMC = {};
  purchases.filter(p=>p.card==="costco").forEach(p=>{
    const k=`${p.month}-${p.year}-${p.catId}`;
    byMC[k]=(byMC[k]||0)+p.amount;
  });
  return Object.entries(byMC).reduce((t,[k,amt])=>{
    const cat=getCat(k.split("-")[2]);
    if(!cat) return t;
    return cat.cap
      ? t+Math.min(amt,cat.cap)*(cat.rate/100)+Math.max(0,amt-cat.cap)*((cat.capRate||1)/100)
      : t+amt*(cat.rate/100);
  },0);
}

function calcAmexPoints(purchases){
  const TC=20.1;
  return Math.round(purchases.filter(p=>p.card==="amex").reduce((t,p)=>{
    const cat=getCat(p.catId);
    return t+(cat?.pts||1.6)*(p.amount/TC);
  },0));
}

function calcGDCBonos(purchases){
  return Math.min(purchases.filter(p=>p.card==="amex"&&p.catId==="gdc"&&p.amount>=3000).length,4)*1000;
}

function calcBenefitValue(b, usos){
  if(!usos) return 0;
  if(b.max===null) return (b.valorUso||0)*usos;
  return Math.min(usos,b.max)*(b.valorUso||b.valor);
}

// JSON parser robusto — extrae el objeto JSON más completo del texto
function extractJSON(raw) {
  // 1. Intentar parsear directo
  try { return JSON.parse(raw); } catch {}
  // 2. Buscar bloque JSON balanceado (no greedy corto)
  let depth=0, start=-1;
  for(let i=0;i<raw.length;i++){
    if(raw[i]==="{"){if(depth===0)start=i;depth++;}
    else if(raw[i]==="}"){depth--;if(depth===0&&start>=0){try{return JSON.parse(raw.slice(start,i+1));}catch{start=-1;}}}
  }
  return null;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT=`Eres un asistente experto en tarjetas de crédito. El usuario tiene DOS tarjetas:

AMEX PLATINUM AEROMÉXICO:
- Vuelos Aeroméxico directo: 4.8 pts/USD (~3.5% real). catId: aeromexico
- Compras en extranjero/dólares: 2.08 pts/USD (~1.6% real). catId: extranjero
- Restaurante GDC (lista de +200 conocidos): bono $1,000 MXN al gastar $3,000+ MXN. catId: gdc
- Todo lo demás: 1.6 pts/USD (~1.2% real). catId: otros_amex
- Activa: seguro auto rentado fuera de MX ($75k USD), seguro equipaje, seguro accidentes

COSTCO BANAMEX:
- Gasolina en Costco: 5% (tope $10,000/mes, luego 3%). catId: gasolina_costco
- Educación/colegiaturas: 4% (tope $20,000/mes, luego 1%). catId: educacion
- Compras en Costco (tienda, EUA, online): 3%. catId: costco_tienda
- Restaurantes: 2% (OJO: si pagan con agregador Clip/iZettle → solo 1%). catId: restaurantes_c
- Streaming, internet, TV de paga: 2%. catId: streaming
- Cualquier otra compra: 1%. catId: otros_costco

RESTAURANTES GDC (entre muchos): Nobu, Quintonil, Pujol, Sonora Grill, Fisher's, Fogo de Chao, Tori Tori, Rosa Negra, Suntory, Hunan, El Japonez, Sud 777, Maximo Bistrot, Puerto Madero, Porfirio's, Cambalache, Farina, Carolo, Lardo, Rosetta, Pangea, San Angel Inn, Harry's y más de 200 en México.

REGLAS — MUY IMPORTANTE:
1. Si tienes suficiente info → recomienda directo.
2. Si falta info clave (¿es Costco o gasolinera normal? ¿restaurante GDC o no? ¿compra en MXN o USD?) → haz UNA sola pregunta.
3. RESPONDE EXCLUSIVAMENTE con JSON crudo. CERO texto, CERO markdown, CERO backticks.
4. En el campo "reason", tutea a Alo y sé directo — ej: "gasolina Costco, Alo" o "es GDC, úsala".

Recomendación: {"recommendation":true,"card":"costco|amex","catId":"id_categoria","reason":"frase max 7 palabras, tutear a Alo","benefit":"ej: 5% reembolso"}
Pregunta: {"recommendation":false,"question":"pregunta concisa, tuteando a Alo"}`;

// ─── LOGO BANAMEX ─────────────────────────────────────────────────────────────
// 5 piezas tipo gancho/C entrelazadas en pentágono
const BanamexLogo = ({size=22, color="white"}) => {
  const s = size, cx = s/2, cy = s/2, r = s*0.38;
  // 5 puntos del pentágono (rotado -90° para que uno apunte arriba)
  const pts = Array.from({length:5},(_,i)=>{
    const a=(i*72-90)*Math.PI/180;
    return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
  });
  const sw = size*0.13;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {pts.map((p,i)=>{
        const next=pts[(i+2)%5];
        const mid=[(p[0]+next[0])/2,(p[1]+next[1])/2];
        return(
          <path key={i}
            d={`M ${p[0].toFixed(1)} ${p[1].toFixed(1)} Q ${mid[0].toFixed(1)} ${(mid[1]-s*0.04).toFixed(1)} ${next[0].toFixed(1)} ${next[1].toFixed(1)}`}
            stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"
          />
        );
      })}
    </svg>
  );
};

// ─── COMPONENTES ──────────────────────────────────────────────────────────────
function CardPill({card}){
  const isA=card==="amex";
  return isA?(
    <div style={{display:"flex",alignItems:"center",gap:7,background:C.amexGrad,borderRadius:9,padding:"6px 12px",boxShadow:C.shadow}}>
      <svg width="24" height="17" viewBox="0 0 44 32" fill="none">
        <rect width="44" height="32" rx="4" fill="#1a4e8a"/>
        <text x="22" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black,sans-serif" letterSpacing="-0.5">AMEX</text>
      </svg>
      <div>
        <div style={{fontSize:10,fontWeight:800,color:"#1a4e8a",fontFamily:"monospace",letterSpacing:1,lineHeight:1.2}}>PLATINUM</div>
        <div style={{fontSize:9,color:"#4a7ab5",fontFamily:"monospace"}}>Aeroméxico</div>
      </div>
    </div>
  ):(
    <div style={{display:"flex",alignItems:"center",gap:7,background:C.costcoGrad,borderRadius:9,padding:"6px 12px",boxShadow:C.shadow}}>
      <BanamexLogo size={22} color="white"/>
      <div>
        <div style={{fontSize:10,fontWeight:800,color:"white",fontFamily:"monospace",letterSpacing:1,lineHeight:1.2}}>COSTCO</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.85)",fontFamily:"monospace"}}>Banamex Visa</div>
      </div>
    </div>
  );
}

function CardBadge({card,small}){
  const isA=card==="amex";
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:3,background:isA?C.amexLight:C.costcoLight,border:`1px solid ${isA?"rgba(45,110,181,0.25)":"rgba(232,25,44,0.25)"}`,color:isA?C.amex:C.costco,borderRadius:5,padding:small?"2px 7px":"4px 11px",fontSize:small?10:11,fontFamily:"monospace",fontWeight:700,letterSpacing:0.5}}>
      {isA?"✦ AMEX":"◈ COSTCO"}
    </span>
  );
}

const SectionTitle=({children})=>(
  <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",letterSpacing:1.5,marginBottom:12,textTransform:"uppercase",fontWeight:600}}>{children}</div>
);

// ─── MODAL EDITAR ─────────────────────────────────────────────────────────────
function EditModal({purchase,onSave,onClose}){
  const [card,setCard]=useState(purchase.card);
  const [catId,setCatId]=useState(purchase.catId);
  const [amount,setAmount]=useState(String(purchase.amount));
  const cats=card==="amex"?CATS_AMEX:CATS_COSTCO;
  useEffect(()=>{ if(!cats.find(c=>c.id===catId)) setCatId(cats[0].id); },[card]);
  const iStyle={width:"100%",background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:"monospace",outline:"none"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,37,53,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:22,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(28,37,53,0.18)"}}>
        <SectionTitle>Editar compra</SectionTitle>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["amex","costco"].map(c=>(
            <button key={c} onClick={()=>setCard(c)} style={{flex:1,background:card===c?(c==="amex"?C.amexLight:C.costcoLight):C.card,border:`1px solid ${card===c?(c==="amex"?C.amex:C.costco):C.border}`,color:card===c?(c==="amex"?C.amex:C.costco):C.muted,borderRadius:8,padding:"8px",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>
              {c==="amex"?"✦ AMEX":"◈ COSTCO"}
            </button>
          ))}
        </div>
        <select value={catId} onChange={e=>setCatId(e.target.value)} style={{...iStyle,marginBottom:12}}>
          {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <div style={{position:"relative",marginBottom:18}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...iStyle,paddingLeft:22}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>onSave({...purchase,card,catId,amount:parseFloat(amount)||0,label:getCat(catId)?.label||catId})} style={{flex:2,background:C.amex,border:"none",color:"#fff",borderRadius:8,padding:"9px",fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:"pointer"}}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

// ─── RECO CARD ────────────────────────────────────────────────────────────────
function RecoCard({card,catId,reason,benefit,onRegister}){
  const isA=card==="amex";
  const accent=isA?C.amex:C.costco;
  const cat=getCat(catId);
  const [amount,setAmount]=useState("");
  const [done,setDone]=useState(false);
  const reg=()=>{
    const n=parseFloat(amount);
    if(!n||n<=0) return;
    onRegister({card,catId,amount:n});
    setDone(true);
  };
  return(
    <div style={{background:C.surface,border:`2px solid ${accent}`,borderRadius:14,overflow:"hidden",marginTop:4,maxWidth:"92%",boxShadow:C.shadow}}>
      <div style={{background:isA?C.amexGrad:C.costcoGrad,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        {isA?(
          <svg width="36" height="26" viewBox="0 0 44 32" fill="none">
            <rect width="44" height="32" rx="4" fill="#1a4e8a"/>
            <text x="22" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black,sans-serif" letterSpacing="-0.5">AMEX</text>
          </svg>
        ):(
          <BanamexLogo size={30} color="white"/>
        )}
        <div>
          <div style={{fontSize:11,fontWeight:800,color:isA?"#1a4e8a":"white",fontFamily:"monospace",letterSpacing:1}}>
            {isA?"AMEX PLATINUM":"COSTCO BANAMEX"}
          </div>
          <div style={{fontSize:9,color:isA?"#4a7ab5":"rgba(255,255,255,0.85)",fontFamily:"monospace"}}>
            {isA?"Aeroméxico":"Banamex Visa"}
          </div>
        </div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:20,fontWeight:800,color:isA?"#1a4e8a":"white",fontFamily:"monospace",lineHeight:1}}>{benefit}</div>
          <div style={{fontSize:10,color:isA?"#4a7ab5":"rgba(255,255,255,0.85)",fontFamily:"monospace"}}>{cat?.icon} {reason}</div>
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {!done?(
          <div>
            <div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginBottom:7,letterSpacing:0.5}}>¿CUÁNTO GASTASTE? — lo agrego al tracker</div>
            <div style={{display:"flex",gap:8}}>
              <div style={{position:"relative",flex:1}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span>
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} onKeyDown={e=>e.key==="Enter"&&reg()} placeholder="0.00"
                  style={{width:"100%",background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"8px 8px 8px 22px",borderRadius:8,fontSize:14,fontFamily:"monospace",outline:"none"}}/>
              </div>
              <button onClick={reg} disabled={!amount} style={{background:amount?accent:"#e8ecf2",border:"none",color:amount?"#fff":C.dim,padding:"8px 16px",borderRadius:8,fontFamily:"monospace",fontSize:12,fontWeight:700,cursor:amount?"pointer":"default"}}>
                Registrar
              </button>
            </div>
          </div>
        ):(
          <div style={{fontSize:13,color:C.green,fontFamily:"monospace",display:"flex",alignItems:"center",gap:6}}>
            <span>✓</span> Registrado — {fmx(parseFloat(amount))}
          </div>
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
  const cats=card==="amex"?CATS_AMEX:CATS_COSTCO;
  const add=()=>{
    const n=parseFloat(amount);
    if(!n||n<=0) return;
    onAdd({card,catId,amount:n});
    setAmount("");
  };
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16,boxShadow:C.shadow}}>
      <SectionTitle>⚡ Registro rápido</SectionTitle>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {["amex","costco"].map(c=>(
          <button key={c} onClick={()=>{setCard(c);setCatId(c==="amex"?"aeromexico":"gasolina_costco");}} style={{flex:1,background:card===c?(c==="amex"?C.amexLight:C.costcoLight):C.card,border:`1px solid ${card===c?(c==="amex"?C.amex:C.costco):C.border}`,color:card===c?(c==="amex"?C.amex:C.costco):C.muted,borderRadius:9,padding:"9px",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>
            {c==="amex"?"✦ AMEX PLATINUM":"◈ COSTCO BANAMEX"}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <select value={catId} onChange={e=>setCatId(e.target.value)} style={{flex:2,background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"9px 10px",borderRadius:8,fontSize:12,fontFamily:"monospace",outline:"none"}}>
          {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <div style={{position:"relative",flex:1}}>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.muted}}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Monto"
            style={{width:"100%",background:C.card,border:`1px solid ${C.borderLight}`,color:C.text,padding:"9px 9px 9px 20px",borderRadius:8,fontSize:13,fontFamily:"monospace",outline:"none"}}/>
        </div>
        <button onClick={add} disabled={!amount} style={{background:amount?(card==="amex"?C.amex:C.costco):"#e8ecf2",border:"none",color:amount?"#fff":C.dim,padding:"9px 16px",borderRadius:8,fontFamily:"monospace",fontSize:16,fontWeight:700,cursor:amount?"pointer":"default",transition:"all 0.15s"}}>+</button>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
        {cats.map(c=>(
          <span key={c.id} style={{fontSize:10,color:C.muted,fontFamily:"monospace",background:C.card,border:`1px solid ${C.border}`,padding:"2px 8px",borderRadius:4}}>
            {c.icon} {c.rate?`${c.rate}%`:c.pts?`${c.pts}x`:"★"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("asistente");
  const [messages,setMessages]=useState([{role:"assistant",type:"text",content:"Hola Alo! 👋🏽 ¿Qué estás pagando?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [purchases,setPurchases]=useState([]);
  const [benefitUsage,setBenefitUsage]=useState({});
  const [editP,setEditP]=useState(null);
  const [simHoteles,setSimHoteles]=useState(0);
  const [simGolf,setSimGolf]=useState(0);
  const [simEntret,setSimEntret]=useState(1);
  const chatRef=useRef(null);

  // Persistencia — nueva key cs_v1 para evitar datos corruptos de versiones anteriores
  useEffect(()=>{
    try{
      const s=localStorage.getItem("cs_v1");
      if(s){const p=JSON.parse(s);if(p.purchases)setPurchases(p.purchases);if(p.benefitUsage)setBenefitUsage(p.benefitUsage);}
    }catch{}
  },[]);
  useEffect(()=>{ try{localStorage.setItem("cs_v1",JSON.stringify({purchases,benefitUsage}));}catch{}; },[purchases,benefitUsage]);
  useEffect(()=>{ if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages,loading]);

  const addPurchase=({card,catId,amount})=>{
    const cat=getCat(catId);
    setPurchases(prev=>[{
      id:Date.now(),card,catId,amount,
      label:cat?.label||catId,month:CUR_MONTH,year:CUR_YEAR,
      date:new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short"}),
    },...prev]);
  };

  const send=async()=>{
    const text=input.trim();
    if(!text||loading) return;
    setInput("");
    const userMsg={role:"user",type:"text",content:text};
    setMessages(prev=>[...prev,userMsg]);
    setLoading(true);
    try{
      // Limitar historial a últimos 10 mensajes para controlar tokens
      const allMsgs=[...messages,userMsg];
      const history=allMsgs
        .filter(m=>m.type==="text"||m.type==="question")
        .slice(-10)
        .map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}));

      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:300,system:SYSTEM_PROMPT,messages:history}),
      });
      const data=await res.json();
      const raw=data.content?.map(b=>b.text||"").join("").trim()||"{}";
      let parsed=extractJSON(raw);
      if(Array.isArray(parsed)) parsed=parsed[0];

      if(parsed?.recommendation){
        setMessages(prev=>[...prev,{role:"assistant",type:"recommendation",card:parsed.card,catId:parsed.catId,reason:parsed.reason,benefit:parsed.benefit}]);
      } else {
        setMessages(prev=>[...prev,{role:"assistant",type:"question",content:parsed?.question||"¿Puedes darme más detalles?"}]);
      }
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",type:"text",content:"Error al conectar. Intenta de nuevo."}]);
    }
    setLoading(false);
  };

  // ── STATS ──────────────────────────────────────────────────────────────────
  const costcoCashback   = calcCostcoCashback(purchases);
  const amexPts          = calcAmexPoints(purchases);
  const gdcBonos         = calcGDCBonos(purchases);
  const amexPtsMXN       = Math.round(amexPts*0.17);
  const COSTCO_ANUALIDAD = 754;
  const AMEX_ANUALIDAD   = 30311;

  // Valor total Amex (solo beneficios de esa tarjeta)
  const amexBenefitsVal = Object.entries(benefitUsage).reduce((t,[id,usos])=>{
    const b=AMEX_BENEFITS.find(b=>b.id===id);
    return b?t+calcBenefitValue(b,usos):t;
  },0);
  const amexTotalVal = amexPtsMXN + gdcBonos + amexBenefitsVal;

  // Mes actual
  const thisMo   = purchases.filter(p=>p.month===CUR_MONTH&&p.year===CUR_YEAR);
  const thisMoCostco = calcCostcoCashback(thisMo);
  const thisMoAmexPts= calcAmexPoints(thisMo);
  const thisMoGDC    = calcGDCBonos(thisMo);
  const thisMoTotal  = thisMoCostco+Math.round(thisMoAmexPts*0.17)+thisMoGDC;

  // Comparador — valAM = solo valor Amex (sin Costco que es independiente)
  const numVuelos = purchases.filter(p=>p.card==="amex"&&p.catId==="aeromexico").length;
  // Todas las visitas a restaurantes (Costco o Amex) para estimar uso en PN
  const numRestTotal = purchases.filter(p=>p.catId==="restaurantes_c"||p.catId==="gdc").length;

  const valAM = amexTotalVal; // Solo valor tarjeta Amex
  const valPN = 5500 // bono aniversario
    + Math.min(numRestTotal,8)*500  // restaurantes $4,000 tope
    + Math.min(simEntret,1)*4000    // Ticketmaster
    + Math.min(simGolf,2)*1500      // golf
    + (simHoteles>0?simHoteles*11000+3000:0) // FHR + Hilton
    + numVuelos*1600;               // salas VIP comparables

  const TABS=[["asistente","⚡ Asistente"],["gastos","💰 Gastos"],["beneficios","📋 Beneficios"],["analisis","📊 Análisis"]];
  const TAB_COLORS={asistente:C.amex,gastos:C.costco,beneficios:C.green,analisis:"#2b5ea7"};

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:840,margin:"0 auto",paddingBottom:70}}>

      {/* ── HEADER ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 16px 12px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(28,40,65,0.06)"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:C.text,letterSpacing:-0.3,lineHeight:1}}>
              CardStack <span style={{color:C.dim,fontWeight:400,fontSize:12}}>· ACZ</span>
            </div>
            <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",letterSpacing:1,marginBottom:6}}>MIS TARJETAS</div>
            <div style={{display:"flex",gap:6}}>
              <CardPill card="amex"/>
              <CardPill card="costco"/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?TAB_COLORS[t]:"transparent",border:tab===t?"none":`1px solid ${C.border}`,color:tab===t?"#fff":C.muted,padding:"6px 13px",borderRadius:7,fontSize:11,fontFamily:"monospace",fontWeight:700,cursor:"pointer",letterSpacing:0.3,transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:16}}>

        {/* ── ASISTENTE ── */}
        {tab==="asistente"&&(
          <div>
            <div ref={chatRef} style={{height:420,overflowY:"auto",marginBottom:12,display:"flex",flexDirection:"column",gap:10,padding:"4px 0"}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
                  {m.type==="recommendation"?(
                    <RecoCard card={m.card} catId={m.catId} reason={m.reason} benefit={m.benefit} onRegister={addPurchase}/>
                  ):(
                    <div style={{maxWidth:"82%",background:m.role==="user"?C.amexLight:C.surface,border:`1px solid ${m.role==="user"?"rgba(45,110,181,0.2)":C.border}`,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",fontSize:13,lineHeight:1.7,color:C.text,boxShadow:C.shadow}}>
                      {m.content}
                    </div>
                  )}
                </div>
              ))}
              {loading&&(
                <div style={{display:"flex"}}>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px 14px 14px 4px",padding:"10px 16px",boxShadow:C.shadow}}>
                    <div style={{display:"flex",gap:4}}>
                      {[0,1,2].map(i=>(
                        <div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.amex,opacity:0.5,animation:`bounce 1s ${i*0.15}s infinite`}}/>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
                placeholder="Ej: voy a cenar en Nobu Polanco..."
                style={{flex:1,background:C.surface,border:`1px solid ${C.borderLight}`,color:C.text,padding:"11px 14px",borderRadius:10,fontSize:13,outline:"none",boxShadow:C.shadow}}/>
              <button onClick={send} disabled={loading||!input.trim()} style={{background:input.trim()?C.amex:"#e0e4ed",border:"none",color:input.trim()?"#fff":C.dim,padding:"11px 18px",borderRadius:10,fontSize:16,fontWeight:700,cursor:input.trim()?"pointer":"default",transition:"all 0.15s"}}>→</button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Gasolina Costco","Cena en Quintonil","Vuelo a Miami","Netflix","Despensa Costco","Colegiatura","Restaurante (no sé si es GDC)","Amazon.com"].map(q=>(
                <button key={q} onClick={()=>setInput(q)} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.textMed,padding:"5px 11px",borderRadius:20,fontSize:11,fontFamily:"monospace",cursor:"pointer",boxShadow:"0 1px 3px rgba(28,40,65,0.05)"}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── GASTOS ── */}
        {tab==="gastos"&&(
          <div>
            <QuickAdd onAdd={addPurchase}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,boxShadow:C.shadow}}>
                <div style={{fontSize:9,color:C.costco,fontFamily:"monospace",letterSpacing:1,marginBottom:5,fontWeight:700}}>◈ REEMBOLSO COSTCO</div>
                <div style={{fontSize:26,fontWeight:800,color:C.costco,fontFamily:"monospace",lineHeight:1,marginBottom:4}}>{fmx(costcoCashback)}</div>
                <div style={{background:C.bg,borderRadius:100,height:5,overflow:"hidden",marginBottom:4}}>
                  <div style={{height:"100%",width:`${Math.min(100,(costcoCashback/COSTCO_ANUALIDAD)*100)}%`,background:C.costcoGrad,borderRadius:100,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
                  {costcoCashback>=COSTCO_ANUALIDAD?`✓ +${fmx(costcoCashback-COSTCO_ANUALIDAD)} neto`:`${fmx(COSTCO_ANUALIDAD-costcoCashback)} para cubrir anualidad`}
                </div>
              </div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,boxShadow:C.shadow}}>
                <div style={{fontSize:9,color:C.amex,fontFamily:"monospace",letterSpacing:1,marginBottom:5,fontWeight:700}}>✦ VALOR AMEX</div>
                <div style={{fontSize:22,fontWeight:800,color:C.amex,fontFamily:"monospace",lineHeight:1,marginBottom:2}}>{fmx(amexTotalVal)}</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{amexPts.toLocaleString()} pts ≈ {fmx(amexPtsMXN)}</div>
                {gdcBonos>0&&<div style={{fontSize:10,color:C.amex,fontFamily:"monospace",marginTop:2}}>+ {fmx(gdcBonos)} bonos GDC</div>}
              </div>
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,boxShadow:C.shadow}}>
              <SectionTitle>Historial de compras ({purchases.length})</SectionTitle>
              {purchases.length===0&&(
                <div style={{color:C.dim,fontSize:12,fontFamily:"monospace",textAlign:"center",padding:"24px 0"}}>
                  Sin compras aún — usa el asistente o el registro rápido
                </div>
              )}
              {purchases.map(p=>{
                const cat=getCat(p.catId);const isA=p.card==="amex";
                return(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:isA?C.amexLight:C.costcoLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>
                      {cat?.icon||"🏷️"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:C.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{cat?.label||p.catId}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <CardBadge card={p.card} small/>
                        <span style={{fontSize:10,color:C.dim,fontFamily:"monospace"}}>{p.date}</span>
                      </div>
                    </div>
                    <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:isA?C.amex:C.costco,flexShrink:0}}>{fmx(p.amount)}</div>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>setEditP(p)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>✎</button>
                      <button onClick={()=>setPurchases(prev=>prev.filter(x=>x.id!==p.id))} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BENEFICIOS ── */}
        {tab==="beneficios"&&(
          <div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14,boxShadow:C.shadow}}>
              <SectionTitle>✦ Beneficios Amex Platinum Aeroméxico</SectionTitle>
              {AMEX_BENEFITS.map(b=>{
                const usos=benefitUsage[b.id]||0;
                const maxed=b.max!==null&&usos>=b.max;
                const val=calcBenefitValue(b,usos);
                return(
                  <div key={b.id} style={{padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                      <div style={{flex:1,marginRight:10}}>
                        <div style={{fontSize:12,color:C.text,marginBottom:2,fontWeight:500}}>
                          {b.icon} {b.name}
                          {maxed&&<span style={{marginLeft:6,fontSize:9,color:C.green,background:C.greenLight,padding:"1px 6px",borderRadius:8,fontFamily:"monospace",fontWeight:700}}>✓ AGOTADO</span>}
                        </div>
                        <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{b.cat}{b.max?` · ${usos}/${b.max} usos`:b.max===null&&usos>0?` · ${usos}× usado`:""}</div>
                        {b.tip&&<div style={{fontSize:10,color:C.muted,marginTop:3,lineHeight:1.5}}>💡 {b.tip}</div>}
                      </div>
                      <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:C.amex,flexShrink:0,textAlign:"right"}}>
                        {fmx(val>0?val:b.valorUso||b.valor)}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setBenefitUsage(u=>({...u,[b.id]:Math.max(0,(u[b.id]||0)-1)}))} disabled={!usos}
                        style={{background:"none",border:`1px solid ${C.border}`,color:!usos?C.dim:C.muted,borderRadius:6,padding:"4px 12px",fontSize:13,cursor:!usos?"default":"pointer"}}>−</button>
                      <button onClick={()=>{if(maxed)return;setBenefitUsage(u=>({...u,[b.id]:(u[b.id]||0)+1}));}} disabled={maxed}
                        style={{flex:1,background:maxed?C.greenLight:C.amex,border:maxed?`1px solid ${C.green}`:"none",color:maxed?C.green:"#fff",borderRadius:6,padding:"5px",fontSize:11,fontFamily:"monospace",fontWeight:700,cursor:maxed?"default":"pointer",transition:"all 0.15s"}}>
                        {maxed?"✓ Agotado":!usos?"Marcar como usado":"Marcar otro uso"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,boxShadow:C.shadow}}>
              <SectionTitle>◈ Reembolso Costco por categoría</SectionTitle>
              {CATS_COSTCO.map(cat=>{
                const total=purchases.filter(p=>p.card==="costco"&&p.catId===cat.id).reduce((s,p)=>s+p.amount,0);
                if(!total) return null;
                const cb=cat.cap
                  ?Math.min(total,cat.cap)*(cat.rate/100)+Math.max(0,total-cat.cap)*((cat.capRate||1)/100)
                  :total*(cat.rate/100);
                return(
                  <div key={cat.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:12,color:C.textMed}}>{cat.icon} {cat.label} <span style={{fontSize:10,color:C.muted}}>({cat.rate}%)</span></span>
                    <div>
                      <span style={{color:C.costco,fontFamily:"monospace",fontWeight:700,fontSize:13}}>{fmx(cb)}</span>
                      <span style={{color:C.dim,fontSize:10,fontFamily:"monospace",marginLeft:6}}>/ {fmx(total)}</span>
                    </div>
                  </div>
                );
              })}
              {!purchases.some(p=>p.card==="costco")&&(
                <div style={{color:C.dim,fontSize:12,fontFamily:"monospace",textAlign:"center",padding:"14px 0"}}>Registra compras Costco para ver el desglose</div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontWeight:700}}>
                <span style={{fontSize:13,color:C.text}}>Total reembolso acumulado</span>
                <span style={{fontSize:15,color:C.costco,fontFamily:"monospace"}}>{fmx(costcoCashback)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ANÁLISIS ── */}
        {tab==="analisis"&&(
          <div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:14,boxShadow:C.shadow}}>
              <SectionTitle>📅 Resumen — {MONTHS[CUR_MONTH]} {CUR_YEAR}</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                {[
                  {l:"Reembolso Costco",v:fmx(thisMoCostco),c:C.costco},
                  {l:"Valor Amex",v:fmx(Math.round(thisMoAmexPts*0.17)+thisMoGDC),c:C.amex},
                  {l:"Total recuperado",v:fmx(thisMoTotal),c:C.green},
                ].map((s,i)=>(
                  <div key={i} style={{background:C.card,borderRadius:10,padding:"11px 12px",textAlign:"center",border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:15,fontWeight:800,fontFamily:"monospace",color:s.c,marginBottom:3}}>{s.v}</div>
                    <div style={{fontSize:9,color:C.muted,fontFamily:"monospace"}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {thisMo.length===0?(
                <div style={{color:C.dim,fontSize:12,fontFamily:"monospace",textAlign:"center",padding:"8px 0"}}>Sin compras registradas este mes</div>
              ):(
                ALL_CATS.map(cat=>{
                  const ps=thisMo.filter(p=>p.catId===cat.id);
                  if(!ps.length) return null;
                  const total=ps.reduce((s,p)=>s+p.amount,0);
                  const isA=CATS_AMEX.some(c=>c.id===cat.id);
                  return(
                    <div key={cat.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                      <span style={{color:C.textMed}}>{cat.icon} {cat.label}</span>
                      <span style={{color:isA?C.amex:C.costco,fontFamily:"monospace",fontWeight:700}}>{fmx(total)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,boxShadow:C.shadow}}>
              <SectionTitle>⚖️ ¿Me conviene cambiar a Platinum Normal?</SectionTitle>
              <div style={{fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.6}}>
                Comparativo basado en tus compras reales. Ajusta los beneficios que no se registran aquí:
              </div>
              {[
                {l:"🏨 Noches en hoteles FHR / Hilton al año", v:simHoteles, set:setSimHoteles, max:4},
                {l:"⛳ Rondas de golf al año",                  v:simGolf,    set:setSimGolf,    max:6},
                {l:"🎭 Compras en Ticketmaster / entretenimiento", v:simEntret, set:setSimEntret, max:4},
              ].map((s,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,color:C.text}}>{s.l}</span>
                    <span style={{fontSize:13,fontWeight:700,color:C.blue,fontFamily:"monospace"}}>{s.v}</span>
                  </div>
                  <input type="range" min={0} max={s.max} value={s.v} onChange={e=>s.set(Number(e.target.value))} style={{width:"100%",accentColor:C.blue,cursor:"pointer"}}/>
                </div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[
                  {label:"Platinum Aeroméxico",val:valAM,color:C.amex,bg:C.amexLight},
                  {label:"Platinum Normal",    val:valPN,color:"#2b5ea7",bg:"#dde8f8"},
                ].map((c,i)=>{
                  const gana=i===0?valAM>=valPN:valPN>valAM;
                  return(
                    <div key={i} style={{background:gana?c.bg:C.card,border:`2px solid ${gana?c.color:C.border}`,borderRadius:12,padding:14,textAlign:"center",transition:"all 0.2s"}}>
                      <div style={{fontSize:9,color:c.color,fontFamily:"monospace",letterSpacing:1,fontWeight:700,marginBottom:5}}>{c.label.toUpperCase()}</div>
                      <div style={{fontSize:22,fontWeight:800,fontFamily:"monospace",color:gana?c.color:C.muted,marginBottom:4}}>{fmx(c.val)}</div>
                      {gana&&<div style={{fontSize:10,fontFamily:"monospace",color:c.color,fontWeight:700}}>✓ Mejor opción</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{background:valPN>valAM?"#dde8f8":C.amexLight,border:`1px solid ${valPN>valAM?"#2b5ea7":C.amex}`,borderRadius:10,padding:13}}>
                <div style={{fontSize:12,color:valPN>valAM?"#2b5ea7":C.amex,fontFamily:"monospace",fontWeight:700,marginBottom:5}}>
                  {valPN>valAM?"💡 La Platinum Normal te conviene más":"🏆 Tu Platinum Aeroméxico sigue siendo mejor"}
                </div>
                <div style={{fontSize:12,color:C.textMed,lineHeight:1.7}}>
                  Diferencia estimada: <strong>{fmx(Math.abs(valPN-valAM))}</strong> a favor de la {valPN>valAM?"Platinum Normal":"Platinum Aeroméxico"}.
                  {valPN>valAM?" Pide un cambio de producto a Amex para no afectar tu historial.":" Considera cambiar si empiezas a volar con otras aerolíneas o te hospedas en hoteles de lujo."}
                </div>
              </div>
              <div style={{marginTop:10,fontSize:10,color:C.dim,fontFamily:"monospace",lineHeight:1.6}}>
                ⚠️ Estimado aproximado basado en compras registradas + variables manuales.
                Ascensos nacionales ilimitados vencen en septiembre (tu aniversario).
              </div>
            </div>
          </div>
        )}
      </div>

      {editP&&<EditModal purchase={editP} onSave={p=>{setPurchases(prev=>prev.map(x=>x.id===p.id?p:x));setEditP(null);}} onClose={()=>setEditP(null)}/>}

      <div style={{textAlign:"center",padding:"20px 16px 8px",color:C.dim,fontSize:10,fontFamily:"monospace",letterSpacing:1.2}}>
        CARDSTACK · ACZ · powered by Claude AI
      </div>

      <style>{`
        *{box-sizing:border-box;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        select{outline:none;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.borderLight};border-radius:2px;}
        @keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
      `}</style>
    </div>
  );
}