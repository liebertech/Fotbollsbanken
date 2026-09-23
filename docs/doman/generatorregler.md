Status: ändrad 2026-09-23 (läsanvisning tillagd, inga regler ändrade)

# Generatorregler

**Ägare:** fotbollsexpert

Det här är specifikationen för regelmotorn som sätter ihop träningspass. Kod och tester ska hänvisa till regel-ID:n här. En regel som inte står här ska inte finnas i koden (`docs/doman/README.md`).

Reglerna bygger på de andra domänfilerna och använder deras nycklar:

| Vad | Nycklar | Fil |
|---|---|---|
| Spelformer | `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11` | `spelformer.md` |
| Åldersfaser | `fas-6-7`, `fas-8-9`, `fas-10-12`, `fas-13-14`, `fas-15-19` | `aldrar-och-fokus.md` |
| Nivåer | `niva-1`, `niva-2`, `niva-3` | `nivaer.md` |
| Fokusområden | 17 nycklar, till exempel `bollkansla`, `passning-mottagning` | `fokusomraden.md` |
| Passets delar | `del-uppvarmning`, `del-ovning`, `del-spelovning`, `del-spel`, `del-avslutning` | `passuppbyggnad.md` |
| Grupptyper | `fri`, `par`, `tva-lag`, `fast-storlek` | `passuppbyggnad.md` |
| Ytor | `yta-hel`, `yta-halv`, `yta-kvart` | den här filen, R-090 och R-091 |
| Materialtyper | 8 nycklar: `boll`, `kon`, `markering`, `vast`, `mal`, `minimal`, `hinder`, `ovrigt` | `passuppbyggnad.md`, avsnittet *Material* |

## Ändringar efter K1

Domänmodellen godkändes vid K1 den 2026-09-11. Sedan dess har den här filen ändrats så här. Inga nummer har bytts och ingen regel har tagits bort.

| Datum | Ändring |
|---|---|
| 2026-09-12 | **R-072 omformulerad.** Regeln binder nu algoritmens val i stället för mängden möjliga pass. Den gamla lydelsen krävde i praktiken det globalt bästa passet, vilket R-049 uttryckligen säger att generatorn inte behöver hitta (ADR 0011, avsnitt 4, grupp 8). |
| 2026-09-12 | **R-120 tillagd.** Materialtyperna är en sluten lista. Själva listan står i `passuppbyggnad.md`, avsnittet *Material*. |
| 2026-09-12 | **R-084 förtydligad.** Regeln pekar nu ut vilka materialtyper som räknas som mål (`mal` och `minimal`). Innebörden är oförändrad. |
| 2026-09-14 | **R-057 tillagd.** Taket per ledare i R-050 gäller inte i `del-spel`. Utan undantaget delade generatorn ett spel i dagens spelform i två mindre spel bara för att gruppen var större än taket. Frågan kom fram vid granskningen av omgång 1 av övningsbanken. Godkänd av användaren 2026-09-14. |
| 2026-09-14 | **R-050 hänvisar till R-057.** Strecksatsen om taket per ledare pekar nu på undantaget, så att regeln inte blir missvisande läst för sig. Vad R-050 kräver är oförändrat. |
| 2026-09-21 | **R-121 tillagd.** Ledaren får välja vilket fokusområde som helst som är K eller R för fasen, men om `del-ovning` eller `del-spelovning` annars skulle bli tom fyller generatorn delen med ett närliggande fokusområde och talar om för ledaren att den gjorde det. Regeln anger vilket fokusområde som är närliggande vilket, per passdel och med avvikelser per åldersfas, och vad som gäller när inget närliggande fokus heller har någon övning. Frågan kom fram när `lek` eller `koordination` valdes som enda fokus i en bank med 31 godkända övningar: båda delarna i kärnan blev då tomma. Alternativen att skriva nya övningar eller att begränsa valet i gränssnittet valdes bort. Godkänd av användaren 2026-09-21. |
| 2026-09-21 | **R-041, R-100, R-101, R-102, R-103 och R-104 hänvisar till R-121.** Hänvisningarna visar var ersättningsfokuset kommer in, så att reglerna inte blir missvisande lästa för sig. Vad reglerna kräver är oförändrat. |
| 2026-09-23 | **Läsanvisning i grupp 10, ingen regel.** Inledningen till grupp 10 pekar nu ut att *yta per spelare* i `passuppbyggnad.md` är ett granskningskriterium för övningsbanken och inte något generatorn använder. Anledningen är att tabellen med kvadratmeter per spelare annars kan hittas i domänfilen och implementeras som ett filter, alltså en regel som ingen har beslutat. Inget nytt regel-ID, ingen ändrad regel och inget nytt krav på koden. Användaren godkände granskningskriteriet 2026-09-23. |

## Så läser du reglerna

- **Krav** måste alltid vara uppfyllt. Ett pass som bryter mot ett krav är fel.
- **Prioritet** är ett önskemål. Generatorn försöker uppfylla prioriteterna i den ordning som R-048 anger, och R-049 säger exakt vad det levererade passet alltid måste klara.
- **Definition** förklarar ett begrepp som andra regler använder.
- **Preliminär** betyder att regeln väntar på användarens beslut. Den kan byggas, men ska vara lätt att ändra. Preliminära regler är märkta med *(preliminär)* i rubriken.
- **Utgår** betyder att regeln inte längre gäller. Rubriken får markeringen *(utgår)*, och regeln hänvisar till den regel som ersätter den. Numret och rubriken finns kvar, så att gamla hänvisningar går att följa.
- **Beslut.** Användaren fattade beslut i de öppna frågorna 2026-09-11. Besluten står i `docs/krav/kravspec.md`, avsnittet *Beslut vid K1*. Regler som bygger på ett sådant beslut säger det och anger punkten i kravspecen.
- **Min bedömning.** Siffrorna i reglerna är mina bedömningar som tränarutbildare, om inget annat står. Källorna finns i respektive domänfil.
- **Numren är frysta.** Kraven i `docs/krav/` hänvisar till regel-ID:n. Ett nummer byts aldrig och tas aldrig bort. Varje grupp har ett eget nummerintervall, till exempel R-030–R-039 för tid. Nummer som inte används är reserverade för nya regler i samma grupp. Ett ID återanvänds aldrig.

## Begrepp

| Begrepp | Betydelse |
|---|---|
| **Underlag** | Det ledaren anger: ålder, spelform, nivå, antal spelare (N), antal ledare (L), passlängd (P), fokusområden och, om ledaren vill, yta. |
| **Gemensamma banken** | Övningarna i `content/ovningar/` och de inskickade övningar som en redaktör har godkänt. Generatorn väljer bara härifrån (R-022). |
| **Klubbens egna övningar** | Övningar som ledare i klubben har skapat (berättelse 13 och 14) och som inte har godkänts till den gemensamma banken. Ledaren kan byta in dem för hand (R-106). |
| **Fas** | Åldersfasen som följer av åldern (R-012). |
| **Valt fokus** | De fokusområden ledaren har valt. |
| **Del** | En av passets fem delar. De fyra första fylls från banken, `del-avslutning` är ett fast inslag. |
| **Moment** | Innehållet i en del. En del har ett eller två moment. Ett moment är antingen ett **helgruppsmoment** (alla gör samma övning, i en eller flera grupper samtidigt) eller ett **stationsmoment** (olika övningar samtidigt, med rotation). |
| **Grupp** | De spelare som gör en övning tillsammans på en yta. Övningens fält `spelare` anger minsta och största antal i en grupp. |
| **Ledarbehov** | Hur många ledare varje grupp i övningen behöver: 0, 1 eller 2 (R-006). |
| **Taket per ledare** | Högsta antal spelare per ledare för fasen: 8 (`fas-6-7`), 10 (`fas-8-9`), 12 (`fas-10-12`), 14 (`fas-13-14`), 16 (`fas-15-19`). Se `passuppbyggnad.md`. |
| **Aktiv tid** | Passlängd minus avslutning minus vattenpauser (R-032). |
| **Måltid** | Den tid en del ska ha enligt R-032 och R-033. |
| **Träff** | En övning träffar valt fokus om minst ett av övningens fokusområden finns bland de valda. **Huvudträff** betyder att övningens första fokusområde (huvudfokus) finns bland de valda. |
| **Giltigt moment** | Ett moment som för sig uppfyller alla krav som gäller ett enskilt moment: grundfiltret (grupp 3), R-041 i `del-ovning` och `del-spelovning`, tid (R-034, R-065), grupper (grupp 6), ledare och stationer (grupp 7), säkerhet (grupp 9) och, om yta är vald, yta (grupp 10). |
| **Delen kan fyllas** | Det finns ett eller två giltiga moment för delen, med olika övningar, vars sammanlagda tid kan ligga inom delens måltid ± 3 minuter (R-035) och som tillsammans håller nicktaket (R-082). Det prövas för delen för sig, utan hänsyn till resten av passet. Begreppet används i R-100, R-101 och R-103. |
| **Delen kan fyllas med fokus F** | Samma prövning som *Delen kan fyllas*, men där R-041 prövas mot fokusområdet F i stället för mot valt fokus. Används i R-121. |
| **Ersättningsfokus** | Det närliggande fokusområde som `del-ovning` eller `del-spelovning` använder när delen inte kan fyllas med valt fokus (R-121). Ersättningsfokuset gäller bara i den delen och ändrar aldrig ledarens val. |
| **Giltigt pass** | Ett pass som uppfyller alla krav. |

---

## Grupp 1: Övningens data som generatorn använder (R-001–R-009, R-120)

**Varför:** generatorn kan bara välja rätt om övningarna är märkta på ett sätt som går att lita på. Reglerna kan kontrolleras automatiskt när en övning sparas eller valideras. En övning som bryter mot någon av dem får inte användas av generatorn. Flera fält är nya eller ändrade jämfört med `content/ovningar/README.md`. Fältnamnen bestäms vid K2, men innehållet ska vara det som står här.

### R-001 Nivå är en lista
Krav. Fältet `niva` är en lista med minst en av `niva-1`, `niva-2` och `niva-3`, utan dubletter. Om listan innehåller både `niva-1` och `niva-3` måste den också innehålla `niva-2`.

### R-002 Fokusområden
Krav. Fältet `fokusomraden` innehåller 1–3 olika fokusnycklar. Den första är övningens huvudfokus. Varje fokusområde ska vara K eller R i tabellen i `fokusomraden.md` för **varje** fas som övningens åldersspann berör.

