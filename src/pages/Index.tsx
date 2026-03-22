import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  color: string;
  specs: string;
}

interface CartItem extends Product {
  cartId: number;
}

interface Notification {
  id: number;
  name: string;
}

interface DeliveryItem extends CartItem {
  progress: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iPhone 13",
    price: 300,
    emoji: "📱",
    color: "#1d6fa4",
    specs: "6.1\" · A15 Bionic · 128GB",
  },
  {
    id: 2,
    name: "iPhone 14",
    price: 400,
    emoji: "📱",
    color: "#5856d6",
    specs: "6.1\" · A15 Bionic · 256GB",
  },
  {
    id: 3,
    name: "iPhone 17 Pro Max",
    price: 1000,
    emoji: "📱",
    color: "#bf5a00",
    specs: "6.9\" · A19 Pro · 512GB",
  },
];

let cartIdCounter = 1;
let notifIdCounter = 1;

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, cartId: cartIdCounter++ }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const buyAll = () => {
    if (cart.length === 0) return;
    const items = [...cart];
    setCart([]);
    setCartOpen(false);

    items.forEach((item, i) => {
      setTimeout(() => {
        const delivery: DeliveryItem = { ...item, progress: 0 };
        setDeliveries(prev => [...prev, delivery]);

        const start = Date.now();
        const duration = 5000;
        const interval = setInterval(() => {
          const elapsed = Date.now() - start;
          const prog = Math.min(elapsed / duration, 1);
          setDeliveries(prev =>
            prev.map(d => d.cartId === item.cartId ? { ...d, progress: prog } : d)
          );
          if (prog >= 1) {
            clearInterval(interval);
            setDeliveries(prev => prev.filter(d => d.cartId !== item.cartId));
            const notifId = notifIdCounter++;
            setNotifications(prev => [...prev, { id: notifId, name: item.name }]);
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notifId));
            }, 4000);
          }
        }, 50);
      }, i * 300);
    });
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "#e4001a",
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(228,0,26,0.3)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>DNS</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: 10, marginLeft: 2 }}>
            Цифровые технологии
          </span>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: cart.length > 0 ? "#fff" : "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: 12,
            padding: "8px 18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: cart.length > 0 ? "#e4001a" : "#fff",
            fontWeight: 800,
            fontSize: 15,
            transition: "all 0.2s",
          }}
        >
          <Icon name="ShoppingCart" size={20} />
          Корзина
          {cart.length > 0 && (
            <span style={{
              background: "#e4001a",
              color: "#fff",
              borderRadius: 99,
              padding: "1px 8px",
              fontSize: 13,
              fontWeight: 900,
            }}>{cart.length}</span>
          )}
        </button>
      </header>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "40px 32px",
        textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>
          ОФИЦИАЛЬНЫЙ ДИСТРИБЬЮТОР
        </p>
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0 }}>
          🍎 Apple iPhone
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginTop: 8 }}>
          Лучшие цены · Гарантия · Быстрая доставка
        </p>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", marginBottom: 24 }}>
          Смартфоны Apple
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                background: `linear-gradient(135deg, ${p.color}22 0%, ${p.color}44 100%)`,
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}>
                {p.emoji}
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 4, letterSpacing: 1 }}>APPLE</p>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{p.specs}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#e4001a" }}>${p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    style={{
                      background: "#e4001a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "10px 20px",
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 4px 16px rgba(228,0,26,0.3)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(228,0,26,0.45)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(228,0,26,0.3)";
                    }}
                  >
                    <Icon name="ShoppingCart" size={16} />
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliveries */}
      {deliveries.length > 0 && (
        <div style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 24px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", marginBottom: 16 }}>
            <Icon name="Truck" size={18} /> Доставка
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {deliveries.map(d => (
              <div key={d.cartId} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 15 }}>{d.name}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>
                    {Math.round(d.progress * 100)}%
                  </span>
                </div>
                <div style={{ background: "#f0f0f0", borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${d.progress * 100}%`,
                    background: "linear-gradient(90deg, #e4001a, #ff5533)",
                    borderRadius: 99,
                    transition: "width 0.05s linear",
                  }} />
                </div>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>🚚 Курьер уже в пути...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 200, backdropFilter: "blur(4px)",
          }}
          onClick={() => setCartOpen(false)}
        >
          <div
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: 380, background: "#fff",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
              display: "flex", flexDirection: "column",
              padding: 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 20, color: "#1a1a2e" }}>
                Корзина {cart.length > 0 && <span style={{ color: "#e4001a" }}>({cart.length})</span>}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 20, padding: 4 }}
              >
                <Icon name="X" size={22} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>Корзина пуста</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {cart.map(item => (
                    <div key={item.cartId} style={{
                      background: "#f8f8f8",
                      borderRadius: 14,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 32 }}>📱</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>{item.name}</p>
                        <p style={{ margin: 0, color: "#e4001a", fontWeight: 700, fontSize: 14 }}>${item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "#ccc", padding: 4,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#e4001a"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ccc"}
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{
                padding: "20px 24px",
                borderTop: "1px solid #f0f0f0",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: 16, alignItems: "center",
                }}>
                  <span style={{ fontWeight: 700, color: "#888", fontSize: 15 }}>Итого:</span>
                  <span style={{ fontWeight: 900, fontSize: 22, color: "#1a1a2e" }}>${total}</span>
                </div>
                <button
                  onClick={buyAll}
                  style={{
                    width: "100%",
                    height: 54,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #e4001a 0%, #ff3333 100%)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 17,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(228,0,26,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
                >
                  <Icon name="CreditCard" size={20} />
                  Оформить заказ
                </button>
                <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 10 }}>
                  🚚 Доставка ~5 секунд
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        pointerEvents: "none",
      }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              background: "linear-gradient(135deg, #00c853 0%, #00e676 100%)",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: 16,
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 8px 32px rgba(0,200,83,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 22 }}>✅</span>
            Успешно куплено! «{n.name}»
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
