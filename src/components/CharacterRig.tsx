import { useEffect, useRef } from "react";
import { MrACharacter } from "./MrACharacter";

type CharacterRigProps = {
  speaking?: boolean;
  speechBeat?: boolean;
  motionOn?: boolean;
  compact?: boolean;
  onTap?: () => void;
};

export default function CharacterRig({ speaking = false, motionOn = true, compact = false, onTap }: CharacterRigProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<MrACharacter | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const character = new MrACharacter({ mount: mountRef.current, scale: compact ? 0.72 : 1.08, autoWander: false });
    characterRef.current = character;
    return () => {
      character.destroy();
      characterRef.current = null;
    };
  }, [compact]);

  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;
    if (!motionOn) character.play("idle");
    else if (speaking) character.play("talk");
    else character.play("idle");
  }, [motionOn, speaking]);

  return (
    <div
      ref={mountRef}
      className={`rig-frame three-rig ${motionOn ? "rig-motion" : "rig-still"} ${speaking ? "rig-speaking" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Tap Mr.A 3D character"
      onClick={() => { characterRef.current?.play("happy", 1100); onTap?.(); }}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { characterRef.current?.play("happy", 1100); onTap?.(); } }}
    >
      <span className="rig-expression-chip">{speaking ? "3D · talking" : motionOn ? "3D · ready" : "3D · paused"}</span>
      {speaking && <span className="rig-speech-chip"><i /> talking</span>}
    </div>
  );
}