*Exempel:* en övning för 8–12 år berör `fas-8-9` och `fas-10-12` och får inte ha `fasta-situationer`, eftersom det är "–" för `fas-8-9`.

### R-003 Ålder
Krav. `alder` har ett minsta och ett högsta värde, båda heltal, där 6 ≤ minsta ≤ högsta ≤ 19.

### R-004 Spelformer
Krav. `spelformer` innehåller minst en spelformsnyckel. Varje spelform i listan ska vara tillåten (R-014) för minst en ålder i övningens åldersspann.

### R-005 Passdelar
Krav. Det nya fältet `passdelar` innehåller minst en av `del-uppvarmning`, `del-ovning`, `del-spelovning` och `del-spel`. `del-avslutning` får inte förekomma.

### R-006 Ledarbehov per grupp
Krav. Övningen anger ledarbehov per grupp som ett heltal 0, 1 eller 2.
- 0 (självgående): en ledare i närheten räcker, och den kan ha uppsikt över flera grupper.
- 1 (ledarstyrd): varje grupp behöver en egen ledare hela tiden.
- 2: varje grupp behöver två egna ledare.

### R-007 Antal spelare
Krav. `spelare` har ett minsta och ett högsta antal per grupp, båda heltal, där 1 ≤ minsta ≤ högsta ≤ 40.

### R-008 Grupptyp
Krav. Övningen har exakt en grupptyp: `fri`, `par`, `tva-lag` eller `fast-storlek`.
- `par` och `tva-lag` kräver att minsta antal spelare är minst 2.
- `fast-storlek` kräver att minsta och högsta antal är lika (gruppens storlek, minst 2). Övningen anger dessutom ja eller nej för om den har en lösning för udda antal, till exempel att en spelare vilar och byter in.
- En övning som har `del-spel` i `passdelar` ska ha grupptypen `tva-lag`.

### R-009 Tid
Krav. Övningen har en kortaste, en rekommenderad och en längsta tid i hela minuter, där 5 ≤ kortaste ≤ rekommenderad ≤ längsta. Om övningen bara har en rekommenderad tid gäller den som både kortaste och längsta.

### R-120 Materialtyper är en sluten lista
Krav. Varje post i övningens `material` har en typ ur den slutna listan i `passuppbyggnad.md`, avsnittet *Material*. I dag är listan `boll`, `kon`, `markering`, `vast`, `mal`, `minimal`, `hinder` och `ovrigt`. En typ som inte finns i listan underkänns när övningen valideras. Typen `ovrigt` kräver en anteckning som säger vad materialet är.

Nycklarna är stabila och ändras aldrig. Om en typ behöver läggas till skrivs den in i listan i `passuppbyggnad.md`, som är den enda källan. Den här regeln pekar alltid på den listan.

*Regeln är ny vid K2 (2026-09-12).* Den behövs för R-084: appen kan bara veta om en övning har mål när typerna är bestämda. Listan är inget filter. Generatorn väljer aldrig bort en övning för att klubben saknar material (kravspec, *Beslut vid K1*, punkt 1). Numret är taget från R-120 och uppåt, eftersom grupp 1 inte har några lediga nummer i sitt ursprungliga intervall.

---

## Grupp 2: Underlaget (R-010–R-021)

**Varför:** underlaget bestämmer allt annat. Reglerna ser till att ledaren bara kan be om pass som går att genomföra säkert och meningsfullt, och att samma underlag alltid tolkas på samma sätt.

### R-010 Hur åldern tolkas
Krav. Den ålder ledaren anger är den ålder spelarna fyller under det aktuella kalenderåret. Om gruppen har flera åldrar anger ledaren den ålder som flest spelare har. Om två åldrar är lika vanliga anger ledaren den lägre. Appen säger detta vid åldersfältet.

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 6).* Att ledaren väljer den lägre åldern när två åldrar är lika vanliga är min bedömning. Den lägre åldern ger de försiktigaste säkerhetsreglerna och tiderna. Regeln påverkar hjälptexten och säsongsplanen (R-113), inte beräkningarna i ett enskilt pass.

### R-011 Giltig ålder
Krav. Åldern är ett heltal från 6 till 19. Andra värden ger ett felmeddelande och inget pass (berättelse 01, kriterium 3).

### R-012 Fas från ålder
Krav. Fasen bestäms av åldern:

| Ålder | Fas |
|---|---|
| 6–7 | `fas-6-7` |
| 8–9 | `fas-8-9` |
| 10–12 | `fas-10-12` |
| 13–14 | `fas-13-14` |
| 15–19 | `fas-15-19` |

### R-013 Föreslagen spelform
Krav. Appen föreslår spelformen för åldern: 6–7 år `3mot3`, 8–9 år `5mot5`, 10–12 år `7mot7`, 13–14 år `9mot9`, 15–19 år `11mot11` (`spelformer.md`).

### R-014 Tillåtna spelformer
Krav. Spelformerna har ordningen `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`. Ledaren får välja den föreslagna spelformen eller den som ligger närmast före eller efter i ordningen. Andra spelformer kan inte väljas.

*Exempel:* för 12 år är `5mot5`, `7mot7` och `9mot9` tillåtna. För 6 år är `3mot3` och `5mot5` tillåtna.

*Motivering:* en grupp som har spelare från två åldersfaser, eller som spelar i en annan spelform i sitt distrikt, behöver kunna välja grannspelformen. Att välja 11 mot 11 för 8-åringar är aldrig rimligt.

### R-015 Fasen styrs av åldern, inte av spelformen
Krav. När ledaren har valt en annan spelform än den föreslagna bestäms fasen fortfarande av åldern (R-012). Alla regler som använder fasen, till exempel säkerhetsregler, tider och taket per ledare, använder fasen från åldern. Spelformen används bara för att matcha övningarnas `spelformer` (R-024) och ytor (R-092).

### R-016 Nivå
Krav. Ledaren väljer exakt en nivå: `niva-1`, `niva-2` eller `niva-3`.

### R-017 Antal spelare och ledare
Krav. Antal spelare är ett heltal från 1 till 40. Antal ledare är ett heltal från 1 till 10. Andra värden ger ett felmeddelande och inget pass.

*Motivering för taken:* med fler än 40 spelare på ett pass behöver gruppen delas i två pass. Fler än 4 ledare ger inte fler stationer (R-061), men de gör att fler ledarstyrda grupper kan köras samtidigt (R-055). Med 10 ledare kan även 40 spelare i den yngsta fasen delas i ledarstyrda grupper om högst 8, så 10 räcker gott.

### R-018 Passlängd
Krav. Passlängden är ett heltal i minuter, minst 30 och högst:

| Fas | Längst |
|---|---|
| `fas-6-7` | 60 |
| `fas-8-9` | 75 |
| `fas-10-12` | 90 |
| `fas-13-14` | 90 |
| `fas-15-19` | 120 |

Kortare pass ger felmeddelandet att passet är för kort (berättelse 01, kriterium 8). Längre pass ger ett felmeddelande som anger längsta passlängd för åldern.

### R-019 Val av fokusområden
Krav. Ledaren väljer 1–3 fokusområden. Bara fokusområden som är K eller R för fasen i `fokusomraden.md` kan väljas.

*Motivering:* med fler än tre fokus blir passet splittrat, och kärnan i passet (Öva och Spelövning) har bara plats för två till fyra övningar.

### R-020 Komplett underlag
Krav. Ett underlag är komplett när ålder, spelform, nivå, antal spelare, antal ledare, passlängd och minst ett fokusområde finns och uppfyller R-011 till R-019. Yta är valfri (R-090). Generatorn körs bara med ett komplett underlag.

### R-021 Många spelare per ledare
Krav. Om N är större än L gånger taket per ledare för fasen genereras passet ändå, men appen visar ett tips om att ta hjälp av fler vuxna. Om N är högst L gånger taket visas inget tips.

*Testfall:* 20 spelare, 2 ledare, 7 år: 20 > 2 × 8 = 16, så tipset visas. 16 spelare med samma ledare och ålder: inget tips.

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 9).*

---

## Grupp 3: Vilka övningar som får väljas, och nivå (R-022–R-029)

**Varför:** det här är grundfiltret. En övning som inte klarar det är aldrig aktuell, oavsett hur passet ser ut i övrigt. En övning kan bara läggas i ett moment om den dessutom klarar reglerna för grupper (grupp 6), ledare och stationer (grupp 7), säkerhet (grupp 9) och yta (grupp 10).

Nivåmatchningen är strikt (beslut 2026-09-11, kravspec, Beslut vid K1, punkt 5). Det är ledaren som vet var gruppen står, och övningsförfattaren som vet vilka nivåer övningen passar för. Om generatorn själv tar en övning från en annan nivå går ledarens val förlorat, och det är just det berättelse 03 säger att appen inte ska göra. Att en övning passar två nivåer uttrycks i stället i övningens nivålista (R-001).

### R-022 Bara godkända övningar ur den gemensamma banken
Krav. Generatorn väljer bara övningar ur den gemensamma banken med status `godkand` (berättelse 02, kriterium 11). Klubbens egna övningar väljs aldrig av generatorn, inte heller i stationer eller när en del saknar övning. Ledaren kan själv byta in en av klubbens egna övningar enligt R-106.

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 4).*

### R-023 Ålder
Krav. Övningen kan väljas bara om underlagets ålder ligger inom övningens `alder`, med gränserna inräknade.

### R-024 Spelform
Krav. Övningen kan väljas bara om underlagets spelform finns i övningens `spelformer`.

### R-025 Nivå
Krav. Övningen kan väljas bara om underlagets nivå finns i övningens nivålista.

*Exempel:* en övning med `[niva-1, niva-2]` kan väljas för `niva-1` och `niva-2`, men inte för `niva-3`.

### R-026 Inga angränsande nivåer
Krav. Generatorn väljer aldrig en övning vars nivålista saknar underlagets nivå, inte ens när för få övningar matchar. Då gäller R-100 till R-103.

### R-027 Alla övningens fokusområden passar fasen
Krav. Övningen kan väljas bara om alla dess fokusområden är K eller R för fasen. Regeln är ett skydd om en övning är fel märkt eller om tabellen i `fokusomraden.md` ändras.

