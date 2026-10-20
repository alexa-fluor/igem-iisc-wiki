import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

/*
 * The notebook: a book whose leaves turn about the spine.
 *
 * Two pages side by side on a wide screen, one at a time on a phone. A leaf has a front (the right-
 * hand page) and a back (the next left-hand page), so turning a leaf shows two new pages at once.
 * Pages are set in container-query units (cqw) so the handwriting, the ruling and every drawing scale
 * together and a page never overflows at any width.
 *
 * Content lives in notebook-pages.tsx; this file is only the binding.
 */

export type Pen = "wet" | "dry" | "hp" | "idea" | "out" | "wiki";

export interface NbPage {
  month: string;
  /** Written in the page's top corner, e.g. "Tue 14 Apr". */
  date: string;
  pen: Pen;
  /** The area, e.g. "Wet lab". */
  tag: string;
  title: ReactNode;
  /** One row per element: rows write themselves in, one after another. */
  rows: ReactNode[];
}

export const PEN_COLOUR: Record<Pen, string> = {
  wet: "var(--nb-blue)",
  dry: "var(--nb-green)",
  hp: "var(--nb-red)",
  idea: "var(--nb-purple)",
  out: "var(--nb-amber)",
  wiki: "var(--nb-ink)",
};

interface Props {
  pages: NbPage[];
  cover: ReactNode;
  /** The left-hand page facing the first entry. Receives a `go(month)` so it can act as the contents. */
  front: (go: (month: string) => void) => ReactNode;
  /** Print the small "draft" mark on each entry while the entries are placeholders. */
  draft?: boolean;
}

function useNarrow(px = 760) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [px]);
  return narrow;
}

function Entry({ page, n, draft }: { page: NbPage; n: number; draft?: boolean }) {
  return (
    <div className="nb-entry" style={{ ["--pen" as string]: PEN_COLOUR[page.pen] } as CSSProperties}>
      <header className="nb-head">
        <span className="nb-date">{page.date}</span>
        <span className="nb-tag">{page.tag}</span>
      </header>
      <div className="nb-content">
        <h3 className="nb-row nb-title" style={{ ["--i" as string]: 0 } as CSSProperties}>{page.title}</h3>
        {page.rows.map((r, i) => (
          <div className="nb-row" key={i} style={{ ["--i" as string]: i + 1 } as CSSProperties}>{r}</div>
        ))}
      </div>
      <footer className="nb-foot">
        <span>{n}</span>
        {draft && <em>draft entry</em>}
      </footer>
    </div>
  );
}

