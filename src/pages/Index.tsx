import { useState } from "react";

type Screen = "menu" | "game" | "settings";
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

type ClothingItem =
  | "scarf"
  | "jacket"
  | "hat"
  | "tshirt"
  | "tanktop"
  | "hoodie"
  | "trackpants";

const CLOTHING_BUTTONS: { id: ClothingItem; label: string }[] = [
  { id: "scarf", label: "🧣 Одеть шарф" },
  { id: "jacket", label: "🧥 Одеть куртку" },
  { id: "hat", label: "🎩 Одеть шапку" },
  { id: "tshirt", label: "👕 Одеть футболку" },
  { id: "tanktop", label: "👔 Одеть майку" },
  { id: "hoodie", label: "🥼 Одеть кофту" },
  { id: "trackpants", label: "👖 Одеть трико" },
];

// ---- HELL STYLE COLORS ----
const HELL_COLORS: Record<ClothingItem, string> = {
  scarf: "#B91C1C",
  jacket: "#7F1D1D",
  hat: "#991B1B",
  tshirt: "#DC2626",
  tanktop: "#EF4444",
  hoodie: "#450A0A",
  trackpants: "#6B0000",
};

// ---- SNOW STYLE COLORS ----
const SNOW_COLORS: Record<ClothingItem, string> = {
  scarf: "#BAE6FD",
  jacket: "#DBEAFE",
  hat: "#E0F2FE",
  tshirt: "#F0F9FF",
  tanktop: "#EFF6FF",
  hoodie: "#BFDBFE",
  trackpants: "#93C5FD",
};

