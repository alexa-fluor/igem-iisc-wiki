import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WikiPage, P } from "../components/WikiPage";
import { LowPoly } from "../components/LowPoly";
import tRnaiLogic from "../assets/education/rnai-logic.jpg";
import tGeneDrives from "../assets/education/gene-drives.jpg";
import tInside from "../assets/education/inside-moskateer.jpg";
import tGeneSilencing from "../assets/education/gene-silencing.jpg";
import tPymol from "../assets/education/pymol-rnase.jpg";
import "./human-practices.css";
import "./education.css";

/*
 * Education: the team's explainers, to read and to watch.
 *
 * Read: one article per write-up, each on its own page. The prose is the team's own,
 * carried word for word; nothing here paraphrases, shortens or re-titles it.
 * Watch: the videos on the team's YouTube channel, which play in place.
 */

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts up to `to` the first time it scrolls into view. Used only to animate
 * figures that are already part of a sentence, never to add or alter wording.
 */
function CountUp({ to, text }: { to: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1000);
        setN(k < 1 ? to * (1 - Math.pow(1 - k, 3)) : null);
        if (k < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span className="edu-count" ref={ref}>
      {n === null ? text : Math.round(n).toLocaleString("en-US")}
    </span>
  );
}

/** The write-up's paragraphs, in order, exactly as written. */
function Prose({ paras }: { paras: ReactNode[] }) {
  return <>{paras.map((p, i) => <P key={i}>{p}</P>)}</>;
}

const IGEM: ReactNode[] = [
  <>iGEM stands for the International Genetically Engineered Machine. It is a competition where students from all over the world, mostly undergraduates, although school students and graduate students take part too, get together in teams and try to solve a real problem using biology.</>,
  <>Every year, hundreds of teams from different countries pick a problem they are concerned about. It could be anything, a disease, a pollution issue, a gap in healthcare, a problem in farming; almost anything one could imagine. The team then spends months designing a solution using synthetic biology, which is, in other words, the science of redesigning living things, usually bacteria or other tiny organisms, to do a job they wouldn&rsquo;t naturally do. They plan it out, build it in the lab, test whether it actually works, and learn from what happens, and then they do this cycle again and again, improving their design each time. Along the way, teams also think and work on whether their idea is safe, ethical, and helpful to the people it&rsquo;s meant for, not just clever on paper. At the end of it all, every team travels to present their work at a big final event called the Grand Jamboree, where projects are judged, and medals and awards are given out.</>,
  <>Now, why does something like this actually matter? Because science, especially the kind done in professional labs, can sometimes feel very far away from students. iGEM flips that around, enabling students to solve something that they think really matters, using the actual methods real scientists use. That, we believe, is a very big deal.</>,
  <>Competitions like iGEM give the fearless thinking a real, structured place to go. And for a project like ours, this is exactly where it all began: A group of students choosing a problem worth solving, and deciding to actually go try and solve it.</>,
];

