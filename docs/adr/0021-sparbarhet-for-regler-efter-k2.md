# 0021: Spårbarhet för reglerna som kommit till efter K2

Status: föreslagen. Kompletterar regeltabellen i 0011 avsnitt 4 och kedjan och modullistan i 0011 avsnitt 1

## Kontext

ADR 0011 (beslutad vid K2, 2026-09-12) har en regeltabell i avsnitt 4 som pekar ut vilken modul som äger varje regel i `docs/doman/generatorregler.md`, och om regeln går att bygga och testa. Tabellen räknar 89 regler. Sedan dess har fotbollsexperten lagt till fem regler, var och en efter användarens beslut (avsnittet *Ändringar efter K1* i `generatorregler.md`):

| Regel | Tillagd | Grupp |
|---|---|---|
| R-120 Materialtyper är en sluten lista | 2026-09-12 | 1 Övningens data |
| R-057 Taket per ledare gäller inte i `del-spel` | 2026-09-14 | 6 Grupper och udda antal |
| R-121 Närliggande fokusområde när kärnan annars blir tom | 2026-09-21 | 5 Fokusområden |
| R-058 Grupper med fast grundstorlek | 2026-10-02 | 6 Grupper och udda antal |
| R-086 Nickövningar bara när ledaren har valt nickspel | 2026-10-07, infördes i PR #39 | 9 Säkerhet |

`generatorregler.md` har nu 94 regler. Ingen regel har status *Utgår*, och R-112 är fortfarande den enda preliminära (sammanställningen sist i `generatorregler.md`). Det är alltså exakt de fem reglerna ovan som saknas i tabellen i ADR 0011. Kontrollen gjordes genom att jämföra regelrubrikerna (`### R-…`) i `generatorregler.md` med tabellraderna (`| R-…`) i ADR 0011.

En ADR ändras inte i efterhand (`CLAUDE.md`, `docs/adr/README.md`). Raderna läggs därför till här i stället för i ADR 0011.

Två saker i ADR 0011 avsnitt 1 har också hunnit bli ofullständiga av samma skäl: kedjan genom motorn räknar säkerhetsreglerna som R-080–R-085, och modullistan saknar `focus/substitute.ts`, som byggdes för R-121.

## Beslut

### 1 Tabellraderna som saknas

Raderna har samma kolumner som tabellen i ADR 0011 avsnitt 4 och ska läsas som en del av respektive grupp där. `Bygg` betyder att regeln går att uttrycka i kod som den står, `Test` att det går att visa automatiskt att den följs. Var i koden och testerna regeln finns står i avsnitt 2.

#### Grupp 1: Övningens data (R-001–R-009, R-120)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-120 Materialtyper är en sluten lista | `schema/ovning`, `keys` | ja | ja | Listan ligger i `keys.ts` som `MATERIAL_TYPES` och prövas med `z.enum` i schemat. Kravet på en anteckning för `ovrigt` prövas i schemats korskontroller. Regeln är inget filter: generatorn väljer aldrig bort en övning för materialets skull |

#### Grupp 5: Fokusområden (R-040–R-049, R-121)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-121 Närliggande fokusområde när kärnan annars blir tom | `focus/substitute`, `keys`, `index`, `select/fill`, `swap/options` | ja | ja | Steg 1–5 i regeln byggs i `focus/substitute`. Närhetstabellen och avvikelserna per fas ligger i `keys.ts`. *Delen kan fyllas med fokus F* är `canFillPart` i `select/fill` med fokuset som parameter. Vid byte prövas R-041 mot delens ersättningsfokus (`partFocus` i `swap/options`). Appen visar ersättningen och behåller ledarens ordning bland fokusen, som kandidatlistan bygger på |

#### Grupp 6: Spelare, grupper och udda antal (R-050–R-058)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-057 Taket per ledare gäller inte i `del-spel` | `blocks/groups`, `check/session` | ja | ja | Byggs i `largestGroup`, som tar passdelen som parameter. Testfallet i regeln, 14 spelare och ledarbehov 1 i `fas-10-12`, används som det står |
| R-058 Grupper med fast grundstorlek | `blocks/groups`, `blocks/stations`, `swap/options`, `check/session` | ja | ja | Gäller i stället för R-051 och R-052 för `par` med `spelare` 2–2 och för `fast-storlek`. Testfall 1–18 (helgruppsmoment) och 19–24 (stationer) i regeln används som de står, med numret i testnamnet |