export function NotebookBook({ pages, cover, front, draft }: Props) {
  const narrow = useNarrow();
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  /* sides: 0 cover, 1 the page facing the first entry, then one per entry */
  const monthStart = useMemo(() => {
    const m = new Map<string, number>();
    pages.forEach((p, i) => !m.has(p.month) && m.set(p.month, i + 2));
    return m;
  }, [pages]);
  const sideCount = pages.length + 2;
  const leafCount = Math.ceil(sideCount / 2);

  /* `at` is how many leaves lie turned over to the left (wide) or how many pages are behind (narrow) */
  const [at, setAt] = useState(0);
  const timer = useRef<number | null>(null);
  const max = narrow ? sideCount - 1 : leafCount;
  const clamp = useCallback((v: number) => Math.min(max, Math.max(0, v)), [max]);
  useEffect(() => setAt((a) => Math.min(a, max)), [max]);
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const step = (dir: 1 | -1) => setAt((a) => clamp(a + dir));
  const goTo = (target: number) => {
    if (timer.current) window.clearInterval(timer.current);
    const to = clamp(target);
    if (reduce) return setAt(to);
    timer.current = window.setInterval(() => {
      setAt((a) => {
        if (a === to) { if (timer.current) window.clearInterval(timer.current); return a; }
        return a + (to > a ? 1 : -1);
      });
    }, 150);
  };
  const goMonth = (month: string) => {
    const side = monthStart.get(month);
    if (side === undefined) return;
    goTo(narrow ? side : Math.ceil(side / 2));
  };

  /* wide: an even side shows on the right when at = s/2, an odd side on the left when at = (s+1)/2 */
  const visible = (s: number) => (narrow ? s === at : s === 2 * at - 1 || s === 2 * at);
  const closedFront = at === 0;
  const closedBack = !narrow && at === leafCount;

  const side = (s: number): ReactNode => {
    if (s === 0) return <div className="nb-cover">{cover}</div>;
    if (s === 1) return <div className="nb-entry nb-entry--front">{front(goMonth)}</div>;
    const page = pages[s - 2];
    return page ? <Entry page={page} n={s - 1} draft={draft} /> : <div className="nb-entry nb-entry--blank" />;
  };

  const leaves: Array<{ front: number; back: number | null }> = narrow
    ? Array.from({ length: sideCount }, (_, i) => ({ front: i, back: null }))
    : Array.from({ length: leafCount }, (_, i) => ({ front: 2 * i, back: 2 * i + 1 < sideCount ? 2 * i + 1 : null }));

  /* a swipe turns the page */
  const down = useRef<number | null>(null);
  const swiped = useRef(false);
  const turn = (dir: 1 | -1) => (e: { target: EventTarget }) => {
    if (swiped.current) { swiped.current = false; return; }
    if ((e.target as HTMLElement).closest("button, a")) return;
    step(dir);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const months = [...monthStart.keys()];
  const activeSide = narrow ? at : Math.max(2, Math.min(sideCount - 1, at === 0 ? 2 : 2 * at));
  const activeMonth = pages[Math.max(0, activeSide - 2)]?.month;

  return (
    <div className={`nb-book-wrap${narrow ? " is-narrow" : ""}`}>
      <div
        className="nb-book"
        tabIndex={0}
        role="group"
        aria-roledescription="notebook"
        aria-label="The MOSKATEER notebook. Use the left and right arrow keys to turn the pages."
        onKeyDown={onKey}
        onPointerDown={(e) => { down.current = e.clientX; }}
        onPointerUp={(e) => {
          if (down.current === null) return;
          const dx = e.clientX - down.current;
          down.current = null;
          if (Math.abs(dx) > 60) { swiped.current = true; step(dx < 0 ? 1 : -1); window.setTimeout(() => { swiped.current = false; }, 50); }
        }}
      >
        <div className={`nb-stage${closedFront ? " is-closed-front" : ""}${closedBack ? " is-closed-back" : ""}`}>
          {!narrow && <div className="nb-board nb-board--l" />}
          {!narrow && <div className="nb-board nb-board--r" />}
          {leaves.map((leaf, i) => {
            const flipped = i < at;
            return (
              <div
                key={i}
                className={`nb-leaf${flipped ? " is-flipped" : ""}`}
                style={{ zIndex: flipped ? i : leaves.length - i } as CSSProperties}
              >
                <div className={`nb-side nb-side--front${visible(leaf.front) ? " is-open" : ""}`} aria-hidden={!visible(leaf.front)} onClick={flipped ? undefined : turn(1)}>
                  {side(leaf.front)}
                </div>
                <div
                  className={`nb-side nb-side--back${leaf.back !== null && visible(leaf.back) ? " is-open" : ""}`}
                  aria-hidden={leaf.back === null || !visible(leaf.back)}
                  onClick={flipped ? turn(-1) : undefined}
                >
                  {leaf.back !== null ? side(leaf.back) : <div className="nb-entry nb-entry--blank" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="nb-controls">
        <button type="button" onClick={() => step(-1)} disabled={at === 0} aria-label="Previous page">←</button>
        <ul className="nb-months" aria-label="Jump to a month">
          {months.map((m) => (
            <li key={m}>
              <button type="button" className={m === activeMonth && at > 0 ? "is-on" : ""} onClick={() => goMonth(m)}>{m}</button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => step(1)} disabled={at >= max} aria-label="Next page">→</button>
      </div>
    </div>
  );
}