const MALARIA: ReactNode[] = [
  <>Malaria remains one of the oldest diseases known to humankind. Centuries ago, in Italy, people who lived near marshy, swampy land kept falling terribly sick, and they assumed it was the bad, foul-smelling air rising from the swamps that was making them ill. So they called it &ldquo;mal aria&rdquo;, meaning literally, &ldquo;bad air&rdquo;, and the name stuck, even though the swamps themselves were never really the problem. Ancient physicians in China, Egypt, and Greece all wrote about the same kind of illness thousands of years ago: sudden fevers that came and went in cycles. For most of human history, nobody knew what was actually causing it. People just knew it came from somewhere near water, and that it could take a person&rsquo;s life without warning.</>,
  <>Long before anyone understood the cause, people in South America had already stumbled onto a cure, without knowing exactly why it worked. Indigenous communities in the Andes had discovered that the bark of a particular tree, later named the cinchona tree, could bring fevers like these under control. Spanish colonists and missionaries carried this knowledge back to Europe in the 1600s, and cinchona bark slowly became the go-to remedy for malarial fevers across the continent, centuries before the disease itself was understood at all. It wasn&rsquo;t until 1820 that French chemists managed to isolate the actual active compound inside the bark responsible for the effect, a substance they named quinine turning a folk remedy into something that could be purified, dosed, and eventually mass-produced.</>,
  <>It took until the late 1800s for anyone to actually find the real culprit behind the disease, and when they did, the answer surprised everyone. In 1880, a French army doctor named Charles Louis Alphonse Laveran, working in Algeria, looked at the blood of a feverish patient under a microscope and spotted something moving, a tiny, single-celled parasite, living and multiplying inside human blood. It was the first time anyone had actually seen the cause of malaria with their own eyes, and the discovery eventually earned Laveran the Nobel Prize in Physiology or Medicine in 1907. But finding the parasite still left a mystery unsolved: how was it actually getting from one person to another? That answer came almost two decades later, in 1897, when a British medical officer named Ronald Ross, working in India, dissected the stomach of a mosquito that had fed on a malaria patient and found the parasite developing inside it. Ross had found the missing link, the mosquito wasn&rsquo;t just an annoyance, it was the vehicle carrying the disease from person to person and his discovery won him the Nobel Prize in 1902, making Ross and Laveran two of the earliest Nobel laureates in medicine, both for cracking open the same disease from two different angles.</>,
  <>Once the mosquito&rsquo;s role was understood, the fight against malaria shifted from treating symptoms to attacking the transmission cycle itself: draining swamps, using insecticides, and later, in the mid-1900s, launching large global eradication campaigns that used the pesticide called DDT (Dichlorodiphenyltrichloroethane) to knock down mosquito populations across many parts of the world. Those campaigns succeeded in eliminating malaria from many countries, but they didn&rsquo;t finish the job everywhere, particularly across much of Africa, where the disease held on stubbornly. Even the medicines kept evolving: in the 1970s, a Chinese scientist; Tu Youyou, digging through centuries-old traditional Chinese medical texts, rediscovered a plant called sweet wormwood as a treatment for fevers, and went on to isolate its active compound, artemisinin, a discovery that eventually won her the 2015 Nobel Prize in Physiology or Medicine and remains, to this day, the backbone of the most effective malaria treatments used worldwide.</>,
  <>So by the time we get to today, malaria carries an unusually long paper trail behind it: a disease named after a wrong guess, cured for centuries by a bark nobody understood, finally explained by two scientists chasing two different halves of the same puzzle, and still being fought with a medicine rediscovered from an ancient text. And despite everything science has learned across all these centuries, malaria is still very much alive today, which is exactly where MOSKATEER&rsquo;s own part of this very long story begins.</>,
];

const LIFE_CYCLE: ReactNode[] = [
  <>Now that we know where malaria came from and how it was finally understood, it&rsquo;s worth walking through exactly how it actually spreads.</>,
  <>The story begins with a female Anopheles mosquito, only the females bite, because they need a blood meal to develop their eggs. As she feeds, she draws up parasites along with the blood she takes in. Over the next week or two, inside the mosquito&rsquo;s gut, the parasites go through several changes, multiplying and transforming into a new form, before finally migrating to the mosquito&rsquo;s salivary glands, the place they need to reach if they&rsquo;re ever going to infect someone new.</>,
  <>The next time that same mosquito bites another person, it doesn&rsquo;t just draw blood out, it injects a small amount of saliva first, to keep the blood from clotting while she feeds. It&rsquo;s from that saliva that the parasites slip into a new person&rsquo;s bloodstream. From there, the parasites don&rsquo;t head straight for the blood. They travel first to the liver, where they quietly invade liver cells and multiply for several days, hidden away and causing no symptoms at all, which is part of what makes malaria so hard to detect early, since a newly infected person can feel perfectly fine during this stage.</>,
  <>Eventually, the parasites burst out of the liver cells in huge numbers and pour into the bloodstream, where they invade red blood cells. Inside each RBC, the parasite grows, multiplies, and eventually bursts the cell open to release even more parasites, which go on to invade fresh red blood cells all over again. It&rsquo;s this repeating cycle &mdash; invade, multiply, burst, invade again that produces the classic symptoms malaria is known for. If nothing intervenes, the disease can escalate quickly, especially in young children and people who&rsquo;ve never been exposed before, sometimes becoming fatal within days.</>,
  <>While most of the parasites in the blood are busy invading and bursting red blood cells, a smaller fraction of them develop into a different form, one built not to cause illness, but to survive inside a mosquito. If another Anopheles mosquito happens to bite this same infected person and picks up some of these specialized parasites along with her blood meal, the entire cycle starts over again inside her body, and she becomes capable of infecting someone new.</>,
  <>This is what makes malaria so persistent in places where the conditions are right: warm climates, standing water for mosquitoes to breed in, and communities where mosquitoes and humans are in constant, close contact. Every bite from an infected mosquito can start the cycle over in another person, which is exactly why stopping malaria has never just been about treating people who are already sick, it is also about finding a way to break the chain somewhere in this loop, whether that means the mosquito, the parasite, or the exact moment of transmission itself. And that, in the simplest possible terms, is the problem MOSKATEER aims to interrupt.</>,
];