// ---- SVG MANNEQUIN ----
function Mannequin({
  worn,
  style,
}: {
  worn: Set<ClothingItem>;
  style: ClothingStyle;
}) {
  const colors = style === "hell" ? HELL_COLORS : SNOW_COLORS;
  const skin = style === "hell" ? "#C77C3C" : "#F9CFAD";
  const eyeColor = style === "hell" ? "#FF4500" : "#4A90D9";
  const hairColor = style === "hell" ? "#1A0000" : "#F5E6CA";

  return (
    <svg
      width="220"
      height="420"
      viewBox="0 0 220 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
    >
      {/* === LEGS / TRACKPANTS === */}
      {worn.has("trackpants") ? (
        <>
          <rect x="62" y="260" width="38" height="130" rx="12" fill={colors.trackpants} />
          <rect x="118" y="260" width="38" height="130" rx="12" fill={colors.trackpants} />
          {/* stripe */}
          <rect x="76" y="260" width="6" height="130" rx="3" fill="rgba(255,255,255,0.25)" />
          <rect x="132" y="260" width="6" height="130" rx="3" fill="rgba(255,255,255,0.25)" />
        </>
      ) : (
        <>
          <rect x="62" y="260" width="38" height="130" rx="12" fill={skin} />
          <rect x="118" y="260" width="38" height="130" rx="12" fill={skin} />
        </>
      )}

      {/* === BODY === */}
      {/* Base body */}
      <rect x="58" y="148" width="104" height="118" rx="18" fill={skin} />

      {/* T-SHIRT */}
      {worn.has("tshirt") && (
        <>
          <rect x="58" y="148" width="104" height="100" rx="18" fill={colors.tshirt} />
          {/* collar */}
          <path d="M90 148 Q110 165 130 148" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none" />
        </>
      )}

      {/* TANK TOP */}
      {worn.has("tanktop") && (
        <>
          <rect x="68" y="148" width="84" height="100" rx="12" fill={colors.tanktop} />
          <rect x="68" y="148" width="84" height="8" rx="4" fill="rgba(0,0,0,0.1)" />
        </>
      )}

      {/* HOODIE */}
      {worn.has("hoodie") && (
        <>
          <rect x="55" y="148" width="110" height="110" rx="18" fill={colors.hoodie} />
          {/* pocket */}
          <rect x="90" y="220" width="40" height="22" rx="8" fill="rgba(0,0,0,0.2)" />
          {/* zip */}
          <rect x="108" y="155" width="4" height="60" rx="2" fill="rgba(0,0,0,0.25)" />
        </>
      )}

      {/* JACKET */}
      {worn.has("jacket") && (
        <>
          <rect x="50" y="145" width="120" height="118" rx="18" fill={colors.jacket} />
          {/* lapels */}
          <path d="M110 155 L88 185 L110 175 L132 185 Z" fill="rgba(0,0,0,0.25)" />
          {/* buttons */}
          <circle cx="110" cy="195" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="110" cy="215" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="110" cy="235" r="4" fill="rgba(255,255,255,0.4)" />
          {/* pockets */}
          <rect x="62" y="225" width="28" height="18" rx="6" fill="rgba(0,0,0,0.2)" />
          <rect x="130" y="225" width="28" height="18" rx="6" fill="rgba(0,0,0,0.2)" />
        </>
      )}

      {/* === ARMS === */}
      <rect x="18" y="148" width="40" height="100" rx="16" fill={skin} />
      <rect x="162" y="148" width="40" height="100" rx="16" fill={skin} />

      {/* Jacket sleeves */}
      {worn.has("jacket") && (
        <>
          <rect x="14" y="145" width="46" height="108" rx="16" fill={colors.jacket} />
          <rect x="160" y="145" width="46" height="108" rx="16" fill={colors.jacket} />
          {/* cuffs */}
          <rect x="14" y="240" width="46" height="12" rx="6" fill="rgba(0,0,0,0.25)" />
          <rect x="160" y="240" width="46" height="12" rx="6" fill="rgba(0,0,0,0.25)" />
        </>
      )}

      {/* Hoodie sleeves */}
      {worn.has("hoodie") && !worn.has("jacket") && (
        <>
          <rect x="16" y="148" width="42" height="104" rx="16" fill={colors.hoodie} />
          <rect x="162" y="148" width="42" height="104" rx="16" fill={colors.hoodie} />
        </>
      )}

      {/* T-shirt sleeves */}
      {worn.has("tshirt") && !worn.has("jacket") && !worn.has("hoodie") && (
        <>
          <rect x="20" y="148" width="38" height="60" rx="14" fill={colors.tshirt} />
          <rect x="162" y="148" width="38" height="60" rx="14" fill={colors.tshirt} />
        </>
      )}

      {/* === SCARF === */}
      {worn.has("scarf") && (
        <>
          <rect x="72" y="128" width="76" height="30" rx="14" fill={colors.scarf} />
          {/* folds */}
          <rect x="72" y="135" width="76" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
          {/* hanging end */}
          <rect x="78" y="152" width="20" height="50" rx="8" fill={colors.scarf} />
        </>
      )}

      {/* === NECK === */}
      <rect x="92" y="118" width="36" height="36" rx="10" fill={skin} />

      {/* === HEAD === */}
      <ellipse cx="110" cy="90" rx="48" ry="56" fill={skin} />

      {/* hair */}
      {style === "snow" ? (
        <ellipse cx="110" cy="50" rx="48" ry="22" fill={hairColor} />
      ) : (
        <>
          <ellipse cx="110" cy="46" rx="48" ry="20" fill={hairColor} />
          {/* hellish horns */}
          <polygon points="80,52 70,20 92,45" fill="#8B0000" />
          <polygon points="140,52 150,20 128,45" fill="#8B0000" />
        </>
      )}

      {/* eyes */}
      <ellipse cx="94" cy="88" rx="7" ry="8" fill="white" />
      <ellipse cx="126" cy="88" rx="7" ry="8" fill="white" />
      <ellipse cx="94" cy="90" rx="4" ry="5" fill={eyeColor} />
      <ellipse cx="126" cy="90" rx="4" ry="5" fill={eyeColor} />
      <ellipse cx="95" cy="89" rx="1.5" ry="2" fill="#111" />
      <ellipse cx="127" cy="89" rx="1.5" ry="2" fill="#111" />

      {/* eyebrows */}
      <path
        d={style === "hell" ? "M86 78 Q94 72 102 78" : "M86 80 Q94 76 102 80"}
        stroke="#5A3010"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={style === "hell" ? "M118 78 Q126 72 134 78" : "M118 80 Q126 76 134 80"}
        stroke="#5A3010"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* mouth */}
      {style === "hell" ? (
        <path d="M100 108 Q110 102 120 108" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M100 108 Q110 115 120 108" stroke="#C17060" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* nose */}
      <ellipse cx="110" cy="99" rx="4" ry="3" fill="rgba(0,0,0,0.08)" />

      {/* === HAT === */}
      {worn.has("hat") && (
        <>
          {style === "hell" ? (
            // Devil crown / dark hat
            <>
              <rect x="66" y="38" width="88" height="46" rx="8" fill={colors.hat} />
              <rect x="52" y="44" width="116" height="14" rx="6" fill="#6B0000" />
              {/* flames on hat */}
              <path d="M75 38 Q80 18 85 38" fill="#FF4500" />
              <path d="M95 38 Q100 12 105 38" fill="#FF6500" />
              <path d="M115 38 Q120 18 125 38" fill="#FF4500" />
            </>
          ) : (
            // Snow hat / beanie
            <>
              <ellipse cx="110" cy="46" rx="52" ry="16" fill={colors.hat} />
              <rect x="62" y="32" width="96" height="36" rx="18" fill={colors.hat} />
              <ellipse cx="110" cy="34" rx="20" ry="16" fill="white" />
              {/* pompom */}
              <circle cx="110" cy="20" r="12" fill="white" />
              <circle cx="110" cy="20" r="8" fill="#DBEAFE" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

// ---- MAIN COMPONENT ----
export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>("snow");
  const [bgColor, setBgColor] = useState<BgColor>("lime");
  const [worn, setWorn] = useState<Set<ClothingItem>>(new Set());

  const toggleClothing = (item: ClothingItem) => {
    setWorn((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const bg = BG_COLORS[bgColor];
  const isDarkBg = bgColor === "purple" || bgColor === "red";
  const textColor = isDarkBg ? "#fff" : "#1a1a1a";
  const subtextColor = isDarkBg ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)";

  // ---- MENU ----
  if (screen === "menu") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', sans-serif",
          transition: "background 0.4s",
        }}
      >
        <div
          style={{
            background: isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
            backdropFilter: "blur(12px)",
            borderRadius: 32,
            padding: "56px 64px",
            textAlign: "center",
            boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            border: isDarkBg ? "1.5px solid rgba(255,255,255,0.2)" : "1.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 8 }}>🧍</div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: textColor,
              margin: "0 0 8px",
              letterSpacing: -1,
            }}
          >
            Одевалка
          </h1>
          <p style={{ color: subtextColor, fontSize: 16, marginBottom: 48 }}>
            Одень манекена по своему вкусу!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MenuButton
              onClick={() => setScreen("game")}
              icon="🎮"
              label="Играть"
              primary
              dark={isDarkBg}
            />
            <MenuButton
              onClick={() => setScreen("settings")}
              icon="⚙️"
              label="Настройки"
              primary={false}
              dark={isDarkBg}
            />
          </div>
        </div>
      </div>
    );
  }

  // ---- SETTINGS ----
  if (screen === "settings") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', sans-serif",
          transition: "background 0.4s",
          padding: 24,
        }}
      >
        <div
          style={{
            background: isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
            backdropFilter: "blur(12px)",
            borderRadius: 32,
            padding: "48px 56px",
            width: "100%",
            maxWidth: 520,
            boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            border: isDarkBg ? "1.5px solid rgba(255,255,255,0.2)" : "1.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: textColor,
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            ⚙️ Настройки
          </h2>
          <p style={{ textAlign: "center", color: subtextColor, marginBottom: 36, fontSize: 14 }}>
            Настрой стиль и цвет под себя
          </p>

          {/* --- Style --- */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ color: subtextColor, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Стиль одежды
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              {(["hell", "snow"] as ClothingStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setClothingStyle(s)}
                  style={{
                    flex: 1,
                    padding: "16px 12px",
                    borderRadius: 18,
                    border: clothingStyle === s
                      ? "2.5px solid " + (isDarkBg ? "#fff" : "#1a1a1a")
                      : "2px solid " + (isDarkBg ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)"),
                    background: clothingStyle === s
                      ? isDarkBg ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)"
                      : isDarkBg ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 15,
                    color: textColor,
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{s === "hell" ? "🔥" : "❄️"}</span>
                  {s === "hell" ? "Адский" : "Снежный"}
                </button>
              ))}
            </div>
          </div>

          {/* --- BG Color --- */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ color: subtextColor, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Цвет фона
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {(Object.keys(BG_COLORS) as BgColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  style={{
                    padding: "14px 12px",
                    borderRadius: 16,
                    border: bgColor === c
                      ? "3px solid " + (isDarkBg ? "#fff" : "#1a1a1a")
                      : "2px solid rgba(0,0,0,0.08)",
                    background: BG_COLORS[c],
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 14,
                    color: c === "purple" || c === "red" ? "#fff" : "#1a1a1a",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: bgColor === c ? "0 0 0 3px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {bgColor === c && <span>✓</span>}
                  {BG_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen("menu")}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 16,
              border: isDarkBg ? "2px solid rgba(255,255,255,0.4)" : "2px solid rgba(0,0,0,0.15)",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 15,
              color: textColor,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = isDarkBg
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            ← Назад в меню
          </button>
        </div>
      </div>
    );
  }

  // ---- GAME ----
  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        fontFamily: "'Segoe UI', sans-serif",
        transition: "background 0.4s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px",
          background: isDarkBg ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)",
          backdropFilter: "blur(10px)",
          borderBottom: isDarkBg ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => setScreen("menu")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 700,
            color: textColor,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Меню
        </button>
        <span style={{ fontWeight: 900, fontSize: 20, color: textColor }}>
          🧍 Одевалка
        </span>
        <button
          onClick={() => setWorn(new Set())}
          style={{
            background: isDarkBg ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
            border: "none",
            borderRadius: 10,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: textColor,
          }}
        >
          🗑 Снять всё
        </button>
      </header>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 0,
          alignItems: "stretch",
          padding: "24px",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT: Mannequin */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              background: isDarkBg ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.55)",
              borderRadius: 32,
              padding: "32px 40px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: isDarkBg ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Mannequin worn={worn} style={clothingStyle} />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
                maxWidth: 240,
              }}
            >
              {worn.size === 0 ? (
                <span style={{ fontSize: 13, color: subtextColor }}>Пока ничего не надето</span>
              ) : (
                Array.from(worn).map((item) => {
                  const btn = CLOTHING_BUTTONS.find((b) => b.id === item);
                  return (
                    <span
                      key={item}
                      style={{
                        background: isDarkBg ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: textColor,
                      }}
                    >
                      {btn?.label.split(" ").slice(1).join(" ")}
                    </span>
                  );
                })
              )}
            </div>
          </div>
          <p style={{ fontSize: 13, color: subtextColor, fontWeight: 600 }}>
            Стиль: {clothingStyle === "hell" ? "🔥 Адский" : "❄️ Снежный"}
          </p>
        </div>

        {/* RIGHT: Clothing Buttons */}
        <div
          style={{
            width: 260,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
            paddingLeft: 24,
          }}
        >
          <h3
            style={{
              color: textColor,
              fontWeight: 900,
              fontSize: 18,
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            Одежда
          </h3>
          {CLOTHING_BUTTONS.map(({ id, label }) => {
            const isWorn = worn.has(id);
            return (
              <button
                key={id}
                onClick={() => toggleClothing(id)}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 16,
                  border: isWorn
                    ? "2.5px solid " + (isDarkBg ? "#fff" : "#1a1a1a")
                    : "2px solid " + (isDarkBg ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"),
                  background: isWorn
                    ? isDarkBg
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(0,0,0,0.13)"
                    : isDarkBg
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  color: textColor,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.18s",
                  boxShadow: isWorn ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isWorn) {
                    (e.currentTarget as HTMLElement).style.background = isDarkBg
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.9)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isWorn
                    ? isDarkBg
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(0,0,0,0.13)"
                    : isDarkBg
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: isWorn
                      ? isDarkBg ? "#fff" : "#1a1a1a"
                      : "transparent",
                    border: "2px solid " + (isDarkBg ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: isWorn ? (isDarkBg ? "#000" : "#fff") : "transparent",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  ✓
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- MENU BUTTON ----
function MenuButton({
  onClick,
  icon,
  label,
  primary,
  dark,
}: {
  onClick: () => void;
  icon: string;
  label: string;
  primary: boolean;
  dark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 48px",
        borderRadius: 18,
        border: primary
          ? "none"
          : dark
          ? "2px solid rgba(255,255,255,0.4)"
          : "2px solid rgba(0,0,0,0.15)",
        background: primary
          ? dark
            ? "rgba(255,255,255,0.25)"
            : "rgba(0,0,0,0.15)"
          : "transparent",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 18,
        color: dark ? "#fff" : "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transition: "all 0.2s",
        minWidth: 240,
        boxShadow: primary ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = primary
          ? "0 4px 20px rgba(0,0,0,0.15)"
          : "none";
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      {label}
    </button>
  );
}
