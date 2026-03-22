import { useState, useRef, useCallback, useEffect } from "react";

// ---- TYPES ----
type Tab = "clicker" | "shop" | "business";

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: "food" | "phone";
  desc: string;
}

// ---- DATA ----
const SHOP_ITEMS: ShopItem[] = [
  { id: "chips", name: "Чипсы Лейс", emoji: "🥔", price: 10, type: "food", desc: "Хрустящие картофельные чипсы" },
  { id: "iphone", name: "Айфон", emoji: "📱", price: 500, type: "phone", desc: "Смартфон Apple последней модели" },
  { id: "cola", name: "Кока-Кола", emoji: "🥤", price: 50, type: "food", desc: "Освежающий газированный напиток" },
  { id: "apple", name: "Яблоко", emoji: "🍎", price: 1, type: "food", desc: "Свежее сочное яблоко" },
  { id: "seeds", name: "Семечки", emoji: "🌻", price: 10, type: "food", desc: "Жареные подсолнечные семечки" },
  { id: "carrot", name: "Морковка", emoji: "🥕", price: 20, type: "food", desc: "Свежая хрустящая морковка" },
];

const STATUS_TIERS = [
  { min: 0,      label: "Бедный",       emoji: "😢", color: "#6B7280", earn: 10   },
  { min: 100,    label: "Нормальный",   emoji: "😐", color: "#3B82F6", earn: 20   },
  { min: 1000,   label: "Богатый",      emoji: "😎", color: "#10B981", earn: 50   },
  { min: 10000,  label: "Супер богатый",emoji: "🤑", color: "#F59E0B", earn: 100  },
  { min: 100000, label: "Миллионер",    emoji: "🏆", color: "#8B5CF6", earn: 1111 },
];

// Автобизнесы
interface Business {
  id: string;
  name: string;
  emoji: string;
  price: number;
  income: number; // $ в секунду
  desc: string;
}
const BUSINESSES: Business[] = [
  { id: "lemonade", name: "Ларёк лимонада",  emoji: "🍋", price: 500,    income: 2,   desc: "+$2/сек" },
  { id: "cafe",     name: "Кафе",             emoji: "☕", price: 5000,   income: 15,  desc: "+$15/сек" },
  { id: "shop",     name: "Магазин",          emoji: "🏪", price: 50000,  income: 100, desc: "+$100/сек" },
  { id: "factory",  name: "Завод",            emoji: "🏭", price: 500000, income: 800, desc: "+$800/сек" },
];

const THRESHOLDS = [100, 1000, 10000, 100000, 1000000];
const THRESHOLD_LABELS = ["100$\nБедный", "1 000$\nНормальный", "10 000$\nБогатый", "100 000$\nСупер богатый", "1 000 000$\nМиллионер"];

function getStatus(balance: number) {
  let tier = STATUS_TIERS[0];
  for (const t of STATUS_TIERS) { if (balance >= t.min) tier = t; }
  return tier;
}

// ---- FLOATING TEXT ----
interface FloatText { id: number; x: number; y: number; text: string; color: string; }

