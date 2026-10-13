Status: godkänd (K2, 2026-09-12)

# Vy: Inloggning och registrering – engångskod via e-post

**Uppfyller:** berättelse 08 (registrera konto och logga in), grunden för 11 (acceptera inbjudan) och bekräftelsen i 27 (logga ut på alla enheter).

**Läge:** Planeringsläget (vanlig kontrast, vanlig text).

**Bakgrund:** enligt `docs/adr/0004-inloggning.md` finns inget lösenord. Ledaren anger e-post, får en engångskod och skriver in den. Samma kodsteg används vid inloggning och vid registrering.

## Kodlängd (beslut 2026-10-13: 8 siffror om Supabase tillåter det, annars 6)

Kodens längd är **ett enda värde**, `kodlängd`, och alla texter och fält nedan hänvisar till det. Wireframes visar **8** (användarens beslut 2026-10-13). Visar kontrollen av Supabase-projektet (berättelse 08, kriterium 8e) att bara 6 går, ändras bara värdet `kodlängd` till 6. Ingen text, ingen etikett och ingen skiss behöver skrivas om, och inga andra delar av vyn påverkas.

- **Etikett:** "Kod ({kodlängd} siffror)". Texten står bara i `texter.md` avsnitt 2 och bygger på platshållaren.
- **Fältet:** ett enda fält, `maxlength` lika med `kodlängd`, `inputmode="numeric"`, `autocomplete="one-time-code"`. Ledaren ska inte behöva skriva ett mellanslag. Klistras en kod in med mellanslag eller bindestreck tas de bort tyst innan koden prövas.
- **Läsbarhet:** siffrorna visas med extra teckenavstånd (minst 0,15 em) och minst 24 px storlek, så att 8 siffror går att kontrollera mot mejlet. Fältet får inte delas i en ruta per siffra, eftersom det bryter automatisk ifyllning och inklistring.
- **Mejlet:** koden skrivs i mejlet i grupper om fyra (8 siffror) eller tre (6 siffror) för att vara lätt att läsa av; se `texter.md` avsnitt 17.

## Wireframe, 360 px – Logga in (steg 1: e-post)

```
┌────────────────────────────────┐
│  ⚽ Fotbollsbanken              │
│                                 │
│  Logga in                      │
│                                 │
│  E-post                        │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ☑ Jag är inte en robot     │ │  ← Cloudflare Turnstile
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Skicka kod          │ │  ← 48 px hög knapp
│  └───────────────────────────┘ │
│                                 │
│  ──────────────────────────    │
│  Har du inget konto?           │
│  ┌───────────────────────────┐ │
│  │      Skapa konto           │ │
│  └───────────────────────────┘ │
└────────────────────────────────┘
```

## Wireframe, 360 px – Logga in efter "Logga ut på alla enheter" (27.4)

Bekräftelsen syns på inloggningssidan som personen kommer till (berättelse 27, kriterium 4). Den är en informationsruta (ⓘ), inte en varning: åtgärden lyckades. Texten ställer sig mellan rubriken och e-postfältet och försvinner när personen går vidare till kodsteget.

