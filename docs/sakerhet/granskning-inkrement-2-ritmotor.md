Status: granskning under inkrement 2, ritmotorn (2026-09-29)

# Säkerhets- och dataskyddsgranskning: ritmotorn

**Granskare:** agenten `sakerhet-integritet` · **Gren:** `feature/ritmotor` (c9eaf95) · **Krav:** RK-1–RK-10 och resterna F7–F9 i `granskning-inkrement-2-schema.md`

Huvudsessionen har sparat rapporten i repot. Fynden är numrerade R1–R6 inom den här rapporten.

## Sammanfattning

Ritmotorn uppfyller kravet på att text från skissen aldrig hamnar i ett attribut.

- **Uppfyllda:** RK-2, RK-3, RK-4, RK-5, RK-7 och RK-10.
- **Delvis uppfyllda:** RK-1 och RK-6.
- **Går inte att pröva än:** RK-8 (utskrift, inkrement 6) och RK-9 (redaktörskön, inkrement 4).

Granskningen gav inga kritiska, höga eller medelhöga fynd. Rekommendationen är att R1, R2 och R5 åtgärdas före merge och att R3 åtgärdas senast före inkrement 4.

## Kraven

| Krav | Utfall | Underlag |
|---|---|---|
| RK-1 | Delvis | Typen är märkt. `KortSkiss` läser skissen med `readPlanskiss`, och `Planskissvy` lägger en felgräns runt varje skiss. Lintningen i `src/app/` hindrar ändå inte att någon går förbi felgränsen (R3). |
| RK-2 | Uppfyllt | Text från skissen står bara som barn till `<text>`, `<title>` och `<desc>`. `id`, `aria-labelledby` och `url(#…)` byggs bara av `instansId` och ett fast suffix. Körtestet prövar alla attribut mot en vitlista. |
| RK-3 | Uppfyllt | Varje geometriskt attribut går genom `finite()`. En förfalskad `NaN` ger `NonFiniteError`, som felgränsen fångar. |
| RK-4 | Uppfyllt | `INSTANCE_ID_PATTERN` kontrolleras. Felaktiga varianter underkänns. Unika id:n behandlas i R6. |
| RK-5 | Uppfyllt | Ritmotorn har ingen `style`. Färgerna sätts med klasser som använder fasta CSS-variabler. |
| RK-6 | Delvis | Taket på 8 spelare per kö gäller vid ritning. Basskissens spelare, antalet objekt, rörelser och `per_yta` kontrolleras inte på nytt (R1). |
| RK-7 | Uppfyllt | `unicode-bidi: isolate` gäller varje `<text>`, och etiketterna kortas. Kosmetiskt: etiketter på rörelser kan klippas vid bildens kant, och `slice` kan dela ett surrogatpar. |
| RK-8 | Går inte att pröva än | Utskriften byggs i inkrement 6. Lintskyddet utanför `src/planskiss/` saknas (R3). |
| RK-9 | Går inte att pröva än | Redaktörskön byggs i inkrement 4. |
| RK-10 | Uppfyllt | XSS-nyttolaster, en vitlista för element och attribut, kontrollen att inget attributvärde innehåller skissens text och en fuzz-slinga. Fuzz-testet är ostabilt (R5). |

**F7:** åtgärdat. **F8:** delvis, resten gäller `src/app/` (R3). **F9:** i stort sett åtgärdat, resten står i R4.

## Fynd

### R1 · Låg · Taken i RK-6 kontrolleras inte på nytt vid ritning

Om data som schemat skulle ha underkänt når ritmotorn, till exempel genom en regression eller en förfalskning förbi `readPlanskiss`, händer följande:

- 60 basspelare ritas.
- `per_yta: 0` ger texten "en av Infinity ytor".
- En dribbling på 1e7 m tar slut på minnet, och fliken dör.

**Åtgärd:**

- Klamra antalet spelare till 40 i `Planskiss` och `scalePlayers`.
- Använd `Math.max(1, per_yta)`.
- Sätt ett tak för antalet samplade punkter per bana, till exempel 400.

### R2 · Låg · Giltig skissdata kan ge mycket stor SVG

En skiss som schemat godkänner, med yta 120 × 5 m och 30 vågiga dribblingar, ger 414 kB markup och 28 650 linjesegment. Den tar 128–195 ms att rita. En sådan skiss kan läggas in direkt via PostgREST.

**Åtgärd:** samma tak som i R1, och ett test som mäter storleken i värsta fallet.

### R3 · Låg · `src/app/planskiss/` saknar ritmotorns lintskydd

