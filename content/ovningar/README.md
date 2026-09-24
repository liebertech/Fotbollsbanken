# Övningsbanken

**Skrivs av:** ovningsforfattare · **Granskas av:** fotbollsexpert · **Godkänns av:** redaktör (en människa)

Här finns övningarna som regelmotorn sätter ihop till träningspass. Formatet, valideringen och vägen in i appen beslutas i [`docs/adr/0010-ovningsformat-och-lagring.md`](../../docs/adr/0010-ovningsformat-och-lagring.md). Den här filen är den korta arbetsbeskrivningen.

## Filer

- En övning är en YAML-fil: `content/ovningar/<id>.yaml`.
- `<id>` är övningens stabila ID: gemener, siffror och bindestreck, 3–64 tecken, bara ASCII. Filnamnet och fältet `id` ska vara lika.
- Ett ID ändras aldrig och återanvänds aldrig. Byt inte namn på en fil som redan finns i banken.
- Filer som börjar med `_` hoppas över av valideringen och importen.

Repot är källan. Filerna läses in i appens databas av ett CI-jobb, och bara filer med status `godkand` importeras.

## Status

Statusarna nedan gäller **filerna i det här repot**. Appens redaktörskö har egna värden: en inskickad övning är `inskickad`, inte `utkast`, och en egen övning i en klubb har ingen status alls, bara markeringen om den är komplett. Se ADR 0010, avsnitt 4.

```
utkast ──► granskad ──► godkand
  ▲            │
  └─ atgarda ◄─┘
```

| Status | Sätts av | Betyder |
|---|---|---|
| `utkast` | ovningsforfattare | Ny eller åtgärdad övning som väntar på granskning |
| `atgarda` | fotbollsexpert eller redaktör | Behöver ändras. Kommentarerna står i `granskning` |
| `granskad` | fotbollsexpert | Fotbollsfackligt granskad och väntar på godkännande |
| `godkand` | **bara arbetsflödet `godkann-omgang`** | Publicerad i banken och kan väljas av generatorn |

**Skriv aldrig `godkand` för hand.** Varken en människa eller en agent sätter det värdet. Det skrivs av CI efter att användaren har mergat omgångens pull request med sitt eget GitHub-konto (ADR 0013). En pull request som ändrar en status till `godkand` på något annat sätt underkänns av kontrollen `godkannande`.

## Fälten

Fullständiga regler, typer och intervall står i ADR 0010, avsnitt 1. `Krävs` betyder att fältet måste finnas för att filen ska få status `granskad` eller `godkand`.

| Fält | Innehåll | Krävs | Regel |
|---|---|---|---|
| `schema` | Versionen av formatet. Just nu `1` | ja | |
| `id` | Samma som filnamnet | ja | |
| `namn` | Kort namn som ledare känner igen, 3–60 tecken | ja | |
| `syfte` | En mening om vad spelarna ska lära sig | ja | |
| `beskrivning` | Hur övningen går till | ja | |
| `organisation` | Uppställning, grupper och rotation | ja | |
| `fokusomraden` | 1–3 nycklar ur `docs/doman/fokusomraden.md`. Den första är huvudfokus | ja | R-002 |
| `alder` | `min` och `max`, 6–19 | ja | R-003 |
| `spelformer` | 1–5 nycklar ur `docs/doman/spelformer.md` | ja | R-004 |
| `niva` | Lista med `niva-1`, `niva-2` eller `niva-3`. Både 1 och 3 kräver att 2 finns med | ja | R-001 |
| `passdelar` | `del-uppvarmning`, `del-ovning`, `del-spelovning` eller `del-spel`. Aldrig `del-avslutning` | ja | R-005 |
| `ledarbehov` | 0, 1 eller 2 ledare **per grupp** | ja | R-006 |
| `ledaruppgift` | Vad ledaren gör. Krävs när `ledarbehov` är 1 eller 2 | villkorat | |
| `spelare` | `min` och `max` **per grupp**, 1–40 | ja | R-007 |
| `grupptyp` | `fri`, `par`, `tva-lag` eller `fast-storlek` | ja | R-008 |
| `udda_antal_losning` | `true` eller `false`. Bara för `fast-storlek` | villkorat | R-008 |
| `tid` | `kortast`, `rekommenderad` och `langst` i hela minuter, minst 5 | ja | R-009 |
| `yta` | Mått per spelform, eller `alla` för samma mått överallt | ja | R-092 |
| `ytreferens` | Kort text som säger hur stor ytan är, jämfört med något ledaren känner igen. Samma nycklar som `yta`. Se nedan | nej | |
| `material` | Lista med `typ`, `antal` och `anteckning`. `typ` väljs ur den slutna listan i `docs/doman/passuppbyggnad.md`: `boll`, `kon`, `markering`, `vast`, `mal`, `minimal`, `hinder`, `ovrigt`. `ovrigt` kräver en anteckning | ja | R-084, R-120 |
| `coachningspunkter` | 2–4 punkter | ja | |
| `varianter` | `lattare` och `svarare` | ja | R-029 |
| `anpassning` | `fler_spelare`, `udda_antal` och `ledare` | ja | |
| `planskiss` | Skissdata. Formatet beslutas av planskissutvecklaren. Får utelämnas | nej | |
| `kalla` | Inspiration eller källa, om det finns någon | nej | |
| `status` | Se tabellen ovan | ja | |
| `granskning` | Lista med `datum`, `av`, `roll` och `kommentar` | ja | |

