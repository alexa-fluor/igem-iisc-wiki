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
5. **Never fabricate** results, data, citations or team facts. The Results page is deliberately "awaiting data".
6. **Verify before saying done**: `npx tsc -b`, a production build, and look at the page in a browser at desktop width.

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

Fonts are in `public/fonts/` (inter-var, noto-sans-var, onest-var, poppins-300/400, amatic-sc-700; about 164 KB) and are bundled into the build, referenced by `@font-face` in `src/global.css`. That works but is not what iGEM asks for.

Still to do: upload them to static.igem.wiki (under `teams/6506/wiki/fonts/`), then point the `@font-face` `src:` URLs in `src/global.css` at the new URLs, and fill in the `TEAM_PATH` placeholders in `src/contents/sustainability.css` (the real value is `6506/wiki`). Old fonts from the previous wiki are already there, for example `.../teams/6506/wiki/fonts/amatic-sc/amaticsc-bold.woff2`. No CDN links, no Google Fonts, ever.

## Pushing to GitLab (this is what deploys the live site)

The assistant cannot log in to GitLab. It prepares a commit; **the user pushes** with their GitLab username and a personal access token (scope `write_repository`) as the password. A GitLab password does not work over HTTPS. Token page: https://gitlab.igem.org/-/user_settings/personal_access_tokens. Never ask for the token in chat.

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

## Where things stand

Done: full revamp pushed to GitLab; images moved to static.igem.wiki; home hero and navbar wordmark are live text beside the animated mosquito; "Dive deeper" redesigned; Part 1/2/3 labels removed from the home page; numbers section is plain type on the facets; closing logo slide removed; card backdrops removed from the figures in "The Molecule" and "Beyond One Mosquito" (rule in `src/contents/home.css`, scoped to `#molecule` and `#bigger-picture`).

Open:
- Fonts still bundled; move them to static.igem.wiki (above).
- Results: every experiment says "awaiting data".
- Team: three members without a sub-team; PI and advisor entries held back until confirmed.
- Communication: video files and the 10 October event recordings.
- Model: the tag-placement analysis on 1ZDH.
- The navbar mosquito flaps constantly on every page; swap for a still image if that is distracting.
- Label chips inside the Molecule and Bigger Picture figures (e.g. "fewer viable eggs") still have their own coloured backgrounds; they are part of the drawings and were left alone on purpose.

AI-use note: the GitLab repo has `.claude/RESPONSIBLE_AI_USE.md`. The team stays fully responsible for everything published.