### R-028 Rätt del
Krav. En övning kan läggas i en del bara om delens nyckel finns i övningens `passdelar`. Varje övning i passet visas med nyckeln för den del den ligger i (berättelse 02, kriterium 2).

### R-029 Varianterna visas alltid
Krav. Generatorn väljer inte mellan övningens lättare och svårare variant. Passet visar övningen med båda varianterna, så att ledaren kan anpassa på plats (`nivaer.md`).

---

## Grupp 4: Passets delar och tid (R-030–R-039)

**Varför:** alla pass ska ha samma begripliga form (värm upp, öva, spelövning, spel, avslutning) och räcka precis så länge som ledaren har planen. Spelet ska alltid få mest tid. Vattenpauser och avslutning är fasta och kan inte offras för att få tiden att gå ihop. Tabeller med uträknade exempel finns i `passuppbyggnad.md`.

### R-030 Delar och ordning
Krav. Passet har delarna i den här ordningen: `del-uppvarmning`, `del-ovning`, `del-spelovning`, `del-spel`, `del-avslutning`. En del kan saknas bara enligt R-033 eller R-100.

### R-031 Fasta inslag
Krav.
- `del-avslutning` är sist och tar 3 minuter för `fas-6-7` och `fas-8-9`. För övriga faser tar den 3 minuter om P < 60, annars 5 minuter.
- Vattenpauser tar 2 minuter var. Antal pauser = ⌈P / pausintervall⌉ − 1, där pausintervallet är 15 minuter för `fas-6-7` och `fas-8-9`, 20 minuter för `fas-10-12` och `fas-13-14` och 25 minuter för `fas-15-19`.
- Generatorn tar aldrig bort eller kortar en vattenpaus eller avslutningen.

*Exempel:* P = 60 för `fas-10-12` ger ⌈60 / 20⌉ − 1 = 2 pauser, alltså 4 minuter.

### R-032 Måltider för delarna
Krav. Aktiv tid = P − avslutning − vattenpauser. Måltiden för `del-uppvarmning`, `del-ovning` och `del-spelovning` är andelen gånger aktiv tid, avrundad nedåt till hela minuter. `del-spel` får det som blir kvar av den aktiva tiden.

| Fas | `del-uppvarmning` | `del-ovning` | `del-spelovning` |
|---|---|---|---|
| `fas-6-7` | 25 % | 25 % | 15 % |
| `fas-8-9` | 20 % | 25 % | 20 % |
| `fas-10-12` | 20 % | 20 % | 25 % |
| `fas-13-14` | 25 % | 15 % | 25 % |
| `fas-15-19` | 25 % | 15 % | 25 % |

*Testfall:* `fas-8-9`, P = 60: avslutning 3, vatten 6, aktiv tid 51. Uppvärmning ⌊10,2⌋ = 10, Öva ⌊12,75⌋ = 12, Spelövning ⌊10,2⌋ = 10, Spel 51 − 32 = 19.

### R-033 För korta delar tas bort
Krav. Om måltiden för `del-ovning` eller `del-spelovning` enligt R-032 är mindre än 5 minuter tas delen bort ur passet, och dess minuter läggs till måltiden för `del-spel`. En del som tas bort på det här sättet räknas inte som att den saknar övning (R-100).

*Testfall:* `fas-13-14`, P = 30: avslutning 3, vatten 2, aktiv tid 25. Uppvärmning 6, Öva ⌊3,75⌋ = 3, som tas bort, Spelövning 6, Spel 25 − 15 + 3 = 13.

### R-034 Tid för en övning
Krav. En övnings tid i passet är ett heltal som
1. är minst 5 minuter,
2. ligger inom övningens kortaste och längsta tid (R-009),
3. är högst fasens längsta tid för delen:

| Fas | Uppvärmning, Öva, Spelövning | Spel |
|---|---|---|
| `fas-6-7` | 8 | 20 |
| `fas-8-9` | 10 | 25 |
| `fas-10-12` | 15 | 30 |
| `fas-13-14` | 20 | 35 |
| `fas-15-19` | 25 | 45 |

Alla grupper i samma helgruppsmoment har samma tid. För stationer gäller R-065.

### R-035 Varje del nära sin måltid
Krav. Summan av momentens tider i en del ligger inom måltiden ± 3 minuter.

### R-036 Hela passets tid
Krav. Passets totala tid, med vattenpauser och avslutning, är minst P − 5 och högst P minuter. Passet visar den faktiska totala tiden (berättelse 02, kriterium 8).

### R-037 Var vattenpauserna ligger
Krav. En vattenpaus ligger mellan två moment eller, i `del-spel`, mellan två perioder av samma spel. I övriga delar ligger den aldrig inuti en övning. Ingen paus ligger före passets första moment, och ingen ligger efter passets sista moment, alltså direkt före avslutningen.

Undantag när `del-spel` saknar övning (R-100): om pauserna då inte får plats enligt stycket ovan, får flera pauser ligga direkt efter varandra mellan två moment. Om passet bara har ett moment ligger pauserna direkt efter det. Pauserna tas aldrig bort (R-031).

*Motivering för undantaget:* när `del-spel` finns kan en paus alltid läggas mellan två perioder av spelet. När den saknas kan passet ha färre platser än pauser. Ledaren kommer troligen att fylla den tomma tiden själv, och då behövs vattnet ändå.

Prioritet. Pauserna placeras så att den längsta sammanhängande aktiva tiden utan paus blir så kort som möjligt.

*Testfall:* delarna 10, 11, 12 och 18 minuter i följd och 2 pauser (exemplet i `passuppbyggnad.md`). Den längsta tiden utan paus kan inte bli kortare än 21 minuter, till exempel med pauser efter Öva och efter Spelövning.

### R-038 Antal moment per del
Krav. Varje del som fylls från banken har ett eller två moment, utom en del som saknar övning (R-100) och därför inte har något.

Prioritet. En del fylls med så få moment som möjligt. Varje byte kostar tid och koncentration.

### R-039 När en del saknas gäller inte tidsgränserna
Krav. Om en del saknar övning (R-100) gäller inte R-036 för passet, och R-035 gäller inte för den tomma delen. R-035 gäller fortfarande för varje del som har moment, så att de delarna får sina måltider som vanligt. Passet visar den faktiska totala tiden och hur mycket som saknas.

---

## Grupp 5: Fokusområden och vad som är ett bra pass (R-040–R-049, R-121)

**Varför:** ledaren väljer fokus för att passet ska handla om något. Kärnan i passet, Öva och Spelövning, ska därför alltid träffa valt fokus. Uppvärmning och Spel ska helst också göra det, men har egna uppgifter: uppvärmningen ska förbereda kroppen, och spelet ska ge mycket fri speltid. Ett fritt spel är alltid meningsfullt, även när det inte är märkt med dagens fokus.

**Hur stor del av passet som träffar fokus:** minst Öva och Spelövning, alltså 40–45 procent av den aktiva tiden beroende på fas (R-032). Med prioriteterna R-045 och R-046 blir det oftast mer. I korta pass där Öva tas bort (R-033) kan andelen bli lägre. Därför finns ingen fast procentregel.

### R-040 Träff och huvudträff
Definition. En övning **träffar** valt fokus om minst ett av dess fokusområden finns bland de valda. Den har **huvudträff** om dess första fokusområde finns bland de valda.

### R-041 Kärnan träffar alltid valt fokus
Krav. Varje övning i `del-ovning` och `del-spelovning` träffar valt fokus. Det gäller också varje station i ett stationsmoment.

*Hänvisning:* om delen inte kan fyllas med valt fokus får den ett ersättningsfokus enligt R-121, och då prövas det här kravet mot ersättningsfokuset i just den delen. Vad kravet innebär är oförändrat: varje övning och varje station i delen ska träffa det fokus som gäller för delen.

### R-042 Huvudträff i kärnan
Prioritet. Övningarna i `del-ovning` och `del-spelovning` har huvudträff.

### R-043 Röd tråd
Prioritet. Minst en övning i `del-spelovning` har ett valt fokusområde gemensamt med minst en övning i `del-ovning`. Det spelarna övar ska de sedan använda i spel.

### R-044 Uppvärmningen förbereder kroppen
Prioritet. Minst en övning i `del-uppvarmning` har något av dessa fokusområden:

| Fas | Fokusområden |
|---|---|
| `fas-6-7` | `lek`, `bollkansla` eller `koordination` |
| `fas-8-9` | `lek`, `bollkansla`, `koordination` eller `skadeforebyggande` |
| `fas-10-12` | `skadeforebyggande` eller `koordination` |
| `fas-13-14`, `fas-15-19` | `skadeforebyggande` |

*Motivering:* SvFF rekommenderar skadeförebyggande program i uppvärmningen minst två gånger i veckan, FIFA 11+ Kids för 7–14 år och FIFA 11+ eller Knäkontroll för äldre (se källan i `passuppbyggnad.md`). För de yngsta sker samma sak genom lek och rörelse. `fas-6-7` har inte `skadeforebyggande`, eftersom fasen också har 6-åringar (`fokusomraden.md`).

### R-045 Uppvärmningen träffar valt fokus
Prioritet. Minst en övning i `del-uppvarmning` träffar valt fokus.

### R-046 Spelet träffar valt fokus
Prioritet. Minst en övning i `del-spel` träffar valt fokus. Om ingen övning för `del-spel` i banken träffar, väljs ett spel som uppfyller alla krav, utan hänsyn till fokus.

### R-047 Alla valda fokus finns med
Prioritet. Om ledaren har valt flera fokusområden träffas varje valt fokusområde av minst en övning i passet.

### R-048 Hur två pass jämförs
Definition. Två giltiga pass för samma underlag jämförs med en poänglista. Posterna jämförs uppifrån och ned. Det pass som är bättre på den första posten där passen skiljer sig är det bättre passet, oavsett de lägre posterna. Två pass med samma värde på alla poster är lika bra.

Regeln säger bara i vilken ordning prioriteterna gäller när två pass jämförs. Den kräver inte att generatorn hittar det bästa av alla möjliga pass. Vad passet som generatorn lämnar alltid måste klara står i R-049. Varje post går att räkna ut från passet självt, utan att andra pass behöver prövas.

