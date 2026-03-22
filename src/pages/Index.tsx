import { useState, useEffect, useRef } from "react";

type Screen = "menu" | "game" | "settings" | "shop" | "earn";
type ClothingStyle = "hell" | "snow";
type BgColor = "yellow" | "purple" | "red" | "lime";

const BG_COLORS: Record<BgColor, string> = {
  yellow: "#FFD600",
  purple: "#7C3AED",
  red: "#DC2626",
  lime: "#84CC16",
};
const BG_LABELS: Record<BgColor, string> = {
  yellow: "Жёлтый",
  purple: "Фиолетовый",
  red: "Красный",
  lime: "Лаймовый",
};

type ClothingItem = "scarf" | "jacket" | "hat" | "tshirt" | "tanktop" | "hoodie" | "trackpants";

const CLOTHING_BUTTONS: { id: ClothingItem; label: string }[] = [
  { id: "scarf", label: "🧣 Одеть шарф" },
  { id: "jacket", label: "🧥 Одеть куртку" },
  { id: "hat", label: "🎩 Одеть шапку" },
  { id: "tshirt", label: "👕 Одеть футболку" },
  { id: "tanktop", label: "👔 Одеть майку" },
  { id: "hoodie", label: "🥼 Одеть кофту" },
  { id: "trackpants", label: "👖 Одеть трико" },
];

const HELL_COLORS: Record<ClothingItem, string> = {
  scarf: "#B91C1C", jacket: "#7F1D1D", hat: "#991B1B",
  tshirt: "#DC2626", tanktop: "#EF4444", hoodie: "#450A0A", trackpants: "#6B0000",
};
const SNOW_COLORS: Record<ClothingItem, string> = {
  scarf: "#BAE6FD", jacket: "#DBEAFE", hat: "#E0F2FE",
  tshirt: "#F0F9FF", tanktop: "#EFF6FF", hoodie: "#BFDBFE", trackpants: "#93C5FD",
};

interface Phone {
  id: number;
  name: string;
  price: number;
  emoji: string;
  color: string;
  specs: string;
}
const PHONES: Phone[] = [
  { id: 1, name: "iPhone 13", price: 300, emoji: "📱", color: "#1d6fa4", specs: "6.1\" · A15 Bionic · 128GB" },
  { id: 2, name: "iPhone 14", price: 400, emoji: "📱", color: "#5856d6", specs: "6.1\" · A15 Bionic · 256GB" },
  { id: 3, name: "iPhone 17 Pro Max", price: 1000, emoji: "📱", color: "#bf5a00", specs: "6.9\" · A19 Pro · 512GB" },
];

