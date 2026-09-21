Status: godkänd (K2, 2026-09-12); kompletterad inför K4 (2026-09-21), se avsnittet Beslut 2026-09-21

# Kravspecifikation – Fotbollsbanken

## Vision

Fotbollsbanken ska göra det snabbt och enkelt för en ideell ungdomsledare att gå från "jag behöver ett träningspass" till ett färdigt, anpassat pass med planskisser – på mobilen, kvällen innan eller på väg till planen. Passen sätts ihop av en regelmotor ur en övningsbank som är kvalitetssäkrad av människor, inte av AI.

## Vilka appen är till för

| Roll | Vem | Vad rollen gör i appen |
|---|---|---|
| **Ledare** | Ideell ungdomsledare, ofta förälder, med ont om tid. Planerar på mobilen. | Genererar och justerar träningspass, sparar dem, använder planläge på planen, skapar och delar egna övningar, kan skicka in övningar till den gemensamma banken. |
| **Klubbadmin** | Hanterar klubbens lag och ledare. | Skapar klubben och dess lag, bjuder in ledare, hanterar vem som hör till vilket lag. |
| **Redaktör** | Godkänner övningar till den gemensamma banken. | Granskar inskickade övningar och sätter status `godkand` eller skickar tillbaka dem med kommentar. |

Användaren (beställaren) är redaktör från start. Fler redaktörer kan utses i appen senare, se berättelse 18.

En och samma person kan ha flera roller (till exempel vara klubbadmin och ledare i samma klubb).

## Mål med version 1

- En ledare ska kunna gå från tomt underlag till ett komplett, anpassat träningspass på under ett par minuter.
- Passen ska bygga på en granskad övningsbank, aldrig på AI-genererat innehåll.
- Klubbar ska kunna organisera sina lag och ledare, och dela pass och övningar inom klubben.
- Ledare ska kunna bidra med egna övningar till den gemensamma banken, kvalitetssäkrat av en redaktör.
- Ett pass ska gå att använda direkt på planen (planläge med timer) och att ta med på papper (utskrift/PDF).
- En säsongs träning ska kunna planeras med progression över tid, inte bara pass för pass.

## Vad ingår i version 1

Version 1 byggs i sju inkrement, i den ordning som anges i `CLAUDE.md`:

1. **Generatorn** – ledaren anger ålder, nivå, antal spelare, antal ledare, passets längd och fokusområde (spelform föreslås utifrån åldern; yta kan anges men är valfri) och får ett träningspass, som kan justeras (byta ut en övning, även mot en egen övning i klubben) och sparas.
2. **Planskisser** – övningar och pass visas med planskisser ritade som SVG från skissdata.
3. **Konton med klubbar och lag** – ledare och klubbadmin har konton, klubbadmin skapar klubb och lag och bjuder in ledare, sparade pass delas inom laget.
4. **Egna och inskickade övningar med redaktörskö** – ledare skapar egna övningar som delas inom klubben, kan skicka in dem till den gemensamma banken och redaktören granskar dem.
5. **Planläge med timer** – ett pass körs på planen, en övning i taget, med timer.
6. **Utskrift/PDF** – ett pass kan skrivas ut eller exporteras med planskisser.
7. **Säsongsplanering** – pass, ett eller flera per vecka, planeras över veckor, och veckans fokusområden visas så att progressionen över tid blir synlig.

## Avgränsningar – vad ingår inte i version 1

- Ingen AI i appen. Inget innehåll genereras automatiskt av en språkmodell; allt övningsinnehåll är skrivet och granskat av människor.
- Inga uppgifter om enskilda spelare lagras – bara antal. Ingen närvaroregistrering, ingen individuell statistik eller utveckling per spelare.
- Ingen publik, öppen delning av pass eller övningar utanför inloggade konton. Den gemensamma övningsbanken delas mellan klubbar, men klubbens egna pass och egna (icke godkända) övningar delas bara inom klubben.
- Ingen betalfunktion eller prenumeration. Drift ska hålla sig inom gratisnivåer (se `CLAUDE.md`).
- Inget annat språk än svenska i gränssnittet.
- Ingen nativ app – Fotbollsbanken är en mobilanpassad webbapp (PWA).
- Fullständigt offlineläge är inte ett krav för version 1 (tekniskt beslut vid K2, men grundbehovet "fungerar på planen med dåligt mobilnät" gäller, se icke-funktionella krav).