const ONE_HEALTH: ReactNode[] = [
  <>When people hear &ldquo;mosquito control,&rdquo; they usually picture something simple: mosquitoes spread malaria, so get rid of the mosquitoes. But mosquitoes don&rsquo;t live on their own. They bite people, they bite cows and goats, they breed in the same ponds that farms drain into, and they&rsquo;re food for other animals too. Change one thing and something else shifts. That&rsquo;s the idea behind what scientists call One Health: the health of people, animals and the environment are linked, so you can&rsquo;t really fix one without thinking about the other two.</>,
  <>Not every Anopheles mosquito cares about human blood equally. Some prefer people, but others are happy to feed on cattle if there are cattle nearby. So if your tool only targets mosquitoes that come inside houses, you can miss the ones that feed outdoors on livestock. And in parts of Southeast Asia there&rsquo;s a malaria parasite called Plasmodium knowlesi that normally lives in macaque monkeys and sometimes jumps to humans through mosquito bites. In those places the animals aren&rsquo;t just bystanders, they&rsquo;re part of how the disease travels.</>,
  <>Then there&rsquo;s what we&rsquo;ve done to the environment trying to fight mosquitoes. DDT is the classic example. It worked really well against mosquitoes in the mid-1900s, but there was a problem- it didn&rsquo;t break down quickly, and it built up in food chains. It was linked to birds of prey laying eggs with thin shells, which is one big reason it was eventually restricted. Even now, pesticides sprayed on crops wash into the same puddles and ponds where mosquito larvae grow. The larvae get a small dose of chemical over and over, which helps them become resistant, and meanwhile fish, frogs and harmless insects in that water are harmed too. So the way we farm can quietly make malaria harder to control.</>,
  <>How we use land matters as well. Dams, irrigation channels, rice fields and cleared forest all create standing water, and standing water is exactly what Anopheles looks for. Even bed nets, which have saved a huge number of lives, have an unintended drawback: in some communities people reuse them as fishing nets, and the insecticide on them ends up in the water.</>,
  <>Lastly, mosquitoes are a part of the ecosystem too. Their larvae are eaten by fish, and adults get eaten by bats, birds and dragonflies. Most researchers think removing one malaria-carrying species wouldn&rsquo;t collapse anything, since most mosquito species don&rsquo;t spread malaria and other animals can take up the slack. But &ldquo;probably fine&rdquo; isn&rsquo;t a guarantee, and it&rsquo;s something we need to take seriously when we design anything that affects wild mosquito populations.</>,
  <>So the question for any mosquito control idea shouldn&rsquo;t just be &ldquo;does it work on mosquitoes?&rdquo; It should also be what happens to the people, animals and places around it.</>,
];

