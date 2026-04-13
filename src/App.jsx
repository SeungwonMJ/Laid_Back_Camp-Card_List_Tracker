import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CARD_DATA from "./cards.json";

const I18N = {
  ja: {
    title: "ゆるキャン△ SEASON3",
    subtitle: "Weiß Schwarz コレクショントラッカー",
    all: "全て", collected: "収集済み", missing: "未収集",
    deckAll: "全て", deckBooster: "ブースターパック", deckTrial: "トライアルデッキ",
    search: "番号・名前で検索…", showing: "件表示",
    qty: "枚", type: "種類", level: "レベル", power: "パワー",
    soul: "ソウル", cost: "コスト", trigger: "トリガー",
    traits: "特徴", side: "サイド", color: "色",
    effect: "効果", noImage: "画像なし", addImage: "画像追加",
    owned: "所持枚数", clearFilter: "解除",
    editName: "名前を編集…",
  },
  en: {
    title: "Laid-Back Camp SEASON3",
    subtitle: "Weiß Schwarz Collection Tracker",
    all: "All", collected: "Collected", missing: "Missing",
    deckAll: "All", deckBooster: "Booster Pack", deckTrial: "Trial Deck",
    search: "Search by number or name…", showing: "shown",
    qty: "copies", type: "Type", level: "Level", power: "Power",
    soul: "Soul", cost: "Cost", trigger: "Trigger",
    traits: "Traits", side: "Side", color: "Color",
    effect: "Effect", noImage: "No Image", addImage: "Add Image",
    owned: "Owned copies", clearFilter: "Clear",
    editName: "Edit name…",
  },
  ko: {
    title: "유루캠△ SEASON3",
    subtitle: "바이스 슈발츠 컬렉션 트래커",
    all: "전체", collected: "수집", missing: "미수집",
    deckAll: "전체", deckBooster: "부스터팩", deckTrial: "트라이얼덱",
    search: "번호 또는 이름으로 검색…", showing: "장 표시",
    qty: "장", type: "종류", level: "레벨", power: "파워",
    soul: "소울", cost: "코스트", trigger: "트리거",
    traits: "특징", side: "사이드", color: "색",
    effect: "효과", noImage: "이미지 없음", addImage: "이미지 추가",
    owned: "보유 수량", clearFilter: "해제",
    editName: "이름 편집…",
  },
};

const LANG_LABELS = { ja: "日本語", en: "English", ko: "한국어" };

const RARITY_ORDER = ["SEC+","RRR+","AGR","SSP","SP","RRR","SR","RR","R","U","C","CR","TD"];
const RARITY_COLORS = {
  "SEC+": { bg:"#FFD700", text:"#1a1a1a" },
  "RRR+": { bg:"#FF6B9D", text:"#fff" },
  "AGR":  { bg:"#CC88FF", text:"#fff" },
  "SSP":  { bg:"#FF9F43", text:"#fff" },
  "SP":   { bg:"#54A0FF", text:"#fff" },
  "RRR":  { bg:"#FF6B6B", text:"#fff" },
  "SR":   { bg:"#7C3AED", text:"#fff" },
  "RR":   { bg:"#00D2D3", text:"#fff" },
  "R":    { bg:"#1DD1A1", text:"#fff" },
  "U":    { bg:"#576574", text:"#fff" },
  "C":    { bg:"#8395a7", text:"#fff" },
  "CR":   { bg:"#F368E0", text:"#fff" },
  "TD":   { bg:"#A0522D", text:"#fff" },
};

const TYPE_MAP = {
  "キャラ": { en:"Character", ko:"캐릭터" },
  "イベント": { en:"Event", ko:"이벤트" },
  "クライマックス": { en:"Climax", ko:"클라이맥스" }
};