## Icke-funktionella krav (behovsnivå)

Dessa beskriver behov, inte lösningar. Hur de uppfylls tekniskt avgörs vid K2.

- **Mobil först:** appen ska vara fullt användbar på en mobiltelefon. Skrivbordsvy är inte prioriterad i version 1.
- **Används utomhus, på planen:** gränssnittet ska vara läsbart i starkt solljus, ha tillräckligt stora tryckytor för att användas med en hand (till exempel i planläget), och fungera även vid svagt eller instabilt mobilnät.
- **Tillgänglighet:** appen ska uppfylla WCAG 2.2 nivå AA.
- **Flera klubbar:** datamodellen ska hantera flera klubbar från start, även om appen byggs och används av den egna klubben först. En klubbs data ska inte vara synlig för en annan klubb.
- **Inga spelaruppgifter:** inga personuppgifter om spelare får samlas in eller lagras, bara antal. Personuppgifter förekommer bara för ledarnas och klubbadminens konton.
- **Kostnad:** drift ska rymmas inom gratisnivåer. Nya kostnader kräver användarens beslut.
- **Språk:** gränssnitt och innehåll är på svenska.

## Beslut vid K1 (2026-09-11)

De här frågorna kunde inte avgöras av produktägaren eller fotbollsexperten. Användaren har fattat följande beslut, som kraven i `berattelser/` och reglerna i `docs/doman/generatorregler.md` nu bygger på:

1. **Yta:** generatorn har ett valfritt ytfilter i version 1. Ledaren kan ange hel, halv eller kvarts plan, men måste inte. Inget materialfilter (bollar, koner, mål) i version 1. Inomhushall som yta kommer i en senare version. Se R-090 till R-094 och berättelse 01–02.
2. **Nickning:** SvFF:s linje följs. Ingen nickträning före 13 år. Högst 10 minuter nickspel per pass för 13–14 år och högst 20 minuter för 15–19 år. Se R-080 till R-083 och berättelse 01.
3. **Åldersfaserna** i `docs/doman/aldrar-och-fokus.md` godkänns som fotbollsexpertens bedömning för version 1. De ska kontrolleras mot SvFF:s spelarutbildningsplan innan lansering (K5), se backloggen.
4. **Klubbens egna övningar:** generatorn väljer bara godkända övningar ur den gemensamma banken (R-022). Ledaren kan själv byta in en av klubbens egna övningar i ett pass, när ledaren byter ut en övning (se berättelse 04, 13, 14).
5. **Nivåer:** tre nivåer (`niva-1` Grund, `niva-2` Fortsättning, `niva-3` Fördjupning). En övning har en nivålista, och nivån matchar när listan innehåller den valda nivån. Angränsande nivåer används aldrig av generatorn (R-025, R-026).
6. **Ålder** anges som den ålder spelarna fyller i år. I en blandad grupp anger ledaren den ålder som flest spelare har (R-010).
7. **Fokusområden:** ledaren väljer 1–3, och minst ett är obligatoriskt. Listan visar bara de fokusområden som passar den angivna åldern (R-019).
8. **Spelform:** ledaren kan välja den föreslagna spelformen eller den som ligger närmast före eller efter den (R-014). Högst 40 spelare och 10 ledare (R-017). Passlängden har gränser per åldersfas (R-018).
9. **Tips vid många spelare per ledare:** appen visar ett tips, men genererar passet ändå (R-021).
10. **Säsongsplanen:** stöd för flera pass per vecka är Must i version 1. Att ledaren kan skriva in perioder och teman för ett block, innan passen finns, är Could och läggs i backloggen.
11. **Inskickade övningar:** redaktören granskar ensam i appen, med stegen inskickad och sedan godkänd eller åtgärda (se berättelse 16). En befintlig redaktör kan utse fler redaktörer (se berättelse 18).
12. **Varning om ålder i säsongsplanen (Must):** enligt R-113 behåller ett sparat pass sin ålder även när det kopplas till en vecka i säsongsplanen. Appen varnar när passets ålder inte stämmer med veckans ålder, och varnar alltid när passet innehåller en övning märkt `nickspel` och veckans ålder är under 13 år. Se berättelse 24, kriterium 5.
13. **Fråga om nickning i formuläret för egna övningar (Could):** ingår inte i version 1 och ligger i backloggen. I version 1 bygger nickreglerna (R-080 till R-083) för egna övningar på att ledaren själv märker övningen med fokusområdet `nickspel`. Egna övningar granskas inte av fotbollsexpert eller redaktör.

