import { useEffect, useRef, useState } from "react";
import { WikiPage, type WikiSection } from "../components/WikiPage";
import p3936 from "../assets/team/IMG_3936.jpg";
import p3938 from "../assets/team/IMG_3938.jpg";
import p3940 from "../assets/team/IMG_3940.jpg";
import p3941 from "../assets/team/IMG_3941.jpg";
import p3945 from "../assets/team/IMG_3945.jpg";
import p3948 from "../assets/team/IMG_3948.jpg";
import p3950 from "../assets/team/IMG_3950.jpg";
import p3952 from "../assets/team/IMG_3952.jpg";
import p3954 from "../assets/team/IMG_3954.jpg";
import p3956 from "../assets/team/IMG_3956.jpg";
import p3958 from "../assets/team/IMG_3958.jpg";
import p3960 from "../assets/team/IMG_3960.jpg";
import p3969 from "../assets/team/IMG_3969.jpg";
import p3971 from "../assets/team/IMG_3971.jpg";
import p3973 from "../assets/team/IMG_3973.jpg";
import piShukla from "../assets/team/pi-shantanu-shukla.jpg";
import piSingh from "../assets/team/pi-vishal-singh.jpg";
import "./team.css";

/*
 * Team. Same layout as the Gallery: no navigator, one centred column.
 *
 * The Principal Investigators come first, each photograph above the name. The fourteen photographs follow, each cropped on the face and set in a
 * card of one size. Names are not supplied yet, so the cards carry none: fill in
 * `name` (and `attributions`) on a member below; the name rises over the photo on hover and
 * both show in the pop-up that a click opens. `file` keeps the
 * original photograph's number so names can be matched to it.
 *
 * The earlier sub-team bios are kept in writeups/team-bios.md.
 */

/** One line of the person's attributions: what they did. Only add what the person has confirmed. */
interface Person {
  name?: string;
  src: string;
  /** Shown as "Attributions" in the pop-up. Empty until the person confirms them. */
  attributions?: string[];
}

const PIS: Person[] = [
  { name: "Dr. Shantanu Shukla", src: piShukla },
  { name: "Dr. Vishal Singh", src: piSingh },
];

interface Member extends Person {
  /** The original photograph's file number, e.g. IMG_3936. */
  file: string;
}

const MEMBERS: Member[] = [
  { file: "IMG_3936", src: p3936 },
  { file: "IMG_3938", src: p3938 },
  { file: "IMG_3940", src: p3940 },
  { file: "IMG_3941", src: p3941 },
  { file: "IMG_3945", src: p3945 },
  { file: "IMG_3948", src: p3948 },
  { file: "IMG_3950", src: p3950 },
  { file: "IMG_3952", src: p3952 },
  { file: "IMG_3954", src: p3954 },
  { file: "IMG_3956", src: p3956 },
  { file: "IMG_3958", src: p3958 },
  { file: "IMG_3960", src: p3960 },
  { file: "IMG_3969", src: p3969 },
  { file: "IMG_3971", src: p3971 },
  { file: "IMG_3973", src: p3973 },
];


/** The photo card: lifts and tilts on hover with the name rising at the foot; a click opens the attributions. */
function PhotoCard({ person, onOpen, className }: { person: Person; onOpen: (p: Person) => void; className: string }) {
  return (
    <button type="button" className={className} onClick={() => onOpen(person)} aria-label={`Attributions: ${person.name ?? "team member"}`}>
      <img src={person.src} alt={person.name ?? "A member of the MOSKATEER team"} loading="lazy" />
      {person.name && <span className="tm-name">{person.name}</span>}
    </button>
  );
}

function AttributionPopup({ person, onClose }: { person: Person; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [onClose]);
  const items = person.attributions ?? [];
  return (
    <div className="tm-modal" onClick={onClose}>
      <div className="tm-dialog" role="dialog" aria-modal="true" aria-label={person.name ?? "Team member"} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="tm-close" ref={closeRef} onClick={onClose} aria-label="Close">×</button>
        <img src={person.src} alt={person.name ?? "A member of the MOSKATEER team"} />
        <div className="tm-dialog-text">
          <h3>{person.name ?? "Team member"}</h3>
          <h4>Attributions</h4>
          {items.length ? (
            <ul>{items.map((a) => <li key={a}>{a}</li>)}</ul>
          ) : (
            <p className="tm-pending">Attributions will be added soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Team() {
  const [open, setOpen] = useState<Person | null>(null);
  const sections: WikiSection[] = [
    {
      id: "principal-investigators",
      title: "Principal Investigators",
      band: "mist",
      body: (
        <ul className="tm-pis">
          {PIS.map((pi) => (
            <li key={pi.name} data-reveal>
              <PhotoCard person={pi} onOpen={setOpen} className="tm-card tm-card--pi" />
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "team-members",
      title: "Team Members",
      band: "paper",
      body: (
        <div className="tm-grid">
          {MEMBERS.map((m) => (
            <div key={m.file} data-reveal data-photo={m.file}>
              <PhotoCard person={m} onOpen={setOpen} className="tm-card" />
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <>
      <WikiPage slug="team" title="Team" sideless sections={sections} />
      {open && <AttributionPopup person={open} onClose={() => setOpen(null)} />}
    </>
  );
}