const THEMES = {
  dark: {
    pageBg: "linear-gradient(160deg,#080f0a 0%,#0d2018 50%,#060e0a 100%)",
    headerBg: "rgba(6,15,9,0.96)",
    headerBorder: "rgba(76,175,80,0.12)",
    text: "#e8f5e9",
    textSub: "#4a7a5a",
    textMid: "#a8e6b0",
    textDim: "#5a8a6a",
    textCard: "#b8d8c0",
    textList: "#c0dcc8",
    textEffect: "#b0d0b8",
    cardCollectedBg: "rgba(15,40,22,0.9)",
    cardMissingBg: "rgba(255,255,255,0.03)",
    cardMissingBorder: "rgba(255,255,255,0.06)",
    cardListCollectedBg: "rgba(15,45,25,0.65)",
    progressBg: "rgba(255,255,255,0.07)",
    surface: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    accentBorder: "rgba(76,175,80,0.18)",
    statBg: "rgba(255,255,255,0.05)",
    effectBg: "rgba(255,255,255,0.04)",
    effectBorder: "rgba(100,200,120,0.1)",
    modalBg: "#132318",
    imgBg: "#0a1a0e",
    imgBorder: "rgba(100,200,120,0.3)",
    countMissing: "#576574",
    qtyBg: "rgba(255,255,255,0.05)",
    dropdownBg: "#132318",
    dropdownBorder: "rgba(76,175,80,0.25)",
    dropdownHover: "rgba(76,175,80,0.15)",
  },
  light: {
    pageBg: "linear-gradient(160deg,#f5faf5 0%,#eaf4ea 50%,#f0f8f0 100%)",
    headerBg: "rgba(245,250,245,0.97)",
    headerBorder: "rgba(76,175,80,0.25)",
    text: "#1a3a1a",
    textSub: "#4a7a4a",
    textMid: "#2e7d32",
    textDim: "#5a8a5a",
    textCard: "#2a5a2a",
    textList: "#2a5a2a",
    textEffect: "#3a6a3a",
    cardCollectedBg: "rgba(200,240,200,0.85)",
    cardMissingBg: "rgba(0,0,0,0.03)",
    cardMissingBorder: "rgba(0,0,0,0.08)",
    cardListCollectedBg: "rgba(190,235,190,0.7)",
    progressBg: "rgba(0,0,0,0.08)",
    surface: "rgba(0,0,0,0.04)",
    border: "rgba(0,0,0,0.12)",
    accentBorder: "rgba(76,175,80,0.35)",
    statBg: "rgba(0,0,0,0.04)",
    effectBg: "rgba(0,0,0,0.03)",
    effectBorder: "rgba(76,175,80,0.2)",
    modalBg: "#f0f8f0",
    imgBg: "#e0f0e0",
    imgBorder: "rgba(76,175,80,0.35)",
    countMissing: "#8a9a8a",
    qtyBg: "rgba(0,0,0,0.04)",
    dropdownBg: "#f0f8f0",
    dropdownBorder: "rgba(76,175,80,0.3)",
    dropdownHover: "rgba(76,175,80,0.12)",
  },
};

const STORAGE_KEY = "yurucamp-tracker-v4";

const WS_IMG = "https://ws-tcg.com/wordpress/wp-content/images/cardlist/_partimages/";
const SIDE_ICON = { "white":"w.gif", "White":"w.gif", "black":"s.gif", "Black":"s.gif" };
const COLOR_ICON = { "赤":"red.gif", "Red":"red.gif", "red":"red.gif", "青":"blue.gif", "Blue":"blue.gif", "blue":"blue.gif", "緑":"green.gif", "Green":"green.gif", "green":"green.gif", "黄":"yellow.gif", "Yellow":"yellow.gif", "yellow":"yellow.gif" };
const TRIGGER_ICON = { "ソウル":"soul.gif", "ゲート":"gate.gif", "トレジャー":"treasure.gif", "Soul":"soul.gif", "soul":"soul.gif", "Gate":"gate.gif", "gate":"gate.gif", "Treasure":"treasure.gif", "treasure":"treasure.gif" };

function WsIcon({ file }) {
  return <img src={`${WS_IMG}${file}`} alt={file} style={{ height:14, verticalAlign:"middle" }} />;
}

function renderStatVal(key, val, card) {
  if (key === "side" && SIDE_ICON[val]) return <WsIcon file={SIDE_ICON[val]} />;
  if (key === "color" && COLOR_ICON[val]) return <WsIcon file={COLOR_ICON[val]} />;
  if (key === "soul") {
    const n = parseInt(val);
    if (n > 0) return <span style={{ display:"flex", gap:2 }}>{Array.from({length:n}, (_, i) => <WsIcon key={i} file="soul.gif" />)}</span>;
  }
  if (key === "trigger" && val && val !== "-") {
    const parts = val.split(",").map(s => s.trim());
    const icons = parts.map(p => TRIGGER_ICON[p]).filter(Boolean);
    if (icons.length > 0) return <span style={{ display:"flex", gap:2 }}>{icons.map((f, i) => <WsIcon key={i} file={f} />)}</span>;
  }
  return <>{val || "—"}</>;
}