#### Grupp 9: Säkerhet (R-080–R-086)

| Regel | Modul | Bygg | Test | Kommentar |
|---|---|---|---|---|
| R-086 Nickövningar bara när ledaren har valt nickspel | `filter/safety`, `blocks/candidates`, `check/session`, `swap/options` | ja | ja | Prövas mot ledarens valda fokus, aldrig mot ett ersättningsfokus (R-121). Gäller både generatorns val och ledarens byte (R-104, R-106), eftersom villkor 1 vid byte är säkerhetsreglerna i `filter/safety`. Testfall 6 och 7 används som de står. Testfall 5, en av klubbens egna övningar, har inget eget test, se *Konsekvenser* |

### 2 Var reglerna finns i koden och testerna

Uppgifterna är hämtade med sökning efter `@regel R-0xx` i `src/` och efter regel-ID:t i testnamnen (`describe` och `it`), på `main` 2026-10-08. Sökvägarna är relativa till `src/regelmotor/` om inget annat står.

| Regel | `@regel` i koden | Tester (namnet börjar med eller innehåller regel-ID:t) |
|---|---|---|
| R-120 | **Ingen `@regel`-tagg.** Regeln är märkt med kommentarer: `keys.ts` (`MATERIAL_TYPES` och typen som kräver anteckning) och `schema/ovning.ts` (`checkCrossRules`, kravet på anteckning för `ovrigt`) | `schema/ovning.test.ts`: *R-120 materialtyper är en sluten lista*, tre tester. `src/app/text/names.test.ts`: ett test |
| R-121 | `focus/substitute.ts` (`candidateFocusList`, `decideSubstituteFocus`), `keys.ts` (`focusNeighbours`), `index.ts` (`decideFocus`), `select/fill.ts` (`canFillPart`), `swap/options.ts` (`partFocus`, `trySwap`), `src/app/input/form.ts` (`withFocusToggled`), `src/app/session/SessionView.tsx` (`SubstituteNote`) | `focus/substitute.test.ts`: *R-121 Närliggande fokusområde när kärnan annars blir tom*, tretton tester. `generate.test.ts`: två tester. `swap/swap.test.ts`: ett test under R-104. `src/app/session/model.test.ts`: ett test |
| R-057 | `blocks/groups.ts` (`largestGroup`), `check/session.ts` (`checkSession`) | `blocks/groups.test.ts`: *R-057 Taket per ledare gäller inte i del-spel*, två tester |
| R-058 | `blocks/groups.ts` (`baseGroupSize`, `allowsExtraPlayer`, `largestGroup`, `splitFixedSize`, `planWholeGroupsWithReason`, `planWholeGroups`), `blocks/stations.ts` (`buildStationBlock`), `swap/options.ts` (`placeReplacement`), `check/session.ts` (`checkSession`) | `blocks/groups.test.ts`: *R-058 Grupper med fast grundstorlek*, testfall 1–18 och fyra tester till, och ett test under R-050. `blocks/stations.test.ts`: testfall 19–24. `generate.test.ts`: fyra tester. `swap/swap.test.ts`: två tester. `src/app/session/ExerciseCard.test.tsx`: två tester |
| R-086 | `filter/safety.ts` (`safetyRejection`), `blocks/candidates.ts` (`candidatesForPart`), `check/session.ts` (`checkSession`), `swap/options.ts` (`trySwap`) | `filter/safety.test.ts`: *R-086 Nickning bara när ledaren har valt nickspel*, fem tester. `focus/substitute.test.ts`: testfall 6 och 7, tre tester. `swap/swap.test.ts`: *R-086 Nickövningar vid byte*, två tester. `swap/swapped-flag.test.ts`: ett test |

Antalet tester är räknat på testnamn och kan ändras. Det som ska gälla är att varje regel har minst ett test med regel-ID:t i namnet, enligt konventionen i ADR 0011 avsnitt 7.

