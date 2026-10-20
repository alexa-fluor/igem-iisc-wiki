import type { CSSProperties, ReactNode } from "react";

/*
 * Hand-drawn pieces for the Notebook: wobbly lines, doodles and sketch charts.
 *
 * Everything is inline SVG with `pathLength={1}` so a stroke can draw itself in when its page
 * opens (see .nb-draw in notebook.css). The wobble is seeded, so the drawing is the same on every
 * render and every reload. Nothing here is data: the charts are sketches, labelled as such.
 */

function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A straight line drawn the way a pen draws it: a few soft kinks along the way. */
export function wobble(x1: number, y1: number, x2: number, y2: number, seed = 1, amp = 1): string {
  const r = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const n = Math.max(2, Math.round(len / 26));
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  let d = `M${x1.toFixed(1)} ${y1.toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const tc = (i - 0.5) / n;
    const j = (r() - 0.5) * 2 * amp * (i === n ? 0.3 : 1);
    const jc = (r() - 0.5) * 2 * amp;
    d += ` Q${(x1 + (x2 - x1) * tc + nx * jc).toFixed(1)} ${(y1 + (y2 - y1) * tc + ny * jc).toFixed(1)} ${(x1 + (x2 - x1) * t + nx * j).toFixed(1)} ${(y1 + (y2 - y1) * t + ny * j).toFixed(1)}`;
  }
  return d;
}

/** A loose ellipse that overshoots where it started, like a circled word. */
function loop(cx: number, cy: number, rx: number, ry: number, seed = 1): string {
  const r = rng(seed);
  const pts: string[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const a = -2.5 + (i / steps) * (Math.PI * 2 + 0.55);
    const k = 1 + (r() - 0.5) * 0.09 + (i / steps) * 0.05;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return `M${pts[0]} ` + pts.slice(1).map((p) => `L${p}`).join(" ");
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`;
}

const d = (n: number): CSSProperties => ({ ["--d" as string]: `${n}s` });

interface PathProps {
  d: string;
  delay?: number;
  color?: string;
  w?: number;
  fill?: string;
}
function P({ d: path, delay = 0, color, w, fill }: PathProps) {
  return (
    <path
      className="nb-draw"
      pathLength={1}
      d={path}
      style={{ ...d(delay), ...(color ? { stroke: color } : null), ...(w ? { strokeWidth: w } : null), ...(fill ? { fill } : null) }}
    />
  );
}