const SYNBIO: ReactNode[] = [
  <>Imagine you&rsquo;re an engineer, but instead of building with metal, plastic, or circuits, you build with the actual machinery of life, namely genes, proteins, and the tiny cellular systems that make living things work. That, to put simply, is what synthetic biology is. It&rsquo;s a field that takes the mindset of engineering &mdash; take something apart, understand each piece, redesign it, and rebuild it to do a specific job.</>,
  <>For most of the history of biology, scientists were mainly in the business of understanding living things as they already exist, mainly interested in how a cell works, how a gene gets switched on, how a protein folds into its shape. Synthetic biology asks a different kind of question. Instead of just asking &ldquo;how does this work,&rdquo; it asks &ldquo;now that we understand how this works, can we redesign it to do something new?&rdquo;</>,
  <>The basic idea rests on treating pieces of DNA almost like standardized parts. A gene that makes a cell glow, a genetic &ldquo;switch&rdquo; that turns a process on or off in response to some signal, a piece of DNA that tells a cell to produce a particular protein. Each of these can be thought of as a modular part, something you can combine with other parts to build a larger system inside a living cell.</>,
  <>What makes synthetic biology especially powerful is the sheer range of problems it can be used to solve. A bacterium doesn&rsquo;t naturally know how to interfere with a mosquito&rsquo;s fertility, or clean up an oil spill, or manufacture a specific drug, but with the right genetic parts engineered into it, it can be redirected to do exactly that. That&rsquo;s the real promise of the field: synthetic biology borrows life&rsquo;s own toolkit and redirects a small piece of it toward a problem humans actually need solved.</>,
  <>MOSKATEER, at its core, is exactly this kind of project: taking a naturally occurring bacterium and giving it a very specific, engineered job to do, in service of a problem Malaria that has resisted simpler solutions for far too long.</>,
];

const ENGINEERING_PARTS: ReactNode[] = [
  <>A promoter, which acts like an &ldquo;on switch&rdquo; telling the cell when to start reading a gene;</>,
  <>The gene itself, which carries the actual instructions for building a specific protein; and often a few other regulatory pieces that fine-tune exactly how much of that protein gets made, and under what conditions.</>,
];

const ENGINEERING_REST: ReactNode[] = [
  <>Once the design exists on paper, the next step is actually building it, usually assembled in a lab using enzymes that can cut and join DNA fragments together with precision, stitching the different parts of the design into one continuous sequence. This finished piece of engineered DNA is typically carried on a plasmid, a small, circular loop of DNA separate from the bacterium&rsquo;s own main chromosome.</>,
  <>Getting that plasmid into the bacterium is called transformation. Bacterial cells don&rsquo;t normally let foreign DNA in. So scientists have to coax them into a temporarily more permeable state, often using one of the methods called heat-shock, wherein the cells are chilled, mixed with the plasmid DNA, then briefly exposed to a sudden rise in temperature that creates small, temporary openings in the cell membrane just long enough for the plasmid to slip inside. Not every cell in the population takes up the DNA successfully, which is why the next step is screening: growing the treated bacteria on a plate containing an antibiotic that only cells carrying the plasmid can survive, since the plasmid itself usually carries a resistance gene as a marker.</>,
  <>From there, the cell&rsquo;s own machinery reads the engineered gene and manufactures the protein it codes for, the same way it would with any of its own native genes.</>,
];

