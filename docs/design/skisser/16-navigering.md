Status: utkast

# Vy: Navigering och meny

**Uppfyller:** berättelse 08 (kriterium 13: var personen hamnar efter inloggning), 26 och 27 (var "Mitt konto" ligger). Löser det som `15-radera-konto.md` lämnade till inkrement 3: ett övergripande navigeringsmönster.

**Läge:** Planeringsläget. Planläget (`06-planlage.md`) har ingen meny, bara "Avsluta".

**Bakgrund:** med konton får appen fler ställen att gå till än generatorn: sparade pass, klubb och lag, redaktörskön och kontot. Mönstret ska vara enkelt, fungera med handskar och inte krocka med den fasta knappraden längst ner i passvyn ("Spara pass", `designsystem.md` 6.10).

## Beslut

- **Ingen flikrad längst ner.** Passvyn har redan en fast knapp längst ner, och en flikrad under den skulle ta en fjärdedel av höjden på en 360 × 640-skärm och kollidera vid stor text. Menyn ligger i stället i sidhuvudet.
- **Knappen "Meny"** ligger på varumärkesraden i sidhuvudet (`designsystem.md` 6.10), längst till höger, minst 48 × 48 px, med synlig text "Meny" och en ikon (tre streck, dekor). Den är en disclosure-knapp med `aria-expanded`.
- **Menyn fäller ut under sidhuvudet** som en lista över hela bredden, inte som ett sidopanel som skymmer sidan. Varje punkt är en rad på minst 56 px. Menyn stängs med Escape, med ett tryck på "Stäng" (samma knapp som öppnade den, nu med texten "Stäng meny") och när en punkt valts.
- **På bred skärm (720 px och uppåt):** menypunkterna ligger i en rad direkt i sidhuvudet och knappen "Meny" finns inte. Punkterna är desamma, i samma ordning. Under 720 px gäller den hopfällda menyn.
- **Aktuell punkt** markeras med `aria-current="page"`, en fet stil och en understrykning, aldrig bara med färg.

## Wireframe, 360 px – Sidhuvud med meny stängd och öppen

```
Stängd                                   Öppen
┌────────────────────────────────┐      ┌────────────────────────────────┐
│ ⚽ Fotbollsbanken      [☰ Meny]│      │ ⚽ Fotbollsbanken   [✕ Stäng meny]│
│                                 │      ├────────────────────────────────┤
│ Sparade pass                    │      │ Sparade pass          ← aktuell │
│                                 │      │ Nytt pass                       │
│ …                               │      │ Klubb och lag                   │
└────────────────────────────────┘      │ Redaktörskö (3)                 │
                                          │ Mitt konto                      │
                                          │ Logga ut                        │
                                          └────────────────────────────────┘
```

## Menypunkter per roll

| Punkt | Leder till | Visas för |
|---|---|---|
| Sparade pass | `05-sparade-pass.md` (startsida) | alla inloggade |
| Nytt pass | `01-underlag.md` | alla inloggade |
| Klubb och lag | `13-klubbadmin-lag.md` | klubbadmin (full vy), ledare i ett lag (skrivskyddad vy över sina lag), person utan klubb ser "Skapa klubb" |
| Klubbens övningar | `11-hantera-egna-ovningar.md` | alla i en klubb (kommer med inkrement 4) |
| Redaktörskö ({antal}) | `12-redaktorsko.md` | redaktör (kommer med inkrement 4) |
| Säsongsplan | `09-sasongsplan-oversikt.md` | ledare i ett lag (kommer med inkrement 7) |
| Mitt konto | `15-radera-konto.md` | alla inloggade |
| Logga ut | utloggning, sedan `14-inloggning.md` | alla inloggade |

- En punkt som inte är byggd än visas inte alls (inte inaktiverad och inte med "kommer snart"), så att menyn aldrig lovar något som inte går att göra.
- Ordningen är fast. "Logga ut" ligger sist och är skild från "Mitt konto" med en linje, så att den inte trycks av misstag i stället för punkten ovanför.
- "Logga ut på alla enheter" och "Radera mitt konto" ligger inte i menyn, bara i vyn Mitt konto (27.6).

## Startsida per roll efter inloggning (08.13)

| Roll | Startsida |
|---|---|
| Ledare | Sparade pass, med "+ Nytt pass" överst |
| Klubbadmin utan klubb | `13-klubbadmin-lag.md`, "Skapa din klubb" |
| Klubbadmin med klubb | Sparade pass, som ledare. Klubb och lag nås från menyn |
| Redaktör | Sparade pass. Redaktörskön nås från menyn, med antalet som väntar |
| Inbjuden | Sparade pass efter att `14-inloggning.md` kopplat personen till laget, med bekräftelsen "Du är nu kopplad till {lagnamn}." |

En person utan klubb och utan lag kan ändå skapa pass och spara dem som personliga (12.2). "Skapa din klubb" är därför ett erbjudande och inget hinder: i Sparade pass står en informationsruta med knappen "Skapa din klubb" tills personen har en klubb eller en inbjudan.

## Skrivbord

På skärmar över 900 px begränsas innehållets bredd till 720 px och centreras, så att rader inte blir oläsligt långa. Sidhuvudets band går över hela bredden, och menypunkterna ligger i raden enligt ovan. Allt annat är som på mobil. Dialoger är 480 px breda och centrerade.

## Tillgänglighet

- Knappen "Meny" har synlig text och ett tillgängligt namn som innehåller den ordagrant (2.5.3). Tillståndet annonseras via `aria-expanded`.
- Fokus flyttas till den första menypunkten när menyn öppnas, och tillbaka till knappen när den stängs.
- Menyn är en `nav` med ett eget namn ("Huvudmeny") och en vanlig lista med länkar. Den är ingen `role="menu"`, eftersom det kräver ett tangentbordsmönster som inte passar en enkel länklista.
- Antalet i "Redaktörskö (3)" ingår i länkens tillgängliga namn: "Redaktörskö, 3 väntar".
- Träffytor minst 48 × 48 px, 56 px för raderna i den utfällda menyn.
- Menyn syns inte i planläget och inte i utskriften.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-13 | Ny vy. Berättelse 08 och backlogens översikt för inkrement 3 efterfrågar ett navigeringsmönster och en placering för "Mitt konto". |