```
┌────────────────────────────────┐
│  ⚽ Fotbollsbanken              │
│                                 │
│  Logga in                      │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ⓘ Du är utloggad på alla   │ │
│  │ enheter. Det kan dröja upp │ │
│  │ till en timme innan en     │ │
│  │ annan enhet har loggats    │ │
│  │ ut. En enhet utan nät      │ │
│  │ behåller sin sparade kopia │ │
│  │ tills den får kontakt      │ │
│  │ igen.                      │ │
│  └───────────────────────────┘ │
│                                 │
│  E-post                        │
│  …                             │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skapa konto (steg 1)

```
┌────────────────────────────────┐
│  ← Skapa konto                 │
│                                 │
│  Namn                          │
│  ┌───────────────────────────┐ │
│  └───────────────────────────┘ │
│  Visas för andra ledare i      │
│  dina lag.                     │
│                                 │
│  E-post                        │
│  ┌───────────────────────────┐ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ☑ Jag är inte en robot     │ │  ← Cloudflare Turnstile
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Skicka kod          │ │
│  └───────────────────────────┘ │
│                                 │
│  Vi sparar bara det som         │
│  behövs för ditt konto. Inga    │
│  uppgifter om spelare.          │
└────────────────────────────────┘
```

## Wireframe, 360 px – Skriv in koden (steg 2, gemensam)

```
┌────────────────────────────────┐
│  ← Skriv in koden               │
│                                 │
│  Vi har skickat en kod till     │
│  anna@exempel.se.               │
│                                 │
│  ⓘ Hittar du inget mejl om en   │
│  liten stund? Kolla även i      │
│  skräpposten.                   │
│                                 │
│  Kod (8 siffror)                │  ← kodlängd, se avsnittet ovan
│  ┌───────────────────────────┐ │
│  │  1 2 3 4 5 6 7 8          │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │      Bekräfta kod           │ │
│  └───────────────────────────┘ │
│                                 │
│  Skicka ny kod (47 s)           │  ← inaktiv text under väntetiden
│                                 │
│  Fel e-postadress? Gå tillbaka  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Fel kod

```
┌────────────────────────────────┐
│  ← Skriv in koden               │
│                                 │
│  ⛔ Koden stämmer inte.          │
│  Kontrollera siffrorna och      │
│  försök igen.                   │
│                                 │
│  Kod (8 siffror)                │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │      Bekräfta kod           │ │
│  └───────────────────────────┘ │
│  Skicka ny kod                  │  ← aktiv, väntetiden är slut
└────────────────────────────────┘
```

## Wireframe, 360 px – Kontrollen (Turnstile) går inte att ladda (08.9)

Gäller när Cloudflares kontroll blockeras (innehållsblockerare, företagsnät) eller inte kan hämtas utan nät. Personen ska aldrig sitta fast i ett tyst läge: knappen "Skicka kod" är kvar och klickbar, men säger vad som saknas.

```
┌────────────────────────────────┐
│  ⚽ Fotbollsbanken              │
│                                 │
│  Logga in                      │
│                                 │
│  E-post                        │
│  ┌───────────────────────────┐ │
│  │ anna@exempel.se           │ │
│  └───────────────────────────┘ │
│                                 │
│  ⛔ Vi kunde inte göra          │
│  kontrollen som visar att du    │
│  är en person. Kontrollera      │
│  din anslutning. Blockerar du   │
│  innehåll från andra            │
│  webbplatser kan du behöva      │
│  tillåta Cloudflare.            │
│  ┌───────────────────────────┐ │
│  │  Försök kontrollen igen    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │        Skicka kod          │ │  ← ger felet "Bekräfta först …"
│  └───────────────────────────┘ │     tills kontrollen är godkänd
└────────────────────────────────┘
```

## Wireframe, 360 px – Väntetid och gränser (08.8)

Tre olika lägen, alla utan att avslöja om adressen har ett konto (S-13):

```
Väntetid mellan koder (60 s)            För många koder i rad (server nekar)
┌─────────────────────────┐            ┌─────────────────────────┐
│ Skicka ny kod (47 s)    │            │ ⛔ Du har begärt för    │
│ Du kan begära en ny kod │            │ många koder just nu.    │
│ om 47 sekunder.         │            │ Vänta en stund och      │
│                         │            │ försök igen.            │
└─────────────────────────┘            └─────────────────────────┘

Tjänstens gräns för mejl per timme nådd
┌─────────────────────────┐
│ ⛔ Det går inte att     │
│ skicka fler koder just  │
│ nu. Försök igen om en   │
│ liten stund.            │
└─────────────────────────┘
```

## Wireframe, 360 px – Inbjudan fungerar inte (11.4, 11.5, 11.7)

Visas när någon öppnar en inbjudningslänk som inte kan användas. Vyn nämner varken klubb, lag eller den inbjudna adressen, eftersom länken kan ha hamnat hos fel person (S-14). Ingen kopplas till något lag. Orsakerna skiljs åt med egna texter, så att ledaren vet vad hon eller han ska göra.

