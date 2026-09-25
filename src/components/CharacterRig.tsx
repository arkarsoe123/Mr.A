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
  const mouthOpen = speaking ? (speechBeat ? 0.92 : 0.42) : expression === "surprised" ? 0.42 : expression === "smile" ? 0.2 : 0.08;

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
    if (speaking) {
      setExpression("smile");
      setGesture("point");
    }
  }, [speaking]);

  const handleTap = () => {
    setTapPulse(true);
    setExpression("surprised");
    setGesture("wave");
    onTap?.();
    window.setTimeout(() => { setTapPulse(false); setExpression("smile"); }, 620);
  };

  return (
    <div
      className={`rig-frame ${compact ? "compact" : ""} ${motionOn ? "rig-motion" : "rig-still"} ${speaking ? "rig-speaking" : ""} ${tapPulse ? "rig-tap" : ""} expression-${expression} gesture-${gesture}`}
      role="button"
      tabIndex={0}
      aria-label="Tap Mr.A character"
      onClick={handleTap}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleTap(); }}
    >
      <svg className="character-rig" viewBox="0 0 420 620" role="img" aria-label="Code animated Mr.A virtual character">
        <defs>
          <linearGradient id="rigSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd8c4" /><stop offset="1" stopColor="#bc786a" /></linearGradient>
          <linearGradient id="rigHoodie" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#172b45" /><stop offset=".58" stopColor="#081526" /><stop offset="1" stopColor="#020a14" /></linearGradient>
          <radialGradient id="rigGlow"><stop offset="0" stopColor="#4bbaff" stopOpacity=".28" /><stop offset="1" stopColor="#4bbaff" stopOpacity="0" /></radialGradient>
          <filter id="rigShadow"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <ellipse className="rig-back-glow" cx="210" cy="250" rx="190" ry="230" fill="url(#rigGlow)" />
        <ellipse className="rig-shadow" cx="210" cy="586" rx="142" ry="19" filter="url(#rigShadow)" />
        <g className="rig-body">
          <path className="rig-shoulders" d="M54 610c8-115 54-177 121-190h70c68 14 113 77 121 190H54Z" fill="url(#rigHoodie)" />
          <path className="rig-hood" d="M109 447c23-51 61-77 101-77s78 26 101 77l-33 31c-20-23-43-36-68-36s-48 13-68 36l-33-31Z" fill="#0c1d31" stroke="#33516c" strokeWidth="3" />
          <path className="rig-shirt" d="m182 440 28 43 28-43 16 170h-88l16-170Z" fill="#dce9ef" />
          <path className="rig-zip" d="M210 481v128" stroke="#5485a1" strokeWidth="3" opacity=".7" />
          <path className="rig-arm-left" d="M63 601c8-61 32-109 68-132l29 40c-28 32-37 61-40 92H63Z" fill="#122a43" />
          <path className="rig-arm-right" d="M357 601c-8-61-32-109-68-132l-29 40c28 32 37 61 40 92h57Z" fill="#122a43" />
          <path className="rig-neck" d="M177 371h66v82c-21 21-45 21-66 0v-82Z" fill="url(#rigSkin)" />
          <g className="rig-head">
            <path d="M103 170c7-85 54-128 107-128s100 43 107 128v126c-11 80-58 119-107 119s-96-39-107-119V170Z" fill="url(#rigSkin)" stroke="#f7c5b4" strokeWidth="2" />
            <path className="rig-hair" d="M103 177C82 83 131 19 212 26c76 6 118 69 105 151l-25-21-11-59-20 28-26-34-26 38-34-28-28 43-31-21-13 54-1 0Z" fill="#111a26" />
            <path className="rig-ear" d="M105 221c-28-17-39 9-27 42 8 21 19 29 34 27M315 221c28-17 39 9 27 42-8 21-19 29-34 27" fill="url(#rigSkin)" stroke="#c48678" strokeWidth="6" />
            <path className="rig-brow left" d="M137 204q30-19 58 0" fill="none" stroke="#5c3732" strokeWidth="8" strokeLinecap="round" />
            <path className="rig-brow right" d="M225 204q30-19 58 0" fill="none" stroke="#5c3732" strokeWidth="8" strokeLinecap="round" />
            <g className="rig-eyes">
              <ellipse className="rig-eye left" cx="167" cy="234" rx="18" ry="17" fill="#f7fbff" /><ellipse className="rig-pupil" cx="171" cy="237" rx="8" ry="10" fill="#172636" /><circle cx="174" cy="233" r="3" fill="white" />
              <ellipse className="rig-eye right" cx="253" cy="234" rx="18" ry="17" fill="#f7fbff" /><ellipse className="rig-pupil" cx="257" cy="237" rx="8" ry="10" fill="#172636" /><circle cx="260" cy="233" r="3" fill="white" />
            </g>
            <path className="rig-nose" d="M205 237q-3 48-20 65 21 13 42 0" fill="none" stroke="#a8635a" strokeWidth="5" strokeLinecap="round" />
            <ellipse className="rig-mouth" cx="210" cy="335" rx="38" ry={8 + mouthOpen * 19} fill="#5a2931" stroke="#9a5556" strokeWidth="4" />
            <path className="rig-mouth-line" d="M180 335q30 9 60 0" fill="none" stroke="#f19b9c" strokeWidth="4" strokeLinecap="round" opacity={speaking ? 0.85 : 0.4} />
            <path className="rig-chin" d="M189 372q21 10 42 0" fill="none" stroke="#b97065" strokeWidth="4" strokeLinecap="round" opacity=".5" />
            <circle className="rig-cheek left" cx="133" cy="308" r="17" fill="#e98f86" opacity=".16" /><circle className="rig-cheek right" cx="287" cy="308" r="17" fill="#e98f86" opacity=".16" />
          </g>
          <path className="rig-logo" d="M283 532h35" stroke="#58bdf4" strokeWidth="3" strokeLinecap="round" /><text x="287" y="526" fill="#e6f5ff" fontSize="17" fontWeight="800">Mr.<tspan fill="#4eb8f2">A</tspan></text>
        </g>
      </svg>
      <span className="rig-expression-chip">{speaking ? "happy · talking" : `${expression} · ${gesture}`}</span>
      {speaking && <span className="rig-speech-chip"><i /> talking</span>}
    </div>
  );
}