function cardImageUrl(id) {
  const normalized = id.toLowerCase().replace("/", "_").replace("-", "_");
  return `https://ws-tcg.com/wordpress/wp-content/images/cardlist/y/yrc_w116/${normalized}.png`;
}

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : { qty: {}, images: {}, userNames: {} };
  } catch {
    return { qty: {}, images: {}, userNames: {} };
  }
}

function CardModal({ card, state, lang, t, th, onClose, onQtyChange, onImageChange, onNameChange }) {
  const col = RARITY_COLORS[card.rarity] || RARITY_COLORS["C"];
  const qty = state.qty[card.id] ?? 0;
  const imgSrc = state.images[card.id] || cardImageUrl(card.id);

  const baseName = lang === "en" ? card.name_en || card.name_ja
                 : lang === "ko" ? card.name_ko || card.name_ja
                 : card.name_ja;
  const displayName = state.userNames?.[`${card.id}_${lang}`] || baseName;
  const typeDisplay = lang === "ja" ? card.type : (TYPE_MAP[card.type]?.[lang] || card.type);
  const effectText = lang === "en" ? (card.effect_en || card.effect_ja)
                   : lang === "ko" ? (card.effect_ko || card.effect_ja)
                   : card.effect_ja;
  const traitsDisplay = lang === "en" && card.traits_en ? card.traits_en : card.traits;

  const [urlInput, setUrlInput] = useState(
    state.images[card.id]?.startsWith("http") ? state.images[card.id] : ""
  );

  function handleImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImageChange(card.id, ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleUrlApply() {
    const url = urlInput.trim();
    if (url) onImageChange(card.id, url);
  }

  const statRows = [
    { key:"type",    label:t.type,    val:typeDisplay },
    { key:"side",    label:t.side,    val:card.side },
    { key:"color",   label:t.color,   val:card.color },
    { key:"level",   label:t.level,   val:card.level },
    { key:"power",   label:t.power,   val:card.power },
    { key:"soul",    label:t.soul,    val:card.soul },
    { key:"cost",    label:t.cost,    val:card.cost },
    { key:"trigger", label:t.trigger, val:card.trigger },
    { key:"traits",  label:t.traits,  val:traitsDisplay },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000,
               display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background:th.modalBg, border:`1px solid ${col.bg}44`, borderRadius:16,
                 padding:24, maxWidth:500, width:"100%", maxHeight:"90vh", overflowY:"auto",
                 boxShadow:`0 0 40px ${col.bg}22` }}
      >
        {/* 이미지 */}
        <div style={{ width:"100%", aspectRatio:"3/4", background:th.imgBg, borderRadius:10,
                      marginBottom:16, overflow:"hidden", display:"flex", alignItems:"center",
                      justifyContent:"center", border:`1px dashed ${th.imgBorder}`, position:"relative" }}>
          {imgSrc
            ? <img src={imgSrc} alt={displayName} style={{ width:"100%", height:"100%", objectFit:"contain" }} />
            : <div style={{ textAlign:"center", color:th.textDim }}>
                <div style={{ fontSize:48 }}>🃏</div>
                <div style={{ fontSize:12 }}>{t.noImage}</div>
              </div>
          }
          <label style={{ position:"absolute", bottom:8, right:8, background:"rgba(76,175,80,0.85)",
                          color:"#fff", padding:"4px 10px", borderRadius:6, fontSize:11, cursor:"pointer" }}>
            {t.addImage}
            <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleImg} />
          </label>
        </div>

        {/* URL 입력 */}
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          <input
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
            style={{ flex:1, background:th.surface, border:`1px solid ${th.accentBorder}`,
                     borderRadius:8, padding:"6px 10px", color:th.text, fontSize:11, outline:"none" }}
          />
          <button
            onClick={handleUrlApply}
            style={{ padding:"6px 12px", borderRadius:8, fontSize:11, cursor:"pointer",
                     background:"rgba(76,175,80,0.2)", border:"1px solid rgba(76,175,80,0.4)",
                     color:"#4CAF50" }}>
            적용
          </button>
        </div>

        {/* 레어리티 + 번호 */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <span style={{ background:col.bg, color:col.text, padding:"3px 10px",
                         borderRadius:6, fontSize:12, fontWeight:"bold" }}>{card.rarity}</span>
          <span style={{ color:th.textDim, fontSize:12 }}>{card.id}</span>
        </div>

        {/* 이름 */}
        <div style={{ fontSize:17, color:th.text, fontWeight:"bold", marginBottom:2 }}>{displayName}</div>
        {lang !== "ja" && (
          <div style={{ fontSize:11, color:th.textDim, marginBottom:4 }}>{card.name_ja}</div>
        )}

        {/* 이름 편집 */}
        <input
          placeholder={t.editName}
          value={state.userNames?.[`${card.id}_${lang}`] || ""}
          onChange={(e) => onNameChange(card.id, lang, e.target.value)}
          style={{ width:"100%", background:th.surface, border:`1px solid ${th.accentBorder}`,
                   borderRadius:8, padding:"7px 12px", color:th.text, fontSize:12,
                   marginBottom:16, boxSizing:"border-box", outline:"none" }}
        />

        {/* 스탯 3×3 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:16 }}>
          {statRows.map(({ key, label, val }) => (
            <div key={key} style={{ background:th.statBg, borderRadius:8, padding:"7px 10px" }}>
              <div style={{ fontSize:9, color:th.textDim, marginBottom:2 }}>{label}</div>
              <div style={{ fontSize:12, color:th.textCard, display:"flex", alignItems:"center", minHeight:16 }}>
                {renderStatVal(key, val, card)}
              </div>
            </div>
          ))}
        </div>

        {/* 효과 텍스트 */}
        {effectText && effectText !== "-" && (
          <div style={{ background:th.effectBg, border:`1px solid ${th.effectBorder}`,
                        borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:10, color:th.textDim, marginBottom:8,
                          letterSpacing:1, textTransform:"uppercase" }}>{t.effect}</div>
            <div style={{ fontSize:11, color:th.textEffect, lineHeight:1.85, whiteSpace:"pre-wrap" }}>
              {effectText}
            </div>
          </div>
        )}

        {/* 수량 조절 */}
        <div style={{ display:"flex", alignItems:"center", gap:12, background:th.qtyBg,
                      borderRadius:10, padding:"12px 16px" }}>
          <span style={{ color:th.textMid, fontSize:14, flex:1 }}>{t.owned}</span>
          <button
            onClick={() => onQtyChange(card.id, Math.max(0, qty - 1))}
            style={{ width:32, height:32, background:"rgba(255,80,80,0.2)", border:"1px solid rgba(255,80,80,0.4)",
                     borderRadius:8, color:"#ff6666", cursor:"pointer", fontSize:18, fontWeight:"bold" }}>−</button>
          <span style={{ fontSize:22, fontWeight:"bold", minWidth:32, textAlign:"center",
                         color: qty >= 4 ? "#e6a800" : qty > 0 ? "#4CAF50" : th.countMissing }}>{qty}</span>
          <button
            onClick={() => onQtyChange(card.id, qty + 1)}
            style={{ width:32, height:32, background:"rgba(76,175,80,0.2)", border:"1px solid rgba(76,175,80,0.4)",
                     borderRadius:8, color:"#4CAF50", cursor:"pointer", fontSize:18, fontWeight:"bold" }}>+</button>
          <span style={{ color:th.textDim, fontSize:12 }}>{t.qty}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("ja");
  const t = I18N[lang];

  const [darkMode, setDarkMode] = useState(true);
  const th = THEMES[darkMode ? "dark" : "light"];

  const [deckMode, setDeckMode] = useState("all"); // "all" | "booster" | "trial"
  const deckCards = useMemo(() =>
    deckMode === "all" ? CARD_DATA : CARD_DATA.filter(c => c.set === deckMode)
  , [deckMode]);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef(null);

  const [state, setState] = useState(loadState);
  const [filterRarity, setFilterRarity] = useState([]);
  const [showOnly, setShowOnly] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCard, setSelectedCard] = useState(null);

  // 언어 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClick(e) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateQty = useCallback((id, val) => {
    setState((s) => ({ ...s, qty: { ...s.qty, [id]: val } }));
  }, []);

  const updateImage = useCallback((id, src) => {
    setState((s) => ({ ...s, images: { ...s.images, [id]: src } }));
  }, []);

  const updateName = useCallback((id, lang, val) => {
    setState((s) => ({ ...s, userNames: { ...s.userNames, [`${id}_${lang}`]: val } }));
  }, []);

  function getDisplayName(card) {
    const key = `${card.id}_${lang}`;
    if (state.userNames?.[key]) return state.userNames[key];
    if (lang === "en") return card.name_en || card.name_ja;
    if (lang === "ko") return card.name_ko || card.name_ja;
    return card.name_ja;
  }

  const filtered = useMemo(() => {
    return deckCards.filter((c) => {
      if (filterRarity.length > 0 && !filterRarity.includes(c.rarity)) return false;
      const qty = state.qty[c.id] ?? 0;
      if (showOnly === "collected" && qty === 0) return false;
      if (showOnly === "missing" && qty > 0) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !c.id.toLowerCase().includes(s) &&
          !c.name_ja.includes(search) &&
          !(c.name_en || "").toLowerCase().includes(s) &&
          !(c.name_ko || "").includes(search)
        ) return false;
      }
      return true;
    });
  }, [filterRarity, showOnly, search, state.qty]);

  const totalCollected = deckCards.filter((c) => (state.qty[c.id] ?? 0) > 0).length;
  const pct = Math.round((totalCollected / deckCards.length) * 100);

  const rarityStats = useMemo(() => {
    return RARITY_ORDER.map((r) => ({
      r,
      total: deckCards.filter((c) => c.rarity === r).length,
      collected: deckCards.filter((c) => c.rarity === r && (state.qty[c.id] ?? 0) > 0).length,
    }));
  }, [deckCards, state.qty]);

  const btnBase = {
    borderRadius:6, fontSize:11, cursor:"pointer",
    background: th.surface, border:`1px solid ${th.border}`, color:th.textDim,
  };

  return (
    <div style={{ minHeight:"100vh", background:th.pageBg,
                  fontFamily:"Georgia, 'Hiragino Kaku Gothic ProN', serif", color:th.text }}>

      {/* 헤더 */}
      <div style={{ background:th.headerBg, borderBottom:`1px solid ${th.headerBorder}`,
                    padding:"14px 20px", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(12px)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, flexWrap:"wrap" }}>
            <span style={{ fontSize:26 }}>⛺</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:"bold", color:th.textMid, letterSpacing:1 }}>{t.title}</div>
              <div style={{ fontSize:10, color:th.textSub }}>{t.subtitle}</div>
            </div>

            {/* 다크/라이트 토글 버튼 */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              style={{ ...btnBase, padding:"5px 11px", fontSize:12,
                       display:"flex", alignItems:"center", gap:5 }}
            >
              <span>{darkMode ? "🌙" : "☀️"}</span>
              <span style={{ color:th.textDim }}>{darkMode ? "Dark" : "Light"}</span>
            </button>

            {/* 언어 드롭다운 */}
            <div ref={langMenuRef} style={{ position:"relative" }}>
              <button
                onClick={() => setShowLangMenu((v) => !v)}
                style={{ ...btnBase, padding:"5px 11px", fontSize:12,
                         display:"flex", alignItems:"center", gap:5 }}
              >
                <span style={{ color:th.textMid }}>{LANG_LABELS[lang]}</span>
                <span style={{ color:th.textDim, fontSize:9 }}>{showLangMenu ? "▲" : "▼"}</span>
              </button>
              {showLangMenu && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)",
                              background:th.dropdownBg, border:`1px solid ${th.dropdownBorder}`,
                              borderRadius:8, overflow:"hidden", zIndex:200,
                              boxShadow:"0 4px 16px rgba(0,0,0,0.2)", minWidth:100 }}>
                  {Object.entries(LANG_LABELS).map(([l, label]) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setShowLangMenu(false); }}
                      style={{ display:"block", width:"100%", padding:"9px 16px", textAlign:"left",
                               background: lang === l ? th.dropdownHover : "transparent",
                               border:"none", cursor:"pointer", fontSize:12,
                               color: lang === l ? th.textMid : th.text,
                               fontWeight: lang === l ? "bold" : "normal" }}
                    >
                      {label}
                      {lang === l && <span style={{ float:"right", color:th.textMid }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 진행도 */}
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:18, fontWeight:"bold", color: pct === 100 ? "#FFD700" : th.textMid }}>
                {totalCollected}/{deckCards.length}
              </div>
              <div style={{ fontSize:10, color:th.textSub }}>{pct}%</div>
            </div>
          </div>

          {/* 덱 모드 선택 */}
          <div style={{ display:"flex", gap:4, marginBottom:10 }}>
            {[["all", t.deckAll],["booster", t.deckBooster],["trial", t.deckTrial]].map(([v, label]) => (
              <button key={v} onClick={() => { setDeckMode(v); setFilterRarity([]); }}
                style={{ padding:"5px 12px", borderRadius:8, fontSize:11, cursor:"pointer",
                         background: deckMode === v ? "rgba(76,175,80,0.22)" : th.surface,
                         border: `1px solid ${deckMode === v ? "#4CAF50" : th.border}`,
                         color: deckMode === v ? th.textMid : th.textDim }}>{label}</button>
            ))}
          </div>

          {/* 진행 바 */}
          <div style={{ background:th.progressBg, borderRadius:6, height:5, marginBottom:10 }}>
            <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#2e7d32,#66bb6a)",
                          borderRadius:6, transition:"width 0.4s", boxShadow:"0 0 6px rgba(76,175,80,0.4)" }} />
          </div>

          {/* 레어리티 필터 버튼 */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
            {rarityStats.map(({ r, total, collected }) => {
              if (!total) return null;
              const col = RARITY_COLORS[r];
              const active = filterRarity.includes(r);
              const done = collected === total;
              return (
                <button key={r} onClick={() => setFilterRarity((prev) =>
                    active ? prev.filter((x) => x !== r) : [...prev, r]
                  )}
                  style={{ background: active ? col.bg : th.surface,
                           border: `1px solid ${active ? col.bg : col.bg + "44"}`,
                           borderRadius:6, padding:"3px 8px", cursor:"pointer",
                           display:"flex", alignItems:"center", gap:4,
                           transition:"all 0.15s", boxShadow: active ? `0 0 8px ${col.bg}55` : "none" }}>
                  <span style={{ fontSize:9, fontWeight:"bold", color: active ? col.text : col.bg }}>{r}</span>
                  <span style={{ fontSize:9, color: active ? col.text : th.textDim }}>{collected}/{total}</span>
                  {done && <span style={{ fontSize:8, color: active ? col.text : "#4CAF50" }}>✓</span>}
                </button>
              );
            })}
            {filterRarity.length > 0 && (
              <button onClick={() => setFilterRarity([])}
                style={{ background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.3)",
                         borderRadius:6, padding:"3px 8px", cursor:"pointer", fontSize:9, color:"#e05555" }}>
                {t.clearFilter} ✕
              </button>
            )}
          </div>

          {/* 검색 + 뷰 컨트롤 */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              style={{ flex:1, minWidth:160, background:th.surface,
                       border:`1px solid ${th.accentBorder}`, borderRadius:8,
                       padding:"7px 12px", color:th.text, fontSize:12, outline:"none" }}
            />
            <div style={{ display:"flex", gap:4 }}>
              {[["all", t.all], ["collected", t.collected], ["missing", t.missing]].map(([v, label]) => (
                <button key={v} onClick={() => setShowOnly(v)}
                  style={{ padding:"7px 10px", borderRadius:8, fontSize:11, cursor:"pointer",
                           background: showOnly === v ? "rgba(76,175,80,0.22)" : th.surface,
                           border: `1px solid ${showOnly === v ? "#4CAF50" : th.border}`,
                           color: showOnly === v ? th.textMid : th.textDim }}>{label}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:4 }}>
              {[["grid","⊞"],["list","☰"]].map(([v, icon]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{ padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:15,
                           background: viewMode === v ? "rgba(76,175,80,0.22)" : th.surface,
                           border: `1px solid ${viewMode === v ? "#4CAF50" : th.border}`,
                           color: viewMode === v ? th.textMid : th.textDim }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 카드 목록 */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"14px 12px 60px" }}>
        <div style={{ fontSize:11, color:th.textSub, marginBottom:10 }}>
          {filtered.length}{t.showing}
        </div>

        {viewMode === "grid" ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(125px, 1fr))", gap:8 }}>
            {filtered.map((card) => {
              const qty = state.qty[card.id] ?? 0;
              const col = RARITY_COLORS[card.rarity];
              const cardImg = state.images[card.id] || cardImageUrl(card.id);
              const name = getDisplayName(card);
              return (
                <div key={card.id} onClick={() => setSelectedCard(card)}
                  style={{ background: qty > 0 ? th.cardCollectedBg : th.cardMissingBg,
                           border: `1px solid ${qty > 0 ? col.bg + "44" : th.cardMissingBorder}`,
                           borderRadius:10, padding:"9px 7px", cursor:"pointer",
                           opacity: qty > 0 ? 1 : 0.5, transition:"all 0.15s", position:"relative" }}>
                  <div style={{ width:"100%", aspectRatio:"3/4", background:"transparent",
                                borderRadius:5, marginBottom:6, overflow:"hidden",
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <img src={cardImg} alt={name} style={{ width:"100%", height:"100%", objectFit:"contain" }} />
                  </div>
                  <div style={{ display:"inline-block", background:col.bg, color:col.text,
                                fontSize:7, fontWeight:"bold", padding:"1px 5px", borderRadius:3, marginBottom:3 }}>
                    {card.rarity}
                  </div>
                  <div style={{ fontSize:8, color:th.textDim, marginBottom:2 }}>
                    {card.id.replace("YRC/W116-", "")}
                  </div>
                  <div style={{ fontSize:9, color:th.textCard, lineHeight:1.3,
                                display:"-webkit-box", WebkitLineClamp:2,
                                WebkitBoxOrient:"vertical", overflow:"hidden" }}>{name}</div>
                  {qty > 0 && (
                    <div style={{ position:"absolute", top:5, right:5,
                                  background: qty >= 4 ? "#FFD700" : "#4CAF50",
                                  color: qty >= 4 ? "#1a1a1a" : "#fff",
                                  borderRadius:"50%", width:16, height:16,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:9, fontWeight:"bold" }}>{qty}</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {filtered.map((card) => {
              const qty = state.qty[card.id] ?? 0;
              const col = RARITY_COLORS[card.rarity];
              const name = getDisplayName(card);
              const cardImg = state.images[card.id] || cardImageUrl(card.id);
              return (
                <div key={card.id} onClick={() => setSelectedCard(card)}
                  style={{ display:"flex", alignItems:"center", gap:10,
                           background: qty > 0 ? th.cardListCollectedBg : th.cardMissingBg,
                           border: `1px solid ${qty > 0 ? col.bg + "33" : th.cardMissingBorder}`,
                           borderRadius:8, padding:"8px 12px", cursor:"pointer",
                           opacity: qty > 0 ? 1 : 0.55, transition:"all 0.12s" }}>
                  <div style={{ width:30, height:42, borderRadius:4, overflow:"hidden",
                                background:"transparent", flexShrink:0,
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <img src={cardImg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                  <div style={{ background:col.bg, color:col.text, fontSize:8, fontWeight:"bold",
                                padding:"2px 6px", borderRadius:4, flexShrink:0, minWidth:34, textAlign:"center" }}>
                    {card.rarity}
                  </div>
                  <div style={{ fontSize:10, color:th.textDim, flexShrink:0, width:76 }}>
                    {card.id.replace("YRC/W116-", "")}
                  </div>
                  <div style={{ flex:1, fontSize:12, color:th.textList }}>{name}</div>
                  <div style={{ fontSize:10, color:th.textDim, flexShrink:0 }}>
                    Lv{card.level} · {card.power}
                  </div>
                  <div style={{ width:26, height:26, borderRadius:"50%",
                                background: qty > 0 ? (qty >= 4 ? "rgba(255,215,0,0.25)" : "rgba(76,175,80,0.25)") : th.surface,
                                border: `1px solid ${qty > 0 ? (qty >= 4 ? "#FFD700" : "#4CAF50") : th.border}`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:10, fontWeight:"bold", flexShrink:0,
                                color: qty >= 4 ? "#e6a800" : qty > 0 ? "#4CAF50" : th.countMissing }}>
                    {qty || "—"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 카드 상세 모달 */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          state={state}
          lang={lang}
          t={t}
          th={th}
          onClose={() => setSelectedCard(null)}
          onQtyChange={updateQty}
          onImageChange={updateImage}
          onNameChange={updateName}
        />
      )}

      {/* 푸터 */}
      <footer style={{ textAlign:"center", padding:"24px 16px 32px", color:th.textDim, fontSize:11, lineHeight:1.8 }}>
        <div>© 2026 <a href="https://github.com/SeungwonMJ" target="_blank" rel="noreferrer" style={{ color:th.textDim }}>SeungwonMJ</a> — MIT License (app code only)</div>
        <div>Card data &amp; images © Bushiroad. This is a non-commercial fan project.</div>
        <div>ゆるキャン△ © あfろ / Bushiroad</div>
      </footer>
    </div>
  );
}
