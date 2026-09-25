import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Mic2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  Waves,
  Zap,
} from "lucide-react";
import { Button } from "../components/Button";

const characterImage = "/Mr.A/ai-character-myanmar-traditional.png";

const scriptOptions = [
  {
    label: "ကြိုဆိုစကား",
    text: "မင်္ဂလာပါ။ ကျွန်တော်က Mingalar AI ပါ။ သင့် website အတွေ့အကြုံကို ပိုကောင်းအောင် ကူညီပေးဖို့ ဒီမှာရှိပါတယ်။",
  },
  {
    label: "ဝန်ဆောင်မှုမေးရန်",
    text: "သင်ရှာဖွေနေတဲ့ ဝန်ဆောင်မှု ဒါမှမဟုတ် အချက်အလက်ကို ပြောပြပေးပါ။ အကောင်းဆုံးလမ်းညွှန်ချက်နဲ့ ပြန်လည်ကူညီပေးပါမယ်။",
  },
  {
    label: "အနာဂတ် mode",
    text: "နောင်မှာ ကျွန်တော်က စကားပြောခြင်း၊ အချိန်ဇယားစီမံခြင်းနဲ့ သင့်လုပ်ငန်းအတွက် တကယ်အသုံးဝင်တဲ့ assistant တစ်ယောက် ဖြစ်လာနိုင်ပါတယ်။",
  },
];

const roadmap = [
  { number: "01", title: "လက်ရှိ version", detail: "Natural motion · voice demo · responsive UI" },
  { number: "02", title: "Next upgrade", detail: "LLM chat · Burmese voice · memory" },
  { number: "03", title: "အပြည့်အစုံ", detail: "Tasks · integrations · custom knowledge" },
];