| Ordning | Post | Bättre är |
|---|---|---|
| 1 | Antal delar som har minst ett moment, räknat bland de delar som finns kvar efter R-033 | fler |
| 2 | Vilka delar som har moment, prövat i ordningen `del-ovning`, `del-spelovning`, `del-spel`, `del-uppvarmning` | att den första delen där passen skiljer sig har moment |
| 3 | R-042 för `del-ovning`: alla övningar i delen har huvudträff | uppfylld |
| 4 | R-042 för `del-spelovning`: alla övningar i delen har huvudträff | uppfylld |
| 5 | R-043 Röd tråd | uppfylld |
| 6 | R-047 Alla valda fokus finns med | uppfylld |
| 7 | R-044 Uppvärmningen förbereder kroppen | uppfylld |
| 8 | R-045 Uppvärmningen träffar valt fokus | uppfylld |
| 9 | R-046 Spelet träffar valt fokus | uppfylld |
| 10 | R-038 Antal moment i hela passet | färre |
| 11 | R-037 Längsta sammanhängande aktiva tid utan paus, i minuter | kortare |

- En prioritet som gäller en del som har tagits bort enligt R-033 räknas som uppfylld, eftersom den är likadan för alla pass med samma underlag.
- En prioritet som gäller en del som saknar övning (R-100) räknas som inte uppfylld.
- Post 2 avgör vilken del som får en övning när två delar konkurrerar om samma övning (R-070).

*Testfall:* pass A har huvudträff i `del-ovning` men ingen röd tråd. Pass B saknar huvudträff i `del-ovning` men har röd tråd och färre moment. A är bättre, eftersom post 3 avgör före post 5 och 10.

### R-049 Det här klarar ett genererat pass alltid
Krav. Ett pass som generatorn lämnar till ledaren

1. är giltigt. När en del saknar övning gäller R-039: R-036 gäller inte, och R-035 gäller bara för delar som har moment,
2. kan inte bli bättre enligt R-048 genom en enda **enkel ändring**.

En enkel ändring är en av de här:

- **a.** byta en övning i ett moment, också i en station, mot en annan övning ur den gemensamma banken,
- **b.** fylla en del som saknar övning med ett eller två moment,
- **c.** ersätta de två momenten i en del med ett moment,
- **d.** flytta en vattenpaus till en annan plats som R-037 tillåter.

Vid a, b och c får tiderna för passets övningar och stationer väljas om inom sina gränser (R-034, R-065), och grupperna delas om enligt grupp 6. En ändring räknas bara om passet efter ändringen uppfyller punkt 1.

Generatorn behöver inte hitta det bästa av alla möjliga pass. Det kan finnas ett bättre pass som bara nås med flera ändringar samtidigt, och det är tillåtet. Hur generatorn söker är ett algoritmval (R-072). Regeln gäller passet som generatorn lämnar. När ledaren själv har bytt en övning (R-104, R-106) gäller den inte längre.

Punkt 2 med ändring b är det som gör att en del bara står tom när generatorn verkligen har prövat att fylla den (R-100).

**Så testas regeln:**

- Kontrollera att passet är giltigt.
- Pröva alla enkla ändringar mot testbanken och kontrollera att ingen ger en bättre poänglista enligt R-048.
- Jämför poänglistor, inte vilka övningar passet har, eftersom flera pass kan vara lika bra.
- I en testbank där bara ett pass klarar punkt 1 och 2 ska generatorn lämna just det passet.

*Motivering:* kraven skyddar spelarna och ser till att passet går att genomföra. Prioriteterna gör passet bättre, men ett pass som är nästan lika bra är fullt användbart för en ledare. Att kräva det allra bästa passet gör regeln svår att testa, eftersom flera pass kan vara lika bra, och dyr att räkna fram.

### R-121 Närliggande fokusområde när kärnan annars blir tom

Krav. Om `del-ovning` eller `del-spelovning` inte kan fyllas med valt fokus fylls delen i stället med ett **ersättningsfokus**: ett närliggande fokusområde ur tabellen nedan. Passet visar då vilket valt fokus som saknade övningar och vilket fokus som användes i stället.

Regeln gäller bara de två delarna i kärnan, eftersom R-041 är det enda kravet som kan göra en del tom på grund av fokus. `del-uppvarmning` och `del-spel` har egna lösningar: där är fokus en prioritet (R-044, R-045 och R-046), och de delarna fylls redan i dag med en övning som passar delen även när ingen övning träffar valt fokus.

**Så väljs ersättningsfokuset.** Stegen körs i ordning och ger alltid samma svar för samma underlag och samma bank.

1. **Valt fokus först.** Delen prövas med ledarens valda fokus (*Delen kan fyllas*). Går delen att fylla så används inget ersättningsfokus. Ett ersättningsfokus får aldrig användas för att få ett bättre pass, bara för att en del i kärnan annars skulle stå tom.
2. **Kandidatlistan byggs.** Ledarens fokusområden tas i den ordning ledaren valde dem. För varje sådant fokus läggs dess grannar för den aktuella delen till listan, i tabellens ordning.
3. **Listan rensas**, i den här ordningen: dubbletter tas bort så att den första förekomsten står kvar, fokusområden som ledaren redan har valt tas bort, fokusområden som är "–" för fasen i `fokusomraden.md` tas bort, och `nickspel` och `malvaktsspel` tas bort.
4. **Första kandidaten som fungerar väljs.** Ersättningsfokus är det första fokusområdet i den rensade listan där *Delen kan fyllas med fokus F* är sant. Alla andra krav gäller oförändrat, särskilt grupp 3 (grundfiltret), grupp 6 (grupper), grupp 7 (ledare och stationer), grupp 9 (säkerhet) och grupp 10 (yta).
5. **Samma ersättning i båda delarna om det går.** Om både `del-ovning` och `del-spelovning` behöver ett ersättningsfokus går generatorn igenom `del-ovning`:s rensade kandidatlista i ordning och tar det första fokusområde som gör att **båda** delarna kan fyllas. Finns inget sådant väljs ersättningsfokus för varje del för sig enligt steg 4.

**`nickspel` och `malvaktsspel` är aldrig ersättningsfokus.** Nickning ska bara förekomma när ledaren själv har valt den (R-080 till R-083), och en målvaktsövning är till för målvakterna, inte för att fylla en hel passdel för alla spelare.

#### Vilka fokusområden som ligger nära varandra

Nycklarna är de i `fokusomraden.md`. Ordningen i varje cell är den ordning generatorn prövar dem i.

| Valt fokus | Ersättning i `del-ovning` | Ersättning i `del-spelovning` | Varför de hör ihop |
|---|---|---|---|
| `bollkansla` | `dribbling`, `passning-mottagning`, `koordination` | `ett-mot-ett`, `dribbling` | Bollkänsla är att bollen lyder. Närmast ligger att föra bollen och att ta emot den så att nästa handling blir lätt. Med motståndare visar sig bollkänslan i 1 mot 1. |
| `dribbling` | `bollkansla`, `ett-mot-ett` | `ett-mot-ett`, `omstallning` | Dribbling mot en motståndare *är* 1 mot 1. Utan motståndare är det bollbehandling i fart. I spel används dribbling mest i den fria ytan efter en bollvinst. |
| `passning-mottagning` | `bollkansla`, `spelbarhet` | `spelbarhet`, `speluppbyggnad` | En passning kräver någon att passa till. Att göra sig spelbar är passningsspelets andra halva, och speluppbyggnad är passningsspel i lagform. |
| `avslut` | `dribbling`, `passning-mottagning` | `ett-mot-ett`, `omstallning` | Ett avslut föregås nästan alltid av ett driv eller en passning. I spel skapas målchanser genom att ta sig förbi någon eller genom att kontra. |
| `nickspel` | `avslut`, `passning-mottagning` | `fasta-situationer`, `avslut` | Nickar sker mot mål och på inlägg och hörnor. Ersättningen tar alltid bort nickning ur passet, aldrig tvärtom. |
| `ett-mot-ett` | `dribbling`, `bollkansla` | `dribbling`, `forsvarsspel` | Anfallssidan av 1 mot 1 är dribbling och finter. Försvarssidan, att pressa och vinna bollen, är samma sak som lagförsvarets minsta del. |
| `spelbarhet` | `passning-mottagning`, `bollkansla` | `speluppbyggnad`, `passning-mottagning` | Att göra sig spelbar tränas alltid ihop med passningen. I spel med riktning blir spelbarhet i praktiken uppbyggnad genom lagdelarna. |
| `speluppbyggnad` | `passning-mottagning`, `spelbarhet` | `spelbarhet`, `passning-mottagning` | Uppbyggnad är passningsspel med riktning. Tas lagdelarna bort återstår att göra sig spelbar och att passa och ta emot. |
| `forsvarsspel` | `ett-mot-ett`, `koordination` | `ett-mot-ett`, `omstallning` | Allt försvar börjar i 1 mot 1: press, kroppsställning, vända och följa. Omställning innehåller försvarets första sekunder efter bolltapp. |
| `omstallning` | `passning-mottagning`, `snabbhet` | `forsvarsspel`, `spelbarhet` | Omställning är snabba beslut direkt efter bollvinst eller bolltapp: snabba passningar och snabba starter, och i spel återerövring och snabbt anfall. |
| `fasta-situationer` | `passning-mottagning`, `avslut` | `avslut`, `forsvarsspel` | En fast situation är en inövad passning eller ett avslut. Att försvara den är lagförsvar på liten yta. |
| `malvaktsspel` | `avslut`, `passning-mottagning` | `avslut`, `speluppbyggnad` | Målvaktens moment tränas nästan alltid ihop med utespelarnas avslut, och utspelet hör ihop med uppbyggnaden. |
| `koordination` | `bollkansla`, `snabbhet` | `snabbhet`, `ett-mot-ett` | För barn tränas koordination bäst med boll. I spel visar sig koordinationen som riktningsändringar i hög fart och i närkamp. |
| `snabbhet` | `koordination`, `dribbling` | `ett-mot-ett`, `omstallning` | Fotbollssnabbhet är starter och riktningsändringar, nästan alltid i en kamp om bollen eller i en kontring. |
| `uthallighet` | `snabbhet`, `koordination` | `spelbarhet`, `omstallning` | Uthållighet ska tränas i fotbollsform. Ett intensivt smålagsspel med många omställningar ger samma belastning. |
| `skadeforebyggande` | `koordination`, `bollkansla` | `koordination`, `snabbhet` | Programmen består av löp-, hopp- och landningsteknik och bålstabilitet, alltså koordination och kroppskontroll. |
| `lek` | `bollkansla`, `dribbling`, `koordination` | `ett-mot-ett`, `spelbarhet` | Lek med boll är i praktiken bollkänsla och dribbling i lekform. I en spelövning blir leken ett litet spel där alla utmanar, samarbetar och gör mål. |

