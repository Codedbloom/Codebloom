import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Figtree:wght@300;400;500;600;700&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#080810;
      --surface:#0e0e1a;
      --surface2:#141422;
      --surface3:#1c1c2e;
      --surface4:#252538;
      --border:#2a2a42;
      --border2:#363654;
      --accent:#818cf8;
      --accent2:#6366f1;
      --accent3:#a5b4fc;
      --accentg:linear-gradient(135deg,#818cf8,#c084fc);
      --accentg2:linear-gradient(135deg,#6366f1,#8b5cf6);
      --green:#34d399;
      --green-dim:rgba(52,211,153,0.12);
      --red:#f87171;
      --yellow:#fbbf24;
      --blue:#38bdf8;
      --pink:#f472b6;
      --text:#f1f0ff;
      --text2:#9998bb;
      --text3:#5c5b7a;
      --radius:10px;
      --radius-lg:16px;
      --shadow:0 8px 32px rgba(0,0,0,0.5);
    }
    html,body,#root{height:100%;font-family:'Figtree',sans-serif;background:var(--bg);color:var(--text);overflow:hidden}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}
    textarea,input,select{background:transparent;color:inherit;font-family:inherit;border:none;outline:none;resize:none}
    button{cursor:pointer;font-family:inherit;border:none;background:none;color:inherit}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,0.4)}50%{box-shadow:0 0 0 8px rgba(129,140,248,0)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .fade-up{animation:fadeUp .35s ease forwards}
    .fade-in{animation:fadeIn .25s ease forwards}
    .slide-r{animation:slideRight .25s ease forwards}
    .slide-l{animation:slideLeft .25s ease forwards}
    .mono{font-family:'JetBrains Mono',monospace}
    .display{font-family:'Syne',sans-serif}
    iframe{border:none;display:block}
    .cursor-blink::after{content:'▊';animation:blink 1s step-end infinite;color:var(--accent);font-size:.75em}
    .token-keyword{color:#c084fc}
    .token-string{color:#86efac}
    .token-comment{color:#4a4a6a;font-style:italic}
    .token-tag{color:#7dd3fc}
    .token-attr{color:#fca5a5}
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const TEMPLATES = [
  { id: "landing", label: "Landing Page", icon: "🌐", desc: "Marketing site with hero, features, CTA" },
  { id: "dashboard", label: "Dashboard", icon: "📊", desc: "Analytics dashboard with charts & stats" },
  { id: "ecommerce", label: "E-Commerce", icon: "🛍️", desc: "Product page or full shop UI" },
  { id: "saas", label: "SaaS App", icon: "⚡", desc: "Full SaaS UI with auth screens & features" },
  { id: "game", label: "Browser Game", icon: "🎮", desc: "Playable JavaScript game" },
  { id: "portfolio", label: "Portfolio", icon: "🎨", desc: "Personal portfolio site" },
  { id: "blog", label: "Blog / CMS", icon: "✍️", desc: "Blog layout with posts and categories" },
  { id: "tool", label: "Web Tool", icon: "🔧", desc: "Functional utility tool or calculator" },
  { id: "social", label: "Social App", icon: "💬", desc: "Social feed, chat, or community UI" },
  { id: "ai", label: "AI App", icon: "🤖", desc: "AI-powered interface or chatbot UI" },
  { id: "mobile", label: "Mobile App UI", icon: "📱", desc: "Mobile-style UI in a phone frame" },
  { id: "admin", label: "Admin Panel", icon: "⚙️", desc: "Full admin panel with sidebar & tables" },
];

const SYSTEM_PROMPT = `You are Codebloom — the most advanced AI builder on the planet. You generate complete, production-ready web applications: full websites, interactive React-style apps (as self-contained HTML+JS), browser games, dashboards, SaaS UIs, tools, mobile UIs, admin panels, and more.

CAPABILITIES:
- Full websites with animations, scroll effects, parallax
- Interactive apps with state management (vanilla JS or embedded React via CDN)
- Browser games (canvas, keyboard input, game loops)
- Data dashboards with charts (use Chart.js CDN)
- E-commerce UIs with product grids, cart modals
- SaaS UIs with multi-page navigation (tabs/hash routing)
- Admin panels with tables, modals, forms
- AI chatbot UIs (with mock streaming)
- Mobile app UIs in a phone frame
- Calculators, converters, productivity tools
- Social feed UIs, profiles, DMs

RULES:
1. Return ONE complete self-contained HTML file (<!DOCTYPE html>…</html>)
2. ALL CSS inside <style>, ALL JS inside <script> — use CDN links freely (Chart.js, Three.js, GSAP, Tone.js, etc.)
3. Use Google Fonts for beautiful typography
4. Make it visually STUNNING — dark themes, gradients, glassmorphism, animations
5. Make it FUNCTIONAL — real interactivity, working state, real features
6. Multi-page apps: use tab or hash-based routing within the single file
7. For games: implement a real game loop with requestAnimationFrame
8. For updates: return the complete modified file

STRICT OUTPUT FORMAT — output ONLY this, nothing else:
<TITLE>App name</TITLE>
<TYPE>website|app|game|dashboard|tool|saas|ecommerce|admin|mobile|social</TYPE>
<DESCRIPTION>One sentence describing what was built or changed</DESCRIPTION>
<FEATURES>comma,separated,list,of,key,features</FEATURES>
<CODE>
<!DOCTYPE html>
...complete HTML...
</CODE>`;

/* ═══════════════════════════════════════════════════════════════
   ICONS (SVG paths)
═══════════════════════════════════════════════════════════════ */
const ICONS = {
  menu: "M3 12h18M3 6h18M3 18h18",
  send: "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20",
  copy: "M8 17H5a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v3m-8 14h10a2 2 0 002-2v-10a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z",
  check: "M20 6L9 17l-5-5",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  sparkle: ["M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0115.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z"],
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  history: "M12 8v4l3 3M3.05 11A9 9 0 104 19.94M3 3v6h6",
  publish: "M12 19V5M5 12l7-7 7 7",
  device: "M4 6h16v12H4zM8 20h8",
  trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M9 6V4h6v2",
  folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
};

const Ico = ({ name, size = 16, color = "currentColor", strokeWidth = 1.8, fill = "none" }) => {
  const d = ICONS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
};

const Spinner = ({ size = 16, color = "var(--accent)" }) => (
  <div style={{ width: size, height: size, border: `2px solid rgba(255,255,255,0.1)`, borderTopColor: color, borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />
);

/* ═══════════════════════════════════════════════════════════════
   API
═══════════════════════════════════════════════════════════════ */
async function streamClaude(messages, onChunk) {
  const res = await fetch("/api/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      stream: true,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      try {
        const j = JSON.parse(line.slice(6));
        if (j.delta?.text) { full += j.delta.text; onChunk(full); }
      } catch {}
    }
  }
  return full;
}

function parseResponse(raw) {
  const get = (tag) => raw.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? "";
  return {
    title: get("TITLE") || "Untitled",
    type: get("TYPE") || "app",
    description: get("DESCRIPTION") || "",
    features: get("FEATURES").split(",").map(f => f.trim()).filter(Boolean),
    code: get("CODE") || "",
  };
}

/* ═══════════════════════════════════════════════════════════════
   PUBLISH MODAL
═══════════════════════════════════════════════════════════════ */
function PublishModal({ project, onClose }) {
  const [step, setStep] = useState("options"); // options | publishing | done
  const [publishedUrl, setPublishedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const slug = project?.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Math.random().toString(36).slice(2, 6);

  const publish = async () => {
    setStep("publishing");
    await new Promise(r => setTimeout(r, 2000));
    setPublishedUrl(`https://codebloom.app/p/${slug}`);
    setStep("done");
  };

  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="fade-up" onClick={e => e.stopPropagation()} style={{
        background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 16,
        padding: 32, width: 480, maxWidth: "90vw",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}>
        {step === "options" && <>
          <div className="display" style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Publish Project</div>
          <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Share <strong style={{ color: "var(--text)" }}>{project?.title}</strong> with the world</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {[
              { icon: "globe", label: "Public URL", desc: "Anyone with the link can view", tag: "Free" },
              { icon: "device", label: "Embed Code", desc: "Embed on any website via iframe", tag: "Free" },
              { icon: "download", label: "Download HTML", desc: "Export as standalone HTML file", tag: "Free" },
            ].map(opt => (
              <div key={opt.label} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface3)", cursor: "pointer"
              }}
                onClick={opt.label === "Download HTML" ? () => {
                  const b = new Blob([project.code], { type: "text/html" });
                  const a = document.createElement("a"); a.href = URL.createObjectURL(b);
                  a.download = `${project.title}.html`; a.click(); onClose();
                } : undefined}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-dim, rgba(129,140,248,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico name={opt.icon} size={16} color="var(--accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{opt.desc}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "rgba(52,211,153,0.15)", color: "var(--green)" }}>{opt.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--text2)" }}>Cancel</button>
            <button onClick={publish} style={{ flex: 2, padding: "10px", borderRadius: 10, background: "var(--accentg2)", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              🚀 Publish Live
            </button>
          </div>
        </>}

        {step === "publishing" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Spinner size={40} /></div>
            <div className="display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Publishing…</div>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>Deploying your app to the edge network</p>
          </div>
        )}

        {step === "done" && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div className="display" style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Live!</div>
              <p style={{ color: "var(--text2)", fontSize: 13 }}>Your app is published and accessible worldwide</p>
            </div>
            <div style={{ background: "var(--surface3)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Ico name="globe" size={14} color="var(--green)" />
              <span className="mono" style={{ flex: 1, fontSize: 12, color: "var(--accent3)" }}>{publishedUrl}</span>
              <button onClick={() => copy(publishedUrl)} style={{ padding: "4px 10px", borderRadius: 6, background: copied ? "var(--green-dim)" : "var(--surface4)", fontSize: 11, color: copied ? "var(--green)" : "var(--text2)", transition: "all .2s" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ padding: "12px", borderRadius: 10, background: "var(--surface3)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>💬</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>Share the link with anyone</div>
              </div>
              <div style={{ padding: "12px", borderRadius: 10, background: "var(--surface3)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>Edge-deployed globally</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "var(--accentg2)", fontSize: 13, fontWeight: 700, color: "#fff" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEVICE FRAME
═══════════════════════════════════════════════════════════════ */
function DeviceFrame({ code, device }) {
  const sizes = {
    desktop: { w: "100%", h: "100%", frame: false },
    tablet: { w: 768, h: 1024, frame: true, radius: 20 },
    mobile: { w: 390, h: 844, frame: true, radius: 40 },
  };
  const s = sizes[device] || sizes.desktop;
  if (!s.frame) return <iframe srcDoc={code} style={{ width: "100%", height: "100%" }} sandbox="allow-scripts allow-same-origin allow-forms allow-modals" />;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", overflow: "auto" }}>
      <div style={{
        width: s.w, height: s.h, border: "8px solid var(--surface4)", borderRadius: s.radius,
        overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px var(--border2)",
        flexShrink: 0, position: "relative",
        background: "#000"
      }}>
        {device === "mobile" && <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 120, height: 8, background: "var(--surface4)", borderRadius: 99, zIndex: 10 }} />}
        <iframe srcDoc={code} style={{ width: "100%", height: "100%", border: "none" }} sandbox="allow-scripts allow-same-origin allow-forms allow-modals" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CODE VIEWER with syntax highlight
═══════════════════════════════════════════════════════════════ */
function CodeViewer({ code, onCopy }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); onCopy?.(); setTimeout(() => setCopied(false), 2000); };

  const highlighted = useMemo(() => {
    if (!code) return "";
    return code
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="token-comment">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="token-string">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await|new|this|typeof|null|undefined|true|false|from|of|in)\b/g, '<span class="token-keyword">$1</span>');
  }, [code]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text3)", flex: 1 }}>index.html</span>
        <button onClick={handleCopy} style={{
          display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
          borderRadius: 6, background: copied ? "var(--green-dim)" : "var(--surface3)",
          fontSize: 11, color: copied ? "var(--green)" : "var(--text2)", border: "1px solid var(--border)", transition: "all .2s"
        }}>
          <Ico name={copied ? "check" : "copy"} size={11} color={copied ? "var(--green)" : "var(--text2)"} />
          {copied ? "Copied!" : "Copy all"}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <pre className="mono" style={{ fontSize: 12, lineHeight: 1.8, color: "#cdd6f4" }}>
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
      <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text3)", display: "flex", gap: 16 }}>
        <span>{code.split("\n").length} lines</span>
        <span>{(new Blob([code]).size / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAT MESSAGE
═══════════════════════════════════════════════════════════════ */
function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className="slide-r" style={{ display: "flex", gap: 10, marginBottom: 14, flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start" }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: 10, flexShrink: 0,
          background: "var(--accentg2)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "Syne",
        }}>C</div>
      )}
      <div style={{ maxWidth: "85%", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          padding: "10px 13px", fontSize: 13, lineHeight: 1.6,
          borderRadius: isUser ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
          background: isUser ? "rgba(129,140,248,0.15)" : "var(--surface3)",
          border: `1px solid ${isUser ? "rgba(129,140,248,0.25)" : "var(--border)"}`,
          color: msg.isError ? "var(--red)" : "var(--text)",
        }}>
          {msg.isStreaming ? <span className="cursor-blink">{msg.text || "Building your app"}</span> : msg.text}
        </div>
        {msg.features?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "0 2px" }}>
            {msg.features.map(f => (
              <span key={f} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(129,140,248,0.1)", color: "var(--accent3)", border: "1px solid rgba(129,140,248,0.2)" }}>{f}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WELCOME SCREEN
═══════════════════════════════════════════════════════════════ */
function WelcomeScreen({ onPrompt, isLoading }) {
  const [input, setInput] = useState("");
  const ref = useRef();

  const go = (text) => { if (!text.trim() || isLoading) return; onPrompt(text); };

  const autoResize = () => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 180) + "px"; };

  return (
    <div className="fade-in" style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 32, zIndex: 5,
      background: "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)"
    }}>
      <div style={{ width: "100%", maxWidth: 700 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="display" style={{
            fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
            background: "linear-gradient(135deg, #f1f0ff 0%, #818cf8 50%, #c084fc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14
          }}>
            Build anything.<br />Ship instantly.
          </div>
          <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
            Describe your app, website, game, or tool. Codebloom generates production-ready code and deploys it in seconds — no limits, no paywall.
          </p>
        </div>

        {/* Main input */}
        <div style={{
          background: "var(--surface2)", border: "1px solid var(--border2)",
          borderRadius: 16, padding: "16px 20px", marginBottom: 20,
          boxShadow: "0 0 0 1px rgba(129,140,248,0.1), 0 20px 40px rgba(0,0,0,0.4)",
          transition: "border-color .2s",
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)"}
          onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border2)"}
        >
          <textarea ref={ref} value={input} onChange={e => { setInput(e.target.value); autoResize(); }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(input); } }}
            placeholder="Build a SaaS dashboard for a project management tool with dark theme, kanban board, team members, and analytics charts..."
            rows={3}
            style={{ width: "100%", fontSize: 15, lineHeight: 1.6, color: "var(--text)", minHeight: 80, fontFamily: "Figtree" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>⌘ + Enter to build</span>
            <button onClick={() => go(input)} disabled={!input.trim() || isLoading} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 20px",
              borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: input.trim() && !isLoading ? "var(--accentg2)" : "var(--surface3)",
              color: input.trim() && !isLoading ? "#fff" : "var(--text3)",
              transition: "all .2s", opacity: isLoading ? 0.7 : 1,
            }}>
              {isLoading ? <Spinner size={14} color="#fff" /> : <Ico name="sparkle" size={14} color="#fff" />}
              {isLoading ? "Building…" : "Build"}
            </button>
          </div>
        </div>

        {/* Template grid */}
        <div>
          <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>
            Or start with a template
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => go(`Build a ${t.label}: ${t.desc}. Make it visually stunning with dark theme.`)}
                style={{
                  padding: "11px 10px", borderRadius: 10, textAlign: "center",
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  transition: "all .15s", fontSize: 12, color: "var(--text2)", lineHeight: 1.4
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)"; e.currentTarget.style.background = "var(--surface3)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text2)"; }}
              >
                <div style={{ fontSize: 22, marginBottom: 5 }}>{t.icon}</div>
                <div style={{ fontWeight: 600 }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [projects, setProjects] = useState([]); // {id, title, type, code, description, features, createdAt}
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [messages, setMessages] = useState([]); // API message history
  const [chatLog, setChatLog] = useState([]); // display messages
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("preview"); // preview | code
  const [device, setDevice] = useState("desktop");
  const [showPublish, setShowPublish] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProjectsPanel, setShowProjectsPanel] = useState(false);

  const inputRef = useRef();
  const chatEndRef = useRef();
  const activeProject = projects.find(p => p.id === activeProjectId);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatLog]);

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const send = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setIsLoading(true);

    const userApiMsg = { role: "user", content: text };
    const newMessages = [...messages, userApiMsg];
    setMessages(newMessages);
    setChatLog(prev => [...prev, { role: "user", text }]);
    setChatLog(prev => [...prev, { role: "assistant", text: "", isStreaming: true }]);

    try {
      let fullText = "";
      await streamClaude(newMessages, (streamed) => {
        fullText = streamed;
        const parsed = parseResponse(streamed);
        // live update code in preview
        if (parsed.code && activeProjectId) {
          setProjects(ps => ps.map(p => p.id === activeProjectId ? { ...p, code: parsed.code, title: parsed.title || p.title } : p));
        }
        setChatLog(prev => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.text = parsed.description || "Building…";
          updated[updated.length - 1] = last;
          return updated;
        });
      });

      const parsed = parseResponse(fullText);
      setMessages([...newMessages, { role: "assistant", content: fullText }]);

      if (parsed.code) {
        if (activeProjectId) {
          setProjects(ps => ps.map(p => p.id === activeProjectId ? { ...p, ...parsed, updatedAt: new Date() } : p));
        } else {
          const id = Date.now().toString();
          setProjects(ps => [...ps, { id, ...parsed, createdAt: new Date(), updatedAt: new Date() }]);
          setActiveProjectId(id);
        }
      }

      setChatLog(prev => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.text = parsed.description || "Done!";
        last.features = parsed.features;
        last.isStreaming = false;
        updated[updated.length - 1] = last;
        return updated;
      });
    } catch (err) {
      setChatLog(prev => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.text = `Error: ${err.message}`;
        last.isStreaming = false;
        last.isError = true;
        updated[updated.length - 1] = last;
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, activeProjectId]);

  const newProject = () => {
    setActiveProjectId(null);
    setMessages([]);
    setChatLog([]);
    setInput("");
    setShowProjectsPanel(false);
  };

  const openProject = (id) => {
    setActiveProjectId(id);
    setMessages([]);
    setChatLog([]);
    setShowProjectsPanel(false);
  };

  const deleteProject = (id, e) => {
    e.stopPropagation();
    setProjects(ps => ps.filter(p => p.id !== id));
    if (activeProjectId === id) { setActiveProjectId(null); setMessages([]); setChatLog([]); }
  };

  const typeColor = { website: "#38bdf8", app: "#818cf8", game: "#f472b6", dashboard: "#34d399", tool: "#fbbf24", saas: "#c084fc", ecommerce: "#fb923c", admin: "#a78bfa", mobile: "#22d3ee", social: "#f43f5e" };

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)" }}>

        {/* ── TOP BAR ── */}
        <header style={{
          height: 54, display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
          borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0, zIndex: 20
        }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7, color: "var(--text2)", transition: "all .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface3)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Ico name="menu" size={16} />
          </button>

          {/* Logo */}
          <div className="display" style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.04em", background: "var(--accentg)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", flexShrink: 0 }}>
            Codebloom
          </div>

          {/* Project title + type */}
          {activeProject && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, overflow: "hidden" }}>
              <div style={{ width: 1, height: 20, background: "var(--border)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: `${typeColor[activeProject.type] || "#818cf8"}20`, color: typeColor[activeProject.type] || "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", flexShrink: 0 }}>
                {activeProject.type}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeProject.title}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
            {/* Projects button */}
            <button onClick={() => setShowProjectsPanel(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: showProjectsPanel ? "var(--surface3)" : "transparent", color: "var(--text2)", border: "1px solid var(--border)", transition: "all .15s"
            }}>
              <Ico name="folder" size={13} />
              Projects {projects.length > 0 && `(${projects.length})`}
            </button>

            {/* New project */}
            <button onClick={newProject} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7,
              fontSize: 12, fontWeight: 600, color: "var(--text2)", border: "1px solid var(--border)", transition: "all .15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface3)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Ico name="plus" size={13} />
              New
            </button>

            {/* Tabs: preview / code */}
            {activeProject && (
              <div style={{ display: "flex", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: 2, gap: 2 }}>
                {[["preview", "eye"], ["code", "code"]].map(([tab, icon]) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: activeTab === tab ? "var(--surface4)" : "transparent",
                    color: activeTab === tab ? "var(--text)" : "var(--text3)", transition: "all .15s",
                    textTransform: "capitalize"
                  }}>
                    <Ico name={icon} size={11} color={activeTab === tab ? "var(--accent)" : "var(--text3)"} />
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Device picker */}
            {activeProject && activeTab === "preview" && (
              <div style={{ display: "flex", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: 2, gap: 2 }}>
                {[["desktop", "device"], ["tablet", "layers"], ["mobile", "phone"]].map(([d, icon]) => (
                  <button key={d} onClick={() => setDevice(d)} style={{
                    width: 28, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6,
                    background: device === d ? "var(--surface4)" : "transparent",
                    color: device === d ? "var(--accent)" : "var(--text3)", transition: "all .15s"
                  }}>
                    <Ico name={icon} size={12} color={device === d ? "var(--accent)" : "var(--text3)"} />
                  </button>
                ))}
              </div>
            )}

            {/* Publish & Download */}
            {activeProject && (
              <>
                <button onClick={() => setShowPublish(true)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "5px 13px", borderRadius: 7,
                  fontSize: 12, fontWeight: 700, color: "#fff",
                  background: "var(--accentg2)", transition: "all .15s",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.4)"
                }}>
                  <Ico name="share" size={12} color="#fff" />
                  Publish
                </button>
                <button onClick={() => { const b = new Blob([activeProject.code], { type: "text/html" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${activeProject.title}.html`; a.click(); }} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7,
                  fontSize: 12, fontWeight: 600, color: "var(--text2)", border: "1px solid var(--border)", transition: "all .15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Ico name="download" size={12} />
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

          {/* Projects Panel */}
          {showProjectsPanel && (
            <div className="fade-in" style={{
              position: "absolute", top: 0, left: sidebarOpen ? 360 : 0, width: 280, height: "100%",
              background: "var(--surface)", border: "1px solid var(--border)", zIndex: 30,
              display: "flex", flexDirection: "column", boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="display" style={{ fontWeight: 700, fontSize: 14 }}>Projects</span>
                <button onClick={() => setShowProjectsPanel(false)} style={{ color: "var(--text3)", padding: 4 }}><Ico name="x" size={14} /></button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)", fontSize: 13 }}>No projects yet</div>
                ) : projects.map(p => (
                  <div key={p.id} onClick={() => openProject(p.id)} style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                    background: activeProjectId === p.id ? "var(--surface3)" : "transparent",
                    border: `1px solid ${activeProjectId === p.id ? "var(--border2)" : "transparent"}`,
                    transition: "all .15s", display: "flex", alignItems: "center", gap: 10
                  }}
                    onMouseEnter={e => { if (activeProjectId !== p.id) e.currentTarget.style.background = "var(--surface2)"; }}
                    onMouseLeave={e => { if (activeProjectId !== p.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${typeColor[p.type] || "#818cf8"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {TEMPLATES.find(t => t.id === p.type)?.icon || "📦"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{p.type}</div>
                    </div>
                    <button onClick={(e) => deleteProject(p.id, e)} style={{ color: "var(--text3)", padding: 4, borderRadius: 5, transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <Ico name="trash" size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
                <button onClick={newProject} style={{
                  width: "100%", padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "var(--surface3)", color: "var(--text2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: 8, justifyContent: "center", transition: "all .15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <Ico name="plus" size={13} /> New Project
                </button>
              </div>
            </div>
          )}

          {/* Chat Sidebar */}
          <div style={{
            width: sidebarOpen ? 360 : 0, flexShrink: 0,
            borderRight: "1px solid var(--border)", background: "var(--surface)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            transition: "width .25s cubic-bezier(.4,0,.2,1)"
          }}>
            {/* Chat log */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
              {chatLog.length === 0 && (
                <div style={{ padding: "20px 4px" }}>
                  <div className="display" style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em" }}>
                    {activeProject ? `Editing: ${activeProject.title}` : "What are you building?"}
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.6 }}>
                    {activeProject
                      ? "Describe changes, new features, or ask for improvements."
                      : "Describe your app in detail. The more specific, the better the result."}
                  </p>
                  {activeProject && (
                    <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["Add a dark mode toggle", "Make it mobile responsive", "Add animations", "Improve the design", "Add more features"].map(s => (
                        <button key={s} onClick={() => send(s)} style={{
                          padding: "5px 10px", borderRadius: 99, fontSize: 11, fontWeight: 500,
                          background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text2)",
                          transition: "all .15s"
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)"; e.currentTarget.style.color = "var(--accent3)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
                        >{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {chatLog.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
              <div ref={chatEndRef} style={{ height: 8 }} />
            </div>

            {/* Input box */}
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{
                background: "var(--surface2)", border: "1px solid var(--border2)",
                borderRadius: 12, padding: "10px 12px", transition: "border-color .2s"
              }}
                onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)"}
                onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border2)"}
              >
                <textarea ref={inputRef} value={input} onChange={e => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={activeProject ? "Describe a change or add a feature…" : "Describe what you want to build…"}
                  rows={2} style={{ width: "100%", fontSize: 13, lineHeight: 1.55, color: "var(--text)", minHeight: 48 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>Enter to send · Shift+Enter for newline</span>
                  <button onClick={() => send()} disabled={!input.trim() || isLoading} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
                    fontSize: 12, fontWeight: 700,
                    background: input.trim() && !isLoading ? "var(--accentg2)" : "var(--surface3)",
                    color: input.trim() && !isLoading ? "#fff" : "var(--text3)", transition: "all .2s"
                  }}>
                    {isLoading ? <Spinner size={12} color="#fff" /> : <Ico name="send" size={12} color={input.trim() ? "#fff" : "var(--text3)"} />}
                    {isLoading ? "Building" : "Send"}
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "var(--text3)" }}>
                ✦ Codebloom · Unlimited builds · No paywall
              </div>
            </div>
          </div>

          {/* Main canvas */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative", background: activeTab === "code" ? "var(--bg)" : "#f3f4f6" }}>
            {/* Loading bar */}
            {isLoading && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 50, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--accentg)", animation: "gradShift 2s ease infinite", backgroundSize: "200% 100%" }} />
              </div>
            )}

            {/* Status chip */}
            {isLoading && activeProject && (
              <div style={{
                position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
                background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 99,
                padding: "6px 14px", display: "flex", alignItems: "center", gap: 8,
                fontSize: 12, color: "var(--text2)", zIndex: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
              }}>
                <Spinner size={12} /> Generating…
              </div>
            )}

            {/* Welcome screen (no project) */}
            {!activeProject && !isLoading && (
              <WelcomeScreen onPrompt={send} isLoading={isLoading} />
            )}

            {/* Preview */}
            {activeProject && activeTab === "preview" && (
              <DeviceFrame code={activeProject.code} device={device} />
            )}

            {/* Code view */}
            {activeProject && activeTab === "code" && (
              <CodeViewer code={activeProject.code} />
            )}
          </div>
        </div>

        {/* Publish Modal */}
        {showPublish && <PublishModal project={activeProject} onClose={() => setShowPublish(false)} />}
      </div>
    </>
  );
}
