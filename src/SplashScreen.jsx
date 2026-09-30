import { useEffect, useState } from "react";
import "./SplashScreen.css";

// Zig-zag crack running top to bottom through the middle of the bean
const CRACK = [
  [100, 8], [92, 45], [108, 80], [94, 115],
  [107, 150], [93, 185], [106, 220], [100, 252],
];
const crackPath = "M" + CRACK.map((p) => p.join(",")).join(" L");
const leftClip = `M0,0 L${CRACK.map((p) => p.join(",")).join(" L")} L0,260 Z`;
const rightClip = `M200,0 L${CRACK.map((p) => p.join(",")).join(" L")} L200,260 Z`;

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setLeaving(true), reduce ? 200 : 2600);
    const t2 = setTimeout(() => onDone?.(), reduce ? 500 : 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`splash ${leaving ? "splash--leaving" : ""}`} aria-hidden="true">
      <div className="splash__glow" />

      <div className="splash__bean">
        <svg viewBox="0 0 200 260" width="200" height="260">
          <defs>
            <radialGradient id="beanBody" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#a8683a" />
              <stop offset="55%" stopColor="#6b3b1f" />
              <stop offset="100%" stopColor="#3a1d0e" />
            </radialGradient>
            <clipPath id="clipLeft"><path d={leftClip} /></clipPath>
            <clipPath id="clipRight"><path d={rightClip} /></clipPath>
          </defs>

          {/* LEFT HALF */}
          <g className="splash__half splash__half--left">
            <g clipPath="url(#clipLeft)">
              <ellipse cx="100" cy="130" rx="82" ry="122" fill="url(#beanBody)" />
              <ellipse cx="66" cy="70" rx="18" ry="46" fill="#fff" opacity="0.12" transform="rotate(12 66 70)" />
            </g>
            <path d={crackPath} fill="none" stroke="#e8c49a" strokeWidth="3" strokeLinejoin="round" />
          </g>

          {/* RIGHT HALF */}
          <g className="splash__half splash__half--right">
            <g clipPath="url(#clipRight)">
              <ellipse cx="100" cy="130" rx="82" ry="122" fill="url(#beanBody)" />
            </g>
            <path d={crackPath} fill="none" stroke="#e8c49a" strokeWidth="3" strokeLinejoin="round" />
          </g>

          {/* Crack drawing itself before the split */}
          <path
            className="splash__crack"
            d={crackPath}
            fill="none"
            stroke="#ffd9a0"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
          />
        </svg>
      </div>
    </div>
  );
}