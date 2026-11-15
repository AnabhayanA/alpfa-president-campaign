# Anabhayan Ahruran · ALPFA NJIT Campaign

A collectible editorial-lookbook-inspired, scene-based, frontend-only campaign presentation built on the existing React/Vite project. Uses JavaScript, Tailwind CSS v4, Motion for scene transitions, GSAP for the poster reveal, and Lucide icons. No backend or vote collection.

## Launch locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL Vite prints. `npm` also works in shells where PowerShell's script policy does not block it.

```powershell
npm.cmd run build     # Production output in dist/
npm.cmd run preview   # Preview the production build
npm.cmd test          # Edge browser regression checks
npm.cmd run test:mobile # iPhone-style WebKit touch/orientation checks
npm.cmd run format    # Format source files
```

Tests use the installed Microsoft Edge browser. Change `channel` in `playwright.config.js` if using an installed Chrome browser. No new dependencies were needed for the scene redesign.

For WebKit checks, first run `npx.cmd playwright install webkit`. These checks emulate an iPhone browser; testing on your own physical phone is still useful.

## GitHub Pages deployment

`.github/workflows/pages.yml` installs dependencies, builds with Node 24, and publishes `dist/` to GitHub Pages on pushes to `main`. Configure the repository's Pages source as **GitHub Actions**. The workflow sets `PAGES_BASE_PATH` from the repository name. JavaScript media paths and responsive photo sources use Vite's base URL so they work under the repository subdirectory.

To verify the same production path locally in PowerShell:

```powershell
$env:PAGES_BASE_PATH = '/alpfa-president-campaign/'
npm.cmd run build
Remove-Item Env:PAGES_BASE_PATH
npm.cmd run test:pages
```

The production-path test checks the logo, photos, texture, cat GIF, and actual MP3 playback. Normal `npm.cmd run dev` continues using `/` locally. `dist`, `node_modules`, test outputs, and `.env` files are ignored by Git.

## The presentation

Nine full-screen scenes replace one another: the welcome poster, the invitation, five timeline chapters (including two separate Spring 2026 chapters), the presidential manifesto, and the finale. The body does not scroll. Long scene content scrolls internally, including on small phones and landscape screens.

- Next/Previous, Left/Right arrows, horizontal touch swipes, visible progress, and a chapter menu.
- URL hashes and browser Back/Forward; e.g. `/#spring-2026-ideas` or `/#vision`.
- A transition lock prevents rapid input from skipping scenes. Keyboard arrows and swipes ignore nested interactive controls; vertical scrolling stays native.
- Focus moves to each incoming scene heading. Scene changes are announced. The native chapter dialog traps focus and supports Escape.
- Mouse-only NO dodging, an ordinary keyboard/touch NO action, and a respectful skip button.
- A short black-screen “LET ME SHOW YOU WHY” after YES. Direct links to that invitation wait for the visitor to continue.
- Preserved multi-photo galleries and image fallbacks. Inline, optional meme reveals and a final encore with confetti and replay.
- ALPFA NJIT-inspired navy, red, and white theme tokens in `src/index.css`. Reduced motion disables scene movement, poster animation, dodging, and confetti. Supplied GIFs require an extra Play action with reduced motion.

## Local MP3 soundtrack

The supplied MP3 was copied from the generated `dist/assets/audio/` directory into the source asset directory:

```text
public/assets/audio/campaign-theme.mp3
```

Keep the source file in **public**, not only in **dist**. Vite regenerates `dist` during builds. To replace the song, replace that MP3 and rebuild.

Open **Soundtrack**, then click **Enable music**. The root-level HTMLAudioElement stays mounted during every scene transition and loops continuously. It starts at 30% volume, supports play/pause and mute/unmute, fades volume changes, and softens the soundtrack during opened meme moments. There is no Spotify player or external music embed. Playback is never automatic; missing files, playback rejection, and slow loading display a recoverable message while the presentation stays usable.

## Add your photos, logos, GIFs, and memes

Edit `src/data.js`; no component rewrite is necessary. Empty or broken image paths display labeled placeholders. Add as many photo entries as needed to each chapter.

```js
{ src: '/assets/soccer/team.jpg', caption: 'Our first match', alt: 'ALPFA soccer players on the field', kind: 'soccer' }
```

Optional `srcSet`, `sizes`, and `position` properties support responsive photos and cropping. Set `portrait.src` for the campaign portrait. Set each chapter's optional `moment.src` and the entries in `finaleMedia` for comedic media.

Folders: `portraits`, `soccer`, `networking`, `events`, `committee`, `app`, `logos`, `gifs`, `memes`, and `audio`, all under `public/assets/`.

The 19 supplied photo/meme files are now integrated: 16 photographs/screenshots plus three reaction memes. All eight HEICs were converted to WebP; responsive image sizes preserve the originals in Downloads and remove embedded EXIF/GPS from published copies. The standalone ALPFA portrait is on the opening poster. The finale includes an expandable photo album for all 16 photos, including undated convention and summer images.

Capture metadata helps place dated photos; undated photos have explicit labels. Screenshot capture dates do not establish the dates of depicted events. The supplied committee group photo and October 2026 Pie the E-board photo are in the Fall 2026 gallery. The “ooo-shi” phone photo illustrates the app idea in the Spring ideas and Fall galleries; it is not labeled as an app screenshot or a completed demo. Actual app screenshots can be added when available.

The image manifest is `src/photoAssets.json`. To regenerate optimized copies from your originals, run `node scripts/prepare-photos.mjs "C:/path/to/photo/folder"`. The preparation tools are development-only dependencies. The current lettermark is a campaign placeholder rather than an official logo.

## Source map

- `src/App.jsx` — persistent shell, scene composition, fullscreen control, touch gestures, and chapter dialog.
- `src/useSceneNavigation.js` — URL/history, transition locking, keyboard boundaries, focus, and announcements.
- `src/Scenes.jsx` — poster, invitation, documentary chapters, manifesto, and finale.
- `src/MusicController.jsx` — persistent local-audio playback and controls.
- `src/BookPageTurn.jsx` and `src/page-turn.css` — a flexible, two-sided page turns across the binding while the book stays still; temporary printed copies are inert and have no IDs. Resize cancels cleanly and reduced motion changes pages instantly.
- `src/components.jsx` — preserved brand/media/gallery components and reusable meme moments.
- `src/data.js` — campaign content and asset references.
- `src/App.css`, `src/lookbook.css`, `src/index.css` — editorial composition, responsive layouts, and centralized theme.
- `tests/campaign.spec.js` — navigation, history, focus, music, gestures, and viewport checks.

Browser tests cover 320×568, 375×667, 390×844, 768×1024, 1366×768, 1920×1080, and 844×390. Real-device iOS/Android checks and final visual polish with actual media remain useful follow-up work. Desktop browser tests cannot prove every mobile browser's audio policy or hardware behavior.

The visual reference is interpreted through an original ALPFA identity: black surround, textured off-white paper, a center fold, publication details, page folios, narrow editorial columns, photo collages and inserts, and burgundy/navy ink. Desktop spreads have portrait-page proportions; phones and short landscape windows switch to a single-page layout. Page-turn-inspired scene motion is disabled with reduced motion. The supplied reference GIF is not published or used as campaign imagery.

The supplied ALPFA NJIT logo is now used in the navigation and back cover (`public/assets/logos/alpfa-njit.png`). The cat GIF is part of the final encore (`public/assets/gifs/cat-catmeme.gif`) with a Pause/Play control; reduced-motion users initially see the static `cat-still.webp` preview. Original files in Downloads are preserved.