Roll- och behörighetsmodellen som besluten bygger på (bara ledare, klubbadmin och redaktör i appen) beslutas slutgiltigt vid K2.

## Beslut vid K2 (2026-09-12)

De här frågorna fördes fram av säkerhetsgranskningen inför K2 (`docs/sakerhet/granskning-k2.md`) eller kunde inte avgöras av produktägaren ensam. Användaren har fattat följande beslut:

1. **Statusnamn:** en inskickad övning har status `inskickad`, inte `utkast` (se berättelse 15, 16 och 17, och `docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4). En egen övning i klubben har ingen granskningsstatus, bara en härledd markering – **Ofullständig** eller **Klar att använda** – av om den är komplett nog att bytas in i ett pass (R-106, berättelse 13, kriterium 2). Ordet `utkast` används bara om filer i `content/ovningar/`.
2. **Radering av konto ingår i version 1** (GDPR, artikel 17), se den nya berättelse 26 i inkrement 3. Raderingen verkställs direkt. Delat material – till exempel lagets sparade pass, klubbens egna övningar eller en godkänd bankövning – finns kvar men avidentifierat. Är personen den sista klubbadminen i sin klubb måste en efterträdare utses först (se berättelse 09, kriterium 4, och berättelse 26, kriterium 3). Samma spärr gäller den sista redaktören: en efterträdare måste utses först (se berättelse 18, kriterium 1, och berättelse 26, kriterium 4) – beslutat 2026-09-12, eftersom frågan var oavgjord vid K2:s första underlag. Att exportera sina egna uppgifter innan radering (dataportabilitet enligt GDPR, artikel 20) ingår inte i version 1, utan är en Could-post i backloggen (beslutat 2026-09-12, se berättelse 26, Utanför, och `backlog.md`). Se säkerhetsgranskning K2, fynd S-10.
3. **Ingen ritredigerare i version 1.** Ledaren kan inte själv rita eller redigera en planskiss för en egen övning. Kriteriet är flyttat till backloggen som Could. En egen övning saknar därför planskiss i version 1 (se berättelse 06, kriterium 2, och berättelse 13, Utanför).
4. **"Logga ut på alla enheter" ingår i version 1, som Must** (beslutet ändrat 2026-09-12). Senior systemutvecklare och säkerhetsagenten invände mot att lägga funktionen i backloggen: utan den har ledaren ingen väg alls att avbryta åtkomsten från en borttappad telefon, eftersom sessionen inte kan tidsbegränsas på gratisnivån och en vanlig utloggning på en annan enhet bara rör den enheten. Se ny berättelse 27 i inkrement 3, och säkerhetsgranskning K2, fynd S-11.
5. **Ingen egen domän för e-post i version 1.** Inloggningsmejl skickas från en delad avsändaradress och kan hamna i skräpposten. Appen upplyser om detta (berättelse 08, kriterium 6). En egen domän är en Could-post i backloggen.
6. **GDPR:** avtal, inte samtycke, är rättslig grund för behandlingen av ledarnas kontouppgifter. Föreningen är ensam personuppgiftsansvarig, inte klubbarna gemensamt. En integritetspolicy ska finnas, nåbar utan inloggning, före lansering. Se backloggen, "Innan lansering", och säkerhetsgranskning K2, avsnitt 3 och 5, punkt 1–2.
7. **Repot görs publikt före fas 4**, sedan de åtgärder som säkerhetsgranskningen kräver är genomförda (`docs/sakerhet/granskning-k2.md`, avsnitt 4). `content/`-mappens licens är nu avgjord (beslutat 2026-09-12, se samma granskning, *Beslut som behövs*, punkt 5): övningsbanken licensieras under **CC BY-SA 4.0** (`content/LICENSE`), skilt från kodens Apache-2.0-licens. En ledare som skickar in en övning till den gemensamma banken bidrar med den under CC BY-SA 4.0, vilket ska framgå vid inskickning (se berättelse 15, kriterium 5, och avsnittet Licens nedan).
8. **Personuppgifter i fritext (fynd S-20):** lagnamn, passnamn, fritext i egna övningar och redaktörens kommentar kan råka innehålla ett barns namn. Appen upplyser kort vid alla fyra fälten om att spelarnamn inte ska skrivas in (se berättelse 05, kriterium 5, berättelse 10, kriterium 4, berättelse 13, kriterium 3, och berättelse 16, kriterium 5). Texterna till upplysningarna skrivs av UX-designern.
9. **Fel e-postadress avslöjas inte vid inloggning (fynd S-13):** appen svarar likadant oavsett om den angivna adressen har ett konto eller inte. Kontrollerat mot berättelse 08: kriterium 3 gäller fel *kod*, inte en okänd adress, och krockar därför inte med detta beslut.

## Beslut 2026-09-21 (inför K4, generatorns förarbete)

De här frågorna kom upp när acceptanskriterierna för inkrement 1 (generatorn) skulle skrivas, inför bygget. Användaren har fattat följande beslut:

1. **Fallback på närliggande fokusområde.** När ledarens valda fokusområde gör att en passdel inte kan fyllas ska generatorn inte misslyckas. Den ska i stället automatiskt pröva ett närliggande fokusområde för just den delen, och tala om för ledaren att den gjorde det och varför. Ledarens val i underlaget ändras inte (R-102 gäller fortfarande för alla andra fält). Beslutet gäller i första hand `lek` och `koordination`, som i dagens övningsbank saknar övningar i kärnan för både `5mot5` och `7mot7`, men lösningen ska vara generell för alla fokusområden. Vilka fokusområden som räknas som närliggande ett annat är en fotbollsfråga och avgörs av en ny regel i grupp 11 av `docs/doman/generatorregler.md`, som fotbollsexperten skriver. Se berättelse 02, kriterium 16, och berättelse 03, kriterium 5–7.
2. **Ledarbehov ändras inte.** Fältet `ledarbehov` (R-006) behåller sin nuvarande betydelse. Ingen skärpt regel infördes.

## Licens

Beslutat vid K2 (2026-09-12), se säkerhetsgranskning K2, *Beslut som behövs*, punkt 5. Appens kod licensieras under Apache-2.0. Den gemensamma övningsbanken i `content/ovningar/` licensieras separat, under **CC BY-SA 4.0** (se `content/LICENSE`), till skillnad från koden – det gör att övningsinnehållet fritt kan delas och vidareutvecklas, i linje med att repot görs publikt (se Beslut vid K2, punkt 7). En ledare som skickar in en egen övning till den gemensamma banken bidrar därmed med innehållet under CC BY-SA 4.0. Det ska framgå för ledaren i gränssnittet vid själva inskickningen, inte bara i ett dokument (se berättelse 15, kriterium 5).

## Källor

Fotbollsfakta (spelformer, åldersfaser, nivåer, fokusområden, passuppbyggnad, generatorregler, säsongsprogression) ägs av fotbollsexperten och beskrivs i `docs/doman/`. Detta dokument hänvisar dit i stället för att upprepa eller själv besluta fotbollsregler.
