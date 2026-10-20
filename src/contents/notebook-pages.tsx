import type { ReactNode } from "react";
import type { NbPage, Pen } from "./notebook-book";
import { PEN_COLOUR } from "./notebook-book";
import { Arrow, Bubbles, Bulb, Flask, Flow, Hl, Mosquito, Plasmid, Plate, Ring, SketchChart, Tags, Todo, Ul } from "./notebook-hand";

/*
 * Notebook entries, April to October.
 *
 * PLACEHOLDER TEXT. These entries are drafted to show the design and the kind of thing a page can
 * hold (wet lab, dry lab, human practices, ideation, outreach, the wiki). They describe plans and
 * process only: no results, no numbers, and the dates are stand-ins. Replace each entry with the
 * team's own notes before this is pushed, and set DRAFT to false in notebook.tsx to remove the small
 * "draft entry" mark from every page.
 *
 * Rules for writing a page, so it fits: a page holds about thirteen lines of about forty
 * characters after the title. A row is one element in `rows`; use <p> for text, <Fig lines={n}> for
 * a drawing that is n lines tall, <Todo> for a tick-box line.
 */

const p = (t: ReactNode, key?: string) => <p className="nb-p" key={key}>{t}</p>;
const Fig = ({ lines, children }: { lines: number; children: ReactNode }) => (
  <div className="nb-fig" style={{ height: `calc(var(--line) * ${lines})` }}>{children}</div>
);
const Sticky = ({ children, tilt = -2 }: { children: ReactNode; tilt?: number }) => (
  <div className="nb-sticky" style={{ transform: `rotate(${tilt}deg)` }}><i className="nb-tape" />{children}</div>
);

