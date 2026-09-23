# 0015: Övningsbanken byggs in i webbappen som en virtuell modul

Status: beslutad (K4 inkrement 1, 2026-09-23)

## Kontext

Regelmotorn läser aldrig filer själv. Den får banken inskickad som ett vanligt fält
(`generateSession(input, bank, seed)`, ADR 0011 avsnitt 1). Någon måste alltså ge appen de
42 godkända övningarna i `content/ovningar/`, som ligger som YAML-filer i repot.

Två saker gäller redan:

| Ram | Källa |
|---|---|
| Generatorn väljer bara ur övningar med status `godkand` | R-022 |
| Banken ligger i klienten, i IndexedDB, och hämtas från Supabase | ADR 0005, ADR 0011 avsnitt 1 |
| `scripts/bank.ts` läser och validerar filerna med Node och `yaml` | Byggt i fas 3 |
| Ingen serverkörning: appen är ett statiskt bygge | ADR 0001 |

Inkrement 1 bygger bara generatorn. Konton, inloggning och Supabase kommer först i inkrement
3, så det finns ingen databas att hämta banken ur ännu, och ingen inloggning som skulle kunna
skydda den. Appen behöver ändå en riktig bank för att generatorn ska gå att använda och visa.

## Beslut

Banken byggs in i JavaScript-paketet vid bygget, genom en **virtuell Vite-modul**
`virtual:ovningsbanken`, och appen läser den på **ett enda ställe**: `src/data/bank.ts`.

- Ett litet Vite-instick i `scripts/ovningsbanken-plugin.ts` anropar `loadBank()` ur
  `scripts/bank.ts` när modulen efterfrågas, och returnerar de godkända övningarna som JSON.
  Samma kod, samma schema och samma statusfilter som valideringsskriptet och testerna använder.
- En fil i `content/ovningar/` som inte går att läsa som en godkänd övning **avbryter bygget**
  med filnamnet och felet. Ett halvt inläst innehåll får aldrig nå ett pass.
- Utvecklingsservern ser om en fil i mappen ändras, kastar modulen och laddar om sidan.
- Appen importerar aldrig `virtual:ovningsbanken` själv, bara `src/data/bank.ts`. När banken
  senare kommer från Supabase och IndexedDB (ADR 0005) byts innehållet i den filen, och ingen
  vy behöver ändras.
- Bara de fält motorn och gränssnittet läser byggs in. Insticket projicerar varje övning genom
  vitlistan `PUBLISHED_FIELDS` i `src/regelmotor/schema/published.ts`, så att redaktionellt
  arbetsmaterial — `granskning` — aldrig följer med ut i paketet (S-27).

Övningarnas YAML tas därmed aldrig med i paketet, och `yaml` blir inget beroende i klienten:
inläsning och validering sker i Node vid bygget.

### Undantaget från ADR 0001

ADR 0001 säger att allt innehåll ligger bakom inloggning. Det här beslutet gör ett **uttryckligt,
tidsbegränsat undantag från den meningen**: de 42 godkända övningarna ligger i det statiska
bygget och är läsbara för den som har appens adress, utan inloggning.

Undantaget är godkänt av användaren 2026-09-23 (säkerhetsgranskningen av inkrement 1, avsnitt 5,
beslut 1) **till och med inkrement 3**, på de tre villkoren i S-29:

1. Ingen vy som *presenterar* banken utan inloggning byggs. Det är skillnaden mot Won't-posten i
   `docs/krav/backlog.md` om ett publikt läge för att bläddra i banken eller dela pass, och den
   skillnaden måste hållas.
2. Granskningsraderna publiceras inte (S-27). Redaktionellt arbetsmaterial är inte CC BY-SA-
   innehåll och hör inte hemma i ett öppet paket.
3. Beslutet tas upp med användaren vid K4.

Undantaget gäller **bara den gemensamma banken**. Klubbarnas egna övningar får aldrig byggas in:
de hämtas vid körning, efter inloggning, med åtkomstregler på radnivå (ADR 0003, ADR 0005).

**Byggvägen fasas ut genom en egen ADR innan inkrement 4 kodas.** Den ADR:n beskriver hur banken
kommer från Supabase i stället, vad som händer med `src/data/bank.ts`, och hur IndexedDB-cachen
töms vid utloggning och vid byte av konto. Ingen del av det här beslutet får återanvändas för
klubbdata.

ADR 0001 ändras inte i efterhand. När det här beslutet ersätts, skrivs undantaget ut ur
arkitekturen i den nya ADR:n.

## Alternativ

**`import.meta.glob` med `?raw` och YAML-tolkning i webbläsaren.** Då hamnar både
YAML-texterna och en YAML-tolk i paketet, och Zod-valideringen skulle köras i klienten vid
varje start. Ett trasigt innehåll skulle upptäckas hos ledaren i stället för i bygget.

**En genererad JSON-fil som checkas in i `src/`.** Innehållet skulle då finnas i två versioner
i repot, och den ena kan hamna efter den andra. Den som ändrar en övning skulle behöva komma
ihåg ett extra kommando, och en pull request skulle visa samma ändring två gånger.

**Hämta YAML över nätet vid start.** Ger ett extra nätanrop för data som ändå är låst till ett
bygge, och kräver att innehållet valideras i klienten. Det motverkar dessutom ADR 0005, som vill
att appen fungerar på dåligt nät.

**Vänta på Supabase (inkrement 3).** Då går inkrement 1 inte att visa eller acceptanstesta med
riktigt innehåll.

## Konsekvenser

**Fördelar**
- Innehållet valideras en gång, vid bygget, med samma schema som `npm run validera:ovningar`.
- Generatorn fungerar utan nät och utan databas, vilket är precis vad ADR 0005 vill ha.
- Ett trasigt innehåll stoppar bygget i CI i stället för att nå en ledare.

**Nackdelar och risker**
- Banken kan bara ändras genom ett nytt bygge. Det stämmer med hur innehåll släpps i dag
  (ADR 0013: en omgång godkänns genom en merge), men gäller inte när redaktörskön i inkrement 4
  godkänner övningar i drift. Då måste banken komma från Supabase, och `src/data/bank.ts` byter
  innehåll. Det här beslutet gäller alltså till och med inkrement 3.
- Paketet växer med bankens storlek. 42 övningar är 83 kB JSON efter projektionen genom
  vitlistan, mot 166 kB med alla fält. Storleksbudgeten för JavaScript sätts i
  inkrement 1 (ADR 0001, *Nackdelar*) och ska räkna med att banken ligger i en egen del som kan
  laddas för sig när den växer.
- Alla godkända övningar ligger i det statiska bygget och är därmed läsbara för den som har
  appens adress, även innan inloggningen finns. Innehållet är licensierat under CC BY-SA 4.0
  och innehåller inga personuppgifter. Det är en skillnad mot ramen att allt innehåll ligger
  bakom inloggning (ADR 0001), och den skillnaden är ett uttryckligt undantag med tre villkor
  och ett slutdatum, se *Undantaget från ADR 0001* ovan.
- Ett fält som läggs till i övningsschemat syns inte i appen förrän det skrivs in i vitlistan.
  Det är avsikten — inget nytt fält ska kunna slinka ut i paketet av misstag — men det betyder
  att inkrement 2 måste lägga till `planskiss` där när skisserna ritas.