#### Avvikelser per åldersfas

Närheten är inte densamma i alla åldrar. Där en rad nedan gäller används dess ordning i stället för tabellens.

| Valt fokus | Del | Faser | Ordning i stället | Varför |
|---|---|---|---|---|
| `lek` | `del-ovning` | `fas-10-12`, `fas-13-14`, `fas-15-19` | `dribbling`, `koordination`, `bollkansla` | Från 10 år betyder lek i kärnan oftast utmaning och tävling med boll, inte fri lek med egen boll. Övning med egen boll ligger då ett steg längre bort. |
| `lek` | `del-spelovning` | `fas-13-14`, `fas-15-19` | `spelbarhet`, `ett-mot-ett` | Från 13 år bärs den lekfulla spelövningen av lagspelet. `spelbarhet` är kärnområde i faserna, `ett-mot-ett` bara relevant (`fokusomraden.md`). |
| `koordination` | `del-ovning` | `fas-13-14`, `fas-15-19` | `snabbhet`, `skadeforebyggande`, `bollkansla` | Under och efter tillväxtspurten tränas koordination mest som rörelse-, löp- och landningsteknik. Det är samma innehåll som de skadeförebyggande programmen, som är kärnområde i faserna. |

#### När inget närliggande fokusområde heller fungerar

Krav. Om inget fokusområde i den rensade kandidatlistan gör att delen kan fyllas ska delen stå tom. Generatorn går då aldrig vidare till ett fokusområde utanför listan och sänker aldrig något annat krav.

- Delen **saknar övning** enligt R-100 och visas på sin plats med sitt namn, sin måltid och texten att övning saknas. R-039 gäller, alltså ingen tidsgräns för hela passet.
- R-103 visar vilka av ledarens val som, var för sig, skulle kunna ge en övning i delen. Prövningen i R-103 görs mot ledarens egna val, inte mot ersättningsfokus.
- Om varken `del-ovning`, `del-spelovning` eller `del-spel` kan fyllas, räknat med ersättningsfokus, skapas inget pass (R-101).

#### Hur ersättningsfokuset påverkar de andra reglerna

- **R-041** prövas mot delens ersättningsfokus, för varje övning och varje station i delen.
- **R-042 (huvudträff)** prövas mot det fokus som gäller i delen, alltså ersättningsfokuset där ett sådant används.
- **R-043 (röd tråd)** räknas som uppfylld om minst en övning i `del-spelovning` har ett fokusområde gemensamt med minst en övning i `del-ovning`, bland de fokus som gäller för respektive del. Steg 5 ovan finns just för att den röda tråden ska hålla.
- **R-047 (alla valda fokus finns med)** prövas oförändrat mot ledarens val. Ett valt fokus som banken saknar övningar för förblir alltså ouppfyllt. Det är en prioritet, inte ett krav.
- **R-044, R-045 och R-046** är oförändrade. Ersättningsfokuset gäller aldrig i `del-uppvarmning` eller `del-spel`.
- **R-102** gäller fortfarande. Underlaget ändras inte: ledarens valda fokusområden står kvar oförändrade i passet, i utskriften och i säsongsplanens veckofokus (R-110).
- **R-104 och R-106** (byte av övning): i en del med ersättningsfokus prövas villkoret om R-041 mot delens ersättningsfokus.
- **R-049** gäller som vanligt. Eftersom en fylld del är bättre än en tom del enligt post 1 och 2 i R-048 kommer ett pass som kunde ha fyllt kärnan med ett ersättningsfokus, men lät delen stå tom, inte att uppfylla R-049.

**Så testas regeln:**

- En bank utan övningar med valt fokus i kärnan ger ett pass där `del-ovning` och `del-spelovning` har övningar med det första fungerande fokusområdet i listan, och passet talar om att ersättning har skett.
- En bank där valt fokus räcker till båda delarna ger inget ersättningsfokus alls.
- Ett fokusområde som är "–" för fasen, `nickspel` eller `malvaktsspel` förekommer aldrig som ersättningsfokus, oavsett bank.
- När båda delarna behöver ersättning och det finns ett fokusområde som fungerar i båda, används samma fokus i båda delarna.
- En bank där varken valt fokus eller någon kandidat fungerar ger en tom del enligt R-100, inte en övning med ett annat fokus.

*Testfall:* 11 år (`fas-10-12`, `7mot7`), `niva-2`, enda valda fokus `lek`. Banken har inga övningar med `lek` märkta `del-ovning` eller `del-spelovning`. Kandidatlistan för `del-ovning` blir `dribbling`, `koordination`, `bollkansla` (avvikelsen för fas 10–12). Om delen kan fyllas med `dribbling`, och `del-spelovning` också kan fyllas med `dribbling`, används `dribbling` i båda delarna, och den röda tråden räknas som uppfylld. Passet visar att `lek` saknade övningar i kärnan och att `dribbling` användes i stället. Uppvärmningen kan fortfarande ha en lek, eftersom R-045 är en prioritet.

*Testfall:* 9 år (`fas-8-9`), enda valda fokus `koordination`, och banken saknar övningar med `koordination` i kärnan. Kandidatlistan för `del-ovning` är `bollkansla`, `snabbhet`. Om `bollkansla` fungerar i Öva men inte i Spelövning, medan `snabbhet` fungerar i båda, används `snabbhet` i båda delarna enligt steg 5.

*Motivering:* en ersättning är fotbollsmässigt försvarbar bara när tre saker stämmer. För det första ska innehållet leda mot det ledaren valde: ett barn som inte får leken i Öva får i stället det leken skulle ha övat, alltså bollkontakter och rörelse. För det andra ska fokusområdet vara K eller R för åldern (`fokusomraden.md`), så att övningarna passar spelarnas motorik och koncentration. För det tredje ska delens karaktär hålla: Öva är upprepningar utan eller med begränsat motstånd, Spelövning är spel med motståndare, riktning och mål (`passuppbyggnad.md`). Därför har varje fokusområde två listor. Lek i uppvärmningen och lek i en spelövning är inte samma sak: i uppvärmningen är leken målet i sig, i spelövningen är den ett litet spel, och närmast den ligger 1 mot 1 och att spela tillsammans. Motsatsen, att generatorn tystnar och lämnar halva passet tomt för att banken ännu är liten, hjälper ingen ledare. Att den byter i tysthet vore värre: ledaren ska alltid kunna se vad passet faktiskt innehåller.

*Regeln är ny 2026-09-21.* Den kom fram i förarbetet till inkrement 1, när banken hade 31 godkända övningar, nitton för 7 mot 7 och tolv för 5 mot 5, och varken `lek` eller `koordination` fanns som fokus i kärnan. Användaren beslutade 2026-09-21 att valet ska tillåtas och att generatorn ska falla tillbaka på ett närliggande fokusområde och tala om det. Närhetstabellen och avvikelserna per fas är min bedömning som tränarutbildare, byggd på `fokusomraden.md`, `aldrar-och-fokus.md` och `passuppbyggnad.md`. SvFF anger så vitt jag vet ingen sådan indelning.

---

## Grupp 6: Spelare, grupper och udda antal (R-050–R-057)

**Varför:** alla spelare ska vara med i allt, och ingen ska stå i kö. När det är fler spelare än en övning rymmer delas de i flera grupper som gör samma sak sida vid sida. Udda antal ska nästan aldrig vara ett skäl att välja bort en övning, eftersom det finns enkla lösningar som alla ledare känner till: en trio i stället för ett par, eller en joker i ett spel. Principerna beskrivs för ledaren i `passuppbyggnad.md`.

### R-050 Största grupp
Definition. Övningens största grupp är dess högsta antal spelare (R-007), med två undantag:
- En övning med grupptypen `fast-storlek` och en lösning för udda antal (R-008) får ha grupper som är en spelare större än övningens storlek.
- Om övningens ledarbehov är 1 eller 2 får en grupp inte ha fler spelare än taket per ledare gånger ledarbehovet. Den här strecksatsen gäller inte i `del-spel`, se R-057.

Den största gruppen är det minsta av de värden som gäller.

### R-051 Antal grupper
Krav. För ett helgruppsmoment med N spelare är antalet grupper k det minsta heltal där ⌈N / k⌉ ≤ största grupp (R-050). Spelarna fördelas så att grupperna skiljer sig med högst en spelare.

*Testfall:* N = 14 och största grupp 8 ger k = 2, alltså grupper om 7 och 7. N = 13 ger 7 och 6.

### R-052 Ingen grupp för liten
Krav. Om någon grupp enligt R-051 blir mindre än övningens minsta antal spelare kan övningen inte användas i momentet.

*Testfall:* minst 6, högst 8 och N = 9 ger k = 2 med grupper om 5 och 4. Övningen kan inte användas.

### R-053 För få spelare
Krav. Om N är mindre än övningens minsta antal spelare kan övningen inte användas (berättelse 02, kriterium 5).

### R-054 Udda antal
Krav. Så hanteras en grupp med udda antal, beroende på grupptyp:

| Grupptyp | Udda antal i en grupp |
|---|---|
| `fri` | Ingen åtgärd. |
| `par` | En trio i stället för ett par. Passet visar det. |
| `tva-lag` | En spelare blir joker. Passet visar det. Om övningens `anpassning` beskriver en annan lösning visas den i stället. |
| `fast-storlek` | Grupper som är en spelare större är tillåtna bara om övningen har en lösning för udda antal (R-050). Annars kan övningen inte användas om spelarna inte går jämnt upp i grupper av övningens storlek. |

Bara en övning med grupptypen `fast-storlek` kan alltså väljas bort på grund av udda antal (berättelse 02, kriterium 7).

### R-055 Ledare för ett helgruppsmoment
Krav. Ett helgruppsmoment med k grupper behöver k × ledarbehov ledare. Det får inte vara fler än L. En övning med ledarbehov 0 kan köras i hur många grupper som helst med en ledare.

*Testfall:* L = 1 och en ledarstyrd övning som måste köras i 2 grupper: övningen kan inte användas. Samma övning med ledarbehov 0: övningen kan användas.