const BIOSAFETY: ReactNode[] = [
  <>Whenever you&rsquo;re working with living organisms in a lab, especially organisms that have been genetically modified, there has to be some way of deciding how careful you actually need to be. Not every experiment carries the same amount of risk. So scientists came up with a simple system to sort this out: biosafety levels, usually just called BSL, numbered from 1 to 4, where the number tells you how much risk the organism you&rsquo;re working with actually poses, and therefore how much protection the lab needs to have in place.</>,
  <>At the very bottom is BSL-1, the level used for organisms that are well understood, don&rsquo;t cause disease in healthy people, and are already commonly used in teaching and basic research labs. Stepping up to BSL-2, and you&rsquo;re working with organisms that could cause moderate illness if something went wrong. Thus, BSL-2 labs add things like restricted access, more careful waste disposal, and safety cabinets for any step that could create airborne particles.</>,
  <>Climbing further up to BSL-3, and now you&rsquo;re dealing with organisms that can cause serious or even fatal disease, but ones for which treatments usually exist so the lab itself becomes a much more controlled space, with specialized ventilation that keeps air flowing inward rather than out, sealed windows, and researchers wearing more protective gear before they even enter. And at the very top, BSL-4, you&rsquo;re in the realm of the most dangerous pathogens known with no reliable treatment or vaccine. Full-body positive-pressure suits, completely sealed facilities, and an amount of institutional oversight makes BSL-4 labs some of the most tightly controlled spaces in all of science, of which there are only a small number in the entire world.</>,
  <>Most synthetic biology work including ours happens at the lower end of that scale, usually BSL-1 or BSL-2, using well-characterized lab strains of bacteria that aren&rsquo;t dangerous to begin with. But, synthetic biology adds its own extra layer of thinking on top of the standard biosafety ladder, because we&rsquo;re not just handling an organism as it naturally exists, you&rsquo;re deliberately changing what it can do. That means a project has to ask a slightly different set of questions alongside the standard biosafety checklist: could the new trait we&rsquo;ve engineered into this organism make it more likely to survive somewhere it shouldn&rsquo;t? could it transfer to another organism unintentionally? and have we built in any safeguards? &mdash; containment strategies, kill switches, dependency on lab-only conditions that stops the engineered function from becoming a problem outside the lab, even if the original organism itself was never dangerous to begin with.</>,
  <>This is exactly the kind of thinking every iGEM project, ours included, is expected to work through carefully, not merely adhering to the appropriate biosafety level for our chassis organism, which we do, but genuinely sitting with the harder question underneath it: what happens if this engineered system ever left the lab? Have we designed the system responsibly enough that the answer to that question is reassuring rather than worrying?</>,
];

const SUGAR_TRAP: ReactNode[] = [
  <>The utilization of insecticide treated nets as well as spraying of the insecticides can reduce the number of mosquitoes, however, the development of insecticide resistance and also reaching large numbers of mosquitoes has been a challenge which has encouraged researchers to seek out other means.</>,
  <>One of the alternatives is the sugar trap which does not involve attracting and killing mosquitoes but it involves delivery of the engineered bacterium to the mosquito population. The engineered bacterium interferes with the reproduction process in mosquitoes.</>,
  <>In the case of MOSKATEER, the components of the trap have acetoin and sulcatone, which are used to attract mosquitoes and are effective.</>,
  <>The sugar solution acts as a source of food for the mosquitoes, which increases the chances of their interaction with the trap. It has Asaia bogorensis, a bacterium that colonises parts of the mosquito&rsquo;s body.</>,
  <>Unlike a conventional mosquito trap whose primary purpose is to capture or kill its target, the sugar trap in MOSKATEER is designed primarily for biological delivery.</>,
  <>The sugar trap is meant to be cost effective, large scale and needing little infrastructural support. Its success depends on parameters such as mosquito attraction, bacterial survival, successful RNA delivery and reproductive suppression.</>,
];

/* The two sections whose wording carries inline figures or a lead-in list. */

const STILL_KILLING = (
  <>
    <P>
      Given everything we now know about malaria, a parasite first observed under a microscope in
      1880, a transmission cycle elucidated out by 1897, treatments refined for over a century, and
      entire global eradication campaigns launched in the decades that followed - you&rsquo;d be
      forgiven for assuming this is a disease humanity has already solved. It isn&rsquo;t.
    </P>
    <P>
      According to the World Health Organization&rsquo;s most recent global data, malaria caused
      around <CountUp to={282} text="282" /> million cases and{" "}
      <CountUp to={610000} text="610,000" /> deaths in a single year, with the overwhelming
      majority of both roughly <CountUp to={94} text="94" />% of cases and{" "}
      <CountUp to={95} text="95" />% of deaths concentrated in Africa. And worse, that case number
      isn&rsquo;t falling. It&rsquo;s climbing: from about 230 million cases in 2015, up to 273
      million in 2023, and higher still after that.
    </P>
    <P>
      To understand why malaria keeps finding new footing despite all the existing medical
      interventions, it becomes important to look at a handful of very specific ways the disease
      has kept adapting just as fast as we have.
    </P>
    <P>
      One of the crucial factors explaining this, is the resistance occurring at 2 fronts. On one
      hand, the mosquitoes themselves are becoming harder to kill. Resistance to the insecticides
      used in bed nets and indoor spraying. On the other side, the parasite itself is starting to
      slip past our best medicines too. Partial resistance to artemisinin, has now been detected
      spreading across parts of Africa. When both the mosquito and the parasite start finding ways
      around our two most important tools at the same time, the ground we had gained starts eroding
      from underneath us. Adding to this, the disruptions caused by climate change, which is
      shifting rainfall and temperature patterns into new areas in ways that can expand where
      mosquitoes can survive and breed.
    </P>
    <P>
      A disease we&rsquo;ve technically understood for over a century is still, in practical terms,
      winning in large parts of the world and is thus difficult to tackle.
    </P>
  </>
);

