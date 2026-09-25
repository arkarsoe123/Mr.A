import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Headphones, Keyboard, MessageCircle, Mic2, MoreHorizontal, PanelLeft, Send, Settings2, Sparkles, UserRound, Volume2, Waves, X, Zap } from "lucide-react";

const characterImage = "/Mr.A/ai-character-myanmar-traditional.png";
const quickPrompts = ["မိတ်ဆက်ပေးပါ", "ဒီနေ့ ဘာလုပ်ရမလဲ?", "Website အကြောင်းပြောပါ"];
const starterMessages = [
  { from: "ai", text: "မင်္ဂလာပါ။ ကျွန်တော်က Mr.A ပါ။ ဒီနေ့ ဘာကူညီပေးရမလဲ?" },
  { from: "ai", text: "စကားပြောနိုင်တဲ့ AI companion အဖြစ် အခုကတည်းက သင်နဲ့အတူရှိနေပါတယ်။" },
];

export default function Home() {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState("");
  const [motionOn, setMotionOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [activeNav, setActiveNav] = useState("Chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentMessage = useMemo(() => messages[messages.length - 1], [messages]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = (text = currentMessage?.text ?? "မင်္ဂလာပါ။") => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "my-MM"; voice.rate = 0.9; voice.pitch = 1;
    voice.onstart = () => setSpeaking(true); voice.onend = () => setSpeaking(false); voice.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(voice);
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setMessages((items) => [...items, { from: "user", text: value }, { from: "ai", text: "နားလည်ပါပြီ။ ဒီအကြောင်းကို နောက်ထပ်အသေးစိတ် ကူညီပေးဖို့ အဆင်သင့်ပါ။" }]);
    setDraft("");
  };

  const selectPrompt = (prompt: string) => { setDraft(prompt); setTimeout(() => document.getElementById("chat-input")?.focus(), 0); };

  return (
    <div className="companion-app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand"><span className="mr-mark">Mr.<b>A</b></span><span className="brand-sub">AI VIRTUAL CHARACTER</span></div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={17} /></button>
        <div className="character-mini"><div className="mini-avatar"><img src={characterImage} alt="Mr.A character" /></div><div><strong>Mr.A</strong><span><i /> online now</span></div></div>
        <nav className="main-nav" aria-label="Character modes">
          {[{ label: "Talk", icon: Mic2 }, { label: "Listen", icon: Headphones }, { label: "Chat", icon: MessageCircle }, { label: "Support", icon: Zap }].map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}><Icon size={18} /><span>{label}</span>{activeNav === label && <span className="nav-pip" />}</button>)}
        </nav>
        <div className="always-card"><div className="always-icon"><Sparkles size={16} /></div><div><strong>Always with you</strong><span>Ready when you are</span></div><Check size={15} /></div>
        <div className="sidebar-bottom"><button><Settings2 size={16} /> Settings</button><button><UserRound size={16} /> My profile</button></div>
      </aside>
      {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <section className="workspace">
        <header className="workspace-header"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><PanelLeft size={20} /></button><div className="header-title"><span className="live-dot" /><span>Mr.A</span><small>Personal AI companion</small></div><div className="header-actions"><span className="secure-label"><Check size={13} /> private session</span><button aria-label="More options"><MoreHorizontal size={20} /></button></div></header>
        <div className="workspace-grid">
          <section className="character-column">
            <div className="character-heading"><div><span className="section-kicker">YOUR AI COMPANION</span><h1>မင်္ဂလာပါ၊ <em>ကျွန်တော် Mr.A ပါ။</em></h1><p>သင်နဲ့ စကားပြောဖို့ အဆင်သင့်ဖြစ်နေပါတယ်။</p></div><span className="mode-badge"><Waves size={13} /> {activeNav} mode</span></div>
            <div className={`portrait-stage ${motionOn ? "moving" : "still"} ${speaking ? "speaking" : ""}`}><div className="stage-grid" /><div className="portrait-orbit orbit-a" /><div className="portrait-orbit orbit-b" /><div className="portrait-label label-top"><span className="live-dot" /> online / ready</div><img src={characterImage} alt="မြန်မာဝတ်စုံဝတ်ထားသော Mr.A AI virtual character" /><div className="portrait-copy"><span className="script-burmese">မင်္ဂလာပါ</span><small>YOUR PERSONAL AI COMPANION</small></div><div className="voice-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></div>
            <div className="portrait-controls"><button className={motionOn ? "selected" : ""} onClick={() => setMotionOn(!motionOn)}><Sparkles size={15} /> {motionOn ? "Natural motion" : "Motion paused"}</button><button className={speaking ? "selected" : ""} onClick={() => speak()}><Volume2 size={15} /> {speaking ? "Speaking..." : "Voice preview"}</button><button onClick={() => setActiveNav("Talk")}><Mic2 size={15} /> Talk to Mr.A</button></div>
          </section>

          <section className="chat-column" aria-label="AI chat screen"><div className="chat-card"><div className="chat-card-header"><div><span className="section-kicker">LIVE CONVERSATION</span><h2>Mr.A နဲ့ စကားပြောမယ်</h2></div><button className="header-icon" aria-label="Chat settings"><Settings2 size={17} /></button></div><div className="chat-history"><div className="chat-date">TODAY · 10:42 AM</div>{messages.map((message, index) => <div className={`message-row ${message.from}`} key={`${message.text}-${index}`}><div className="message-avatar">{message.from === "ai" ? <Sparkles size={13} /> : <UserRound size={13} />}</div><div className="message-bubble">{message.text}{message.from === "ai" && <button className="bubble-speak" onClick={() => speak(message.text)} aria-label="Read message aloud"><Volume2 size={13} /></button>}</div></div>)}{speaking && <div className="typing-row"><span /><span /><span /> Mr.A is speaking</div>}</div><div className="quick-prompts"><span>QUICK START</span>{quickPrompts.map((prompt) => <button key={prompt} onClick={() => selectPrompt(prompt)}>{prompt}<ChevronDown size={12} /></button>)}</div><form className="chat-composer" onSubmit={sendMessage}><button type="button" className="composer-icon" aria-label="Voice input"><Mic2 size={18} /></button><input id="chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Mr.A ကို မေးလိုတာ ရေးပါ..." aria-label="Message Mr.A" /><button type="submit" className="send-button" aria-label="Send message"><Send size={16} /></button></form><div className="composer-note"><Keyboard size={12} /> Enter to send <span>·</span> <span>AI companion prototype</span></div></div><div className="chat-footer"><span><Check size={13} /> End-to-end private by design</span><span>Mr.A v0.1</span></div></section>
        </div>
        <div className="feature-strip"><div><span className="feature-icon"><Mic2 size={16} /></span><div><strong>Talk naturally</strong><small>Voice-ready conversation</small></div></div><div><span className="feature-icon"><Sparkles size={16} /></span><div><strong>See expressions</strong><small>Natural character motion</small></div></div><div><span className="feature-icon"><Waves size={16} /></span><div><strong>Always learning</strong><small>Ready for your next upgrade</small></div></div></div>
        <footer className="app-footer"><span>Mr.<b>A</b> · Your personal AI companion</span><span>Designed for a more human web</span></footer>
      </section>
    </div>
  );
}
