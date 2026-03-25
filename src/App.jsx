import { useState, useRef, useEffect } from "react";

const FOOD_EMOJIS = ["🍕","🍣","🌮","🍜","🍔","🥗","🍛","🥩","🍱","🥘","🫕","🍝"];

function getEmoji(name) {
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return FOOD_EMOJIS[hash % FOOD_EMOJIS.length];
}

const pastelPairs = [
  ["#FFD6D6","#FF8A8A"],["#D6F0FF","#6BBCFF"],["#D6FFE4","#5FD68A"],
  ["#FFF3D6","#FFB347"],["#EFD6FF","#C06EFF"],["#FFD6F0","#FF6BC1"],
];
function getColor(name) {
  let hash = 0;
  for (let c of name) hash = (hash * 17 + c.charCodeAt(0)) & 0xff;
  return pastelPairs[hash % pastelPairs.length];
}

export default function App() {
  const [input, setInput] = useState("");
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem("restaurant-chooser-list");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [spinIdx, setSpinIdx] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem("restaurant-chooser-list", JSON.stringify(restaurants));
  }, [restaurants]);

  const addRestaurant = () => {
    const name = input.trim();
    if (!name || restaurants.includes(name)) return;
    setRestaurants(prev => [...prev, name]);
    setInput("");
    setWinner(null);
    inputRef.current?.focus();
  };

  const remove = (r) => {
    setRestaurants(prev => prev.filter(x => x !== r));
    if (winner === r) setWinner(null);
  };

  const spin = () => {
    if (restaurants.length < 2 || spinning) return;
    setWinner(null);
    setSpinning(true);
    let ticks = 0;
    const total = 18 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
      setSpinIdx(Math.floor(Math.random() * restaurants.length));
      ticks++;
      if (ticks >= total) {
        clearInterval(interval);
        const picked = restaurants[Math.floor(Math.random() * restaurants.length)];
        setSpinIdx(null);
        setWinner(picked);
        setSpinning(false);
      }
    }, 80);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") addRestaurant();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          background: #edd0ae;
          background-image:
            radial-gradient(circle at 15% 20%, #e0c69a 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, #8867b0 0%, transparent 40%),
            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23E8C8A0' opacity='0.4'/%3E%3C/svg%3E");
          font-family: 'DM Sans', sans-serif;
        }

        .app-wrap {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 16px 80px;
        }

        .card-main {
          width: 100%;
          max-width: 500px;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 8px 40px rgba(120,80,30,0.10), 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #d55737 0%, #FEB47B 100%);
          padding: 36px 32px 28px;
          text-align: center;
        }

        .header-emoji { font-size: 2.8rem; display: block; margin-bottom: 8px; }

        .header-title {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .header-sub {
          font-size: 0.90rem;
          color: rgba(15, 12, 12, 0.85);
          margin-top: 6px;
          letter-spacing: 0.3px;
        }

        .card-body { padding: 28px 28px 32px; }

        .add-row {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
        }

        .add-input {
          flex: 1;
          border: 2px solid #f2dec6;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #3A2E22;
          background: #FFF8F2;
          outline: none;
          transition: border-color 0.2s;
        }
        .add-input::placeholder { color: #e3c495; }
        .add-input:focus { border-color: #f87555; background: #fff; }

        .btn-add {
          background: #f8704d;
          color: #f0bfbf;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          line-height: 1;
        }
        .btn-add:hover { background: #e96a4a; }
        .btn-add:active { transform: scale(0.95); }

        .list-section { margin-bottom: 24px; }

        .empty-state {
          text-align: center;
          color: #ebcc9e;
          font-size: 0.9rem;
          padding: 18px 0 8px;
        }
        .empty-icon { font-size: 2rem; display: block; margin-bottom: 6px; }

        .resto-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .resto-list::-webkit-scrollbar { width: 4px; }
        .resto-list::-webkit-scrollbar-thumb { background: #f5d9b6; border-radius: 4px; }

        .resto-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 14px;
          padding: 10px 14px;
          border: 2.5px solid transparent;
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          cursor: default;
          position: relative;
        }
        .resto-pill.highlight {
          border-color: #ef6948 !important;
          transform: scale(1.025);
          box-shadow: 0 4px 18px rgba(249, 112, 78, 0.18);
        }

        .pill-emoji {
          font-size: 1.4rem;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pill-name {
          flex: 1;
          font-size: 0.97rem;
          font-weight: 500;
          color: #3A2E22;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pill-remove {
          background: none;
          border: none;
          color: #696154;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
          border-radius: 6px;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .pill-remove:hover { color: #0b0b0b; }

        .btn-spin {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #9b2359 0%, #e80d8d 100%);
          color: #f0ecee;
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(231, 49, 203, 0.35);
          letter-spacing: 0.2px;
        }
        .btn-spin:hover:not(:disabled) { opacity: 0.92; box-shadow: 0 6px 28px rgba(245, 112, 79, 0.45); }
        .btn-spin:active:not(:disabled) { transform: scale(0.98); }
        .btn-spin:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

        .winner-box {
          margin-top: 22px;
          border-radius: 18px;
          padding: 22px 24px;
          background: linear-gradient(135deg, #f0cdac 0%, #f695b6 100%);
          border: 2px solid #f4ad73;
          text-align: center;
          animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity:0; transform: scale(0.8) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .winner-label {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #ea7e50;
          margin-bottom: 6px;
        }
        .winner-name {
          font-family: 'Fraunces', serif;
          font-size: 1.7rem;
          font-weight: 700;
          color: #3b2f22;
          letter-spacing: -0.5px;
        }
        .winner-emoji { font-size: 2.2rem; display: block; margin-bottom: 4px; }
        .winner-sub { font-size: 0.95rem; color: #f7770f; margin-top: 4px; }

        .count-badge {
          display: inline-block;
          background: #FFF3E8;
          color: #f1804f;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 2px 10px;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="app-wrap">
        <div className="card-main">
          <div className="card-header">
            <span className="header-emoji">🍽️</span>
            <div className="header-title">What should we eat?</div>
            <div className="header-sub">Add your options, then let fate decide</div>
          </div>

          <div className="card-body">
            {/* Input row */}
            <div className="add-row">
              <input
                ref={inputRef}
                className="add-input"
                placeholder="Restaurant name…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                maxLength={50}
              />
              <button className="btn-add" onClick={addRestaurant} title="Add restaurant">＋</button>
            </div>

            {/* List */}
            <div className="list-section">
              {restaurants.length > 0 && (
                <div className="count-badge">{restaurants.length} place{restaurants.length !== 1 ? "s" : ""} in the mix</div>
              )}
              {restaurants.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🗺️</span>
                  Add at least 2 restaurants to get started
                </div>
              ) : (
                <div className="resto-list">
                  {restaurants.map((r, i) => {
                    const [bg, accent] = getColor(r);
                    const emoji = getEmoji(r);
                    return (
                      <div
                        key={r}
                        className={`resto-pill${spinIdx === i ? " highlight" : ""}`}
                        style={{ background: bg, borderColor: spinIdx === i ? undefined : bg }}
                      >
                        <div className="pill-emoji" style={{ background: accent + "33" }}>{emoji}</div>
                        <span className="pill-name">{r}</span>
                        <button className="pill-remove" onClick={() => remove(r)} title="Remove">✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              className="btn-spin"
              onClick={spin}
              disabled={restaurants.length < 2 || spinning}
            >
              {spinning ? "🎲 Deciding…" : "🎲 Pick for me!"}
            </button>

            {/* Winner */}
            {winner && !spinning && (
              <div className="winner-box">
                <div className="winner-label">Tonight's pick</div>
                <span className="winner-emoji">{getEmoji(winner)}</span>
                <div className="winner-name">{winner}</div>
                <div className="winner-sub">Enjoy your meal! 🎉</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}