export default function Home() {
  const [motionOn, setMotionOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [activeScript, setActiveScript] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const selectedScript = useMemo(() => scriptOptions[activeScript], [activeScript]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(selectedScript.text);
    utterance.lang = "my-MM";
    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mingalar AI home">
          <span className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></span>
          <span>Mingalar<span className="brand-accent">AI</span></span>
        </a>

        <button className="mobile-menu" type="button" aria-label="Toggle menu" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${mobileNavOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          <a href="#character" onClick={() => setMobileNavOpen(false)}>ကာရိုက်တာ</a>
          <a href="#demo" onClick={() => setMobileNavOpen(false)}>Demo</a>
          <a href="#roadmap" onClick={() => setMobileNavOpen(false)}>Upgrade လမ်းကြောင်း</a>
          <Button className="nav-cta" onClick={scrollToDemo}>စမ်းကြည့်မယ် <ArrowRight size={15} /></Button>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" id="character">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> မြန်မာစကားပြော AI character</div>
            <h1>လူလိုနီးပါး<br /><em>တုံ့ပြန်ပေးမယ်။</em></h1>
            <p className="hero-description">သင့် website ရဲ့ အသံ၊ မျက်နှာနဲ့ ကိုယ်ပိုင် assistant ဖြစ်လာမယ့် Mingalar AI ကို အခုကတည်းက တည်ဆောက်ထားပါတယ်။</p>
            <div className="hero-actions">
              <Button className="primary-btn" onClick={scrollToDemo}>Live demo ကြည့်မယ် <ArrowRight size={17} /></Button>
              <a className="text-link" href="#roadmap">နောက်ထပ် ဘာတွေလုပ်နိုင်မလဲ <ChevronDown size={16} /></a>
            </div>
            <div className="hero-meta">
              <span><Check size={15} /> Mobile responsive</span>
              <span><Check size={15} /> Upgrade-ready</span>
              <span><Check size={15} /> Free deploy အတွက် ပြင်ဆင်ပြီး</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Animated Myanmar AI character">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className={`character-stage ${motionOn ? "motion-on" : "motion-off"} ${speaking ? "is-speaking" : ""}`}>
              <div className="stage-glow" />
              <div className="status-chip"><span className="status-dot" /> Online · prototype</div>
              <img className="character-image" src={characterImage} alt="မြန်မာဝတ်စုံဝတ်ထားသော Mingalar AI ကာရိုက်တာ" />
              <div className="character-caption"><span>မင်္ဂလာပါ</span><small>Mingalar AI</small></div>
              <div className="sound-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            </div>
            <div className="floating-note note-top"><Sparkles size={14} /> natural motion</div>
            <div className="floating-note note-bottom"><Volume2 size={14} /> Burmese voice-ready</div>
          </div>
        </section>

        <section className="intro-strip">
          <div className="strip-label">01 / WHY IT MATTERS</div>
          <p>ကာရိုက်တာတစ်ခုက website ကို<br /><strong>စာမျက်နှာတစ်ခုထက် ပိုစေတယ်။</strong></p>
          <div className="strip-aside"><span>တည်ဆောက်ရန် ရည်ရွယ်ချက်</span><br />အခု animation အနေနဲ့ စတင်ထားပြီး<br />နောက်ပိုင်းမှာ တကယ့် AI assistant အဖြစ် တိုးချဲ့နိုင်ပါတယ်။</div>
        </section>

        <section className="demo-section" id="demo">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> အခု စမ်းကြည့်လို့ရပြီ</div><h2>Character ကို<br /><em>လှုပ်ရှားကြည့်မယ်။</em></h2></div>
            <p>Motion ကို ဖွင့်ပိတ်ကြည့်ပါ။ စကားပြော demo က သင့် browser ရဲ့ built-in voice ကို အသုံးပြုထားပြီး နောက်ပိုင်း Burmese TTS API နဲ့ upgrade လုပ်နိုင်ပါတယ်။</p>
          </div>

          <div className="demo-grid">
            <div className="demo-panel">
              <div className="panel-topline"><span>CHARACTER STUDIO</span><span>v0.1 / prototype</span></div>
              <div className={`mini-stage ${motionOn ? "motion-on" : "motion-off"} ${speaking ? "is-speaking" : ""}`}>
                <div className="mini-ring ring-a" /><div className="mini-ring ring-b" />
                <img src={characterImage} alt="Mingalar AI preview" />
                <div className="mini-status"><span className="status-dot" /> ready</div>
              </div>
              <div className="panel-controls">
                <button className={`control-button ${motionOn ? "active" : ""}`} onClick={() => setMotionOn(!motionOn)}>
                  {motionOn ? <Pause size={16} /> : <Play size={16} />} <span>{motionOn ? "Motion ကို ရပ်မယ်" : "Motion ဖွင့်မယ်"}</span>
                </button>
                <button className={`control-button voice-control ${speaking ? "active" : ""}`} onClick={speak}>
                  {speaking ? <Pause size={16} /> : <Volume2 size={16} />} <span>{speaking ? "ရပ်မယ်" : "စကားပြောခိုင်းမယ်"}</span>
                </button>
              </div>
            </div>

            <div className="script-panel">
              <div className="script-header"><div><span className="panel-kicker">VOICE SCRIPT</span><h3>သူ့ကို ဘာပြောခိုင်းမလဲ?</h3></div><Mic2 size={22} /></div>
              <p className="script-help">အောက်က sample စကားကို ရွေးပြီး “စကားပြောခိုင်းမယ်” ကို နှိပ်ကြည့်ပါ။</p>
              <div className="script-list">
                {scriptOptions.map((script, index) => (
                  <button key={script.label} className={`script-option ${activeScript === index ? "selected" : ""}`} onClick={() => { setActiveScript(index); setSpeaking(false); window.speechSynthesis?.cancel(); }}>
                    <span className="script-radio">{activeScript === index && <span />}</span><span>{script.label}</span><ArrowRight size={15} />
                  </button>
                ))}
              </div>
              <div className="quote-box"><span>“</span><p>{selectedScript.text}</p></div>
              <div className="script-footer"><span><Waves size={15} /> Browser voice demo</span><span className="ready-badge">ready for upgrade</span></div>
            </div>
          </div>
        </section>

        <section className="roadmap-section" id="roadmap">
          <div className="roadmap-intro"><div className="eyebrow"><span className="eyebrow-dot" /> တစ်ခါထဲ upgrade-ready</div><h2>အခြေခံကနေ<br /><em>အပြည့်အဝအထိ။</em></h2><p>အခု version က visual experience နဲ့ voice demo အတွက် အခြေခံတည်ဆောက်ထားတာပါ။ နောက်ထပ် feature တွေကို မူလ design မပျက်ဘဲ တိုးချဲ့နိုင်အောင် ဖန်တီးထားပါတယ်။</p><a className="roadmap-link" href="#top">တည်ဆောက်ပုံကို သိချင်တယ် <ArrowRight size={16} /></a></div>
          <div className="roadmap-list">
            {roadmap.map((item, index) => <div className={`roadmap-item ${index === 0 ? "current" : ""}`} key={item.number}><span className="roadmap-number">{item.number}</span><div><h3>{item.title}{index === 0 && <span className="current-tag">လက်ရှိ</span>}</h3><p>{item.detail}</p></div><ArrowRight size={17} /></div>)}
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta-mark"><Zap size={23} /></div><div><span className="eyebrow">သင့် website အတွက်</span><h2>စကားပြောနိုင်တဲ့<br /><em>အမှတ်တံဆိပ်မျက်နှာ။</em></h2></div><Button className="primary-btn" onClick={scrollToDemo}>Demo ကို စမ်းကြည့်မယ် <ArrowRight size={17} /></Button>
        </section>
      </main>

      <footer className="footer"><div className="brand"><span className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></span><span>Mingalar<span className="brand-accent">AI</span></span></div><span>Prototype 01 · Built for a more human web</span><a href="#top">အပေါ်သို့ ↑</a></footer>
      <div className="corner-help"><CircleHelp size={17} /><span>နောက်တစ်ဆင့်ကို ဆွေးနွေးမယ်</span></div>
    </div>
  );
}