export const NB_PAGES: NbPage[] = [
  /* ---------------------------------------------------------------- April */
  {
    month: "April", date: "7 Apr", pen: "idea", tag: "Ideation", title: "Day one: what do we even work on?",
    rows: [
      p("First meeting. Everyone brought one problem they cared about and one reason biology might solve it."),
      p(<>Mosquito-borne disease kept coming back up. Not because it is <Ul>fashionable</Ul>, but because it touches so many of us directly.</>),
      <Fig lines={4} key="b"><Bulb /></Fig>,
      p("Ideas on the whiteboard (none ruled out yet):"),
      <Todo key="1">stop the mosquito from spreading it</Todo>,
      <Todo key="2">something that works where people live</Todo>,
      p(<>Biggest question: <Ring seed={5}>who would use it?</Ring></>),
    ],
  },
  {
    month: "April", date: "15 Apr", pen: "dry", tag: "Dry lab", title: "Reading week",
    rows: [
      p("Split the reading so nobody drowns: the vector, existing control methods, and why they stalled."),
      <Fig lines={3} key="f"><Flow steps={["question", "reading", "model"]} /></Fig>,
      p("Rule: every paper gets a three-line summary, plus one thing it does NOT tell us."),
      p(<>That last line turned out to be the useful one. <Hl>Gaps are where the project lives.</Hl></>),
      <Todo done key="1">shared reading list set up</Todo>,
      <Todo done key="2">three-line summary template</Todo>,
      <Todo key="3">first journal club, Friday</Todo>,
      <Fig lines={3} key="m"><Mosquito /></Fig>,
    ],
  },

  /* ------------------------------------------------------------------ May */
  {
    month: "May", date: "5 May", pen: "hp", tag: "Human practices", title: "Talk to people before we build",
    rows: [
      p("Decision: before any design is locked, we speak to the people who would live with it."),
      <Fig lines={3} key="b"><Bubbles /></Fig>,
      p("Who we want to hear from:"),
      <Todo key="1">a clinician who sees the disease</Todo>,
      <Todo key="2">someone from vector control</Todo>,
      <Todo key="4">people in the community itself</Todo>,
      p("For each call: what worries you? What would make you trust it?"),
      <Sticky key="s">write up calls same day!</Sticky>,
    ],
  },
  {
    month: "May", date: "19 May", pen: "idea", tag: "Ideation", title: "Narrowing down",
    rows: [
      p("Put the shortlisted ideas side by side. Not to pick a winner yet, only to see what each one asks of us."),
      <Fig lines={6} key="c"><SketchChart kind="bars" x="ideas" y="effort" /></Fig>,
      p(<>Criteria: is it <Ul color="var(--nb-red)">safe</Ul>, can we test it in one summer, could it work outside a lab?</>),
      p("Safety came up in every conversation. Anything that spreads on its own needs a much harder conversation than anything that stays where we put it."),
      p(<>Leaning towards the contained option. <Hl>Nothing final.</Hl></>),
      <Todo key="1">one-page summary of each idea</Todo>,
      <Todo key="2">ask a biosafety person to read them</Todo>,
    ],
  },

  /* ----------------------------------------------------------------- June */
  {
    month: "June", date: "2 Jun", pen: "dry", tag: "Dry lab", title: "Where does the tag go?",
    rows: [
      p("Our protein carries a tag. Put it at the start of the chain or at the end, and it can change how the protein folds and what it can do."),
      <Fig lines={6} key="t"><Tags /></Fig>,
      p("Plan before touching a pipette: predict the structure with the tag in each place and look at what ends up near the active parts."),
      p(<>Whatever we learn, <Ring seed={9} color="var(--nb-red)">check it in the lab</Ring>. A prediction is a reason to try something, not an answer.</>),
      <Todo key="1">set up the structure prediction runs</Todo>,
      <Todo key="2">decide how we compare the two layouts</Todo>,
    ],
  },
  {
    month: "June", date: "16 Jun", pen: "wet", tag: "Wet lab", title: "Designing the construct",
    rows: [
      p("Turning the idea into a sequence we can order and build. Every piece on the map has to have a reason to be there."),
      <Fig lines={7} key="p"><Plasmid /></Fig>,
      p("Things to settle before ordering:"),
      <Todo key="1">codon choices for the host</Todo>,
      <Todo key="2">restriction sites that do not cut inside</Todo>,
      <Todo key="3">a tag we can pull down on later</Todo>,
      p("Ask the lab what they have in the freezer before ordering anything new."),
    ],
  },

  /* ----------------------------------------------------------------- July */
  {
    month: "July", date: "7 Jul", pen: "wet", tag: "Wet lab", title: "Transformation day",
    rows: [
      p("First full run of the protocol. Written down so the second time is faster."),
      <Fig lines={3} key="f"><Flow steps={["cells", "shock", "plate", "wait"]} /></Fig>,
      p("Notes to self:"),
      <Todo key="1">label plates BEFORE the cells go on</Todo>,
      <Todo key="2">controls on every plate, always</Todo>,
      <Todo key="3">keep a record of what actually happened</Todo>,
      <Fig lines={4} key="pl"><Plate /></Fig>,
      p("(a doodle, not a photo)"),
    ],
  },
  {
    month: "July", date: "21 Jul", pen: "out", tag: "Outreach", title: "Taking it to schools",
    rows: [
      p("Working with NoteBook Drive on sessions for students. Goal: leave them able to explain the idea to someone else."),
      p("What we want a ten-year-old to walk away with:"),
      <Todo key="1">a mosquito is an animal, not a villain</Todo>,
      <Todo key="2">DNA is instructions you can read</Todo>,
      <Todo key="3">scientists change their minds, a lot</Todo>,
      <Fig lines={4} key="b"><Bubbles /></Fig>,
      p(<>Best activity so far is the one with <Hl>no slides at all</Hl>.</>),
      <Sticky key="s" tilt={2}>bring spare pens!</Sticky>,
    ],
  },

  /* --------------------------------------------------------------- August */
  {
    month: "August", date: "4 Aug", pen: "wet", tag: "Wet lab", title: "How will we know it binds?",
    rows: [
      p("Plan for the pull-down: catch the tagged protein on beads and see what comes along with it."),
      <Fig lines={3} key="f"><Flow steps={["lyse", "bind", "wash", "elute"]} /></Fig>,
      p("What a clean result would look like, drawn before we run it so we cannot fool ourselves:"),
      <Fig lines={5} key="c"><SketchChart kind="dose" x="sample" y="signal" /></Fig>,
      p("The flat line is the control. If the two lines look alike, that is an answer too."),
    ],
  },
  {
    month: "August", date: "18 Aug", pen: "dry", tag: "Dry lab", title: "Building the dataset",
    rows: [
      p("To say anything about where this matters, we need to know where the disease is. Finding the numbers is one job; trusting them is another."),
      <Fig lines={7} key="c"><SketchChart kind="bars" x="region" y="burden" /></Fig>,
      p("The rule for every source: where did it come from, who collected it, when, and can a second source agree?"),
      <Todo key="1">list every source and its limits</Todo>,
      <Todo key="2">cross-check the large numbers</Todo>,
      <Todo key="3">write down what we left out and why</Todo>,
    ],
  },

  /* ------------------------------------------------------------ September */
  {
    month: "September", date: "1 Sep", pen: "wet", tag: "Wet lab", title: "Uptake, and keeping things alive",
    rows: [
      p("Two questions this month. Do the vesicles get taken up? And does the sugar matrix keep the cells happy?"),
      <Fig lines={5} key="fl"><Flask /></Fig>,
      p("Plan for both, side by side, with controls for each:"),
      <Todo key="1">decide the time points before starting</Todo>,
      <Todo key="2">same batch of cells across conditions</Todo>,
      <Todo key="3">photograph everything, even the boring ones</Todo>,
      p("Whoever runs the experiment writes it up. Not someone else, not later."),
    ],
  },
  {
    month: "September", date: "15 Sep", pen: "hp", tag: "Human practices", title: "Asking more people",
    rows: [
      p("Two surveys, because the first one taught us how to write the second."),
      <Fig lines={4} key="b"><Bubbles /></Fig>,
      p("What we changed after the first round:"),
      <Todo key="1">shorter questions, one idea each</Todo>,
      <Todo key="2">no questions that lead the answer</Todo>,
      <Todo key="3">a plain-language intro</Todo>,
      p(<>Never merge the two surveys. <Ul>Different questions, different people.</Ul></>),
      <Sticky key="s">thank every respondent</Sticky>,
    ],
  },
  {
    month: "September", date: "29 Sep", pen: "dry", tag: "Dry lab", title: "Is it worth the money?",
    rows: [
      p("A cost-effectiveness model. The question is not whether it works, but whether it works well enough for what it costs."),
      <Fig lines={6} key="c"><SketchChart kind="rise" x="cost" y="benefit" /></Fig>,
      p("Every assumption goes in a list with a name next to it, so when someone asks why we chose it, there is an answer."),
      p(<>Rule: <Hl>if we cannot defend an input, we show a range instead.</Hl></>),
      <Todo key="1">list assumptions, name an owner</Todo>,
      <Todo key="2">sensitivity: which input matters most?</Todo>,
    ],
  },

  /* -------------------------------------------------------------- October */
  {
    month: "October", date: "10 Oct", pen: "out", tag: "Outreach", title: "Orientation day",
    rows: [
      p("Running orientations for people new to iGEM on campus. We remember how confusing it was ourselves."),
      p("What we wanted them to leave with:"),
      <Todo key="1">what iGEM actually is</Todo>,
      <Todo key="2">that you do not need to know it all first</Todo>,
      <Todo key="3">where to start, this week</Todo>,
      <Fig lines={4} key="m"><Mosquito /></Fig>,
      p("Recording it so people who could not come can still watch."),
    ],
  },
  {
    month: "October", date: "17 Oct", pen: "wiki", tag: "Wiki", title: "Writing it all up",
    rows: [
      p("Everything above has to become pages someone else can read. A checklist, so nothing gets lost in the rush:"),
      <Todo done key="1">pages written in the team's own words</Todo>,
      <Todo done key="2">attributions, so everyone is named</Todo>,
      <Todo key="3">images uploaded and checked live</Todo>,
      <Todo key="4">fonts moved to the iGEM static host</Todo>,
      <Todo key="5">read it all on a phone, not only a laptop</Todo>,
      <Fig lines={4} key="b"><Bulb /></Fig>,
      p(<>Reminder: if a number is on the wiki, <Ring seed={12}>we can show where it came from.</Ring></>),
    ],
  },
  {
    month: "October", date: "20 Oct", pen: "idea", tag: "Everything", title: "Things we would tell next year's team",
    rows: [
      p("Written late, tired, and meaning every word."),
            <Todo key="1">talk to people earlier</Todo>,
      <Todo key="2">write the notebook as you go</Todo>,
      <Todo key="3">draw the expected result first</Todo>,
      <Todo key="4">say what did not work, out loud</Todo>,
      <Todo key="5">look after each other; sleep is a protocol</Todo>,
      <Fig lines={4} key="m"><Mosquito /></Fig>,
      p(<>Thank you to everyone who answered a message at <Ul>11 pm</Ul>.</>),
    ],
  },
];

/** First entry of each month, as the printed page number the contents page shows. */
export function contentsRows() {
  const seen = new Map<string, { n: number; pen: Pen }>();
  NB_PAGES.forEach((pg, i) => !seen.has(pg.month) && seen.set(pg.month, { n: i + 1, pen: pg.pen }));
  return [...seen.entries()].map(([month, v]) => ({ month, ...v }));
}

export const LEGEND: Array<{ pen: Pen; label: string }> = [
  { pen: "wet", label: "Wet lab" },
  { pen: "dry", label: "Dry lab" },
  { pen: "hp", label: "Human practices" },
  { pen: "idea", label: "Ideation" },
  { pen: "out", label: "Outreach" },
  { pen: "wiki", label: "Wiki" },
];

export { PEN_COLOUR };
