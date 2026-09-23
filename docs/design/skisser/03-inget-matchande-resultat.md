Status: godkänd (K2, 2026-09-12)

# Vy: Inget matchande resultat

**Uppfyller:** berättelse 03 (inget matchande resultat), R-100 till R-103.

**Läge:** Planeringsläget.

**Viktigt designval:** den här vyn visas bara när **inget pass alls** kunde skapas (R-101: ingen av Öva, Spelövning, Spel kunde fyllas). Om minst en av dem kunde fyllas visas i stället `02-genererat-pass.md` med de tomma delarna markerade där. De två vyerna delar samma förklarande komponent för "varför", se nedan.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Nytt pass                    │
│                                 │
│         🔍  (ingen ikon med     │
│          bara färg som signal)  │
│                                 │
│  Vi kunde inte skapa ett pass   │
│  med de här uppgifterna.        │
│                                 │
│  Det finns för få övningar som  │
│  matchar allt du valt. Prova    │
│  att ändra ett av de här:       │
│                                 │
│  • Nivå                        │
│  • Fokusområden (Avslut)        │
│  • Antal spelare                │
│                                 │
│  Vi ändrar ingenting åt dig –   │
│  gå tillbaka och justera det    │
│  du vill testa.                 │
│                                 │
│ ┌───────────────────────────┐  │
│ │   Ändra uppgifter (←)      │  │  ← 48 px, tar tillbaka
│ └───────────────────────────┘  │     till ifyllt underlag
│                                 │
│  Ditt underlag just nu:         │
│  11 år · 7 mot 7 · Fortsättning │
│  · 14 spelare · 2 ledare ·      │
│  60 min · Passning och          │
│  mottagning, Avslut              │
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Vilka val pekas ut (03.2, R-103):** listan visar bara *vilka fält* som skulle kunna lösa problemet var för sig ("Nivå", "Fokusområden", "Antal spelare" osv.), aldrig ett förslag på nytt värde. Om ett specifikt fokusområde är boven (till exempel att just `avslut` gör att inget går ihop) namnges det området, som i exemplet ovan, men fortfarande utan ett förslag på ersättning.
- **Tom lista över fält – två möjliga texter, inte en (rättat vid granskningen inför K4, 2026-09-23):** när listan med ändringsbara fält är tom finns *inte* bara ett läge, utan två, som lätt blandas ihop:
  - **Kan inte kombineras (R-100 andra punkten):** en bekräftad orsak, till exempel att en och samma övning skulle behövas i två delar samtidigt, eller att nicktaket skulle överskridas. Texten: "Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val."
  - **Inget enskilt val hjälper (tillagd 2026-09-23):** listan är tom, men vyn har *ingen* bekräftelse på att det verkligen finns övningar som passar var för sig – till exempel för att banken helt saknar övningar för den valda spelformen (11 mot 11 i dag). Att påstå att sådana övningar finns vore då felaktigt. Texten: "Vi hittade inga övningar som matchar de här valen, och vi kan inte peka ut ett enskilt val som skulle lösa det. Prova att ändra flera uppgifter i underlaget samtidigt."

  **Vilken av de två visas:** `NoSessionReason` (regelmotorns svar när inget pass alls kunde skapas) innehåller i dag bara den samlade listan över ändringsbara fält, `changeableFields` – ingen bekräftad kombinationsorsak. Det betyder att vyn i praktiken *aldrig* kan veta att "kan inte kombineras" verkligen stämmer. Tills regelmotorn kan lämna en sådan bekräftad signal ska vyn därför visa **"Inget enskilt val hjälper"** varje gång listan är tom, inte "Kan inte kombineras". Se `texter.md` avsnitt 5 för exakt formulering av alla tre varianterna, och rapporten från granskningen inför K4 för bakgrunden.
- **"Ändra uppgifter":** går tillbaka till `01-underlag.md` med alla värden kvar ifyllda (03.3). Ledaren ändrar själv, appen ändrar aldrig ett värde automatiskt.
- **Sammanfattningen längst ner** låter ledaren se exakt vad hon eller han bad om, utan att behöva bläddra tillbaka för att minnas det.
- Vyn har ingen "försök igen automatiskt"-knapp, eftersom det inte finns något nytt att generera förrän ledaren ändrat något.

## Tillgänglighet

- Rubriken "Vi kunde inte skapa ett pass …" är en riktig h1/h2 så att skärmläsare direkt hör vad som hänt.
- Listan med fält är en riktig lista (`ul`/`li`), inte fritext med punkter, för korrekt uppläsning.
- Färgen på ikonen bär ingen egen betydelse (samma gråtoner i ljust/mörkt läge, se `designsystem.md`) – all information finns i texten.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-23 | Tillagt: den tomma fältlistan kan bero på två olika saker, och vyn kan i dag bara skilja "lista finns" från "listan är tom" – inte om en kombinationskonflikt verkligen är bekräftad. Ny text "Inget enskilt val hjälper" ska visas när listan är tom, i stället för "Kan inte kombineras", tills regelmotorn kan bekräfta orsaken. Upptäckt vid granskningen av det byggda gränssnittet inför K4, där 11 mot 11 (banken saknar övningar helt) visade "Kan inte kombineras" trots att påståendet inte stämde. Statusraden överst ändras inte av en agent. |