### 3 Kedjan och modullistan i ADR 0011 avsnitt 1

| I ADR 0011 | Läses nu |
|---|---|
| Steg 3 Filtrering, regler R-022–R-029, R-080–R-085, R-090–R-094 | R-022–R-029, R-080–R-086, R-090–R-094. Filtret för R-086 sitter i `filter/safety` och används av `blocks/candidates` |
| Steg 4 Val per passdel, regler R-034–R-038, R-041, R-050–R-067, R-070 | Oförändrat intervall, som redan omfattar R-057 och R-058. Dessutom R-121, som avgör vilket fokus R-041 prövas mot i `del-ovning` och `del-spelovning` innan delarna fylls |
| Modullistan | Kompletteras med `focus/substitute.ts`, ersättningsfokus för kärnan (R-121). Den ligger ovanför `select` i beroendeordningen: den importerar `keys`, `types`, `blocks/candidates` och `select/fill`, och importeras bara av `index.ts` |

### 4 Sammanställningen

Sammanställningen i ADR 0011 avsnitt 4 läses så här med de fem reglerna:

| Utfall | Antal | Regler |
|---|---|---|
| Går att bygga och testa som de står, och ingår i version 1 | 90 | De 85 i ADR 0011 och R-057, R-058, R-086, R-120, R-121 |
| Går att bygga och testa som den står, men byggs inte i version 1 | 1 | R-112, preliminär och Could |
| Delvis, därför att regeln själv lägger en del av bedömningen på en människa | 2 | R-010, R-081 |
| Går att bygga, men bara delvis att testa, och behöver förtydligas | 1 | R-072 |
| **Summa** | **94** | |

Raden för R-072 står kvar som i ADR 0011. Att regeln omformulerades 2026-09-12 ändrar inte den här ADR:n, som bara gäller de regler som saknades.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Föra in raderna direkt i ADR 0011** | En ADR ändras inte i efterhand (`CLAUDE.md`). Ett ändrat eller kompletterat beslut skrivs som en ny ADR |
| **Ersätta hela tabellen med en ny ADR** | De 89 raderna i ADR 0011 stämmer fortfarande. En kopia skulle ge två tabeller som kan säga emot varandra, och granskningen skulle behöva gå igenom 94 rader i stället för fem |
| **Flytta spårbarheten ut ur ADR:erna, till en fil som skrivs av ett skript** | Skulle hålla tabellen aktuell utan en ny ADR för varje regel. Skriptet som ADR 0011 avsnitt 7 beskriver, `npm run regler:tackning`, finns inte i `package.json`. Att bygga det är en egen uppgift och lyfts som en fråga i stället för att lösas här |
| **Vänta med raderna tills R-086 är mergad** | R-086 är redan mergad till `main` genom PR #39, så det finns inget att vänta på |

## Konsekvenser

- **ADR 0011 och den här ADR:n läses tillsammans.** Regeltabellen är summan av de två. ADR 0011 får ingen ny status, eftersom inget av dess beslut ersätts.
- **En ny regel kräver en ny rad någonstans.** Varje gång fotbollsexperten lägger till en regel blir tabellen ofullständig igen. Utan den kontroll som ADR 0011 avsnitt 7 beskriver märks det bara när någon jämför för hand, som här.
- **R-120 har ingen `@regel`-tagg.** Den är spårbar genom kommentarer med regel-ID:t i `keys.ts` och `schema/ovning.ts` och har tester med regel-ID:t i namnet, men den följer inte konventionen i ADR 0011 avsnitt 7. En kontroll som bara letar efter `@regel` skulle räkna den som saknad i koden.
- **Två luckor i testerna.** Testfall 5 i R-086, en av klubbens egna övningar märkt med `nickspel`, har inget eget test. Regeln gäller ändå klubbens övningar, eftersom bytesvägen använder samma säkerhetsfilter för båda (`trySwap` och `safetyRejection`), men det är inte visat med ett test. Kontrollen av R-057 i `check/session` har inget test med regel-ID:t i namnet; regeln testas i `blocks/groups`. Båda är kvalitetssäkrarens att bedöma.
- **Ingen kod ändras.** Ingen migration, inget nytt beroende och ingen ändrad konfiguration.
