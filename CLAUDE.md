# MOSKATEER wiki: handoff for any session

iGEM 2026, team IISc-Bengaluru (team ID **6506**, project ID 4489). React 19 + Vite + TypeScript.
Read this first, then `README.md` for the file layout.

- Live site: https://2026.igem.wiki/iisc-bengaluru/
- Deploys from GitLab: https://gitlab.igem.org/2026/iisc-bengaluru (branch `main`)
- GitHub copy (our working repo and backup): https://github.com/alexa-fluor/igem-iisc-wiki

## Ground rules (always)

1. **Touch only what you were asked to touch.** No drive-by cleanups, renames or restyling of other pages or sections. If you spot something else, mention it; don't change it.
2. **Keep previous commits' edits.** Other people push to GitLab `main` too (Soham Acharya has). Always `git fetch` and rebase onto `origin/main` before committing there. Never force-push, never reset over their work, never let a sync delete their files.
3. **Keep the site coherent.** Reuse the existing tokens, type and components instead of inventing new ones:
   - Colours (`src/contents/home.css`, `src/global.css`): `--pine`, `--night`, `--teal`, `--mint`, `--mist`, `--paper`, `--ink`, `--muted`, `--cream`, `--rust`.
   - Type: Inter for headings, Segoe UI then Noto Sans for text, Amatic SC for the wordmark and decorative numerals, Poppins only for the home tagline.
   - Pages are built from `WikiPage` (`src/components/WikiPage.tsx`); the page registry is `src/pages.ts`.
   - Text is live HTML, never a screenshot. Screenshots look blurry (that was the original problem with the hero and numbers).
4. **Commits are authored by the user**, Srijan Agrawal <asrijan@iisc.ac.in>. Do **not** add `Co-Authored-By: Claude` or "Generated with Claude Code" lines to commits.
5. **iGEM's asset rules are hard rules** (from the template README, `gitlab.igem.org/templates/wiki-frozen-flask`): images, photos, icons and fonts only from `static.igem.wiki`; **videos only embedded from iGEM Video Universe**; no external CDNs, no third-party embeds or iframes. Check the README before adding anything that loads from another host. Plain outbound links are fine.
6. **Never fabricate** results, data, citations or team facts. The Results page is deliberately "awaiting data".
7. **Verify before saying done**: `npx tsc -b`, a production build, and look at the page in a browser at desktop width.

## Build

```
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build, writes dist/
```

`vite.config.ts` reads two variables from `.env` (GitLab repo has the real file):

```
IGEM_BASE=/iisc-bengaluru/
IGEM_STATIC_BASE=https://static.igem.wiki/teams/6506/wiki/images-igem-iisc/
```

- `IGEM_BASE` is the sub-path. Without it every asset URL 404s on the live wiki.
- With `IGEM_STATIC_BASE` set, images are **not bundled** (see Images). Unset (plain `npm run dev`), images load from the local files.

**Links between pages:** use react-router `<Link to="/description">`, never `<a href="/description">`. A plain anchor drops the `/iisc-bengaluru/` base path and leaves the wiki.

## Images (static.igem.wiki)

iGEM only serves images from static.igem.wiki, and the GitLab CI rejects a build artifact that is too large (11 MB failed with `413 Request Entity Too Large`; ~1.6 MB works). So raster images in `src/assets/<dir>/` and `assets/` are served from static.igem.wiki, not shipped in `dist/`.

How a local file maps to its URL (plugin `staticImages` in `vite.config.ts`):

```
src/assets/<dir>/<name>.<png|jpg|webp|gif>   (assets/<name>.png uses dir "site")
  -> ${IGEM_STATIC_BASE}<dir>-<name>.avif     lower-cased, "_" -> "-"
e.g. src/assets/aiim/aiim-3.jpg  ->  .../images-igem-iisc/aiim-aiim-3.avif
     src/assets/team/IMG_3936.jpg ->  .../images-igem-iisc/team-img-3936.avif
```

To add or change an image:

