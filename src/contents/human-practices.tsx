import { WikiPage, type WikiSection } from "../components/WikiPage";
import { ArticleCards } from "./expert-articles";

/*
 * Integrated Human Practices: the experts and stakeholders we spoke to, one article
 * each. AIIM, the Sciastra quiz and the orientation are on Public Engagement; the
 * community survey has a page of its own.
 */

const SECTIONS: WikiSection[] = [
  {
    id: "experts",
    title: "Interactions with Experts and stakeholders",
    nav: "Experts and stakeholders",
    band: "mist",
    lead: "Five conversations, an article for each. Open one to read it in full.",
    after: <ArticleCards />,
  },
];

export function HumanPractices() {
  return <WikiPage slug="human-practices" sideless title="Integrated Human Practices" sections={SECTIONS} />;
}