### R-056 Alla är med
Krav. I varje moment är summan av spelarna i alla grupper lika med N. Ingen spelare står utanför ett moment.

### R-057 Taket per ledare gäller inte i `del-spel`
Krav. Den andra strecksatsen i R-050, om taket per ledare, gäller inte för ett moment i `del-spel`. Där är övningens största grupp dess högsta antal spelare (R-007), oavsett om övningens ledarbehov är 0, 1 eller 2. Övriga krav gäller oförändrat, särskilt R-055: ett moment med k grupper behöver k × ledarbehov ledare, och det får aldrig vara fler än L.

*Testfall:* `fas-10-12`, N = 14, L = 2, en övning i `del-spel` med ledarbehov 1 och spelare 10–14. Med R-057 blir det en grupp om 14 och ett moment som kräver en ledare. Utan regeln sätter taket största gruppen till 12, och 14 delas i två grupper om 7, alltså två spel och två ledare.

*Motivering:* taket per ledare är satt för ledarstyrda övningar med upprepningar, kö och material som ska servas. Spelet är något annat: två lag, mål och riktning, där ledaren dömer och coachar från sidan medan spelet driver sig självt. Utan undantaget delar generatorn ett 7 mot 7 i två spel om 3 mot 3 plus målvakt bara för att gruppen är större än taket, med fyra mål och dubbelt så många ledare. Det bryter mot att spelet ska spelas i dagens spelform eller strax under (`passuppbyggnad.md`, *Passets delar*) och gör passets största del sämre, inte säkrare. Skyddet finns kvar på annat håll: R-021 ger ledaren tipset om att be om hjälp när det är många spelare per ledare, och R-084 påminner om att målen ska vara förankrade.

*Samspelar med:* R-050 (regeln stänger av den andra strecksatsen i just `del-spel`), R-051 och R-055 (antal grupper och ledare räknas som vanligt), R-008 (en övning i `del-spel` har alltid grupptypen `tva-lag`, så den första strecksatsen i R-050 om `fast-storlek` kan aldrig bli aktuell här), R-021 (tipset) och R-060 (stationer finns inte i `del-spel`, så R-063 och R-064 berörs aldrig).

*Regeln är ny vid K3 (2026-09-14).* Den kom fram när jag granskade omgång 1 av övningsbanken. Användaren godkände den 2026-09-14.

---

## Grupp 7: Ledare och stationer (R-060–R-067)

**Varför:** fler ledare ger mindre grupper och mer aktivitet. Stationer är ett bra sätt att använda flera ledare, men de tar tid att ställa i ordning och att rotera, och de kräver en vuxen per station för att fungera. Därför begränsas både antalet och var i passet de får förekomma.

### R-060 När stationer får användas
Krav. Ett stationsmoment får bara finnas om L ≥ 2, och bara i `del-ovning` eller `del-spelovning`. Med L = 1 har passet inga stationer (berättelse 02, kriterium 3).

### R-061 Antal stationer
Krav. Ett stationsmoment har S stationer, där 2 ≤ S ≤ 4 och S ≤ L (berättelse 02, kriterium 4).

### R-062 Stationernas övningar
Krav. Varje station har en egen övning. Alla S övningar är olika, uppfyller grundfiltret (grupp 3) och säkerhetsreglerna (grupp 9), är märkta med den del momentet ligger i (R-028) och uppfyller R-041.

### R-063 Grupper vid stationer
Krav. Spelarna delas i S grupper som skiljer sig med högst en spelare. Varje grupp ska för varje stationsövning vara minst övningens minsta antal och högst övningens största grupp (R-050). Ingen grupp får vara större än taket per ledare. Udda antal hanteras enligt R-054.

### R-064 Ledare vid stationer
Krav. Varje station har minst en egen ledare. Stationen behöver det största av 1 och övningens ledarbehov. Summan för alla stationer får inte vara större än L.

### R-065 Tid vid stationer
Krav. Alla grupper har samma tid t på varje station. t är ett heltal som är minst 5, högst fasens längsta tid för delen (R-034) och ligger inom varje stationsövnings kortaste och längsta tid. Momentets tid är S × t + (S − 1) minuter, eftersom varje byte tar 1 minut.

*Testfall:* S = 2 och t = 5 ger 11 minuter. S = 3 och t = 5 ger 17 minuter.

### R-066 Rotation
Krav. Varje grupp går igenom varje station exakt en gång. Alla spelare får alltså samma innehåll.

### R-067 Val mellan stationer och helgrupp
Algoritmval. När både ett stationsmoment och ett helgruppsmoment är giltiga och lika bra enligt R-048 får algoritmen välja vilket som används.

---

## Grupp 8: Variation (R-070–R-072)

**Varför:** inom ett pass ska varje övning ge något nytt. Mellan pass är det tvärtom. Barn och ungdomar lär sig genom att göra samma sak flera gånger, och en övning som gruppen redan kan kommer igång snabbare och ger mer aktiv tid. Därför finns ingen fotbollsfacklig regel som hindrar att samma övning återkommer i nästa pass.

### R-070 Samma övning bara en gång i ett pass
Krav. En övning (samma `id`) förekommer högst en gång i ett pass, i ett moment och en del. Att samma övning körs i flera grupper sida vid sida i ett moment räknas som en gång.

### R-071 Varianter är samma övning
Krav. Övningens lättare och svårare variant är inte egna övningar. R-070 gäller därför också för dem.

### R-072 Gränsen mellan fotbollsregler och algoritmval
Krav. Regeln gäller de val algoritmen gör, inte mängden pass som skulle kunna finnas.

1. **Slumpen är sista utslagsgivare.** När algoritmen använder slumpen, eller ett frö, för att välja mellan flera alternativ ska alternativen vara lika bra i den jämförelse algoritmen gör i just det beslutet. Alternativ som är sämre i den jämförelsen sorteras bort innan slumpen används.
2. **Ingen medveten försämring.** Algoritmen väljer aldrig ett alternativ som den vid tillfället kan se är sämre enligt R-048 än ett annat alternativ den har att välja på.
3. **Golvet gäller varje frö.** Passet som lämnas till ledaren uppfyller alltid R-049, oavsett vilket frö som användes.
4. **Samma frö ger samma pass.** Samma underlag, samma bank och samma frö ger alltid samma pass.

Regeln kräver inte att alla frön ger pass med samma poäng enligt R-048. Två frön får ge pass som skiljer sig, också i poäng, så länge punkt 1 till 4 är uppfyllda.

**Så testas regeln:**

- Varje ställe i koden där slumpen används pekas ut. Ett test visar att listan som slumpen väljer ur bara innehåller alternativ som är lika bra i den jämförelse som görs där, till exempel genom att listan först har filtrerats på det bästa värdet.
- Pass från många olika frön prövas mot R-049. Varje resultat ska klara den uttömmande kontrollen av enkla ändringar.
- Samma frö två gånger ger ett identiskt pass.
- Att två frön ger olika poäng enligt R-048 är inte i sig ett fel.

*Varför regeln ändrades 2026-09-12:* den tidigare lydelsen krävde att alla frön skulle ge pass som är lika bra enligt R-048. Det kravet går bara att uppfylla genom att alltid hitta det bästa av alla möjliga pass, och R-049 säger uttryckligen att generatorn inte behöver det: två sökningar kan hamna i olika lokala optima och ändå båda uppfylla R-049 (ADR 0011, avsnitt 4, grupp 8). Det fotbollsfackliga syftet är oförändrat: **ledaren ska aldrig få ett sämre pass för att generatorn slumpade annorlunda.** Syftet bärs nu av punkt 1 till 3. Punkt 3 är det som skyddar ledaren i praktiken. Varje pass som lämnas ut är ett pass som ingen enkel ändring kan förbättra, och skillnaden mellan två sådana pass är liten: den gäller aldrig kraven, som skyddar spelarna och gör passet genomförbart, utan bara önskemålen i R-048.

*Uppföljning, inte ett krav:* om olika frön ofta ger skillnader på post 1 till 6 i R-048, alltså vilka delar som fylls, huvudträff i kärnan, röd tråd och att alla valda fokus finns med, är passen inte längre likvärdiga för ledaren. Då är det sökningen som fastnar för lätt. Det ska tas upp med fotbollsexperten som en fotbollsfacklig fråga, inte lösas genom att ändra den här regeln.

Mellan olika pass finns ingen begränsning. Samma övning och samma fokus får återkomma i pass efter varandra och i på varandra följande veckor i en säsongsplan (se `sasongsprogression.md`).

### Algoritmval som senior-systemutvecklare äger

Följande är inte fotbollsregler. Det avgörs av senior-systemutvecklare, så länge alla krav och R-048 följs:

- hur generatorn söker efter passet, och i vilken ordning delarna fylls
- hur generatorn väljer bland lika bra pass, till exempel slumpmässigt, och om upprepad generering ger olika pass (berättelse 02, *Utanför*)
- vilken tid en övning får inom sina gränser (R-034), så länge R-035 och R-036 följs
- om ett stationsmoment eller ett helgruppsmoment används när båda är lika bra (R-067)
- var vattenpauserna hamnar när flera placeringar är lika bra enligt R-037
- om generatorn i en framtida version tar hänsyn till tidigare pass. Det förutsätter en ny fotbollsregel här innan det byggs.

---

## Grupp 9: Säkerhet (R-080–R-085)

**Varför:** säkerhetsreglerna gäller alltid, även när det gör att färre övningar matchar. De gäller också när ledaren själv byter in en övning, både ur banken (R-104) och bland klubbens egna övningar (R-106).

**Nickning.** Användaren beslutade 2026-09-11 att appen följer SvFF (kravspec, Beslut vid K1, punkt 2). SvFF skriver att nickning förs in i spelarutbildningsplanen först i spelformen 9 mot 9, alltså från 13 år, och att spelformerna före det är utformade så att bollen ska vara på marken. Källa: SvFF, *Får barn nicka?*, https://aktiva.svenskfotboll.se/nyheter/2023/05/nickning-for-barn/ (publicerad 2023-05-23, hämtad 2026-09-11). Hur mycket nickning 13–19-åringar ska ha anger SvFF inte. Taken i R-082 är mitt förslag, som användaren har beslutat. Se också avsnittet *Nickning* i `aldrar-och-fokus.md`.

