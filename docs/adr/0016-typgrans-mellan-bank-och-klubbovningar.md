# 0016: Typgräns mellan den gemensamma banken och klubbens egna övningar

Status: föreslagen (läggs fram vid K4 inkrement 1)

## Kontext

R-022 säger att generatorn bara väljer övningar ur den gemensamma banken, med status
`godkand`. ADR 0011 avsnitt 1 beskrev signaturen `generateSession(input, bank: Exercise[],
seed)` och motiverade regeln med att det inte finns någon parameter att skicka in klubbens
egna övningar i.

Säkerhetsgranskningen av inkrement 1 (S-28) visade att den motiveringen inte håller hela
vägen. En egen klubbövning **är** en `Exercise`: ingenting i typen skiljer en bankövning från
en klubbövning. Den faktiska gränsen var statusfältet, kontrollerat i tre lager
(`scripts/bank.ts`, `filter/base.ts`, `check/session.ts`). Samtidigt säger R-106 uttryckligen
att statusen inte spelar någon roll när ledaren byter in en egen övning i inkrement 4, och att
kravet på status `godkand` i R-022 inte gäller där.

Följden: i inkrement 4 skulle ett anrop med bankens och klubbens övningar i samma lista
typkontrollera utan en varning, och alla tre lagren skulle släppa igenom en klubbövning som
ingen redaktör har sett. Det bryter mot R-022 och mot ramen om mänskligt godkännande.

Granskningen visade samtidigt (S-27) att hela övningen byggdes in i paketet, inklusive
`granskning` — 79 kB redaktionell text och granskarnas namn, som varken motorn eller någon vy
läser.

## Beslut

**1. Bankövningar är en egen typ.** `src/regelmotor/origin.ts` inför:

- `BankExercise`, en `Exercise` med `status: 'godkand'` och `ursprung: 'bank'`.
- `toBankExercise`, den enda vägen till en `BankExercise`. Den underkänner en övning som inte
  är godkänd, och projicerar samtidigt ner till de publicerade fälten.
- `isBankExercise`, som slutkontrollen nycklar R-022 mot.

`generateSession` tar `readonly BankExercise[]`. Att blanda in en klubbövning blir därmed ett
kompileringsfel och inte något som ska fångas av ett statusfält som R-106 upphäver. Appen
anropar `toBankExercise` på ett enda ställe, `src/data/bank.ts` (ADR 0015).

R-106:s inbytesväg i inkrement 4 måste därför gå genom en egen funktion, som prövar den egna
övningen mot säkerhetsreglerna för sig. Den funktionen får inte returnera en `BankExercise`.

**2. Bara vitlistade fält lämnar banken.** `src/regelmotor/schema/published.ts` håller
`PUBLISHED_FIELDS` — fälten motorn och gränssnittet faktiskt läser — och typen
`PublishedExercise`. Motorns `Exercise` är den typen: redaktionella fält finns varken som data
eller som typ i appen. Filens fulla form heter fortfarande `Exercise` i
`src/regelmotor/schema/ovning.ts` och används av valideringen och av inläsningen i `scripts/`.

Listan är en vitlista, så att ett nytt fält i schemat aldrig följer med ut av misstag. Samma
vitlista ska gälla när banken senare kommer från Supabase.

Filen ligger skild från `ovning.ts`, eftersom den läses i klienten och `ovning.ts` drar in
`zod`. Ett test i `scripts/ovningsbanken-plugin.test.ts` underkänner om `granskning` finns i
den byggda modulen.

## Alternativ

**Behålla statusfältet som gräns och lita på de tre lagren.** Det är vad som gäller i dag. Det
faller i samma stund R-106 införs, vilket är hela poängen med fyndet.

**En körtidskontroll i `generateSession` i stället för en typ.** Fångar felet först när det
redan har hänt, i stället för när koden skrivs, och säger ingenting till den som bygger
inkrement 4 om hur inbytet ska se ut.

**Ett eget register för klubbövningar utan gemensam typ alls.** Renare på papperet, men
klubbövningar och bankövningar delar format (ADR 0010) och ska visas i samma vyer. Att låta
klubbövningen vara en `Exercise` och bankövningen en smalare, märkt variant av den ger gränsen
utan att dubblera formatet.

**En svartlista över fält som inte ska publiceras.** Billigare i dag, men varje nytt
redaktionellt fält följer med ut i paketet tills någon kommer ihåg att lägga till det i
listan. Det är precis det felet som S-27 fann.

## Konsekvenser

**Fördelar**
- R-022 blir en egenskap hos typerna, som ADR 0011 redan påstod att den var.
- Den som bygger R-106 i inkrement 4 möts av ett kompileringsfel i stället för av en tyst
  läcka, och tvingas gå vägen förbi säkerhetsreglerna.
- Paketet tappar 83 kB redaktionell text som ingen användare har nytta av (S-27), och appens
  JavaScript går från 446 kB till 365 kB.

**Nackdelar och risker**
- Signaturen i ADR 0011 avsnitt 4 stämmer inte längre ordagrant: parametern heter `bank` som
  förut men har typen `BankExercise[]`. ADR 0011 ändras inte i efterhand; den här ADR:n är
  ändringen.
- Testerna behöver två fixturer: `contentExercise` för filens form, där ett test kan sätta en
  annan status, och `bankExercise` för det generatorn tar emot.
- Ett fält som läggs till i schemat syns inte i appen förrän det skrivs in i vitlistan.
  Inkrement 2 måste lägga till `planskiss` där.
- `toBankExercise` kastar för en övning som inte är godkänd. Det kan bara inträffa om
  statusfiltret i `scripts/bank.ts` går sönder, och då är ett avbrott rätt svar.
