import { WikiPage, type WikiSection } from "../components/WikiPage";
import { AIIM } from "./aiim";
import { SCIASTRA, ORIENTATION } from "./sciastra-orientation";
import "./human-practices.css";

/*
 * Public Engagement: AIIM, the Sciastra quiz and the iGEM orientation. The text and
 * photographs are the team's existing write-ups, unchanged; they moved here from
 * the Integrated Human Practices page, so each stays a section of its own.
 */

const SECTIONS: WikiSection[] = [
  { id: "aiim", title: "AIIM", band: "mist", body: AIIM },
  { id: "sciastra-quiz", title: "Sciastra Quiz", band: "paper", body: SCIASTRA },
  { id: "orientation", title: "iGEM Orientation", band: "mist", body: ORIENTATION },
];

export function PublicEngagement() {
  return <WikiPage slug="public-engagement" title="Public Engagement" sections={SECTIONS} />;
}
