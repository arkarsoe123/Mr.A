import { useEffect, useState } from "react";

type Expression = "neutral" | "smile" | "curious" | "surprised" | "thinking";
type Gesture = "idle" | "wave" | "point" | "think";

type CharacterRigProps = {
  speaking?: boolean;
  speechBeat?: boolean;
  motionOn?: boolean;
  compact?: boolean;
  onTap?: () => void;
};

export default function CharacterRig({ speaking = false, speechBeat = false, motionOn = true, compact = false, onTap }: CharacterRigProps) {
  const [tapPulse, setTapPulse] = useState(false);
  const [expression, setExpression] = useState<Expression>("neutral");
  const [gesture, setGesture] = useState<Gesture>("idle");
  const mouthOpen = speaking ? (speechBeat ? 0.9 : 0.35) : expression === "surprised" ? 0.32 : expression === "smile" ? 0.16 : 0.05;

  useEffect(() => {
    if (!motionOn || speaking) return;
    const expressions: Expression[] = ["neutral", "curious", "smile", "thinking"];
    const gestures: Gesture[] = ["idle", "wave", "point", "think"];
    let index = 0;
    const cycle = window.setInterval(() => {
      index = (index + 1) % expressions.length;
      setExpression(expressions[index]);
      setGesture(gestures[index]);
    }, 4200);
    return () => window.clearInterval(cycle);
  }, [motionOn, speaking]);

  useEffect(() => {
    if (speaking) { setExpression("smile"); setGesture("point"); }
  }, [speaking]);

  const handleTap = () => {
    setTapPulse(true);
    setExpression("surprised");
    setGesture("wave");
    onTap?.();
    window.setTimeout(() => { setTapPulse(false); setExpression("smile"); }, 620);
  };

  return (
    <div className={`rig-frame ${compact ? "compact" : ""} ${motionOn ? "rig-motion" : "rig-still"} ${speaking ? "rig-speaking" : ""} ${tapPulse ? "rig-tap" : ""} expression-${expression} gesture-${gesture}`} role="button" tabIndex={0} aria-label="Tap Mr.A character" onClick={handleTap} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleTap(); }}>
      <svg className="character-rig semi-realistic-rig" viewBox="0 0 420 620" role="img" aria-label="Semi-realistic code animated Mr.A virtual character">
        <defs>
          <linearGradient id="skinBase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8c7b3" /><stop offset=".42" stopColor="#d99480" /><stop offset="1" stopColor="#a65e59" /></linearGradient>
          <linearGradient id="skinLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe0cf" stopOpacity=".7" /><stop offset="1" stopColor="#c2786c" stopOpacity="0" /></linearGradient>
          <linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#263d59" /><stop offset=".45" stopColor="#0c1d32" /><stop offset="1" stopColor="#020914" /></linearGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#27313c" /><stop offset=".55" stopColor="#0d141d" /><stop offset="1" stopColor="#050a11" /></linearGradient>
          <radialGradient id="aura"><stop offset="0" stopColor="#73cfff" stopOpacity=".26" /><stop offset="1" stopColor="#73cfff" stopOpacity="0" /></radialGradient>
          <filter id="softShadow"><feGaussianBlur stdDeviation="11" /></filter>
        </defs>
        <ellipse cx="210" cy="258" rx="185" ry="235" fill="url(#aura)" />
        <ellipse className="rig-shadow" cx="210" cy="595" rx="137" ry="17" filter="url(#softShadow)" />
        <g className="rig-body">
          <path className="rig-shoulders" d="M51 610c10-99 49-158 117-183 26-10 58-10 84 0 68 25 107 84 117 183H51Z" fill="url(#jacket)" stroke="#314d68" strokeWidth="2" />
          <path className="rig-hood" d="M111 452c21-47 58-75 99-75s78 28 99 75l-31 38c-20-24-43-36-68-36s-48 12-68 36l-31-38Z" fill="#0a1728" stroke="#3b5870" strokeWidth="3" />
          <path className="rig-shirt" d="M174 430 210 480l36-50 19 180H155l19-180Z" fill="#edf3f3" />
          <path className="rig-zip" d="M210 479v131" stroke="#628299" strokeWidth="2" opacity=".7" />
          <path className="rig-arm-left" d="M62 608c7-58 29-103 65-133l35 39c-22 28-36 59-39 94H62Z" fill="#142a43" stroke="#324e67" strokeWidth="2" />
          <path className="rig-arm-right" d="M358 608c-7-58-29-103-65-133l-35 39c22 28 36 59 39 94h61Z" fill="#10243b" stroke="#324e67" strokeWidth="2" />
          <path className="rig-neck" d="M176 366h68v92c-19 20-49 20-68 0v-92Z" fill="url(#skinBase)" />
          <path className="rig-neck-shadow" d="M179 379q31 24 62 0v49q-31 22-62 0Z" fill="#995750" opacity=".23" />
          <g className="rig-head">
            <path d="M104 166c4-79 47-127 106-127s102 48 106 127v126c-8 75-51 120-106 120s-98-45-106-120V166Z" fill="url(#skinBase)" stroke="#f6c4b2" strokeWidth="2" />
            <path d="M114 144c14-62 46-92 96-92s82 30 96 92v79c-11-21-22-35-32-44-23 11-45 16-64 16-25 0-47-6-67-18-12 10-22 25-29 46v-79Z" fill="url(#skinLight)" opacity=".65" />
            <path className="rig-hair" d="M102 181C83 93 126 21 207 25c73 3 121 59 111 145l-24-19-12-53-18 25-27-35-27 37-33-29-27 43-31-23-12 56-5 9Z" fill="url(#hair)" stroke="#344251" strokeWidth="2" />
            <path className="rig-hairline" d="M126 169q36-43 82-42t84 42" fill="none" stroke="#79534e" strokeWidth="3" opacity=".35" />
            <path className="rig-ear" d="M106 219c-25-14-37 10-27 39 7 21 19 32 34 28M314 219c25-14 37 10 27 39-7 21-19 32-34 28" fill="url(#skinBase)" stroke="#ad6861" strokeWidth="6" />
            <path d="M95 238q14-17 20 4M325 238q-14-17-20 4" fill="none" stroke="#f1ad9c" strokeWidth="3" opacity=".7" />
            <path className="rig-brow left" d="M137 204q30-15 58 1" fill="none" stroke="#473234" strokeWidth="7" strokeLinecap="round" />
            <path className="rig-brow right" d="M225 205q30-16 58-1" fill="none" stroke="#473234" strokeWidth="7" strokeLinecap="round" />
            <path className="rig-eyelid left" d="M146 232q21-17 42 0" fill="none" stroke="#9d5d59" strokeWidth="3" />
            <path className="rig-eyelid right" d="M232 232q21-17 42 0" fill="none" stroke="#9d5d59" strokeWidth="3" />
            <g className="rig-eyes">
              <ellipse className="rig-eye left" cx="167" cy="241" rx="17" ry="14" fill="#fffaf6" /><ellipse className="rig-pupil" cx="170" cy="242" rx="7" ry="9" fill="#2d2022" /><circle cx="173" cy="238" r="2.7" fill="white" />
              <ellipse className="rig-eye right" cx="253" cy="241" rx="17" ry="14" fill="#fffaf6" /><ellipse className="rig-pupil" cx="256" cy="242" rx="7" ry="9" fill="#2d2022" /><circle cx="259" cy="238" r="2.7" fill="white" />
            </g>
            <path className="rig-nose" d="M207 238q-3 48-18 69 21 13 42 0" fill="none" stroke="#a7615b" strokeWidth="5" strokeLinecap="round" />
            <path d="M178 328q32-12 64 0" fill="none" stroke="#b66d69" strokeWidth="3" opacity=".52" />
            <ellipse className="rig-mouth" cx="210" cy="340" rx="35" ry={7 + mouthOpen * 18} fill="#632d35" stroke="#9f5b5d" strokeWidth="3" />
            <path className="rig-mouth-line" d="M180 339q30 8 60 0" fill="none" stroke="#efaaa5" strokeWidth="3" strokeLinecap="round" opacity={speaking ? .9 : .55} />
            <path className="rig-lower-lip" d="M190 356q20 9 40 0" fill="none" stroke="#c87976" strokeWidth="3" opacity=".7" />
            <path className="rig-chin" d="M188 382q22 10 44 0" fill="none" stroke="#a9635e" strokeWidth="3" opacity=".45" />
            <ellipse className="rig-cheek left" cx="134" cy="312" rx="24" ry="13" fill="#e88982" opacity=".13" /><ellipse className="rig-cheek right" cx="286" cy="312" rx="24" ry="13" fill="#e88982" opacity=".13" />
          </g>
          <path className="rig-logo" d="M284 536h35" stroke="#58bdf4" strokeWidth="3" strokeLinecap="round" /><text x="288" y="530" fill="#e6f5ff" fontSize="16" fontWeight="800">Mr.<tspan fill="#4eb8f2">A</tspan></text>
        </g>
      </svg>
      <span className="rig-expression-chip">{speaking ? "happy · talking" : `${expression} · ${gesture}`}</span>
      {speaking && <span className="rig-speech-chip"><i /> talking</span>}
    </div>
  );
}
