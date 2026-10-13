Status: godkänd (K2, 2026-09-12)

# Vy: Mitt konto – utloggning på alla enheter och radera sitt konto

**Uppfyller:** berättelse 26 (radera konto) och 27 (logga ut på alla enheter).

**Läge:** Planeringsläget.

**Bakgrund:** säkerhetsgranskningens fynd S-10 kräver en fungerande väg för radering i appen, inte bara i drift. Delat material (lagets pass, klubbens egna övningar, godkända bidrag till den gemensamma banken) finns kvar avidentifierat, eftersom andra ledare och lag är beroende av det. Fynd S-11 kräver att en person kan avbryta åtkomsten från en borttappad enhet.

**Placering:** vyn nås från menyn, punkten "Mitt konto" (`16-navigering.md`). Den ligger inte på startsidan, så att de två åtgärderna aldrig trycks av misstag.

## Wireframe, 360 px – Mitt konto

```
┌────────────────────────────────┐
│ ← Mitt konto                    │
│                                 │
│ Namn: Björn Enbom               │
│ E-post: bjorn@exempel.se        │
│                                 │
│ Om du tappat en telefon         │
│ ┌───────────────────────────┐  │
│ │  Logga ut på alla enheter  │  │  ← sekundär, öppnar bekräftelse
│ └───────────────────────────┘  │
│                                 │
│ ──────────────────────────────  │
│ Radera kontot                   │
│ ┌───────────────────────────┐  │
│ │  Radera mitt konto         │  │  ← destruktiv, egen sektion
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

Den vanliga "Logga ut" finns i menyn, inte här (berättelse 27, kriterium 6: åtgärden "Logga ut på alla enheter" ska vara skild från den vanliga utloggningen). Sektionsrubrikerna "Om du tappat en telefon" och "Radera kontot" är h2.

## Wireframe, 360 px – Logga ut på alla enheter (bekräftelse)

En dialog (`designsystem.md` 6.8) öppnas av knappen. Åtgärden går inte att ångra efteråt (alla måste logga in på nytt), därför en bekräftelse, men den är kort.

```
┌────────────────────────────────┐
│ ✕ Logga ut på alla enheter?     │
│                                 │
│ Du loggas ut här direkt. Andra  │
│ enheter loggas ut inom högst    │
│ en timme. Därefter måste du     │
│ logga in med en ny kod på       │
│ varje enhet.                    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Logga ut på alla enheter   │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Efter bekräftelse (27.1, 27.4):** den här enheten loggas ut direkt och dess lokala kopia rensas. Personen kommer till inloggningen med informationsrutan "Du är utloggad på alla enheter. Det kan dröja upp till en timme …" (`14-inloggning.md`).
- **Ärligheten (27.2, 27.4):** texten påstår inte att andra enheter redan är stängda ute. Den säger två saker: att det kan dröja upp till en timme, och att en enhet utan nät behåller sin sparade kopia tills den får kontakt igen.
- **Nät saknas (27.5):** dialogen visar "Du verkar sakna internetanslutning. Du är fortfarande inloggad och ingen enhet har loggats ut. Försök igen när du är uppkopplad." Den egna enhetens kopia rensas inte, och sessionen finns kvar. Inget påstås vara gjort.

## Wireframe, 360 px – Radera konto, blockerad (flera orsaker kan gälla samtidigt)

Blockeringsvyn visar **alla** orsaker som gäller, inte bara den första, så att personen inte löser en och sedan stöter på nästa. Varje orsak har en egen ruta och en egen knapp.

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ Du kan inte radera ditt konto   │
│ än:                             │
│                                 │
│ ┌───────────────────────────┐  │
│ │ ⛔ Du är den enda          │  │
│ │ klubbadminen i IK Exempel.  │  │
│ │ Utse en efterträdare innan  │  │
│ │ du kan radera ditt konto.   │  │
│ │ [Utse en efterträdare]      │  │  ← leder till 13-klubbadmin-lag.md
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ ⛔ Du är den enda          │  │
│ │ redaktören. Utse en annan   │  │
│ │ redaktör innan du kan       │  │
│ │ radera ditt konto.          │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ ⛔ Du är redaktörernas      │  │
│ │ ägare. Ägarskapet kan inte  │  │
│ │ flyttas i appen än. Kontakta│  │
│ │ den som driver              │  │
│ │ Fotbollsbanken.             │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Ensam klubbadmin (26.3):** gäller när klubben har andra medlemmar än personen. Har personen flera klubbar, finns en ruta per klubb där det gäller. Knappen leder till klubbens ledarlista i `13-klubbadmin-lag.md` där "Gör till klubbadmin" finns (09.4).
- **Ensam klubbadmin, men också ensam medlem:** blockerar inte. Då gäller varningen i nästa wireframe i stället (26.9).
- **Sista redaktören och redaktörernas ägare (26.4, 26.10):** knappen "Utse en redaktör" visas först när inkrement 4 har byggt gränssnittet för det (berättelse 18). Till dess visas bara texten, och för ägaren hänvisningen att kontakta den som driver Fotbollsbanken, eftersom något sätt att flytta ägarskapet i appen inte finns (se *Beslut som behövs*, rapporten). Skärmen får inte låta som att personen själv kan lösa det, när hon eller han inte kan.
- Ingen "Radera"-knapp visas i den här vyn. Det finns inget att trycka som ser ut att fungera men nekas.