// ---- MANNEQUIN SVG ----
function Mannequin({ worn, style }: { worn: Set<ClothingItem>; style: ClothingStyle }) {
  const colors = style === "hell" ? HELL_COLORS : SNOW_COLORS;
  const skin = style === "hell" ? "#C77C3C" : "#F9CFAD";
  const eyeColor = style === "hell" ? "#FF4500" : "#4A90D9";
  const hairColor = style === "hell" ? "#1A0000" : "#F5E6CA";
  return (
    <svg width="220" height="420" viewBox="0 0 220 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}>
      {worn.has("trackpants") ? (
        <>
          <rect x="62" y="260" width="38" height="130" rx="12" fill={colors.trackpants} />
          <rect x="118" y="260" width="38" height="130" rx="12" fill={colors.trackpants} />
          <rect x="76" y="260" width="6" height="130" rx="3" fill="rgba(255,255,255,0.25)" />
          <rect x="132" y="260" width="6" height="130" rx="3" fill="rgba(255,255,255,0.25)" />
        </>
      ) : (
        <>
          <rect x="62" y="260" width="38" height="130" rx="12" fill={skin} />
          <rect x="118" y="260" width="38" height="130" rx="12" fill={skin} />
        </>
      )}
      <rect x="58" y="148" width="104" height="118" rx="18" fill={skin} />
      {worn.has("tshirt") && (
        <>
          <rect x="58" y="148" width="104" height="100" rx="18" fill={colors.tshirt} />
          <path d="M90 148 Q110 165 130 148" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none" />
        </>
      )}
      {worn.has("tanktop") && (
        <>
          <rect x="68" y="148" width="84" height="100" rx="12" fill={colors.tanktop} />
          <rect x="68" y="148" width="84" height="8" rx="4" fill="rgba(0,0,0,0.1)" />
        </>
      )}
      {worn.has("hoodie") && (
        <>
          <rect x="55" y="148" width="110" height="110" rx="18" fill={colors.hoodie} />
          <rect x="90" y="220" width="40" height="22" rx="8" fill="rgba(0,0,0,0.2)" />
          <rect x="108" y="155" width="4" height="60" rx="2" fill="rgba(0,0,0,0.25)" />
        </>
      )}
      {worn.has("jacket") && (
        <>
          <rect x="50" y="145" width="120" height="118" rx="18" fill={colors.jacket} />
          <path d="M110 155 L88 185 L110 175 L132 185 Z" fill="rgba(0,0,0,0.25)" />
          <circle cx="110" cy="195" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="110" cy="215" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="110" cy="235" r="4" fill="rgba(255,255,255,0.4)" />
          <rect x="62" y="225" width="28" height="18" rx="6" fill="rgba(0,0,0,0.2)" />
          <rect x="130" y="225" width="28" height="18" rx="6" fill="rgba(0,0,0,0.2)" />
        </>
      )}
      <rect x="18" y="148" width="40" height="100" rx="16" fill={skin} />
      <rect x="162" y="148" width="40" height="100" rx="16" fill={skin} />
      {worn.has("jacket") && (
        <>
          <rect x="14" y="145" width="46" height="108" rx="16" fill={colors.jacket} />
          <rect x="160" y="145" width="46" height="108" rx="16" fill={colors.jacket} />
          <rect x="14" y="240" width="46" height="12" rx="6" fill="rgba(0,0,0,0.25)" />
          <rect x="160" y="240" width="46" height="12" rx="6" fill="rgba(0,0,0,0.25)" />
        </>
      )}
      {worn.has("hoodie") && !worn.has("jacket") && (
        <>
          <rect x="16" y="148" width="42" height="104" rx="16" fill={colors.hoodie} />
          <rect x="162" y="148" width="42" height="104" rx="16" fill={colors.hoodie} />
        </>
      )}
      {worn.has("tshirt") && !worn.has("jacket") && !worn.has("hoodie") && (
        <>
          <rect x="20" y="148" width="38" height="60" rx="14" fill={colors.tshirt} />
          <rect x="162" y="148" width="38" height="60" rx="14" fill={colors.tshirt} />
        </>
      )}
      {worn.has("scarf") && (
        <>
          <rect x="72" y="128" width="76" height="30" rx="14" fill={colors.scarf} />
          <rect x="72" y="135" width="76" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="78" y="152" width="20" height="50" rx="8" fill={colors.scarf} />
        </>
      )}
      <rect x="92" y="118" width="36" height="36" rx="10" fill={skin} />
      <ellipse cx="110" cy="90" rx="48" ry="56" fill={skin} />
      {style === "snow" ? (
        <ellipse cx="110" cy="50" rx="48" ry="22" fill={hairColor} />
      ) : (
        <>
          <ellipse cx="110" cy="46" rx="48" ry="20" fill={hairColor} />
          <polygon points="80,52 70,20 92,45" fill="#8B0000" />
          <polygon points="140,52 150,20 128,45" fill="#8B0000" />
        </>
      )}
      <ellipse cx="94" cy="88" rx="7" ry="8" fill="white" />
      <ellipse cx="126" cy="88" rx="7" ry="8" fill="white" />
      <ellipse cx="94" cy="90" rx="4" ry="5" fill={eyeColor} />
      <ellipse cx="126" cy="90" rx="4" ry="5" fill={eyeColor} />
      <ellipse cx="95" cy="89" rx="1.5" ry="2" fill="#111" />
      <ellipse cx="127" cy="89" rx="1.5" ry="2" fill="#111" />
      <path d={style === "hell" ? "M86 78 Q94 72 102 78" : "M86 80 Q94 76 102 80"} stroke="#5A3010" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={style === "hell" ? "M118 78 Q126 72 134 78" : "M118 80 Q126 76 134 80"} stroke="#5A3010" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {style === "hell" ? (
        <path d="M100 108 Q110 102 120 108" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M100 108 Q110 115 120 108" stroke="#C17060" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      <ellipse cx="110" cy="99" rx="4" ry="3" fill="rgba(0,0,0,0.08)" />
      {worn.has("hat") && (
        style === "hell" ? (
          <>
            <rect x="66" y="38" width="88" height="46" rx="8" fill={colors.hat} />
            <rect x="52" y="44" width="116" height="14" rx="6" fill="#6B0000" />
            <path d="M75 38 Q80 18 85 38" fill="#FF4500" />
            <path d="M95 38 Q100 12 105 38" fill="#FF6500" />
            <path d="M115 38 Q120 18 125 38" fill="#FF4500" />
          </>
        ) : (
          <>
            <ellipse cx="110" cy="46" rx="52" ry="16" fill={colors.hat} />
            <rect x="62" y="32" width="96" height="36" rx="18" fill={colors.hat} />
            <ellipse cx="110" cy="34" rx="20" ry="16" fill="white" />
            <circle cx="110" cy="20" r="12" fill="white" />
            <circle cx="110" cy="20" r="8" fill="#DBEAFE" />
          </>
        )
      )}
    </svg>
  );
}

// ---- FLOATING COIN ----
interface Coin { id: number; x: number; y: number; }

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>("snow");
  const [bgColor, setBgColor] = useState<BgColor>("lime");
  const [worn, setWorn] = useState<Set<ClothingItem>>(new Set());
  const [balance, setBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [earnClicks, setEarnClicks] = useState(0);
  const [boughtPhones, setBoughtPhones] = useState<Set<number>>(new Set());
  const coinIdRef = useRef(0);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bg = BG_COLORS[bgColor];
  const isDark = bgColor === "purple" || bgColor === "red";
  const tc = isDark ? "#fff" : "#1a1a1a";
  const sc = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)";
  const cardBorder = isDark ? "1.5px solid rgba(255,255,255,0.2)" : "1.5px solid rgba(0,0,0,0.07)";

  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMsg(null), 2800);
  };
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMsg(null), 3000);
  };

  const earnMoney = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBalance(p => p + 10);
    setEarnClicks(p => p + 1);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = coinIdRef.current++;
    const x = e.clientX - rect.left + (Math.random() - 0.5) * 40;
    const y = e.clientY - rect.top - 10;
    setCoins(p => [...p, { id, x, y }]);
    setTimeout(() => setCoins(p => p.filter(c => c.id !== id)), 900);
  };

  const buyPhone = (phone: Phone) => {
    if (balance < phone.price) {
      showError(`Недостаточно средств! Нужно ещё $${phone.price - balance}`);
      return;
    }
    setBalance(p => p - phone.price);
    setBoughtPhones(p => new Set([...p, phone.id]));
    showSuccess(`✅ Куплено: ${phone.name}!`);
  };

  const toggleClothing = (item: ClothingItem) => {
    setWorn(prev => {
      const next = new Set(prev);
      if (next.has(item)) { next.delete(item); } else { next.add(item); }
      return next;
    });
  };

  // ---- MENU ----
  if (screen === "menu") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.4s", padding: 24 }}>
        {/* Balance badge */}
        <BalanceBadge balance={balance} dark={isDark} />

        <div style={{ background: cardBg, backdropFilter: "blur(16px)", borderRadius: 32, padding: "52px 64px", textAlign: "center", boxShadow: "0 16px 56px rgba(0,0,0,0.18)", border: cardBorder }}>
          <div style={{ fontSize: 64, marginBottom: 4 }}>🎮</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: tc, margin: "0 0 6px", letterSpacing: -1 }}>Мегаигра</h1>
          <p style={{ color: sc, fontSize: 15, marginBottom: 44 }}>Одевай, покупай, зарабатывай!</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <MenuBtn onClick={() => setScreen("game")} emoji="🧍" label="Одевалка" primary dark={isDark} />
            <MenuBtn onClick={() => setScreen("shop")} emoji="📱" label="Купить телефон" primary={false} dark={isDark} accent />
            <MenuBtn onClick={() => setScreen("earn")} emoji="💵" label="Заработать деньги" primary={false} dark={isDark} gold />
            <MenuBtn onClick={() => setScreen("settings")} emoji="⚙️" label="Настройки" primary={false} dark={isDark} />
          </div>
        </div>
      </div>
    );
  }

  // ---- EARN MONEY ----
  if (screen === "earn") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.4s", padding: 24 }}>
        <BalanceBadge balance={balance} dark={isDark} />

        <div style={{ background: cardBg, backdropFilter: "blur(16px)", borderRadius: 32, padding: "52px 56px", textAlign: "center", boxShadow: "0 16px 56px rgba(0,0,0,0.18)", border: cardBorder, minWidth: 340 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>💰</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: tc, margin: "0 0 6px" }}>Заработок</h2>
          <p style={{ color: sc, fontSize: 14, marginBottom: 8 }}>Нажимай и зарабатывай!</p>

          <div style={{ background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.06)", borderRadius: 16, padding: "16px 24px", marginBottom: 32, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>💎</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#F59E0B" }}>${balance}</span>
          </div>

          {/* EARN BUTTON */}
          <div style={{ position: "relative", marginBottom: 28 }}>
            <button
              onClick={earnMoney}
              style={{
                width: 180, height: 180, borderRadius: "50%",
                background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)",
                border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: "0 8px 40px rgba(245,158,11,0.6), 0 0 0 6px rgba(245,158,11,0.2), inset 0 3px 0 rgba(255,255,255,0.35)",
                transition: "transform 0.1s, box-shadow 0.1s",
                fontSize: 56,
                margin: "0 auto",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.06)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 52px rgba(245,158,11,0.75), 0 0 0 8px rgba(245,158,11,0.25), inset 0 3px 0 rgba(255,255,255,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(245,158,11,0.6), 0 0 0 6px rgba(245,158,11,0.2), inset 0 3px 0 rgba(255,255,255,0.35)";
              }}
              onMouseDown={e => (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"}
              onMouseUp={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"}
            >
              💵
              <span style={{ fontSize: 20, fontWeight: 900, color: "#78350F", letterSpacing: 0 }}>+$10</span>
            </button>
            {/* floating coins */}
            {coins.map(c => (
              <div key={c.id} style={{
                position: "absolute", left: c.x, top: c.y, pointerEvents: "none",
                fontSize: 22, fontWeight: 900, color: "#F59E0B",
                animation: "floatUp 0.9s ease-out forwards",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
                +$10
              </div>
            ))}
          </div>

          <p style={{ color: sc, fontSize: 13, marginBottom: 28 }}>
            Всего нажатий: <strong style={{ color: tc }}>{earnClicks}</strong>
          </p>

          <button onClick={() => setScreen("menu")} style={{ background: "none", border: isDark ? "2px solid rgba(255,255,255,0.3)" : "2px solid rgba(0,0,0,0.12)", borderRadius: 14, padding: "11px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: tc }}>
            ← Назад
          </button>
        </div>

        <style>{`
          @keyframes floatUp {
            0%   { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-70px) scale(1.3); }
          }
        `}</style>
      </div>
    );
  }

  // ---- SHOP ----
  if (screen === "shop") {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', sans-serif", transition: "background 0.4s", padding: "0 0 40px" }}>
        <BalanceBadge balance={balance} dark={isDark} />

        {/* Header */}
        <header style={{
          padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.07)",
        }}>
          <button onClick={() => setScreen("menu")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, color: tc }}>← Меню</button>
          <span style={{ fontWeight: 900, fontSize: 20, color: tc }}>📱 Магазин телефонов</span>
          <div style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)", borderRadius: 12, padding: "7px 14px", fontSize: 15, fontWeight: 800, color: tc }}>
            💰 ${balance}
          </div>
        </header>

        {/* Error / success */}
        <NotifBar error={errorMsg} success={successMsg} />

        <div style={{ maxWidth: 900, margin: "32px auto 0", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {PHONES.map(p => {
            const bought = boughtPhones.has(p.id);
            const canBuy = balance >= p.price;
            return (
              <div key={p.id} style={{
                background: cardBg, backdropFilter: "blur(12px)", borderRadius: 22,
                overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: cardBorder,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px rgba(0,0,0,0.16)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.1)"; }}
              >
                <div style={{ background: `linear-gradient(135deg, ${p.color}33, ${p.color}66)`, height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, position: "relative" }}>
                  {p.emoji}
                  {bought && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#16a34a", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>
                      ✓ Куплено
                    </div>
                  )}
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <p style={{ fontSize: 11, color: sc, marginBottom: 3, letterSpacing: 1 }}>APPLE</p>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: tc, margin: "0 0 4px" }}>{p.name}</h3>
                  <p style={{ fontSize: 12, color: sc, marginBottom: 14 }}>{p.specs}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: isDark ? "#FBBF24" : "#D97706" }}>${p.price}</span>
                    <button
                      onClick={() => buyPhone(p)}
                      style={{
                        padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
                        fontWeight: 800, fontSize: 13,
                        background: bought ? "#16a34a" : canBuy ? "linear-gradient(135deg, #FBBF24, #D97706)" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
                        color: bought ? "#fff" : canBuy ? "#78350F" : tc,
                        boxShadow: canBuy && !bought ? "0 4px 16px rgba(217,119,6,0.4)" : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      {bought ? "✓ Есть" : "🛒 Купить"}
                    </button>
                  </div>
                  {!canBuy && !bought && (
                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 6, fontWeight: 600 }}>
                      Не хватает ${p.price - balance} — заработай!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => setScreen("earn")} style={{
            background: "linear-gradient(135deg, #FBBF24, #D97706)", border: "none", borderRadius: 16,
            padding: "14px 32px", cursor: "pointer", fontWeight: 800, fontSize: 15, color: "#78350F",
            boxShadow: "0 6px 24px rgba(217,119,6,0.35)",
          }}>
            💵 Заработать деньги
          </button>
        </div>
      </div>
    );
  }

  // ---- SETTINGS ----
  if (screen === "settings") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.4s", padding: 24 }}>
        <BalanceBadge balance={balance} dark={isDark} />
        <div style={{ background: cardBg, backdropFilter: "blur(16px)", borderRadius: 32, padding: "48px 52px", width: "100%", maxWidth: 500, boxShadow: "0 12px 48px rgba(0,0,0,0.18)", border: cardBorder }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: tc, marginBottom: 4, textAlign: "center" }}>⚙️ Настройки</h2>
          <p style={{ textAlign: "center", color: sc, marginBottom: 36, fontSize: 14 }}>Настрой стиль и цвет под себя</p>

          <div style={{ marginBottom: 32 }}>
            <p style={{ color: sc, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>Стиль одежды</p>
            <div style={{ display: "flex", gap: 12 }}>
              {(["hell", "snow"] as ClothingStyle[]).map(s => (
                <button key={s} onClick={() => setClothingStyle(s)} style={{
                  flex: 1, padding: "16px 10px", borderRadius: 16,
                  border: clothingStyle === s ? "2.5px solid " + (isDark ? "#fff" : "#1a1a1a") : "2px solid " + (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"),
                  background: clothingStyle === s ? isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontWeight: 800, fontSize: 15, color: tc, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 28 }}>{s === "hell" ? "🔥" : "❄️"}</span>
                  {s === "hell" ? "Адский" : "Снежный"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <p style={{ color: sc, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>Цвет фона</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(Object.keys(BG_COLORS) as BgColor[]).map(c => (
                <button key={c} onClick={() => setBgColor(c)} style={{
                  padding: "13px 10px", borderRadius: 14,
                  border: bgColor === c ? "3px solid " + (isDark ? "#fff" : "#1a1a1a") : "2px solid rgba(0,0,0,0.08)",
                  background: BG_COLORS[c], cursor: "pointer", fontWeight: 800, fontSize: 14,
                  color: c === "purple" || c === "red" ? "#fff" : "#1a1a1a",
                  transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {bgColor === c && "✓ "}{BG_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setScreen("menu")} style={{ width: "100%", padding: "14px", borderRadius: 14, border: isDark ? "2px solid rgba(255,255,255,0.3)" : "2px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 15, color: tc }}>
            ← Назад в меню
          </button>
        </div>
      </div>
    );
  }

  // ---- GAME (одевалка) ----
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', sans-serif", transition: "background 0.4s", display: "flex", flexDirection: "column" }}>
      <BalanceBadge balance={balance} dark={isDark} />

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)", backdropFilter: "blur(10px)", borderBottom: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={() => setScreen("menu")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, color: tc }}>← Меню</button>
        <span style={{ fontWeight: 900, fontSize: 20, color: tc }}>🧍 Одевалка</span>
        <button onClick={() => setWorn(new Set())} style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: tc }}>
          🗑 Снять всё
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", gap: 0, alignItems: "stretch", padding: "24px", maxWidth: 1000, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ background: cardBg, backdropFilter: "blur(12px)", borderRadius: 32, padding: "32px 40px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: cardBorder, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Mannequin worn={worn} style={clothingStyle} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 240 }}>
              {worn.size === 0 ? (
                <span style={{ fontSize: 13, color: sc }}>Пока ничего не надето</span>
              ) : (
                Array.from(worn).map(item => {
                  const btn = CLOTHING_BUTTONS.find(b => b.id === item);
                  return <span key={item} style={{ background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: tc }}>{btn?.label.split(" ").slice(1).join(" ")}</span>;
                })
              )}
            </div>
          </div>
          <p style={{ fontSize: 13, color: sc, fontWeight: 600 }}>Стиль: {clothingStyle === "hell" ? "🔥 Адский" : "❄️ Снежный"}</p>
        </div>

        <div style={{ width: 260, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, paddingLeft: 24 }}>
          <h3 style={{ color: tc, fontWeight: 900, fontSize: 18, margin: "0 0 8px", textAlign: "center" }}>Одежда</h3>
          {CLOTHING_BUTTONS.map(({ id, label }) => {
            const isWorn = worn.has(id);
            return (
              <button key={id} onClick={() => toggleClothing(id)} style={{
                width: "100%", padding: "13px 16px", borderRadius: 16,
                border: isWorn ? "2.5px solid " + (isDark ? "#fff" : "#1a1a1a") : "2px solid " + (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"),
                background: isWorn ? isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.13)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
                cursor: "pointer", fontWeight: 700, fontSize: 14, color: tc, textAlign: "left",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.18s",
                boxShadow: isWorn ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
              }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: isWorn ? isDark ? "#fff" : "#1a1a1a" : "transparent", border: "2px solid " + (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.18)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isWorn ? isDark ? "#000" : "#fff" : "transparent", flexShrink: 0, transition: "all 0.2s" }}>✓</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- SHARED COMPONENTS ----
function BalanceBadge({ balance, dark }: { balance: number; dark: boolean }) {
  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 1000,
      background: "linear-gradient(135deg, #FBBF24, #D97706)",
      borderRadius: 20, padding: "8px 18px",
      boxShadow: "0 4px 20px rgba(217,119,6,0.45)",
      display: "flex", alignItems: "center", gap: 7,
      fontWeight: 900, fontSize: 17, color: "#78350F",
    }}>
      💰 <span>${balance}</span>
    </div>
  );
}

function NotifBar({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return (
    <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {error && (
        <div style={{
          background: "linear-gradient(135deg, #DC2626, #EF4444)",
          color: "#fff", padding: "14px 28px", borderRadius: 16, fontWeight: 800, fontSize: 16,
          boxShadow: "0 8px 32px rgba(220,38,38,0.45)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap",
        }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div style={{
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          color: "#fff", padding: "14px 28px", borderRadius: 16, fontWeight: 800, fontSize: 16,
          boxShadow: "0 8px 32px rgba(22,163,74,0.45)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap",
        }}>
          {success}
        </div>
      )}
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8) translateY(-10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function MenuBtn({ onClick, emoji, label, primary, dark, accent, gold }: {
  onClick: () => void; emoji: string; label: string; primary: boolean;
  dark: boolean; accent?: boolean; gold?: boolean;
}) {
  const bg = gold
    ? "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)"
    : accent
    ? dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)"
    : primary
    ? dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"
    : "transparent";
  const color = gold ? "#78350F" : dark ? "#fff" : "#1a1a1a";
  const border = gold ? "none" : dark ? "2px solid rgba(255,255,255,0.3)" : "2px solid rgba(0,0,0,0.12)";

  return (
    <button onClick={onClick} style={{
      padding: "16px 44px", borderRadius: 18, border, background: bg,
      cursor: "pointer", fontWeight: 800, fontSize: 17, color,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      minWidth: 260, transition: "all 0.2s",
      boxShadow: gold ? "0 6px 28px rgba(217,119,6,0.4)" : primary ? "0 4px 20px rgba(0,0,0,0.12)" : "none",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      <span style={{ fontSize: 20 }}>{emoji}</span>{label}
    </button>
  );
}