function Svg({ vb, children, label, className = "" }: { vb: string; children: ReactNode; label?: string; className?: string }) {
  return (
    <svg className={`nb-svg ${className}`} viewBox={vb} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

/* ---------- inline marks ---------- */

export function Hl({ children }: { children: ReactNode }) {
  return <mark className="nb-hl">{children}</mark>;
}

export function Ul({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="nb-ul">
      {children}
      <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <P d={wobble(1, 4.5, 99, 3.5, 7, 1.6)} color={color} delay={0.9} />
      </svg>
    </span>
  );
}

export function Ring({ children, color, seed = 3 }: { children: ReactNode; color?: string; seed?: number }) {
  return (
    <span className="nb-ring">
      {children}
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <P d={loop(50, 20, 47, 17, seed)} color={color} delay={1} />
      </svg>
    </span>
  );
}

export function Todo({ done, children }: { done?: boolean; children: ReactNode }) {
  return (
    <div className={`nb-todo${done ? " is-done" : ""}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <P d="M4 5.5 L19.5 4.5 L20 19 L5 20 Z" w={1.6} delay={0.6} />
        {done && <P d="M6.5 12.5 L11 17 L22 3.5" color="var(--nb-red)" w={2.4} delay={1.1} />}
      </svg>
      <span>{children}</span>
    </div>
  );
}

/* ---------- doodles ---------- */

export function Bulb() {
  return (
    <Svg vb="0 0 100 80" className="nb-doodle">
      <P d="M50 10 C30 10 22 28 30 42 C34 49 36 52 36 58 L64 58 C64 52 66 49 70 42 C78 28 70 10 50 10 Z" />
      <P d="M38 64 H62" delay={0.5} />
      <P d="M42 70 H58" delay={0.6} />
      <P d="M46 40 L50 32 L54 40 L50 50" color="var(--nb-red)" delay={0.7} />
      <P d={wobble(50, 2, 50, -2, 2)} delay={0.8} />
      <P d={wobble(18, 14, 11, 9, 3)} delay={0.85} />
      <P d={wobble(82, 14, 89, 9, 4)} delay={0.9} />
      <P d={wobble(12, 32, 5, 32, 5)} delay={0.95} />
      <P d={wobble(88, 32, 95, 32, 6)} delay={1} />
    </Svg>
  );
}

export function Mosquito() {
  return (
    <Svg vb="0 0 100 76" className="nb-doodle">
      <P d="M52 34 C64 33 88 40 93 46 C88 51 64 47 52 43 Z" />
      <P d="M36 37 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" delay={0.3} />
      <P d="M25 36 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" delay={0.45} />
      <P d="M26 39 L8 52" delay={0.55} />
      <P d="M44 30 C46 10 66 5 78 8 C72 21 58 30 46 32" delay={0.6} color="var(--nb-green)" />
      <P d="M41 29 C34 12 24 9 17 11 C21 22 32 30 40 31" delay={0.7} color="var(--nb-green)" />
      <P d="M42 44 L35 57 L28 64" delay={0.8} />
      <P d="M46 44 L47 59 L44 69" delay={0.85} />
      <P d="M50 43 L61 57 L68 66" delay={0.9} />
      <P d="M31 33 L32 33.2" w={2.6} delay={1} />
    </Svg>
  );
}

export function Flask() {
  return (
    <Svg vb="0 0 100 80" className="nb-doodle">
      <P d="M40 6 H60" />
      <P d="M44 6 V24 L22 62 C20 68 24 73 30 73 H70 C76 73 80 68 78 62 L56 24 V6" delay={0.2} />
      <P d="M29 52 C40 45 50 57 60 50 C66 47 70 52 73 54" color="var(--nb-green)" delay={0.7} />
      <P d="M46 40 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0" delay={1} w={1.2} />
      <P d="M54 33 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0" delay={1.1} w={1.2} />
    </Svg>
  );
}

const COLONIES: Array<[number, number, number]> = [
  [38, 40, 2.6], [46, 52, 2], [56, 38, 2.8], [62, 50, 2.2], [48, 30, 2], [40, 58, 1.8], [58, 62, 2.4], [30, 50, 2.2], [66, 36, 1.8], [52, 46, 1.6],
];

export function Plate() {
  return (
    <Svg vb="0 0 100 90" className="nb-doodle">
      <P d="M50 8 C74 8 92 26 92 48 C92 70 74 86 50 86 C26 86 8 70 8 48 C8 26 26 8 50 8 Z" />
      <P d="M50 15 C70 15 85 30 85 48 C85 65 70 79 50 79 C31 79 15 65 15 48 C15 30 31 15 50 15 Z" delay={0.3} w={1.2} />
      {COLONIES.map(([x, y, r], i) => (
        <P key={i} d={`M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`} delay={0.8 + i * 0.07} color="var(--nb-red)" w={1.6} />
      ))}
    </Svg>
  );
}

export function Plasmid() {
  const c = 50, r = 28;
  return (
    <Svg vb="0 0 140 100" className="nb-doodle nb-doodle--wide" label="Sketch of a plasmid ring with promoter, tag, cargo and terminator">
      <P d={arc(c, c, r, -1.6, 4.6)} w={1.4} />
      <P d={arc(c, c, r, -1.5, -0.5)} color="var(--nb-red)" w={4} delay={0.5} />
      <P d={arc(c, c, r, -0.35, 0.6)} color="var(--nb-green)" w={4} delay={0.8} />
      <P d={arc(c, c, r, 0.8, 2.6)} color="var(--nb-blue)" w={4} delay={1.1} />
      <P d={arc(c, c, r, 2.8, 3.4)} color="var(--nb-amber)" w={4} delay={1.4} />
      <P d={wobble(78, 17, 100, 10, 2)} w={1} delay={1.6} />
      <P d={wobble(84, 56, 104, 56, 3)} w={1} delay={1.7} />
      <P d={wobble(60, 86, 82, 94, 4)} w={1} delay={1.8} />
      <P d={wobble(22, 70, 8, 84, 5)} w={1} delay={1.9} />
      <text x="102" y="10" className="nb-svg-t">promoter</text>
      <text x="106" y="58" className="nb-svg-t">tag</text>
      <text x="84" y="98" className="nb-svg-t">cargo</text>
      <text x="0" y="96" className="nb-svg-t">stop</text>
      <text x="43" y="52" className="nb-svg-t nb-svg-t--big">pMOSK1</text>
    </Svg>
  );
}

export function Tags() {
  return (
    <Svg vb="0 0 150 70" className="nb-doodle nb-doodle--wide" label="Sketch of a protein with the tag at one end or the other">
      <P d="M8 18 C20 6 30 28 44 16 C58 6 68 28 82 16 C96 6 106 26 118 16" w={1.8} />
      <P d="M100 8 H126 V28 H100 Z" color="var(--nb-red)" delay={0.7} />
      <text x="105" y="22" className="nb-svg-t">tag</text>
      <P d="M8 52 C20 40 30 62 44 50 C58 40 68 62 82 50 C96 40 106 60 118 50" w={1.8} delay={0.9} />
      <P d="M1 40 H22 V60 H1 Z" color="var(--nb-red)" delay={1.5} />
      <text x="5" y="54" className="nb-svg-t">tag</text>
      <P d={wobble(128, 16, 146, 16, 3)} w={1.2} delay={1.9} />
      <P d={wobble(128, 52, 146, 52, 4)} w={1.2} delay={2} />
      <P d="M132 56 L138 62 L148 46" color="var(--nb-green)" w={2.2} delay={2.2} />
      <text x="131" y="14" className="nb-svg-t">?</text>
    </Svg>
  );
}

/* ---------- sketch charts: no numbers, no data ---------- */

export function SketchChart({ kind, x, y }: { kind: "rise" | "bars" | "dose"; x: string; y: string }) {
  return (
    <Svg vb="0 0 140 90" className="nb-doodle nb-doodle--wide" label={`Hand sketch of a chart: ${y} against ${x}. A sketch of the idea, not data.`}>
      <P d={wobble(18, 8, 18, 72, 11, 1.2)} />
      <P d={wobble(18, 72, 132, 72, 12, 1.2)} delay={0.3} />
      <P d="M14 14 L18 7 L22 14" delay={0.5} w={1.4} />
      <P d="M126 68 L133 72 L126 76" delay={0.55} w={1.4} />
      {kind === "rise" && <P d="M22 68 C40 66 52 62 64 48 C76 32 90 22 128 20" color="var(--nb-red)" w={2.2} delay={0.9} />}
      {kind === "dose" && (
        <>
          <P d="M22 66 C46 66 64 64 76 50 C88 34 102 24 128 22" color="var(--nb-blue)" w={2.2} delay={0.9} />
          <P d="M22 68 C50 68 80 67 128 64" color="var(--nb-green)" w={2.2} delay={1.4} />
        </>
      )}
      {kind === "bars" &&
        [[26, 40], [48, 24], [70, 54], [92, 32], [114, 46]].map(([bx, top], i) => (
          <P key={i} d={`M${bx} 70 L${bx + 1} ${top} L${bx + 14} ${top - 1} L${bx + 13} 70`} color="var(--nb-blue)" w={1.6} delay={0.8 + i * 0.25} />
        ))}
      <text x="60" y="87" className="nb-svg-t">{x}</text>
      <text x="1" y="12" className="nb-svg-t nb-svg-t--r">{y}</text>
      <text x="92" y="12" className="nb-svg-t nb-svg-t--red">(sketch)</text>
    </Svg>
  );
}

export function Flow({ steps }: { steps: string[] }) {
  const n = steps.length;
  const w = 140 / n;
  return (
    <Svg vb="0 0 140 34" className="nb-doodle nb-doodle--wide" label={`Flow: ${steps.join(", then ")}`}>
      {steps.map((s, i) => {
        const x0 = i * w + 2;
        const x1 = x0 + w - 12;
        return (
          <g key={s}>
            <P d={`M${x0} 8 L${x1} 7 L${x1 + 1} 27 L${x0 - 1} 28 Z`} delay={i * 0.45} w={1.4} />
            <text x={x0 + 3} y="21" className="nb-svg-t nb-svg-t--sm">{s}</text>
            {i < n - 1 && <P d={`M${x1 + 1.5} 18 L${x1 + 8} 17.5 M${x1 + 5} 14 L${x1 + 8.5} 17.5 L${x1 + 5} 21`} delay={i * 0.45 + 0.3} w={1.4} color="var(--nb-red)" />}
          </g>
        );
      })}
    </Svg>
  );
}

export function Bubbles() {
  return (
    <Svg vb="0 0 120 60" className="nb-doodle nb-doodle--wide" label="Two speech bubbles">
      <P d="M6 8 C6 4 10 3 14 3 H58 C62 3 64 5 64 9 V28 C64 32 62 34 58 34 H30 L18 44 L20 34 H12 C8 34 6 32 6 28 Z" />
      <P d="M62 20 C62 17 65 16 68 16 H108 C112 16 114 18 114 22 V40 C114 44 112 46 108 46 H98 L100 56 L88 46 H68 C64 46 62 44 62 40 Z" delay={0.6} color="var(--nb-blue)" />
      <P d="M14 12 H52 M14 19 H46 M14 26 H40" delay={1.2} w={1.2} />
      <P d="M72 26 H106 M72 33 H100 M72 40 H90" delay={1.6} w={1.2} color="var(--nb-blue)" />
    </Svg>
  );
}

export function Arrow({ flip }: { flip?: boolean }) {
  return (
    <Svg vb="0 0 60 30" className={`nb-arrow${flip ? " is-flip" : ""}`}>
      <P d="M3 22 C14 6 30 4 54 12" color="var(--nb-red)" w={2} />
      <P d="M46 5 L55 12 L45 18" color="var(--nb-red)" w={2} delay={0.7} />
    </Svg>
  );
}