Följande går igenom lintningen i `src/app/`:

- `const d: Planskissdata = JSON.parse(s)`
- `<Planskiss>` utan felgräns
- `ref` som sätter `innerHTML`
- `style` byggd från data

**Åtgärd:**

- Inför i `src/app/**` förbuden mot `ref`, `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`setAttribute`, `createElement`/`jsx-runtime`, `createPortal`, `XMLSerializer` och `style` med ett uttryck.
- Inför typad lintning med `no-unsafe-*`.
- Förbjud att `Planskiss` importeras utanför `Planskissvy.tsx`.

### R4 · Låg · Luckor i ESLint-vitlistan

`const TAG = 'foreignObject'; <TAG />` och `const X = 'script'; <X />` går igenom, eftersom mönstret kräver en versal följd av gemen. Attributen kontrolleras med en svartlista, så `aria-label={label}`, `id={label}` och `fill={`url(#${label})`}` går också igenom.

**Åtgärd:**

- Ändra mönstret till `/^[A-Z]/`, med undantag för konstanter som inte är strängar.
- Gör attributkontrollen till en vitlista, med samma lista som `ALLOWED_ATTRIBUTES` i testet.

### R5 · Låg · Fuzz-testet i RK-10 är ostabilt

Fuzz-testet tog 12,3 s i en parallell körning och föll en gång på gränsen 15 s. Ett test som ibland blir rött utan att koden ändrats lär folk att köra om tills det blir grönt, och då ger testet inget skydd.

**Åtgärd:** ge testet en egen tidsgräns, eller färre varv som ritas.

### R6 · Låg · `instanceId` kan bli samma för två kort

Ett övnings-id på 64 tecken som står på två stationer kortas till samma `instanceId`. Då får två SVG:er samma id.

**Åtgärd:** korta övningsdelen innan delarna fogas ihop, eller lägg en kort hash sist.

## Beroenden

- `npm audit`: 0 sårbarheter.
- Klientpaketet innehåller react, react-dom, scheduler och zod, alla med licensen MIT.
- Grenen ändrar inte `package.json`.

## Kvarstår

- RK-8 och RK-9 prövas i inkrement 6 och 4.
- Ritmotorn är inte prövad i en riktig webbläsare.
- Namn på spelare går fortfarande inte att upptäcka tekniskt.

## Uppföljning 2026-10-02

Säkerhetsagenten prövade fynden igen på `feature/ritmotor` (10f76c0).

| Fynd | Utfall |
|---|---|
| R1 | Åtgärdat. Taken gäller vid ritning, och en dribbling på 1e7 m ger högst 400 punkter. |
| R2 | Åtgärdat. Alla dribblingar i en skiss delar på 2 400 vågpunkter, och värsta fallet ger under 50 000 tecken. |
| R3 | Åtgärdat för de ursprungliga nyttolasterna. Kvarvarande luckor står i N3. |
| R4 | Delvis. Mönstret med versal och vitlistan för attribut fungerar. `id={label}` och `fill={…label…}` går fortfarande igenom lintningen och fångas bara av körtestet. |
| R5 | Åtgärdat. Fuzz-testet har en tidsgräns på 30 s. |
| R6 | Åtgärdat. `instanceId` får en FNV-1a-hash. |

Etikettlagret (`src/planskiss/etiketter.ts`) uppfyller RK-2. Text står bara som barn till `<text>`.

**Nya fynd:**
- **N1 · Medel:** CI föll på `npm audit` (brace-expansion). Åtgärdat i main (#23) och inmergat.
- **N2 · Låg:** vitlistan för element kan kringgås med en importerad sträng (`import { tagName as Tag }`), och `id` och `fill` prövas inte på värde. **Kvarstår.**
- **N3 · Låg:** i `src/app/` går `document.write`, `Reflect.set(el, 'innerHTML', …)`, `innerHTML` i en objektlitteral, `srcDoc`, `href` med ett uttryck och en dynamisk import av ritmotorn igenom lintningen. **Kvarstår.** Ska prövas särskilt mot RK-8 när utskriften byggs i inkrement 6.
- **N4 · Låg:** e2e-rapporten i ett publikt repo innehöll git-metadata. Åtgärdat: `captureGitInfo` är avstängt, och e2e-jobbet har fått `timeout-minutes` och egna uttryckliga behörigheter.

Övrigt: `retries: 1` i e2e i CI kan dölja ostabila tester. `e2e` är ännu inte en obligatorisk kontroll i grenskyddet.