const ENGINEERING = (
  <>
    <P>
      It starts with designing the genetic construct on paper, deciding exactly what pieces of DNA
      need to go into the bacterium, and in what order. A working genetic system is usually made up
      of several distinct parts working together:
    </P>

    <Prose paras={ENGINEERING_PARTS} />
    <Prose paras={ENGINEERING_REST} />
  </>
);

/* ---------- Read: one article per write-up ---------- */

interface Article {
  slug: string;
  title: string;
  /** Shorter label for the navigator; the page heading keeps the full title. */
  nav?: string;
  body: ReactNode;
}

const ARTICLES: Article[] = [
  { slug: "what-is-igem", title: "What is iGEM?", body: <Prose paras={IGEM} /> },
  { slug: "malaria", title: "Malaria", body: <Prose paras={MALARIA} /> },
  { slug: "life-cycle", title: "What is Malaria? Part 2: How It Spreads: The Life Cycle", nav: "How It Spreads", body: <Prose paras={LIFE_CYCLE} /> },
  { slug: "still-killing", title: "Why Is Malaria Still Killing Millions in 2026", nav: "Still killing millions", body: STILL_KILLING },
  { slug: "one-health", title: "Why is mosquito control a human, animal and ecosystem problem?", nav: "A One Health problem", body: <Prose paras={ONE_HEALTH} /> },
  { slug: "synthetic-biology", title: "What is Synthetic Biology?", body: <Prose paras={SYNBIO} /> },
  { slug: "engineering-bacteria", title: "How We Engineer Bacteria", body: ENGINEERING },
  { slug: "biosafety-levels", title: "Biosafety Levels in Synthetic Biology Research", nav: "Biosafety Levels", body: <Prose paras={BIOSAFETY} /> },
  { slug: "sugar-trap", title: "What is a sugar trap and how does it work?", nav: "The sugar trap", body: <Prose paras={SUGAR_TRAP} /> },
];

function ArticlePage({ article }: { article: Article }) {
  return (
    <WikiPage
      slug="education-article"
      kicker="Education"
      heroExtra={<Link to="/education#read" className="hp-back">← All education</Link>}
      title={article.title}
      sections={[{ id: "article", title: "", nav: article.nav ?? article.title, band: "mist", body: article.body }]}
    />
  );
}

/** Each article as a registry entry for pages.ts: routed, but not in the navbar. */
export const EDUCATION_PAGES = ARTICLES.map((a) => ({
  name: a.title,
  title: a.title,
  path: `/education/${a.slug}`,
  component: () => <ArticlePage article={a} />,
  unlisted: true as const,
  lead: "An Education write-up by the team.",
}));

/* ---------- Watch: the team's YouTube channel ---------- */

const CHANNEL = "https://www.youtube.com/@iGEM-IISc";

/**
 * Newest first. To add a video, add a line here: its id is the part after v= in the link,
 * and `thumb` is its YouTube thumbnail saved in src/assets/education/ (served from
 * static.igem.wiki like every other image; see CLAUDE.md).
 */
