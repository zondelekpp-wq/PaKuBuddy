# PaKuBuddy

Aplikacja z rodziny PaKu dla dzieci (ok. 5–10 lat): budowanie kumpla od środka (anatomia), ubieranie, zawody z decyzjami, dom i opieka, bajki, muzyka oraz wehikuł czasu ze słynnymi postaciami nauki, kultury i sztuki. Wszystko czytane na głos.

- Języki: angielski (domyślny) i polski – przełącznik na ekranie startowym i w ⚙️ ustawieniach dla dorosłych
- Działa offline (PWA), bez reklam, bez zbierania danych
- `index.html` – cała aplikacja
- `family.js`, `install.js` – wspólne pliki rodziny PaKu (pasek „Zainstaluj”, lista aplikacji)
- `sw.js` – praca offline (przy zmianach podbij `VERSION`)
- `PaKuBuddy.zip` – gotowy pakiet (płaski, bez podfolderów): `python3 _build_zip.py`

Adres: `https://zondelekpp-wq.github.io/PaKuBuddy/`

## School content updates

New subjects, exhibits and famous people arrive on their own: the app reads `school/packs.json` every time it starts online, keeps a copy for offline use, and marks new things with a **NEW** badge.

To publish new content, add it to `school/packs.json` and **raise `v` by one**:

```json
{ "v": 2,
  "subjects": [ { "id": "lit", "e": "📚", "bg": "#FFF0F6", "en": ["Literature", "Intro…"], "pl": ["Literatura", "Wstęp…"] } ],
  "exhibits": [ { "id": "press", "sub": "physics", "y": 1440, "e": "📰", "bg": "#F7EFE2",
                  "svg": "<g data-p=\"part\">…</g>",
                  "en": { "n": "Name", "w": "when · where", "who": "inventor", "i": "intro",
                          "m": [["emoji", "material", "why"]],
                          "s": [["step text", "parts that appear"]],
                          "p": { "part": ["Part name", "What it does"] },
                          "q": ["question", "correct", "wrong", "wrong", "explanation"] },
                  "pl": { … the same in Polish … } } ],
  "figs": { "music": [["mozart", 1770]] },
  "newIds": ["press"] }
```

Pictures are 300×240 SVG; every `<g data-p="…">` is a part children can zoom into. Animation classes: `a-spin a-bob a-wig a-float a-tw a-flick a-pulse a-glow a-sway a-swing a-vib a-key a-slide a-wave a-swirl a-draw`.
