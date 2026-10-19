import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { LowPoly } from "../components/LowPoly";
import { TitleArt } from "../components/TitleArt";
import "./sustainability.css";

/*
 * Sustainability page.
 * Left: a sticky sidebar whose path between goal waypoints fills in
 * step with the reader's scroll. Right: a faceted hero and alternating bands,
 * one per Sustainable Development Goal.
 */

interface Goal {
  id: string;
  num: number;
  /** Official UN SDG colour. */
  color: string;
  /** Lighter tint of the goal colour, used on the dark bands. */
  light: string;
  title: string;
  paras: ReactNode[];
  band: "dark" | "paper" | "teal" | "mist";
}

const GOALS: Goal[] = [
  {
    id: "sdg-3", num: 3, color: "#4C9F38", light: "#8fd474", band: "dark",
    title: "Good Health and Well-Being",
    paras: [
      <>SDG 3 commits to ensuring healthy lives and promoting well-being for all at all ages, with Target 3.3 specifically calling to end the epidemics of AIDS, tuberculosis, malaria, and neglected tropical diseases by 2030. Malaria alone accounts for hundreds of thousands of deaths annually and remains endemic across large parts of India and Sub-Saharan Africa.</>,
      <>MOSKATEER addresses this target directly at its source: rather than treating malaria after transmission, which is done by most of the existing and prevalent vector control strategies, the project engineers <i>Asaia bogorensis</i> to silence the <i>mosGILT</i> gene via RNAi, reducing fertility and suppressing the vector population responsible for transmitting the parasite. By pairing this with a sugar-trap delivery system, the project also works toward a scalable, field-deployable tool that could be integrated into existing vector-control programs, supporting the broader push toward malaria elimination.</>,
    ],
  },
  {
    id: "sdg-9", num: 9, color: "#FD6925", light: "#FD6925", band: "paper",
    title: "Industry, Innovation, and Infrastructure",
    paras: [
      <>SDG 9 calls for fostering innovation and building resilient, sustainable infrastructure, including scientific research capacity. MOSKATEER at its very core applies synthetic biology and paratransgenesis, engineers both horizontal and vertical transmission of an RNAi effect through a bacterial chassis in a way that has not been established in existing gene-drive literature.</>,
      <>Beyond the immediate application to malaria, the underlying delivery platform (the MS2-based RNA-binding and membrane-translocation fusion protein) is a generalizable tool that could inform future paratransgenic strategies for other vector-borne diseases, contributing to the broader research infrastructure available to the field.</>,
    ],
  },
  {
    id: "sdg-15", num: 15, color: "#56C02B", light: "#9be07a", band: "teal",
    title: "Life on Land",
    paras: [
      <>SDG 15 focuses on protecting, restoring, and promoting the sustainable use of terrestrial ecosystems, including halting biodiversity loss. Among the many other methods aimed at curbing the death toll due to malaria, conventional malaria vector control relies heavily on chemical insecticides, which are broad-spectrum by nature and cause harm to non-target insect populations, soil organisms, and the food chains.</>,
      <>MOSKATEER's paratransgenesis approach is species-targeted by design. The RNAi cargo is engineered against a mosquito-specific gene, and the delivery vehicle is a bacterium that already associates naturally with <i>Anopheles</i>. This limits off-target ecological impact relative to chemical larvicides and adulticides, offering a vector-control strategy that is more compatible with biodiversity conservation goals.</>,
    ],
  },
  {
    id: "sdg-17", num: 17, color: "#19486A", light: "#19486A", band: "mist",
    title: "Partnerships for the Goals",
    paras: [
      <>SDG 17 emphasizes strengthening the means of implementation through multi-stakeholder partnerships. MOSKATEER's Human Practices work puts this into practice by directly engaging the people the project is ultimately meant to serve: through structured questionnaires with medical professionals and clinicians and with the broader community.</>,
      <>The team gathers input on both project-specific design choices and broader perspectives on malaria outbreaks. This engagement is used to ground the project's technical direction in clinical and public-health realities.</>,
    ],
  },
];

const ALL_SDGS: [number, string, string][] = [
  [1, "No Poverty", "#E5243B"], [2, "Zero Hunger", "#DDA63A"], [3, "Good Health and Well-Being", "#4C9F38"],
  [4, "Quality Education", "#C5192D"], [5, "Gender Equality", "#FF3A21"], [6, "Clean Water and Sanitation", "#26BDE2"],
  [7, "Affordable and Clean Energy", "#FCC30B"], [8, "Decent Work and Economic Growth", "#A21942"],
  [9, "Industry, Innovation and Infrastructure", "#FD6925"], [10, "Reduced Inequalities", "#DD1367"],
  [11, "Sustainable Cities and Communities", "#FD9D24"], [12, "Responsible Consumption and Production", "#BF8B2E"],
  [13, "Climate Action", "#3F7E44"], [14, "Life Below Water", "#0A97D9"], [15, "Life on Land", "#56C02B"],
  [16, "Peace, Justice and Strong Institutions", "#00689D"], [17, "Partnerships for the Goals", "#19486A"],
];
const RELEVANT = new Set(GOALS.map((g) => g.num));

