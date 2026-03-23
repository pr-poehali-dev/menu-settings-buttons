import { useState, useEffect, useRef, useCallback } from "react";

type Screen = "menu" | "settings" | "game" | "gameover";
type BgColor = "black" | "gray" | "red";

const BG_STYLES: Record<BgColor, { bg: string; sky: string; ground: string }> = {
  black: {
    bg: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 60%, #16213e 100%)",
    sky: "#0a0a0f",
    ground: "#1a1a2e",
  },
  gray: {
    bg: "linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 60%, #3a3a3c 100%)",
    sky: "#1c1c1e",
    ground: "#2c2c2e",
  },
  red: {
    bg: "linear-gradient(180deg, #1a0000 0%, #3d0000 60%, #5c0000 100%)",
    sky: "#1a0000",
    ground: "#3d0000",
  },
};

const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const PIPE_WIDTH = 64;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const BIRD_SIZE = 36;
const GROUND_HEIGHT = 80;

interface Pipe {
  x: number;
  topH: number;
  passed: boolean;
}

interface GameState {
  birdY: number;
  birdVel: number;
  pipes: Pipe[];
  score: number;
  frame: number;
}

function createPipe(canvasW: number, canvasH: number): Pipe {
  const minH = 60;
  const maxH = canvasH - GROUND_HEIGHT - PIPE_GAP - minH;
  const topH = Math.random() * (maxH - minH) + minH;
  return { x: canvasW, topH, passed: false };
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [bg, setBg] = useState<BgColor>("black");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const aliveRef = useRef(true);

  useEffect(() => {
    setTimeout(() => setMenuVisible(true), 100);
  }, []);

  const stopGame = useCallback(() => {
    aliveRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    aliveRef.current = true;
    gameRef.current = {
      birdY: H / 2,
      birdVel: 0,
      pipes: [createPipe(W, H)],
      score: 0,
      frame: 0,
    };

    const handleJump = () => {
      if (!aliveRef.current) return;
      if (gameRef.current) gameRef.current.birdVel = JUMP_FORCE;
    };

    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") handleJump(); };
    const onTouch = () => handleJump();

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onTouch);

    const bgStyle = BG_STYLES[bg];
    const currentBg = bg;

    function draw() {
      if (!aliveRef.current) return;
      const gs = gameRef.current!;
      const ctx = canvas!.getContext("2d")!;

      gs.frame++;
      gs.birdVel += GRAVITY;
      gs.birdY += gs.birdVel;

      if (gs.pipes.length === 0 || gs.pipes[gs.pipes.length - 1].x < W - 280) {
        gs.pipes.push(createPipe(W, H));
      }

      let dead = false;
      const birdX = W * 0.25;
      const birdR = BIRD_SIZE / 2;

      gs.pipes = gs.pipes.filter(p => p.x + PIPE_WIDTH > -10);
      gs.pipes.forEach(p => {
        p.x -= PIPE_SPEED;
        if (!p.passed && p.x + PIPE_WIDTH < birdX - birdR) {
          p.passed = true;
          gs.score++;
          setScore(gs.score);
          setBestScore(prev => Math.max(prev, gs.score));
        }
        if (
          birdX + birdR > p.x + 6 && birdX - birdR < p.x + PIPE_WIDTH - 6 &&
          (gs.birdY - birdR < p.topH || gs.birdY + birdR > p.topH + PIPE_GAP)
        ) dead = true;
      });

      if (gs.birdY + birdR >= H - GROUND_HEIGHT || gs.birdY - birdR <= 0) dead = true;

      if (dead) {
        aliveRef.current = false;
        window.removeEventListener("keydown", onKey);
        canvas!.removeEventListener("pointerdown", onTouch);
        setScreen("gameover");
        return;
      }

      ctx.clearRect(0, 0, W, H);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, H - GROUND_HEIGHT);
      skyGrad.addColorStop(0, bgStyle.sky);
      skyGrad.addColorStop(1, bgStyle.ground);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H - GROUND_HEIGHT);

      const cloudAlpha = currentBg === "black" ? 0.04 : currentBg === "red" ? 0.06 : 0.05;
      ctx.fillStyle = `rgba(255,255,255,${cloudAlpha})`;
      for (let i = 0; i < 4; i++) {
        const cx = ((gs.frame * 0.3 + i * 180) % (W + 100)) - 50;
        const cy = 60 + i * 30;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 50, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      gs.pipes.forEach(p => {
        const pipeColor = currentBg === "red" ? "#7f0000" : currentBg === "gray" ? "#48484a" : "#0f3460";
        const pipeHighlight = currentBg === "red" ? "#b00000" : currentBg === "gray" ? "#636366" : "#1a5276";

        ctx.fillStyle = pipeColor;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_WIDTH, p.topH - 8, [0, 0, 8, 8]);
        ctx.fill();
        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(p.x + 6, 0, 8, p.topH - 8);

        ctx.fillStyle = pipeColor;
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH - 20, PIPE_WIDTH + 8, 20, [6, 6, 0, 0]);
        ctx.fill();

        ctx.fillStyle = pipeColor;
        ctx.beginPath();
        ctx.roundRect(p.x, p.topH + PIPE_GAP + 8, PIPE_WIDTH, H - (p.topH + PIPE_GAP + 8) - GROUND_HEIGHT, [8, 8, 0, 0]);
        ctx.fill();
        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(p.x + 6, p.topH + PIPE_GAP + 28, 8, H - (p.topH + PIPE_GAP + 28) - GROUND_HEIGHT);

        ctx.fillStyle = pipeColor;
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH + PIPE_GAP, PIPE_WIDTH + 8, 20, [0, 0, 6, 6]);
        ctx.fill();
      });

      const groundColor = currentBg === "red" ? "#2d0000" : currentBg === "gray" ? "#1c1c1e" : "#0d1b2a";
      const groundTop = currentBg === "red" ? "#4a0000" : currentBg === "gray" ? "#3a3a3c" : "#1a3a5c";
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, H - GROUND_HEIGHT, W, GROUND_HEIGHT);
      ctx.fillStyle = groundTop;
      ctx.fillRect(0, H - GROUND_HEIGHT, W, 6);

      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 2;
      const stripeOffset = (gs.frame * PIPE_SPEED) % 40;
      for (let sx = -stripeOffset; sx < W; sx += 40) {
        ctx.beginPath();
        ctx.moveTo(sx, H - GROUND_HEIGHT + 6);
        ctx.lineTo(sx + 20, H);
        ctx.stroke();
      }

      const birdAngle = Math.min(Math.max(gs.birdVel * 0.05, -0.4), 0.6);
      ctx.save();
      ctx.translate(birdX, gs.birdY);
      ctx.rotate(birdAngle);

      const shadow = ctx.createRadialGradient(2, 2, 2, 0, 0, birdR + 4);
      shadow.addColorStop(0, "rgba(0,0,0,0.4)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(2, 2, birdR + 4, 0, Math.PI * 2);
      ctx.fill();

      const bodyGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, birdR);
      bodyGrad.addColorStop(0, "#ffe066");
      bodyGrad.addColorStop(0.5, "#f4c430");
      bodyGrad.addColorStop(1, "#d4a017");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(0, 0, birdR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(8, -6, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(10, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(11, -7, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ff6b35";
      ctx.beginPath();
      ctx.moveTo(birdR - 4, 2);
      ctx.lineTo(birdR + 12, -2);
      ctx.lineTo(birdR + 12, 6);
      ctx.closePath();
      ctx.fill();

      const wingY = Math.sin(gs.frame * 0.3) * 4;
      ctx.fillStyle = "#d4a017";
      ctx.beginPath();
      ctx.ellipse(-4, wingY + 4, 14, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `bold 32px 'Orbitron', sans-serif`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8;
      ctx.fillText(String(gs.score), W / 2, 52);
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTouch);
    };
  }, [bg]);

  useEffect(() => {
    if (screen === "game") {
      const cleanup = startGame();
      return () => {
        stopGame();
        cleanup?.();
      };
    }
    return () => stopGame();
  }, [screen]);

  const bgTheme = BG_STYLES[bg];

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: bgTheme.bg }}
    >
      {screen === "menu" && (
        <div
          className="flex flex-col items-center gap-8"
          style={{
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="text-center mb-4">
            <div style={{ fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(244,196,48,0.6))" }}>🐦</div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 36,
                fontWeight: 900,
                color: "#f4c430",
                textShadow: "0 0 30px rgba(244,196,48,0.5), 0 4px 16px rgba(0,0,0,0.8)",
                letterSpacing: 2,
                marginTop: 12,
              }}
            >
              FLAPPY BIRD
            </h1>
            {bestScore > 0 && (
              <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Nunito', sans-serif", fontSize: 14, marginTop: 6 }}>
                Лучший счёт: {bestScore}
              </p>
            )}
          </div>

          <button
            onClick={() => setScreen("game")}
            style={{
              width: 260,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #f4c430 0%, #ff8c00 100%)",
              color: "#1a0000",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 22,
              fontWeight: 900,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(244,196,48,0.4), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              letterSpacing: 1,
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
              (e.target as HTMLElement).style.boxShadow = "0 14px 40px rgba(244,196,48,0.5), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
              (e.target as HTMLElement).style.boxShadow = "0 8px 32px rgba(244,196,48,0.4), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
          >
            ▶ ИГРАТЬ
          </button>

          <button
            onClick={() => setScreen("settings")}
            style={{
              width: 260,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
              letterSpacing: 1,
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.14)";
              (e.target as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = "translateY(0) scale(1)";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.target as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
            }}
          >
            ⚙ НАСТРОЙКИ
          </button>
        </div>
      )}

      {screen === "settings" && (
        <div
          className="flex flex-col items-center gap-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: "40px 48px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            minWidth: 320,
          }}
        >
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: 2,
            marginBottom: 8,
          }}>
            НАСТРОЙКИ
          </h2>

          <div className="w-full">
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 14, letterSpacing: 1 }}>
              ЦВЕТ ФОНА
            </p>
            <div className="flex flex-col gap-3">
              {([
                { key: "black" as const, label: "Чёрный", color: "#0a0a0f", accent: "#3a3a5c" },
                { key: "gray" as const, label: "Серый", color: "#2c2c2e", accent: "#636366" },
                { key: "red" as const, label: "Красный", color: "#3d0000", accent: "#b00000" },
              ]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setBg(opt.key)}
                  style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 14,
                    background: bg === opt.key
                      ? `linear-gradient(135deg, ${opt.color} 0%, ${opt.accent} 100%)`
                      : "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    border: bg === opt.key
                      ? `2px solid ${opt.accent}`
                      : "2px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    boxShadow: bg === opt.key ? `0 4px 20px ${opt.accent}55` : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: `linear-gradient(135deg, ${opt.color}, ${opt.accent})`,
                    border: "2px solid rgba(255,255,255,0.2)",
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  {opt.label}
                  {bg === opt.key && <span style={{ marginLeft: 4, fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen("menu")}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #f4c430 0%, #ff8c00 100%)",
              color: "#1a0000",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(244,196,48,0.35)",
              marginTop: 8,
              transition: "transform 0.15s ease",
              letterSpacing: 1,
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.transform = "translateY(-2px)"}
            onMouseLeave={e => (e.target as HTMLElement).style.transform = "translateY(0)"}
          >
            ← НАЗАД
          </button>
        </div>
      )}

      {(screen === "game" || screen === "gameover") && (
        <div style={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={420}
            height={620}
            style={{
              borderRadius: 24,
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.08)",
              display: "block",
              cursor: "pointer",
              touchAction: "none",
            }}
          />
          {screen === "gameover" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}>
              <div style={{ fontSize: 56 }}>💀</div>
              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 28,
                fontWeight: 900,
                color: "#f4c430",
                textShadow: "0 0 20px rgba(244,196,48,0.5)",
              }}>ИГРА ОКОНЧЕНА</h2>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
                  Счёт: <strong style={{ color: "#fff", fontSize: 22 }}>{score}</strong>
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                  Рекорд: {bestScore}
                </p>
              </div>
              <div className="flex flex-col gap-3" style={{ width: 220 }}>
                <button
                  onClick={() => setScreen("game")}
                  style={{
                    height: 52,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #f4c430 0%, #ff8c00 100%)",
                    color: "#1a0000",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 16,
                    fontWeight: 900,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(244,196,48,0.4)",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.target as HTMLElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.transform = "translateY(0)"}
                >
                  ▶ ЕЩЁ РАЗ
                </button>
                <button
                  onClick={() => setScreen("menu")}
                  style={{
                    height: 52,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    border: "2px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => (e.target as HTMLElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.transform = "translateY(0)"}
                >
                  ← МЕНЮ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