const VIDEOS: { id: string; title: string; length: string; thumb: string }[] = [
  { id: "rc3Y3rudPUA", title: "Explaining RNAi: The Logic Behind Gene Silencing", length: "3:03", thumb: tRnaiLogic },
  { id: "VH-vaicIgu8", title: "Gene Drives Explained : When Inheritance is Biased", length: "3:46", thumb: tGeneDrives },
  { id: "Mm1wzYZDoFs", title: "iGEM at IISc: Inside MOSKATEER", length: "49:58", thumb: tInside },
  { id: "zoC9jKN_dvQ", title: "Gene Silencing Explained: Harnessing the power of RNAi", length: "1:03", thumb: tGeneSilencing },
  { id: "ZTthQi23HG4", title: "PyMOL for Synthetic Biology: Modeling RNase III Interface Disruption", length: "36:30", thumb: tPymol },
];

/**
 * A video card. Nothing is loaded from YouTube until it is played, so the page stays light
 * and sends no request to YouTube before the reader asks for the video.
 */
function VideoCard({ v, i }: { v: (typeof VIDEOS)[number]; i: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="ed-video">
      <div className="ed-video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="ed-play" onClick={() => setPlaying(true)} aria-label={`Play: ${v.title}`}>
            {/* the facets show until the thumbnail arrives, and stay if it is missing */}
            <LowPoly className="ed-play-poly" cell={90} drift={4} seed={11 + i * 7} />
            <img className="ed-thumb" src={v.thumb} alt="" loading="lazy" onError={(e) => (e.currentTarget.hidden = true)} />
            <svg className="ed-play-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
              <circle cx="32" cy="32" r="30" />
              <path d="M26 20 L46 32 L26 44 Z" />
            </svg>
            <span className="ed-length">{v.length}</span>
          </button>
        )}
      </div>
      <div className="ed-video-body">
        <h3>{v.title}</h3>
        <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="hp-card-go">
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

/* ---------- the page: Read | Watch ---------- */

type Tab = "read" | "watch";

function Hub() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const tab: Tab = hash === "#watch" ? "watch" : "read";
  const tabs: { id: Tab; label: string; n: number }[] = [
    { id: "read", label: "Read", n: ARTICLES.length },
    { id: "watch", label: "Watch", n: VIDEOS.length },
  ];
  const pick = (t: Tab) => navigate({ hash: `#${t}` }, { replace: true, preventScrollReset: true });
  // arrow keys move between the two tabs, as a tablist should
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") pick(tab === "read" ? "watch" : "read");
  };
  return (
    <>
      <div className="ed-tabs" role="tablist" aria-label="Read or watch" onKeyDown={onKey}>
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`ed-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls="ed-panel"
            tabIndex={tab === t.id ? 0 : -1}
            className={tab === t.id ? "is-on" : undefined}
            onClick={() => pick(t.id)}
          >
            {t.label} <b>{t.n}</b>
          </button>
        ))}
      </div>
      <div id="ed-panel" role="tabpanel" aria-labelledby={`ed-tab-${tab}`}>
        {tab === "read" ? (
          <div className="hp-cards">
            {ARTICLES.map((a, i) => (
              <Link key={a.slug} to={`/education/${a.slug}`} className="hp-card">
                <div className="hp-card-img is-facet">
                  <LowPoly className="hp-card-poly" cell={90} drift={4} seed={3 + i * 5} />
                </div>
                <div className="hp-card-body">
                  <h3>{a.title}</h3>
                  <span className="hp-card-go">Read <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="ed-videos">
              {VIDEOS.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}
            </div>
            <p className="ed-channel">
              More on our channel: <a href={CHANNEL} target="_blank" rel="noopener noreferrer">youtube.com/@iGEM-IISc ↗</a>
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function Education() {
  return (
    <WikiPage
      slug="education"
      sideless
      title="Education"
      sections={[
        {
          id: "education",
          title: "",
          band: "mist",
          lead: "Our explainers on malaria, synthetic biology and biosafety. Read them, or watch.",
          after: <Hub />,
        },
      ]}
    />
  );
}