```
┌────────────────────────────────┐
│  ⚽ Fotbollsbanken              │
│                                 │
│  Inbjudan fungerar inte        │
│                                 │
│  ⛔ Den här inbjudan har gått   │
│  ut. Be den som bjöd in dig     │
│  om en ny.                      │
│                                 │
│  ┌───────────────────────────┐ │
│  │        Logga in            │ │
│  └───────────────────────────┘ │
└────────────────────────────────┘
```

Samma vy, olika text i rutan (alla texter i `texter.md` avsnitt 2):

| Orsak | Visas när | Knapp under rutan |
|---|---|---|
| Har gått ut | Mer än 14 dagar sedan inbjudan skickades | Logga in |
| Är återkallad | Klubbadmin har dragit tillbaka den | Logga in |
| Är redan använd | Någon har redan accepterat | Logga in |
| Gäller en annan adress | Personen är inloggad med en annan adress än den inbjudna | Logga ut och byt konto |
| Länken fungerar inte | Okänd eller avkortad nyckel | Logga in |
| För många försök | Gränsen för felaktiga nycklar nådd (11.7) | (ingen) |

"Gäller en annan adress" nämner inte vilken adress inbjudan gäller, bara att den inte är den personen är inloggad med. Då kan en vidarebefordrad länk inte användas för att ta reda på någons adress.

## Beteende och tillstånd

- **Steg 1 gäller lika för okänd och känd adress (S-13):** oavsett om adressen har ett konto eller inte visar appen samma bekräftelse och går vidare till kodsteget: "Om adressen finns hos oss har vi skickat en kod." Appen avslöjar aldrig om ett konto finns. Vid registrering skapas kontot först när koden bekräftas.
- **CAPTCHA före kodbeställning:** Turnstile-rutan måste vara godkänd innan "Skicka kod" fungerar. Rutan är i normalfallet osynlig/automatisk för de flesta besökare (icke-interaktiv), men visas som i skissen när Cloudflare behöver en bekräftelse. Turnstile ersätter aldrig gränserna för antal försök nedan. Trycker personen "Skicka kod" innan kontrollen är godkänd, visas "Bekräfta först att du är en person." under rutan och fokus flyttas dit. Kan kontrollen inte laddas visas felrutan ovan.
- **Väntetid mellan kodbeställningar (S-18):** minst 60 sekunder mellan varje ny kod till samma adress. Under väntetiden visas nedräkningen som text, inte bara en gråtonad knapp, så att skärmläsare uppfattar varför knappen inte går att trycka.
- **Fel kod (08.3):** tydligt felmeddelande ovanför fältet, fältet töms, fokus läggs i fältet igen. Efter för många felaktiga försök (5 per kod, se berättelse 08 kriterium 8) ogiltigförklaras koden och appen visar att en ny kod krävs.
- **Fyra olika kodfel (08.3):** fel kod, utgången kod (10 minuter), redan använd kod och ogiltigförklarad kod (för många försök, eller ersatt av en nyare kod) har egna texter. Går de inte att skilja åt i Supabase (senior-systemutvecklaren avgör), används den gemensamma texten "Koden stämmer inte eller har gått ut. Begär en ny kod." för de fall som inte går att skilja åt.
- **Koden är för kort eller innehåller något annat än siffror:** fältet markeras innan något skickas, med "Koden ska ha {kodlängd} siffror." Ingen serverförfrågan görs.
- **Skräppost, lugn ton:** texten är en upplysning, inte en varning – ingen ikon för fel eller varning, bara en informationsikon (ⓘ), eftersom det är normalt att mejlet dröjer när appen inte har en egen avsändardomän i version 1.
- **Inbjudan (11.1):** en person som klickar en inbjudningslänk i sin e-post kommer till steg 1 med en rad överst: "Du är inbjuden till [Lagnamn] i [Klubbnamn]." E-postfältet är förifyllt och låst till den inbjudna adressen. Efter att koden är bekräftad kopplas kontot automatiskt till laget. Nyckeln i länken ligger i URL-fragmentet och tas bort ur adressfältet direkt efter att appen har läst den (11.6). Ett inbjudningsbanner som visas för en inloggad person med fel adress ersätts av vyn "Inbjudan fungerar inte" ovan.
- **Utloggning (08.4):** en meny (se `16-navigering.md`) innehåller "Logga ut". Efter utloggning visas steg 1; sparade pass och klubbmaterial är otillgängliga tills ny inloggning, och den lokala kopian på enheten är rensad.
- **Utloggning på alla enheter (27.4):** efter åtgärden (se `15-radera-konto.md`) kommer personen hit med informationsrutan i andra wireframen ovan. Rutan lovar inte mer än ADR 0004 ger: andra enheter loggas ut inom högst en timme, och en enhet utan nät behåller sin kopia tills den får kontakt.
- **Tomt fält:** knapparna är alltid klickbara men visar fel om fält saknas, i stället för att vara inaktiverade (så att skärmläsare alltid kan nå dem och beskriva varför de inte går igenom).
- **Laddning:** knapparna visar en spinner och en text ("Skickar kod …", "Kontrollerar kod …") så att ett dubbelklick inte skickar formuläret två gånger.
- **Nät saknas (08.12):** "Skicka kod" och "Bekräfta kod" visar den vanliga texten för handlingar som kräver nät (`texter.md` avsnitt 15), och det som skrivits ligger kvar.
- **Namn vid registrering (08.1):** obligatoriskt, högst 100 tecken. Tomt eller bara blanksteg ger "Fyll i namn för att fortsätta."
- **Delad enhet (08.10):** ingen text i vyn, men efter inloggning visas aldrig den förra användarens namn, lag eller pass, inte ens ett ögonblick medan data hämtas.
- **Inget lösenord finns någonstans i flödet.** Det finns ingen länk "Glömt lösenord?".