## Wireframe, 360 px – Radera konto, vad som händer (ledare med lag, klubben finns kvar)

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ Det här raderas                 │  ← h2
│  • Din profil (namn, e-post)    │
│  • Dina personliga pass som     │
│    inte är kopplade till ett lag│
│  • Dina medlemskap i lag och    │
│    klubbar                      │
│  • Väntande inbjudningar du     │
│    skickat                      │
│                                 │
│ Det här blir kvar, avidenti-    │  ← h2
│ fierat                          │
│  • Pass du sparat åt ett lag    │
│  • Övningar du skapat i klubben │
│  • Övningar du fått godkända    │
│    i den gemensamma banken      │
│  Skaparen visas då som          │
│  "Borttagen användare".         │
│                                 │
│ ⚠ Det går inte att ångra.       │
│                                 │
│ Skriv ditt namn för att         │
│ bekräfta                        │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Radera mitt konto          │  │  ← destruktiv, aria-disabled tills
│ └───────────────────────────┘  │     namnet stämmer
│ ┌───────────────────────────┐  │
│ │  Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Radera konto, ensam medlem i klubben (26.9)

Gäller när personen är den enda medlemmen i en klubb (alltså både enda klubbadmin och enda ledare, utan andra medlemmar). Då raderas klubben, dess lag, lagets pass och klubbens egna övningar tillsammans med kontot. Det är en mycket större följd än vanligt och får därför en egen, högst upp placerad varningsruta, och listan "Det här raderas" blir längre. Ingenting av detta får gömmas bakom en panel.

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ ┌───────────────────────────┐  │
│ │ ⚠ Klubben IK Exempel       │  │  ← varningstriangel, h2
│ │ raderas också              │  │
│ │ Du är den enda medlemmen.   │  │
│ │ Klubben, dess lag, lagens   │  │
│ │ pass och klubbens egna      │  │
│ │ övningar raderas för alltid │  │
│ │ och går inte att få tillbaka│  │
│ └───────────────────────────┘  │
│                                 │
│ Det här raderas                 │
│  • Din profil (namn, e-post)    │
│  • Klubben IK Exempel           │
│  • 2 lag                        │
│  • 14 sparade pass i lagen      │
│  • 3 egna övningar i klubben    │
│  • Dina personliga pass         │
│  • Väntande inbjudningar        │
│                                 │
│ Det här blir kvar, avidenti-    │
│ fierat                          │
│  • Övningar du fått godkända    │
│    i den gemensamma banken      │
│  Skaparen visas då som          │
│  "Borttagen användare".         │
│                                 │
│ ⚠ Det går inte att ångra.       │
│                                 │
│ Skriv ditt namn för att         │
│ bekräfta                        │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Radera mitt konto och       │  │  ← destruktiv, aria-disabled
│ │ klubben                     │  │     tills namnet stämmer
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Antalen visas:** antal lag, sparade pass och egna övningar hämtas när vyn öppnas, så att personen ser hur mycket som försvinner. Är ett antal noll hoppas raden över. Går antalen inte att hämta (nät saknas) går det inte heller att radera (26.12).
- **Knappen säger vad som händer:** "Radera mitt konto och klubben". Är personen ensam medlem i flera klubbar, finns en varningsruta per klubb, och knappen säger "Radera mitt konto och klubbarna".
- **Bekräftelsen är fortfarande personens eget namn** (26.6), också här. Det är samma gest i båda fallen, och att skriva klubbens namn är inte ett krav (rättat 2026-10-13, se *Ändringar*). Skillnaden ligger i varningsrutan och i knappens text, inte i en annan bekräftelse.
- **Blandat läge:** är personen ensam medlem i en klubb men medlem bland andra i en annan, visas varningsrutan för den första och vanliga listor för den andra. Den andra klubbens material blir kvar avidentifierat.

## Wireframe, 360 px – Raderingen blev inte klar (26.11)