### R-080 Ingen nickträning före 13 år
Krav. Om åldern är under 13 kan `nickspel` inte väljas som fokus, och ingen övning som har `nickspel` bland sina fokusområden väljs eller kan bytas in.

*Kontroll mot andra regler:* R-019 ger samma resultat för valet av fokus, eftersom `nickspel` är "–" till och med 12 år i `fokusomraden.md`. R-080 står ändå för sig, så att nickgränsen gäller även om tabellen ändras.

### R-081 Nickövningar märks för rätt ålder
Krav. En övning som har `nickspel` bland sina fokusområden ska ha en minsta ålder på minst 13 (R-003).

En övning där spelarna nickar bollen som en planerad del av övningen ska ha `nickspel` bland sina fokusområden, även när nickning inte är huvudfokus. Det kan inte kontrolleras automatiskt. Det kontrolleras när övningen granskas (fotbollsexpert och redaktör).

*Kontroll mot andra regler:* R-081 säger inte emot R-002. R-002 kräver att varje fokusområde är K eller R för varje fas som övningens åldersspann berör. Eftersom `nickspel` är "–" för `fas-10-12` och yngre ger R-002 samma gräns, 13 år. R-081 står ändå för sig, av samma skäl som R-080. Andra stycket behövs för att R-080 och R-082 ska fungera: en övning med nickning som inte är märkt med `nickspel` skulle annars slippa igenom båda reglerna.

### R-082 Begränsad mängd nickning
Krav. Sammanlagd tid för övningar som har `nickspel` bland sina fokusområden är högst 10 minuter per pass för `fas-13-14` och högst 20 minuter per pass för `fas-15-19`.

- Övningens hela tid räknas, även om bara en del av övningen är nickning.
- I ett helgruppsmoment räknas momentets tid. I ett stationsmoment räknas stationstiden t (R-065) för varje station med en sådan övning, eftersom det är den tid varje spelare är där.
- Taket gäller också efter byte av övning (R-104, R-106), räknat med den nya övningens tid enligt R-105.

*Testfall:* `fas-13-14`, en övning med `nickspel` i Öva på 8 minuter. En till övning med `nickspel` på 5 minuter kan inte läggas i passet, eftersom 8 + 5 = 13 > 10.

### R-083 Nickspel väljs tillsammans med ett annat fokus
Krav. `nickspel` kan bara väljas som fokus om ledaren också väljer minst ett annat fokusområde.

*Motivering:* utan den regeln kan R-041 och R-082 inte uppfyllas samtidigt, eftersom Öva och Spelövning tillsammans ofta är längre än nicktaket.

### R-084 Påminnelse om mål
Krav. Om någon övning i passet har material av typen `mal` eller `minimal` (R-120) visar passet en påminnelse om att alla mål, även små, ska vara förankrade så att de inte kan välta (`spelformer.md`).

Båda typerna räknas, eftersom ett minimål är lätt och välter minst lika lätt som ett stort mål.

### R-085 Påminnelse om benskydd
Krav. Varje pass visar en påminnelse om benskydd, eftersom `del-spel` alltid innehåller närkamper (`spelformer.md`).

---

## Grupp 10: Tillgänglig yta (R-090–R-094)

**Varför:** ytan avgör i praktiken vilka övningar som går att genomföra. Många lag delar planen med andra och har en halv eller en kvarts plan. Ett spel 9 mot 9 får inte plats på en kvarts plan, och fyra smålagsspel sida vid sida kräver mer yta än ett. Om generatorn inte vet det kan den föreslå pass som inte går att genomföra.

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 1):* version 1 har ett valfritt ytfilter med hel, halv och kvarts plan. Det finns inget materialfilter (bollar, koner, mål) i version 1. Inomhushall som yta kommer i en senare version och kräver egna mått, som inte finns här än.

*Läsanvisning, ingen regel (2026-09-23):* yta per spelare är ett **granskningskriterium** för övningsbanken och står i `passuppbyggnad.md`, avsnittet *Yta per spelare*. Det används när en övning skrivs och granskas, inte av generatorn. Generatorn väljer aldrig bort ett moment för att ytan är trång eller rymlig; den kontrollerar bara att momentet får plats på den yta ledaren har valt (R-092). Tabellen med kvadratmeter per spelare ska alltså inte implementeras som ett filter. Om den någon gång ska bli en regel är det ett eget beslut av användaren och en egen ändring av den här filen, med ett nytt regel-ID.

### R-090 Ledaren kan ange yta
Krav. Ledaren kan välja en av `yta-hel`, `yta-halv` och `yta-kvart`, eller låta bli. Yta är valfri (R-020). Om ledaren inte väljer någon yta används inget ytfilter, och R-092 och R-093 gäller inte.

### R-091 Ytornas mått
Krav. Ytorna har de här måtten, längd × bredd i meter:

| Nyckel | Namn | Mått |
|---|---|---|
| `yta-hel` | Hel plan för 11 mot 11 | 105 × 65 |
| `yta-halv` | Halv plan | 65 × 52 |
| `yta-kvart` | Kvarts plan | 52 × 32 |

105 × 65 är SvFF:s rekommenderade mått för 11 mot 11 (`spelformer.md`). Halv och kvarts plan är min avrundning nedåt. Med dessa mått får planen för 7 mot 7 (minst 50 × 30) plats på en kvarts plan och planen för 9 mot 9 (minst 65 × 50) på en halv plan.

### R-092 Momentet får plats
Krav. När en yta är vald kan ett moment bara användas om det får plats. Övningens yta per grupp, fältet `yta` (`content/ovningar/README.md`), är l × b meter. Om övningen anger olika ytor för olika spelformer används ytan för den valda spelformen. Den valda ytan har måtten A × B (R-091).
- **En grupp:** gruppens yta får plats i någon riktning, alltså l ≤ A och b ≤ B, eller l ≤ B och b ≤ A.
- **Flera grupper eller stationer samtidigt:** varje grupp får 3 meters marginal, alltså (l + 3) × (b + 3). Varje grupp med marginal får plats i någon riktning, och summan av alla gruppers ytor med marginal är högst A × B.

Marginalen följer säkerhetsavståndet i `spelformer.md`.

*Testfall:* `yta-kvart` (52 × 32 = 1 664 m²) och två grupper med ytan 25 × 20 m: (28 × 23) × 2 = 1 288 m², och 28 × 23 får plats. Momentet kan användas. Tre grupper: 1 932 m². Momentet kan inte användas.

### R-093 Övning utan yta
Krav. När en yta är vald kan en övning som saknar yta inte användas. Om ingen yta är vald spelar det ingen roll om övningen har en yta.

### R-094 Ytan gäller ett moment i taget
Krav. Ytkontrollen görs för varje moment för sig, eftersom momenten görs efter varandra och kan använda samma yta.

---

## Grupp 11: När för få övningar matchar, och byte av övning (R-100–R-106)

**Varför:** ledaren ska alltid förstå vad som hände och själv bestämma vad som ska ändras (berättelse 03). Generatorn byter aldrig ledarens val i tysthet och fyller inte ut en tom del med något som inte passar. Vid byte av övning (berättelse 04) ska den nya övningen passa lika bra på samma plats som den gamla, och säkerhetsreglerna gäller alltid, också för klubbens egna övningar.

### R-100 En del som saknar övning
Krav. En del som fylls från banken, och som inte har tagits bort enligt R-033, **saknar övning** om den inte har något moment i passet. En sådan del visas i passet på sin plats, med sitt namn, sin måltid och texten att övning saknas. Delens tid läggs inte på andra delar (R-039).

- En del som inte kan fyllas (se *Begrepp*) saknar alltid övning.
- En del som kan fyllas för sig kan ändå sakna övning om generatorn inte kan fylla den tillsammans med resten av passet, till exempel för att samma övning behövs i en annan del (R-070), för att nicktaket annars överskrids (R-082) eller för att passet annars blir för långt (R-036). Det ska vara sällsynt. R-049, ändring b, anger vad generatorn då minst måste ha prövat.

*Hänvisning:* innan `del-ovning` eller `del-spelovning` får sakna övning ska ersättningsfokus enligt R-121 ha prövats. En sådan del saknar övning bara om den varken kan fyllas med valt fokus eller med något närliggande fokusområde.

*Varför regeln inte säger "om inget giltigt pass har ett moment i delen":* det skulle kräva att generatorn prövar alla möjliga pass innan den får visa en tom del. Det är samma sak som att kräva det bästa passet, och det kan varken byggas eller testas på ett rimligt sätt. I stället avgörs det av begreppet *Delen kan fyllas*, som prövas för delen för sig, och av R-049.

### R-101 När inget pass skapas
Krav. Om ingen av delarna `del-ovning`, `del-spelovning` och `del-spel` kan fyllas (se *Begrepp*), bland dem som finns kvar efter R-033, skapas inget pass. Appen visar i stället att inget pass kunde skapas (berättelse 03, kriterium 1). Om minst en av dem kan fyllas skapas ett pass.

*Hänvisning:* vid den här prövningen räknas `del-ovning` och `del-spelovning` som att de kan fyllas också när de bara kan fyllas med ett ersättningsfokus (R-121).

*Motivering:* ett pass med bara uppvärmning är inget träningspass. Ett pass där bara spelet finns går däremot att använda.

### R-102 Underlaget ändras aldrig av generatorn
Krav. Generatorn ändrar aldrig ålder, spelform, nivå, fokus, antal spelare, antal ledare, passlängd eller yta för att hitta fler övningar. Det gäller också R-026.

*Hänvisning:* R-121 ändrar inte underlaget. Ledarens valda fokusområden står kvar oförändrade i passet och i säsongsplanens veckofokus (R-110). Det som ändras är bara vilket fokus övningarna i en del i kärnan måste träffa (R-041), och passet talar om för ledaren att det har skett.

### R-103 Vilka val som kan ändras
Krav. För varje del som saknar övning visar appen vilka av ledarens val som, var för sig, skulle kunna ge en övning i delen. Ett val visas om det finns ett annat tillåtet värde för just det valet, med alla andra val oförändrade, som gör att delen kan fyllas (se *Begrepp*). Valen som prövas är nivå, fokusområden, antal spelare, antal ledare, spelform och, om det är valt, yta. För fokusområden prövas varje enskilt fokusområde som är tillåtet för fasen. Appen visar vilka val det gäller, inte vilka värden (berättelse 03, *Utanför*).