## Mejlen

Texterna till inloggningsmejlet och inbjudningsmejlet finns i `texter.md` avsnitt 17. Inloggningsmejlet innehåller bara koden, ingen länk (08.11), och samma text används vid registrering och inloggning.

## Tillgänglighet

- Fälten har synliga etiketter (inte bara platshållartext), kopplade med `label`/`for` eller motsvarande.
- Felmeddelanden är kopplade till respektive fält (aria-describedby eller motsvarande) och läses upp av skärmläsare.
- Kodfältet har `inputmode="numeric"` och `autocomplete="one-time-code"`, så att mobilens tangentbord och automatisk kodifyllning (SMS/mejl) fungerar. Etiketten och `maxlength` följer `kodlängd`.
- Nedräkningen för "Skicka ny kod" annonseras via `aria-live="polite"` med rimliga intervall, inte varje sekund.
- Informationsrutan efter "Logga ut på alla enheter" och felet när kontrollen inte kan laddas annonseras via `role="status"` respektive `role="alert"`, så att de läses upp utan att personen behöver leta.
- Träffyta på knappar minst 48 × 48 px.

## Beroenden till andra vyer

- Efter bekräftad kod: ledare → startsida "Sparade pass" (`05-sparade-pass.md`), klubbadmin utan klubb → uppmaning att skapa klubb (`13-klubbadmin-lag.md`), redaktör → extra punkt i menyn för redaktörskön (`12-redaktorsko.md`, `16-navigering.md`).
- "Logga ut på alla enheter" och "Radera mitt konto" finns i `15-radera-konto.md` (vyn Mitt konto).

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-13 | Kodlängd 8 siffror (användarens beslut), som ett enda värde som lätt återställs till 6. Nya lägen: bekräftelse efter "Logga ut på alla enheter" (27.4), Turnstile som inte kan laddas (08.9), väntetid och gränser (08.8), inbjudan som inte fungerar (11.4, 11.5, 11.7), fyra kodfel (08.3), kod av fel längd. Hänvisning till nya `16-navigering.md`. Statusraden ändras inte av en agent. |