Raderingen sker i flera steg. Misslyckas ett steg visas ett besked i stället för ett halvraderat, oanvändbart konto, och samma radering går att göra om.

```
┌────────────────────────────────┐
│ ← Radera mitt konto             │
│                                 │
│ ⛔ Raderingen blev inte klar.   │
│ Försök igen. Det går bra att    │
│ göra om, och inget raderas två  │
│ gånger.                         │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Försök radera igen         │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Efter radering (26.13)

Personen kommer till inloggningens första steg med bekräftelsen "Ditt konto är raderat. Du är utloggad." som informationsruta (samma plats och mönster som efter "Logga ut på alla enheter" i `14-inloggning.md`). Tillbaka-knappen i webbläsaren visar ingen inloggad vy.

## Beteende och tillstånd

- **Blockeringar (S-10, S-15):** appen kontrollerar när vyn öppnas om personen är den enda klubbadminen i en klubb med andra medlemmar, den enda redaktören eller redaktörernas ägare. Är något sant visas blockeringsvyn i stället för raderingsformuläret, med alla orsaker. Har personen flera klubbar kontrolleras alla.
- **Tydlig lista, inte en enda mening:** vad som raderas och vad som blir kvar visas som två separata listor, aldrig gömda bakom en accordion, eftersom det är den viktigaste informationen i hela vyn.
- **Bekräftelse med textinmatning (26.6):** ledaren skriver sitt eget namn precis som det står på kontot (inte klubbens namn, inte bara ett klick i en dialogruta) innan "Radera mitt konto" går att trycka, för att en oavsiktlig radering på en delad enhet ska vara osannolik. Jämförelsen ignorerar versaler och extra blanksteg i början och slutet, men inte stavning.
- **Ingen ångra:** varningstexten är alltid synlig, inte bara i en dialogruta som kan missas.
- **Efter radering:** personen loggas ut omedelbart, all lokal cache rensas (som vid vanlig utloggning, `docs/adr/0005-daligt-nat-och-offline.md`), och samma e-postadress kan senare skapa ett helt nytt konto men kopplas inte till det gamla kontots historik.
- **Nätkrav (26.12, 27.5):** både radering och utloggning på alla enheter kräver nät. Saknas nät visas en särskild text som säger att inget har raderats respektive att ingen enhet har loggats ut (`texter.md` avsnitt 16), i stället för den allmänna texten. Det som skrivits i bekräftelsefältet finns kvar.
- **Spärr mot att radera någon annans konto (26.14):** inget i vyn tar emot ett id. Det gäller bara det inloggade kontot.

## Tillgänglighet

- De två listorna ("raderas" / "blir kvar avidentifierat") har varsin rubrik (`h2` eller motsvarande) så att en skärmläsare kan hoppa mellan dem. Varningsrutan för ensam medlem är en egen `h2` före dem.
- Bekräftelsefältet har en synlig etikett och ett tydligt felmeddelande om det skrivna namnet inte stämmer.
- "Radera mitt konto"-knappen har `aria-disabled` med en kopplad förklaring (`aria-describedby` mot texten "Skriv ditt namn för att bekräfta"), i stället för att vara helt dold, tills bekräftelsen är korrekt ifylld.
- Blockeringsrutorna och felet "Raderingen blev inte klar" har `role="alert"`, så att de läses upp när vyn öppnas respektive när felet uppstår.
- Dialogen för "Logga ut på alla enheter" fångar fokus, stänger med Escape och återger fokus till knappen som öppnade den (`designsystem.md` 6.8).
- Träffyta minst 48 × 48 px, som i övriga vyer.

## Beroenden till andra vyer

- Blockeringsläget länkar till `13-klubbadmin-lag.md` för att utse en ny klubbadmin.
- Nås från menyn, punkten "Mitt konto" (`16-navigering.md`).
- Efter "Logga ut på alla enheter" och efter radering visas `14-inloggning.md`.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-13 | Placering i menyn (`16-navigering.md`) i stället för "avgörs i inkrement 3". Ny bekräftelsedialog och ärlig text för "Logga ut på alla enheter" (27.2, 27.4, 27.5). Blockeringsvyn visar alla orsaker och täcker också sista redaktören och redaktörernas ägare (26.4, 26.10). Ny varning för den som är ensam medlem i en klubb (26.9, användarens beslut 2026-10-13). Nytt läge för en radering som inte blev klar (26.11). Bekräftelsen är personens eget namn, i linje med kriterium 26.6 (`floden.md` avsnitt 5 sade tidigare "klubbens eller sitt eget namn", rättat). Statusraden ändras inte av en agent. |
