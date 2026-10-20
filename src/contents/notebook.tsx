import { WikiPage, type WikiSection } from "../components/WikiPage";
import { NotebookBook } from "./notebook-book";
import { Mosquito } from "./notebook-hand";
import { LEGEND, NB_PAGES, PEN_COLOUR, contentsRows } from "./notebook-pages";
import "./notebook.css";

/*
 * Notebook: the whole project in date order, not only the wet lab. Dry lab, human practices,
 * ideation, outreach and the wiki sit in the same book, each page in its own pen colour.
 *
 * It is a bound book you turn page by page, written in a handwriting face. The entries in
 * notebook-pages.tsx are PLACEHOLDERS (see the note at the top of that file). Set DRAFT to false once
 * they are the team's own notes.
 */

const DRAFT = true;

const cover = (
  <div className="nb-cover-in">
    <Mosquito />
    <h2>MOSKATEER</h2>
    <p>iGEM IISc Bengaluru · 2026</p>
    <div className="nb-label">Everything we did, in the order we did it</div>
  </div>
);

const front = (go: (month: string) => void) => (
  <>
    <header className="nb-head">
      <span className="nb-date">April to October</span>
    </header>
    <div className="nb-front">
      <h3>What's inside</h3>
      <ul>
        {contentsRows().map((r) => (
          <li key={r.month}>
            <button type="button" style={{ ["--c" as string]: PEN_COLOUR[r.pen] }} onClick={() => go(r.month)}>
              <span>{r.month}</span>
              <i />
              <b>{r.n}</b>
            </button>
          </li>
        ))}
      </ul>
      <div className="nb-legend" aria-label="Pen colours">
        {LEGEND.map((l) => (
          <span key={l.pen} style={{ ["--c" as string]: PEN_COLOUR[l.pen] }}>{l.label}</span>
        ))}
      </div>
      <p className="nb-howto">turn the page: arrows, swipe, or tap the edge</p>
    </div>
  </>
);

const SECTIONS: WikiSection[] = [
  {
    id: "the-notebook",
    title: "",
    band: "paper",
    body: <NotebookBook pages={NB_PAGES} cover={cover} front={front} draft={DRAFT} />,
  },
];

export function Notebook() {
  return (
    <WikiPage
      slug="notebook"
      kicker="Lab"
      title="Notebook"
      standfirst="The project as it ran, from the first meeting in April: the lab work, the modelling, the conversations, the outreach and the writing-up, all in one book."
      sections={SECTIONS}
      sideless
    />
  );
}