// ---- COMPONENT ----
export default function Index() {
  const [tab, setTab] = useState<Tab>("clicker");
  const [balance, setBalance] = useState(0);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [iphoneOwned, setIphoneOwned] = useState(false);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [chomping, setChomping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [ownedBusinesses, setOwnedBusinesses] = useState<Set<string>>(new Set());
  const [prevStatusLabel, setPrevStatusLabel] = useState("Бедный");
  const floatId = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const balanceRef = useRef(0);
  balanceRef.current = balance;

  const showToast = useCallback((text: string, color: string) => {
    setToast({ text, color });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Следим за сменой статуса
  useEffect(() => {
    const s = getStatus(balance);
    if (s.label !== prevStatusLabel) {
      showToast(`🎉 Новый статус: ${s.emoji} ${s.label}! Теперь +$${s.earn} за клик!`, s.color);
      setPrevStatusLabel(s.label);
    }
  }, [balance, prevStatusLabel, showToast]);

  // Автодоход от бизнесов
  useEffect(() => {
    if (ownedBusinesses.size === 0) return;
    const interval = setInterval(() => {
      let total = 0;
      ownedBusinesses.forEach(id => {
        const b = BUSINESSES.find(b => b.id === id);
        if (b) total += b.income;
      });
      if (total > 0) setBalance(p => p + total);
    }, 1000);
    return () => clearInterval(interval);
  }, [ownedBusinesses]);

  const status = getStatus(balance);

  const earn = (e: React.MouseEvent<HTMLButtonElement>) => {
    const amount = status.earn;
    setBalance(p => p + amount);
    setClickCount(p => p + 1);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = floatId.current++;
    const x = e.clientX - rect.left + (Math.random() - 0.5) * 60;
    const y = e.clientY - rect.top - 20;
    setFloats(p => [...p, { id, x, y, text: `+$${amount}`, color: "#F59E0B" }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 900);
  };

  const buyBusiness = (b: Business) => {
    if (balance < b.price) { showToast(`❌ Не хватает $${(b.price - balance).toLocaleString()}`, "#EF4444"); return; }
    if (ownedBusinesses.has(b.id)) { showToast("Уже куплено!", "#6B7280"); return; }
    setBalance(p => p - b.price);
    setOwnedBusinesses(p => new Set([...p, b.id]));
    showToast(`🏢 «${b.name}» приносит ${b.desc}`, "#10B981");
  };

  const buy = (item: ShopItem) => {
    if (balance < item.price) {
      showToast(`❌ Не хватает $${item.price - balance}`, "#EF4444");
      return;
    }
    if (item.type === "phone") {
      if (iphoneOwned) { showToast("📱 Айфон уже есть!", "#6B7280"); return; }
      setBalance(p => p - item.price);
      setIphoneOwned(true);
      showToast("📱 Айфон куплен! Береги его...", "#3B82F6");
      return;
    }
    setBalance(p => p - item.price);
    setInventory(p => ({ ...p, [item.id]: (p[item.id] ?? 0) + 1 }));
    showToast(`✅ Куплено: ${item.emoji} ${item.name}`, "#10B981");
  };

  const eat = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId)!;
    setInventory(p => {
      const next = { ...p };
      if ((next[itemId] ?? 0) <= 1) {
        delete next[itemId];
      } else {
        next[itemId] = next[itemId] - 1;
      }
      return next;
    });
    setChomping(true);
    setTimeout(() => setChomping(false), 600);
    showToast(`😋 «${item.name}» съедено!`, "#10B981");
  };

  const smashPhone = () => {
    setIphoneOwned(false);
    setBalance(p => p - 50);
    showToast("💥 Айфон разбит! -$50", "#EF4444");
  };

  const foodItems = Object.entries(inventory).filter(([, qty]) => qty > 0);
  const maxThreshold = THRESHOLDS[THRESHOLDS.length - 1];
  const progressPct = Math.min(balance / maxThreshold, 1) * 100;
  const autoIncome = Array.from(ownedBusinesses).reduce((s, id) => {
    const b = BUSINESSES.find(b => b.id === id);
    return s + (b?.income ?? 0);
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 40 }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "12px 28px", borderRadius: 16,
          fontWeight: 800, fontSize: 16, zIndex: 9999,
          boxShadow: `0 8px 32px ${toast.color}88`,
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap",
        }}>
          {toast.text}
        </div>
      )}

      {/* HEADER */}
      <div style={{ width: "100%", maxWidth: 520, padding: "28px 20px 0", boxSizing: "border-box" }}>
        {/* Balance */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 36 }}>{status.emoji}</span>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Статус</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: status.color }}>{status.label}</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "10px 22px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>БАЛАНС</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#FBBF24" }}>${balance.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress bar with tiers */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 10, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, #FBBF24, ${status.color})`, borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {THRESHOLDS.map((t, i) => {
              const reached = balance >= t;
              return (
                <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: reached ? STATUS_TIERS[i + 1]?.color ?? "#8B5CF6" : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
                  <span style={{ fontSize: 9, color: reached ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                    {THRESHOLD_LABELS[i].split("\n").map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 4, marginBottom: 24, gap: 4 }}>
          {([
            { key: "clicker",  label: "💰 Клик" },
            { key: "shop",     label: "🛒 Магазин" },
            { key: "business", label: "🏢 Бизнес" },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "11px 6px", borderRadius: 12, border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: 13,
              background: tab === t.key ? "linear-gradient(135deg, #FBBF24, #D97706)" : "transparent",
              color: tab === t.key ? "#78350F" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s",
              boxShadow: tab === t.key ? "0 4px 16px rgba(217,119,6,0.4)" : "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- CLICKER TAB ---- */}
        {tab === "clicker" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            {/* Big earn button */}
            <div style={{ position: "relative" }}>
              <button
                ref={btnRef}
                onClick={earn}
                style={{
                  width: 200, height: 200, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: "linear-gradient(145deg, #FDE68A 0%, #FBBF24 35%, #D97706 70%, #B45309 100%)",
                  boxShadow: "0 0 0 8px rgba(251,191,36,0.15), 0 0 0 16px rgba(251,191,36,0.08), 0 12px 48px rgba(217,119,6,0.6), inset 0 4px 0 rgba(255,255,255,0.4), inset 0 -4px 0 rgba(0,0,0,0.2)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                  transition: "transform 0.1s, box-shadow 0.1s",
                  userSelect: "none",
                }}
                onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.94)"; }}
                onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                <span style={{ fontSize: 64, lineHeight: 1, filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}>💵</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#78350F", textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}>+${status.earn}</span>
              </button>
              {/* float texts */}
              {floats.map(f => (
                <div key={f.id} style={{ position: "absolute", left: f.x, top: f.y, pointerEvents: "none", fontSize: 20, fontWeight: 900, color: f.color, textShadow: "0 2px 8px rgba(0,0,0,0.4)", animation: "floatUp 0.9s ease-out forwards", zIndex: 10 }}>
                  {f.text}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
                Нажатий: <strong style={{ color: "rgba(255,255,255,0.7)" }}>{clickCount}</strong>
              </p>
              {autoIncome > 0 && (
                <div style={{ background: "rgba(16,185,129,0.15)", borderRadius: 12, padding: "5px 14px", border: "1px solid rgba(16,185,129,0.3)", fontSize: 13, fontWeight: 800, color: "#10B981" }}>
                  🏢 +${autoIncome}/сек
                </div>
              )}
            </div>
            {/* Status earn hint */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "10px 20px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Статус </span>
              <span style={{ fontSize: 13, fontWeight: 900, color: status.color }}>{status.emoji} {status.label}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}> → </span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#FBBF24" }}>+${status.earn} за клик</span>
              {STATUS_TIERS.findIndex(t => t.label === status.label) < STATUS_TIERS.length - 1 && (() => {
                const nextIdx = STATUS_TIERS.findIndex(t => t.label === status.label) + 1;
                const next = STATUS_TIERS[nextIdx];
                return <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>До «{next.label}»: ${(next.min - balance).toLocaleString()}</div>;
              })()}
            </div>

            {/* Inventory / items */}
            {(foodItems.length > 0 || iphoneOwned) && (
              <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ color: "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: 14, margin: "0 0 14px", letterSpacing: 1 }}>📦 ИНВЕНТАРЬ</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* iPhone */}
                  {iphoneOwned && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(59,130,246,0.15)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(59,130,246,0.3)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>📱</span>
                        <div>
                          <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>Айфон</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Смартфон Apple</div>
                        </div>
                      </div>
                      <button
                        onClick={smashPhone}
                        style={{
                          background: "linear-gradient(135deg, #3B82F6, #2563EB)", border: "none", borderRadius: 12,
                          padding: "9px 18px", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#fff",
                          boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
                      >
                        💥 Разбить (-$50)
                      </button>
                    </div>
                  )}
                  {/* Food items */}
                  {foodItems.map(([id, qty]) => {
                    const item = SHOP_ITEMS.find(i => i.id === id)!;
                    return (
                      <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(16,185,129,0.12)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(16,185,129,0.25)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 28 }}>{item.emoji}</span>
                          <div>
                            <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>× {qty} шт.</div>
                          </div>
                        </div>
                        <button
                          onClick={() => eat(id)}
                          style={{
                            background: "linear-gradient(135deg, #10B981, #059669)", border: "none", borderRadius: 12,
                            padding: "9px 18px", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#fff",
                            boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
                            transform: chomping ? "scale(0.92)" : "scale(1)",
                            transition: "transform 0.1s",
                          }}
                        >
                          😋 Съесть
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- BUSINESS TAB ---- */}
        {tab === "business" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 4 }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 4px" }}>Общий автодоход:</p>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>🏢 +${autoIncome}/сек</span>
              {autoIncome === 0 && <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginLeft: 10 }}>— купи бизнес!</span>}
            </div>
            {BUSINESSES.map(b => {
              const owned = ownedBusinesses.has(b.id);
              const canBuy = balance >= b.price;
              return (
                <div key={b.id} style={{
                  background: owned ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.06)",
                  borderRadius: 20, padding: "16px 20px",
                  border: owned ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ fontSize: 44, flexShrink: 0 }}>{b.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>{b.name}</div>
                    <div style={{ fontSize: 13, color: "#10B981", fontWeight: 700 }}>{b.desc}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#FBBF24", marginTop: 2 }}>${b.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => buyBusiness(b)}
                    disabled={owned}
                    style={{
                      padding: "11px 18px", borderRadius: 14, border: "none", cursor: owned ? "default" : "pointer",
                      fontWeight: 800, fontSize: 13, flexShrink: 0,
                      background: owned ? "rgba(16,185,129,0.3)" : canBuy ? "linear-gradient(135deg, #FBBF24, #D97706)" : "rgba(255,255,255,0.08)",
                      color: owned ? "#10B981" : canBuy ? "#78350F" : "rgba(255,255,255,0.4)",
                      boxShadow: canBuy && !owned ? "0 4px 16px rgba(217,119,6,0.35)" : "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!owned && canBuy) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  >
                    {owned ? "✓ Работает" : canBuy ? "Купить" : "Мало $"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- SHOP TAB ---- */}
        {tab === "shop" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SHOP_ITEMS.map(item => {
              const canBuy = balance >= item.price;
              const alreadyOwned = item.type === "phone" && iphoneOwned;
              return (
                <div key={item.id} style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 14,
                  transition: "background 0.2s",
                }}>
                  <div style={{ fontSize: 44, flexShrink: 0, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{item.desc}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#FBBF24" }}>${item.price}</div>
                  </div>
                  <button
                    onClick={() => buy(item)}
                    disabled={alreadyOwned}
                    style={{
                      padding: "11px 20px", borderRadius: 14, border: "none", cursor: alreadyOwned ? "default" : "pointer",
                      fontWeight: 800, fontSize: 14, flexShrink: 0,
                      background: alreadyOwned
                        ? "rgba(255,255,255,0.1)"
                        : canBuy
                        ? "linear-gradient(135deg, #FBBF24, #D97706)"
                        : "rgba(255,255,255,0.08)",
                      color: alreadyOwned ? "rgba(255,255,255,0.3)" : canBuy ? "#78350F" : "rgba(255,255,255,0.4)",
                      boxShadow: canBuy && !alreadyOwned ? "0 4px 16px rgba(217,119,6,0.4)" : "none",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!alreadyOwned && canBuy) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  >
                    {alreadyOwned ? "✓ Есть" : canBuy ? "🛒 Купить" : `Нужно $${item.price - balance} ещё`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(1.4); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.8) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}