Att tänka på:

- **Nickning** märks med fokusområdet `nickspel`, inte med ett eget fält. En övning med `nickspel` måste ha `alder.min` minst 13 (R-081). En övning som innehåller nickning utan att vara märkt släpper förbi säkerhetsreglerna, så märk hellre en gång för mycket.
- **`spelare` och `ledarbehov` gäller en grupp**, inte hela laget. En övning för fyra spelare i taget har `spelare: min 4, max 4`, inte lagets storlek.
- **Skriv inga spelarnamn** någonstans i filen. Banken innehåller inga uppgifter om spelare.
- **Kopiera inte SvFF:s texter eller övningar ordagrant.** Bygg på principerna och ange källa i `kalla`.

### `ytreferens`, ytan i något ledaren känner igen

Ett mått som "30 × 20 meter" går inte att använda på en plan utan måttband. Appen visar därför måttet först och ytreferensen efter det, i parentes: **"30 × 20 meter (ungefär stora planens straffområde)"**. Beslutet står i [ADR 0017](../../docs/adr/0017-ytreferens-i-ovningsformatet.md).

```yaml
yta:
  alla:
    langd: 18
    bredd: 12
ytreferens:
  alla: stora planens målområde, dubbelt så djupt
```

Så här skriver du den:

- **Ordlistan står i `docs/doman/`.** Referensen bygger på den, och fotbollsexperten granskar att den gör det. Hitta inte på en egen jämförelse.
- **Skriv aldrig ett mått i texten.** Metertalet står redan före parentesen, och referensen är en jämförelse, inte ett andra mått. Valideringen underkänner `meter`, `m`, `cm`, `kvadratmeter` och deras släktingar, och mönstret tal × tal. Siffror är tillåtna i övrigt, eftersom spelformernas namn innehåller dem: *hela 7 mot 7-planen*. Steg är också tillåtna: *tio steg utanför straffområdet*.
- **Håll den kort**, ungefär 70 tecken, så att den ryms efter måttet på en mobilskärm. Taket är 90.
- **Skriv liten begynnelsebokstav och ingen punkt.** Texten står inuti en parentes mitt i en rad.
- **Säg vems plandel du menar.** *Straffområdet*, *målområdet* och *mittcirkeln* betyder alltid den fullstora planens, och formuleringen skriver ut det: *stora planens straffområde*. Menar du lagets eget, skriv *ert eget straffområde*. En andel av en spelforms plan skriver alltid ut spelformen: *halva 7 mot 7-planen*, aldrig bara *halva planen*.
- **Ange den per spelform när samma mått förtjänar olika referens.** 18 × 12 meter är *stora planens målområde, dubbelt så djupt* för ett 5 mot 5-lag och *ert eget straffområde* för ett 9 mot 9-lag. Nycklarna följer `yta`: `alla`, eller en spelform som finns i `spelformer`.
- **Utelämna fältet hellre än att hitta på.** Ingen status kräver det, och för en del övningar är det rätt svar att inte ge någon referens: positionsspel och stationer där måttet är själva poängen, och dueller med startavstånd. En parentes som antyder "ungefär" är direkt fel där.

Fältet visas bara. Det filtrerar ingenting och påverkar inte vilka övningar generatorn väljer: ytkontrollen räknar vidare på `langd` och `bredd` (R-092).

## Validering

```
npm run validera:ovningar          # alla filer
npm run validera:ovningar -- <fil> # en fil
```

Kommandot finns när bygget har börjat i fas 4. Fram till dess granskas filerna för hand mot tabellen ovan. Valideringen körs också i CI vid varje ändring under `content/ovningar/`, och som första steg i importen till databasen.

## Exempel på filens form

Exemplet visar formatet, inte en granskad övning. Texterna är avsiktligt korta.

```yaml
schema: 1
id: passa-och-folj
namn: Passa och följ
syfte: Spelarna ska passa med rätt kraft och röra sig efter passningen.
beskrivning: |
  Fyra spelare står i varsitt hörn av en kvadrat. Spelaren med boll passar
  till nästa hörn och följer efter sin egen passning.
organisation: |
  En kvadrat per grupp om fyra. En boll per grupp. Byt riktning efter halva tiden.
fokusomraden:
  - passning-mottagning
  - spelbarhet
alder:
  min: 10
  max: 12
spelformer:
  - 7mot7
niva:
  - niva-1
  - niva-2
passdelar:
  - del-uppvarmning
  - del-ovning
ledarbehov: 0
spelare:
  min: 4
  max: 4
grupptyp: fast-storlek
udda_antal_losning: true
tid:
  kortast: 8
  rekommenderad: 12
  langst: 15
yta:
  alla:
    langd: 15
    bredd: 15
ytreferens:
  alla: ungefär en tredjedel av stora planens straffområde
material:
  - typ: boll
    antal: 1
    anteckning: en per grupp
  - typ: kon
    antal: 4
coachningspunkter:
  - Passa med insidan och lagom kraft.
  - Rör dig direkt efter passningen.
varianter:
  lattare: Stå stilla efter passningen.
  svarare: Två bollar i gång samtidigt.
anpassning:
  fler_spelare: Fler kvadrater bredvid varandra.
  udda_antal: Den femte spelaren vilar ett varv och byter in.
  ledare: Med en ledare per grupp kan coachningen ske under gång.
kalla: Egen övning, inspirerad av allmänt känd passningsövning.
status: utkast
granskning: []
```