1. Put it in `src/assets/<dir>/` and `import` it as usual. SVG figures stay bundled and are unaffected.
2. Make an upload copy named `<dir>__<name>.<ext>` (the prefix keeps same-named files from different folders from colliding):
   ```bash
   mkdir -p ~/Downloads/igem-upload && cp src/assets/aiim/aiim-3.jpg ~/Downloads/igem-upload/aiim__aiim-3.jpg
   ```
3. Upload at https://teams.igem.org/6506/deliverables/wiki/uploads into the folder **`images-igem-iisc`** (flat: the uploader does not accept folders). It lower-cases the name, turns `_` into `-` and converts the file to `.avif`.
4. Check it is live. A missing file returns 403, a real one 200:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' https://static.igem.wiki/teams/6506/wiki/images-igem-iisc/aiim-aiim-3.avif
   ```
5. Static files are CDN-cached for up to 24 h. Replacing a file may show the old one until it expires, so prefer a new filename.

Also hosted there: the animated mosquito `https://static.igem.wiki/teams/6506/wiki/mosquito/mosquito-wing-flap.webp`, used for the "M" of the wordmark in the hero and the navbar.

## Fonts

Fonts are hosted on static.igem.wiki, as iGEM asks: `https://static.igem.wiki/teams/6506/wiki/fonts/iisc/<file>.woff2`. The `@font-face` rules in `src/global.css` point there (the server sends `access-control-allow-origin: *`, so cross-origin loading works). The same files are kept in `public/fonts/`: inter-var, noto-sans-var, onest-var, poppins-300/400, amatic-sc-700, patrick-hand-400 and kalam-700 (the last two are the Notebook's handwriting, both SIL OFL). To add a font: put the woff2 in `public/fonts/`, upload it to the `fonts/iisc` folder, check the URL returns 200, then add an `@font-face`. No CDN links, no Google Fonts, ever.

The `TEAM_PATH` placeholders in `src/contents/sustainability.css` and `home.css` are inside comments (instructions for font files this wiki does not use); nothing to fill in.

## Pushing to GitLab (this is what deploys the live site)

Handy: keep one clone and reuse it, e.g. `~/Downloads/igem-gitlab` (`git pull --rebase origin main` before preparing a commit), then give the user `cd <that path> && git push origin main`. The user wants the push command in exactly that form. Copy only the files you changed; `CLAUDE.md` is not tracked on GitLab, so do not copy it there.

The assistant cannot log in to GitLab, so it cannot push. The repo is readable without a login, though: `git clone https://gitlab.igem.org/2026/iisc-bengaluru.git` into the scratchpad shows what teammates pushed and is the right place to prepare the commit. It prepares a commit; **the user pushes** with their GitLab username and a personal access token (scope `write_repository`) as the password. A GitLab password does not work over HTTPS. Token page: https://gitlab.igem.org/-/user_settings/personal_access_tokens. Never ask for the token in chat.

The GitLab repo has files this repo does not, so do not wipe it with a bare copy. **GitLab-only files, never delete or overwrite:** `.gitlab-ci.yml`, `.env`, `LICENSE`, `.claude/`, `yarn.lock`, and anything a teammate adds (for example `public/world-110m.json`).

```bash
git clone https://gitlab.igem.org/2026/iisc-bengaluru.git igem-gitlab && cd igem-gitlab
git config user.name "Srijan Agrawal" && git config user.email "asrijan@iisc.ac.in"
# copy only the files you changed from this repo, e.g.:
cp ../MOSKATEER-wiki-v29/src/contents/home.css src/contents/home.css
git status --short                      # check that ONLY your intended files changed
yarn install --frozen-lockfile && yarn build   # same steps as the CI
git add -A && git commit -m "What changed"
git fetch origin && git rebase origin/main     # keep teammates' commits
git push origin main                           # the user runs this one
```

- If you must sync many files with `rsync`, **do not use `--delete`** without excluding the GitLab-only files above; it will remove them.
- If you change `package.json`, regenerate `yarn.lock` (`yarn install`) in the GitLab repo and commit it. The CI runs `yarn install --frozen-lockfile` and fails on a stale lockfile. This repo uses `package-lock.json`; GitLab uses `yarn.lock`.
- Push rejected? Someone pushed first: `git pull --rebase origin main`, then push again.
- The pipeline: https://gitlab.igem.org/2026/iisc-bengaluru/-/pipelines. After it passes, hard-refresh the site (Cmd+Shift+R); the page caches for about 10 minutes.
- `ENOSPC: no space left on device` in a job log is the runner's disk, not our code. Retry the job, or use "Clear runner caches" on the Pipelines page; if it repeats, tell iGEM support.
- To check what is really live: `curl -s https://2026.igem.wiki/iisc-bengaluru/ | grep -o 'assets/index-[^"]*'`.

The GitHub repo (`origin` here) is a plain `git push origin main`; no token prompts so far.

## Working in the browser preview

- The preview pane can throttle animations. Before screenshotting an entrance animation, run `document.getAnimations().forEach(a => { try { if (a.effect.getTiming().iterations !== Infinity) a.finish() } catch (e) {} })`.
- The pane is narrow by default (~800 px), which shows the tablet layout. Resize to 1440x900 to see desktop, and reset to the `desktop` preset afterwards.
- On macOS `sed -i` needs `sed -i ''`; for multi-line edits use Python or the Edit tool.

## Site structure (what lives where)

- `src/pages.ts` is the registry (navbar, router, titles). Listed pages carry a `group`; article pages are `unlisted` (routed, not in the navbar) and are **spread into `PAGES` from their content file**: `ARTICLE_PAGES` (`expert-articles.tsx`) and `EDUCATION_PAGES` (`education.tsx`). `pages.ts` stays plain `.ts`, so components are built inside the content files, not in the registry.
- Navbar groups: Project (Description, Ideation), Lab (Experiments, Results, Notebook, Modelling, Biosafety), Human Practices (Integrated Human Practices, Public Engagement, Community Survey, Education, Sustainability, Gallery), plus Team. A panel with more than three items splits into two even rows (`panelColumns` in `Layout.tsx`); `keepPanelOnScreen` nudges a panel left only if it would leave the window. It uses a fixed 22 px offset on purpose (see the comment): reading the panel's own `offsetLeft` double-counts the last nudge.
- **Integrated Human Practices** (`/human-practices`): a card per expert/stakeholder conversation. Each card opens `/human-practices/<slug>` (text and photos in `expert-articles.tsx`, text exactly as the team sent it). Three of the five cards have no photo and show the wiki's facet strip; add `image` to an entry in `ARTICLES` when a photo exists.
- **Public Engagement** (`/public-engagement`): AIIM, Sciastra Quiz, iGEM Orientation, as sections. **Community Survey** (`/community-survey`): the survey text and nine charts under three headings (charts are drawn from the Google Forms screenshots; two surveys of 61 and 93 responses, never merged).
- **Education** (`/education`): a Read | Watch switch (`#read` / `#watch`). Read = nine cards to `/education/<slug>` articles (text word for word). Watch = the `VIDEOS` list in `education.tsx`: a thumbnail card per video. **iGEM requires wiki videos to be embedded from iGEM Video Universe (video.igem.org), never YouTube**, so a card is a plain link to the team's YouTube video until it has an `embed` (the `src` from the Share > Embed code of the video once uploaded to Video Universe); then it plays in place. To add a video: add a line to `VIDEOS` (the id is the part after `v=`), save its YouTube thumbnail (`https://img.youtube.com/vi/<id>/maxresdefault.jpg`) as `src/assets/education/<name>.jpg`, import it, and upload `education__<name>.jpg` to static.igem.wiki (see Images). Until uploaded, the card shows the facets instead.
- **Team** (`team.tsx`): cards open an attributions pop-up in iGEM's format (role, Tasks tags, Specific Tasks). Names and roles are set; **Tasks and Specific Tasks read "To be added." until each person confirms them. Never write them for anyone.** The team's own list may be at `teams.igem.org/wiki/6506/attributions`.
- **Gallery** (`gallery.css`): the user likes the fixed-height, roomy photo rows; do not tighten them.
- **Notebook** (`notebook*.tsx`, `notebook.css`): a bound, page-turning book in handwriting (Patrick Hand, titles Kalam). **The entries in `notebook-pages.tsx` are placeholders** (every page says "draft entry"); never present them as real. When the team's notes arrive, replace them and set `DRAFT = false` in `notebook.tsx`. Pages are sized in `cqw` and hold about 15 ruled lines: after editing text, check each page for overflow in the browser.
- **Home** (`src/contents/home.tsx`): pinned scroll sections use `usePin`, which can ease toward the scroll position (`smooth`). "The whole chain" is a ring of four cards with clockwise arrows that light up as you scroll (`Chain`).
- `WikiPage`'s reveal observer caps how much of a section must be visible at 8% of the screen. Without that, a section taller than about twelve screens never revealed on a short window and looked empty until you zoomed out.

## Working across the two repos

This local repo is the GitHub copy; GitLab is what deploys. Their **commit hashes differ**, because Soham's changes were brought in by copying files, not by merging. Do not try to merge or rebase one onto the other.

1. Clone GitLab into the scratchpad and read `git log` there to see what teammates changed. Compare with `git diff --stat` before assuming nothing changed.
2. Copy teammates' changed files into this repo first if you are about to edit the same files (Soham has edited `Layout.tsx` and `layout.css`).
3. Make the change here, build, test.
4. Copy only the changed and new files to the GitLab clone, delete files you removed, build there (`yarn build`), commit as Srijan with no Claude trailer, `git fetch` and `git rebase origin/main`. The user pushes.
5. Commit in this repo too, so GitHub matches.

## More on the browser preview

- The desktop navbar only shows at 1101 px and wider; below that it is the burger sheet. Emulate 1200x700 to test the dropdowns.
- After a resize or navigation, the page re-flows, so a scroll can land in the wrong place. Scroll again and wait a second before measuring or screenshotting; screenshots can lag the scroll.
- Hover tests: `find` gives a ref, then `computer hover` on the ref; a coordinate hover needs a screenshot first. Read the panel's position with `getBoundingClientRect()` rather than judging by eye.
- Image copies for upload go in `~/Downloads/igem-upload/` as `<dir>__<name>.<ext>`.

## Where things stand

Do not trust a status list here; check. At the start of a session:

- `git log --oneline | head` here, and in a fresh GitLab clone `git log --oneline origin/main | head`, to see what is live and what is only here.
- `curl -s https://2026.igem.wiki/iisc-bengaluru/ | grep -o 'assets/index-[^"]*'` for what is deployed.
- `curl -s -o /dev/null -w '%{http_code}\n' <static.igem.wiki URL>` for any image or font a page needs (200 = uploaded).

Things only the user can do (ask, do not assume done): upload new images and fonts to static.igem.wiki, push to GitLab, upload videos to iGEM Video Universe, supply the team's real notes, names and attributions.

Open:
- Parts and Software: Best Part Collection and Best Software Tool are being targeted. The Parts page exists but is `unlisted`; add it under Lab later. A Software page needs real facts about the tool (what it does, how to run it, repo, validation); do not invent them.
- Communication (unlisted) overlaps with Public Engagement (quiz and orientations on both). Left alone on purpose; decide which page owns what.
- Three expert articles (Rashi Bhavsar, Dr. Iswaran, Prof. Jatkar) have no card photo.
- Results: every experiment says "awaiting data".
- Communication: video files and the 10 October event recordings.
- Model: the tag-placement analysis on 1ZDH.
- The navbar mosquito flaps constantly on every page; swap for a still image if that is distracting.
- Label chips inside the Molecule and Bigger Picture figures still have their own coloured backgrounds; they are part of the drawings and were left alone on purpose.
- Home chain: the fourth arrow ("Downward" back to "One trap") closes the ring; that is a design choice, drop it if the team prefers an open ring.

AI-use note: the GitLab repo has `.claude/RESPONSIBLE_AI_USE.md`. The team stays fully responsible for everything published.