*Hänvisning:* en del som har fyllts med ett ersättningsfokus (R-121) saknar inte övning. R-103 gäller därför inte den delen. Passet talar i stället om vilket valt fokus som saknade övningar och vilket fokus som användes i stället.

Om delen kan fyllas för sig men ändå saknar övning (R-100, andra punkten) är det inget enskilt val som är orsaken. Då visar appen i stället att delens övningar inte gick att kombinera med resten av passet.

### R-104 Vilka övningar som kan ersätta en övning
Krav. En övning X i ett moment kan ersättas med en övning Y ur den gemensamma banken om
1. Y uppfyller grundfiltret (grupp 3), säkerhetsreglerna (grupp 9) och, om yta är vald, ytreglerna (grupp 10). Nicktaket (R-082) prövas för hela passet efter bytet, med Y:s tid enligt R-105,
2. Y är märkt med samma del som X ligger i,
3. Y uppfyller R-041 om delen är `del-ovning` eller `del-spelovning`,
4. Y kan användas med momentets spelare och ledare enligt grupp 6. I ett stationsmoment ska Y dessutom passa stationens grupper (R-063), stationstiden t (R-065) och ledarna (R-064),
5. Y inte redan finns någon annanstans i passet (R-070).

Klubbens egna övningar kan också ersätta X. För dem gäller R-106, som gör ett undantag från kravet på status i R-022 men behåller alla andra villkor.

Prioriteterna i R-048 används inte vid byte. Ledaren väljer själv bland alla övningar som uppfyller villkoren, ur banken och bland klubbens egna övningar. Om ingen övning uppfyller dem ligger X kvar (berättelse 04, kriterium 3).

X kan själv vara en av klubbens egna övningar som ledaren har bytt in tidigare. Villkoren är desamma.

*Hänvisning:* om delen har ett ersättningsfokus (R-121) prövas villkor 3 mot delens ersättningsfokus, alltså mot det fokus delens övningar faktiskt har. Det gäller också R-106, som hänvisar till villkoren här.

### R-105 Tid efter byte
Krav. Y får den tid inom sina gränser (R-034) som ligger närmast X:s tid. Om två tider ligger lika nära väljs den kortare. I ett stationsmoment får Y stationstiden t. R-035 och R-036 kontrolleras inte efter ett byte, men passet visar den nya totala tiden (berättelse 04, kriterium 5). Regeln gäller både övningar ur banken (R-104) och klubbens egna övningar (R-106).

### R-106 Byte till en av klubbens egna övningar
Krav. När ledaren byter ut en övning X (berättelse 04) visar appen också klubbens egna övningar som alternativ. Det är det enda sättet som en egen övning kommer in i ett pass. Generatorn väljer dem aldrig själv (R-022).

En av klubbens egna övningar, Y, kan ersätta X om alla de här villkoren är uppfyllda:

1. **Klubb och status.** Y tillhör ledarens klubb och är inte borttagen (berättelse 14, kriterium 3). Y:s status spelar ingen roll. Det här är det enda undantaget från det som gäller för övningar ur banken: kravet på status `godkand` i R-022 gäller inte.
2. **Uppgifterna finns och är riktiga.** Y har de uppgifter som villkoren behöver, och de uppfyller R-001 till R-009:
   - nivålista (R-001), fokusområden (R-002), ålder (R-003), spelformer (R-004), passdelar (R-005), ledarbehov (R-006), antal spelare (R-007), grupptyp (R-008) och tid (R-009),
   - yta, om ledaren har valt en yta (R-093),
   - namn, syfte och beskrivning, som varje övning i passet visar (berättelse 02, kriterium 2).
3. **Samma villkor som för banken.** Y uppfyller villkor 1 till 5 i R-104, med undantaget i punkt 1 ovan. Det betyder att grundfiltret i övrigt (ålder, spelform, nivå, fokusområden som passar fasen och rätt del), R-041, grupperna, ledarna och R-070 gäller fullt ut.
4. **Säkerhetsreglerna gäller alltid.** Hela grupp 9 gäller för Y utan undantag. Y kan alltså inte bytas in om den har `nickspel` och åldern är under 13 (R-080), om den har `nickspel` och en minsta ålder under 13 (R-081) eller om passet efter bytet går över nicktaket (R-082).

**Om uppgifter saknas.** Om Y saknar en uppgift som punkt 2 kräver, eller om en uppgift bryter mot R-001 till R-009, kan Y inte bytas in. Appen gissar aldrig ett värde som saknas. Den antar till exempel inte att en övning utan nivå passar alla nivåer, att en övning utan antal spelare passar alla antal eller att en övning utan passdelar passar i alla delar. Hur appen visar att en egen övning saknar uppgifter bestäms av ux-designern.

**Om material saknas.** Om Y inte anger något material visar passet påminnelsen om att mål ska vara förankrade (R-084), eftersom appen då inte kan veta att övningen saknar mål.

Efter bytet gäller R-105 för tiden. R-049 gäller inte längre för passet.

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 4). Berättelse 04, kriterium 1 och 3, bygger på regeln.*

*Motivering:* klubbens egna övningar har inte granskats av fotbollsexpert eller redaktör. Ledaren får därför bara välja in dem själv, och bara när de har de uppgifter som behövs för att kontrollera ålder, antal och säkerhet. Nickreglerna fungerar bara om övningen är rätt märkt (R-081, andra stycket).

---

## Grupp 12: Säsongsplan (R-110–R-113)

**Varför:** säsongsplanen ska visa hur träningen byggs upp över tid (berättelse 23–25). Principerna för progressionen finns i `sasongsprogression.md`. I version 1 föreslår appen inte vilka pass som ska ligga på vilken vecka (berättelse 24, *Utanför*). Reglerna här gäller därför bara hur planen visas och kontrolleras.

### R-110 Veckans fokus
Krav. En veckas fokus är alla fokusområden som ledaren valde för de pass som ligger på veckan, utan dubletter, i den ordning de först förekommer. Passen räknas i datumordning. Veckans fokus visas i planen och i översikten (berättelse 24, kriterium 2, och 25, kriterium 1).

### R-111 Upprepning är tillåten
Krav. Appen varnar inte och hindrar inte att samma pass, övning eller fokus förekommer i flera veckor. Se R-072.

### R-112 Fokus som inte har förekommit på länge *(preliminär)*
Definition. Ett kärnområde (K) för lagets fas räknas som att det inte har förekommit på länge om det inte finns bland veckans fokus (R-110) under någon av de 8 senaste veckorna som har minst ett pass. Veckor utan pass räknas inte. Appen kan då visa ett tips.

*Preliminär eftersom funktionen är Could i backlogen och inte ingår i berättelse 24 (se *Utanför* där). Besluten 2026-09-11 avgör den inte. Talet 8 är min bedömning: det motsvarar ungefär två block om 3–4 veckor. Regeln blir slutlig när produktägaren och användaren tar in funktionen.*

### R-113 Åldern i en säsongsplan som passerar ett årsskifte
Krav. Åldern i säsongsplanen räknas som i R-010: den ålder spelarna fyller under kalenderåret.

- Lagets ålder vid planens start är den ålder spelarna fyller det kalenderår som planen börjar i.
- För en vecka i planen är åldern lagets ålder vid planens start plus antalet årsskiften mellan planens start och veckan. För en plan som passerar ett årsskifte blir åldern alltså ett år högre för veckorna i det nya kalenderåret (berättelse 24, kriterium 3).
- En vecka som går över ett årsskifte hör till det kalenderår där veckans torsdag ligger, som i svensk veckonumrering (ISO 8601).
- Fasen följer åldern (R-012). Pass som genereras för en vecka använder veckans ålder, och därmed fasens regler för till exempel säkerhet, tider och passlängd.
- Ett pass som redan finns, till exempel ett sparat pass, genereras inte om när det kopplas till en vecka. Det behåller den ålder det skapades för (R-102).
- Om veckans ålder blir högre än 19 kan inga pass genereras för veckan (R-011).

*Beslut 2026-09-11 (kravspec, Beslut vid K1, punkt 6). Regeln följer direkt av R-010 och är därför inte längre preliminär.*

*Testfall:* en plan som börjar 2026-08-03 för ett lag som fyller 12 år 2026. Veckor under hösten 2026 har åldern 12 och fasen `fas-10-12`. Veckor från och med den som har sin torsdag 2027-01-07 har åldern 13 och fasen `fas-13-14`. Veckan 2026-12-28–2027-01-03 har sin torsdag 2026-12-31 och har därför åldern 12.

---

## Sammanställning

| Grupp | Regler | Antal | Varav preliminära | Varav utgår |
|---|---|---|---|---|
| 1 Övningens data | R-001–R-009, R-120 | 10 | 0 | 0 |
| 2 Underlaget | R-010–R-021 | 12 | 0 | 0 |
| 3 Vilka övningar, nivå | R-022–R-029 | 8 | 0 | 0 |
| 4 Delar och tid | R-030–R-039 | 10 | 0 | 0 |
| 5 Fokusområden | R-040–R-049, R-121 | 11 | 0 | 0 |
| 6 Grupper och udda antal | R-050–R-057 | 8 | 0 | 0 |
| 7 Ledare och stationer | R-060–R-067 | 8 | 0 | 0 |
| 8 Variation | R-070–R-072 | 3 | 0 | 0 |
| 9 Säkerhet | R-080–R-085 | 6 | 0 | 0 |
| 10 Yta | R-090–R-094 | 5 | 0 | 0 |
| 11 Inget matchande, byte | R-100–R-106 | 7 | 0 | 0 |
| 12 Säsongsplan | R-110–R-113 | 4 | 1 (R-112) | 0 |
| **Summa** | | **92** | **1** | **0** |

Lediga nummer, reserverade för nya regler i respektive grupp: R-058–R-059 (grupp 6), R-068–R-069 (grupp 7), R-073–R-079 (grupp 8), R-086–R-089 (grupp 9), R-095–R-099 (grupp 10), R-107–R-109 (grupp 11) och R-114–R-119 (grupp 12). Grupp 1 till 5 har inga lediga nummer kvar i sina ursprungliga intervall. En ny regel i någon av dem får därför nästa lediga nummer från R-120 och uppåt och placeras i den grupp den hör till. R-120 är tagen av grupp 1 och R-121 av grupp 5, så nästa sådan regel får R-122.