/** Waypoints shown in the sidebar, in page order (the sidebar starts at the SDG overview). */
const STOPS = GOALS.map((g) => ({ id: g.id, label: g.title, num: g.num, color: g.color }));

/** Facet colours shared by the header and the sidebar so the two read as one surface. */
const HERO_COLORS = ["#0f4a3f", "#1d715f", "#2b7f6d", "#3f8a6a", "#4f8f74"];

const SVG_NS = "http://www.w3.org/2000/svg";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts from 0 up to `to` the first time the element scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 900);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

export function Sustainability() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  // Hide below-the-fold content before first paint so it can animate in.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root && !reducedMotion() && "IntersectionObserver" in window) root.classList.add("sus-motion");
  }, []);

  // Reveal on scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!root.classList.contains("sus-motion")) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Navigator: highlight the section being read and fill the bar with overall progress.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    let last = -2;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const atEnd = window.scrollY >= max - 4;
      let idx = -1;
      STOPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (atEnd) idx = STOPS.length - 1;
      bar.style.transform = `scaleY(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="sus-page" ref={rootRef}>
      <header className="sus-hero">
        <LowPoly className="sus-hero-canvas" colors={HERO_COLORS} cell={120} drift={6} glow />
        <div className="hero-art" aria-hidden="true"><TitleArt name="earth" /></div>
        <div className="sus-hero-text">
          <h1 className="sus-title">Sustainability</h1>
        </div>
        <svg className="sus-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C240 70 420 110 560 190 C690 262 820 268 960 244 C1110 218 1250 190 1440 238 V260 H0 Z" />
        </svg>
      </header>

      <div className="sus-body">
        <aside className="sus-side" aria-label="Goals on this page">
          <LowPoly className="sus-side-canvas" colors={HERO_COLORS} cell={110} drift={5} seed={11} />

          <nav className="sus-toc">
            <div className="sus-toc-list">
              <div className="sus-toc-group">
                <a href="#sdgs" onClick={go("sdgs")}
                  className={`sus-toc-cycle${active < 0 ? " is-on" : ""}`}
                  aria-current={active < 0 ? "true" : undefined}>
                  <span>The Goals</span><b aria-hidden="true">G</b>
                </a>
                <ol>
                  {STOPS.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} onClick={go(s.id)}
                        className={i === active ? "is-on" : undefined}
                        aria-current={i === active ? "true" : undefined}>
                        <b aria-hidden="true">{s.num}</b><span>{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="sus-toc-bar" aria-hidden="true"><span ref={barRef} /></div>
          </nav>
        </aside>

        <main className="sus-main">
          <section id="sdgs" className="sus-band sus-band--mist sus-band--first">
            <div className="sus-inner">
              <div data-reveal>
                <h2>The UN Sustainable Development Goals</h2>
                <p>In 2015, the UNGA adopted the 2030 Agenda for Sustainable Development, built around 17 Sustainable Development Goals (SDGs). These goals form a shared global blueprint for ending poverty, protecting the planet, and ensuring peace and prosperity for all people by 2030, spanning economic, social, and environmental dimensions of development. As a synthetic biology project addressing a disease of major global public health significance, MOSKATEER is directly and indirectly relevant to several of these goals.</p>
              </div>
              <div className="sus-wall" data-reveal role="list"
                aria-label="The 17 Sustainable Development Goals, with goals 3, 9, 15 and 17 highlighted">
                {ALL_SDGS.map(([n, t, c]) => (
                  <div key={n} role="listitem" className={RELEVANT.has(n) ? "is-hi" : undefined}
                    style={{ "--c": c, "--i": n } as CSSProperties}>
                    <b>{n}</b><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {GOALS.map((g, k) => (
            <section key={g.id} id={g.id} className={`sus-band sus-band--${g.band}`}
              style={{ "--c": g.color, "--cl": g.light, zIndex: k + 2 } as CSSProperties}>
              <div className="sus-inner">
                <div className="sus-goal-head" data-reveal>
                  <p className="sus-big" aria-hidden="true"><CountUp to={g.num} /></p>
                  <h2><span className="sus-visually-hidden">SDG {g.num}: </span>{g.title}</h2>
                </div>
                <div className="sus-goal-body" data-reveal>
                  {g.paras.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
