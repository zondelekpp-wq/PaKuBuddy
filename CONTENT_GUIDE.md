# PaKuBuddy School – content guide

New school content is published by adding it to `school/packs.json`. The app reads that file every time it starts online, keeps a copy for offline use and marks new things with a **NEW** badge. The bundled content lives inside `index.html` (constants `SUBJ`, `SUBJ_FIG`, `EXH`) and is **never edited** by regular updates – packs only add.

Who it is for: children about 5–10 years old, many of whom cannot read yet. **Every text is read aloud** by a British English or Polish voice, so it must sound natural when spoken.

## Fortnightly update (automatic, every second Monday)

1. `node _validate_pack.js` must print OK before you start (if not, fix the existing pack first).
2. Read `school/packs.json` and the **Log** at the bottom of this file so you never repeat an exhibit or a subject.
3. Add **3 new exhibits** to `exhibits`, in 3 different subjects, choosing the subjects with the fewest exhibits first (count bundled + pack). Prefer ideas from the **Ideas** list, and tick them.
4. Every 4th update (when the Log has a multiple of 4 update lines), also add **one new subject** from the subject queue below, with at least 3 exhibits of its own that update (they count as its 3), and link existing famous people to it in `figs` where it fits (ids must already exist in the app: see the list below).
5. Raise `v` by exactly 1, set `updated` to today (Europe/Warsaw), and set `newIds` to the ids added in this update (exhibits and the new subject).
6. Run `node _validate_pack.js` until it prints OK. Run `python3 _render_pack.py`, open `pack_preview.png` and **look at every new picture**: nothing cut off, parts recognisable, nothing overlapping badly, cute and tidy. Fix and re-render until good.
7. Add one line to the Log, run `python3 _build_zip.py`, commit "School pack vN: …" and push `main`.

If anything cannot be fixed, do not push a broken pack: leave `school/packs.json` as it was and report the problem.

## Exhibit format

```json
{ "id": "press", "sub": "physics", "y": 1440, "e": "📰", "bg": "#F7EFE2",
  "svg": "<g data-p=\"frame\">…</g><g data-p=\"screw\">…</g>",
  "en": { "n": "Printing press", "w": "about 1440 · Germany", "who": "Johannes Gutenberg",
          "i": "2–3 sentence introduction",
          "m": [["🔠", "material", "why this material, one sentence"]],
          "s": [["step text", "parts that appear in this step, space separated"]],
          "p": { "frame": ["Part name", "what it does, 1–2 sentences"] },
          "q": ["question?", "correct answer", "wrong answer", "wrong answer", "short explanation"] },
  "pl": { the same in Polish } }
```

- `id`: lowercase letters/digits, unique. `y`: year as a whole number, negative for BC (used to sort the timeline). `w`: when and where, as people say it ("about 1440 · Germany" / "ok. 1440 · Niemcy").
- `m`: 2–4 materials. `s`: 3–5 steps; together they must show **every** part; a step may show no part (`""`) for a "first, …" idea step. `p`: 3–6 parts.
- Quiz: one clearly correct answer, two clearly wrong ones (one may be gently funny), explanation that teaches.
- Exhibits may be inventions, instruments, artworks, tools, famous buildings, natural wonders explained part by part (a volcano, a tree, a flower), animals' bodies, machines…

## Pictures (`svg`)

- Drawn inside a **300 × 240** frame. The app wraps it in `<g stroke="#3A2E4F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none">`, so give shapes a `fill` and they get the outline automatically; use `stroke="none"` for highlights.
- Every part the child can zoom into is `<g data-p="name">…</g>`. Decorations that are not parts: `<g class="deco">`.
- Style: cute, rounded, soft pastel colours, simple shapes, thick outlines – the same look as the bundled exhibits. Keep parts big enough to tap.
- Animate at least one thing with these classes: `a-spin` `a-spinS` (slow) `a-spinx` (propeller) `a-orbit` `a-bob` `a-wig` `a-float` (rising bubbles/notes) `a-tw` (twinkle) `a-flick` (flame) `a-pulse` `a-glow` `a-shine` `a-sway` `a-swing` (compass needle) `a-vib` (strings) `a-key` (press) `a-slide` `a-wave` `a-swirl` `a-draw` `a-look` `a-dna`, delays `d1`–`d4`.
- Only shapes and text: no `<script>`, links, `<image>`, external files or event handlers (the validator checks).

## Content rules

- **Accuracy first.** Only facts you are sure of; check dates, names and numbers with a web search when in doubt. Say "about" for uncertain dates.
- **Original wording**, warm and simple, short sentences, read well aloud. British spelling in English. Natural, correct Polish (not a word-for-word translation), Polish place names (Niemcy, Włochy), "p.n.e." for BC.
- Child-safe: no violence, weapons, war machines, frightening or sad details, no medicines/doses, no brand promotion.
- **No copyrighted works.** Paintings, sculptures, music: only works whose creator died more than 70 years ago, and draw them as a simple friendly impression, never a copy. No modern characters, logos or brands. No real people drawn as photographs.
- Famous people are mentioned by name only; the app already has 40 portraits, linked through `figs`.

## Subject queue (one new subject every 4th update, in this order)

| id | emoji | en | pl | ideas |
|---|---|---|---|---|
| lit | 📚 | Literature | Literatura | papyrus scroll, quill pen, illuminated manuscript, typewriter, Braille book |
| tech | 💻 | Technology | Technologia | telephone, radio, camera, computer, robot, smartphone parts |
| earth | 🌋 | Our planet | Nasza planeta | volcano, layers of the Earth, water cycle, rainbow, glacier |
| animals | 🐾 | Animals | Zwierzęta | how a bird flies, an elephant's trunk, a spider's web, a whale's body |
| sport | ⚽ | Sport & movement | Sport i ruch | Olympic torch, bicycle, skis, ball, swimming |
| build | 🏗️ | Buildings | Budowle | pyramid, arch bridge, lighthouse, windmill, igloo |
| food | 🍞 | Food | Jedzenie | bread, chocolate from cacao, honey, cheese, rice |
| ocean | 🐳 | Ocean | Ocean | coral reef, submarine, diving suit, lighthouse, tides |

Figure ids that exist in the app (for `figs`): imhotep, hatshepsut, ahmes, hippocrates, aristotle, archimedes, zhang, galen, hypatia, khwarizmi, ibnsina, hildegard, leonardo, copernicus, vesalius, shakespeare, galileo, harvey, leeuwenhoek, newton, mozart, galvani, lavoisier, jenner, lovelace, chopin, darwin, pasteur, vangogh, curie, pavlov, cajal, einstein, fleming, kahlo, lindgren, franklin, gagarin, johnson, goodall.

## Ideas (tick when used)

- body: [x] thermometer, [ ] X-ray machine, [ ] plaster cast, [ ] vaccine (Jenner's idea), [ ] wheelchair
- nature: [ ] seed and sprout, [x] butterfly life cycle, [ ] bird's nest, [ ] magnifying glass, [ ] herbarium
- space: [ ] astrolabe, [ ] space suit, [ ] International Space Station, [ ] Hubble telescope, [x] Moon lander
- physics: [x] printing press, [ ] steam engine, [ ] bicycle, [ ] windmill, [ ] lever and pulley, [ ] hot-air balloon
- chem: [ ] soap, [ ] candle, [ ] periodic table card, [ ] paper making, [ ] crystal growing
- math: [ ] ruler and compass (geometry), [ ] hourglass, [ ] scales and weights, [ ] Ishango bone, [ ] tangram
- geo: [ ] map of the world (Mercator), [ ] sextant, [ ] lighthouse, [ ] weather vane, [ ] barometer
- art: [ ] cave painting of Lascaux, [ ] Egyptian bust of Nefertiti, [ ] Girl with a Pearl Earring, [ ] stained-glass window, [ ] potter's wheel
- music: [ ] drum, [ ] harp, [ ] trumpet, [ ] pipe organ, [ ] guitar, [ ] music box

## Log

- 2026-11-22: pack v1 – printing press (physics).
- 2026-11-23: pack v2 – thermometer (body), butterfly life cycle (nature), Moon lander Eagle (space).
