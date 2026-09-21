# Fotbollsbanken

Mobilanpassad webbapp (PWA) där ungdomsledare i fotboll genererar träningspass ur en granskad övningsbank. Övningar har syfte, beskrivning, planskiss och anpassas efter ålder, spelform, nivå, antal spelare och antal ledare. Appen använder ingen AI: passen sätts ihop av en regelmotor.

Den här filen läses av huvudsessionen och av alla agenter. Den beskriver det som gäller för alla. Det rollspecifika står i respektive fil i `.claude/agents/`.

## Fasta ramar

Ramarna är beslutade av användaren och får bara ändras av användaren.

- **Målgrupp:** ledare för 6–19 år, från 3 mot 3 till 11 mot 11. Appen byggs för den egna klubben först, men datamodellen ska klara flera klubbar från start.
- **Fotbollsgrund:** SvFF:s spelarutbildningsplan och nationella spelformer. Bygg på principerna, men kopiera aldrig SvFF:s texter eller övningar ordagrant. Ange källa.
- **Generering:** en övningsbank och regler. Ingen AI i appen.
- **Bilder:** planskisser som ritas som SVG från skissdata.
- **Konton:** klubbar och lag där ledare delar pass och övningar.
- **Inga uppgifter om spelare lagras**, bara antal. Personuppgifter finns bara för ledarnas konton.
- **Egna övningar:** ledare kan skapa övningar som delas inom klubben och kan föreslå dem till den gemensamma banken.
- **Mänskligt godkännande:** en övning publiceras i den gemensamma banken först när en redaktör godkänt den. Ingen agent får sätta status `godkand`.
- **Kostnader:** drift på gratisnivåer. Nya kostnader kräver användarens beslut.
- **Språk:** gränssnitt, dokumentation och commit-meddelanden skrivs på svenska. Kod och identifierare skrivs på engelska.

Version 1 innehåller generatorn, planskisser, konton med klubbar och lag, egna och inskickade övningar med redaktörskö, planläge med timer, utskrift/PDF och säsongsplanering.

## Var saker finns

| Sökväg | Innehåll | Ägare |
|---|---|---|
| `docs/krav/` | Kravspecifikation, backlog, användarberättelser | produktagare |
| `docs/doman/` | Fotbollsdomänen och generatorreglerna | fotbollsexpert |
| `docs/design/` | Flöden, skisser, designsystem, gränssnittstexter | ux-designer |
| `docs/adr/` | Arkitekturbeslut | senior-systemutvecklare |
| `docs/sakerhet/` | Säkerhets- och GDPR-granskningar | sakerhet-integritet (huvudsessionen sparar rapporterna) |
| `content/` | Övningsbanken. Licensieras under CC BY-SA 4.0, se `content/LICENSE`, till skillnad från koden som är Apache-2.0 | ovningsforfattare skriver, fotbollsexpert granskar |
| Källkod (skapas i fas 2) | Appen | senior-systemutvecklare. Planskissmodulen ägs av planskissutvecklare och testerna av kvalitetssakrare |

Läs de dokument som styr uppgiften innan du börjar. Om ett dokument saknas eller säger emot ett annat ska du rapportera det i stället för att gissa.

## Arbetsflöde

Huvudsessionen leder arbetet. Den delegerar till agenterna, samlar in deras rapporter och går igenom kontrollpunkterna med användaren. Agenterna delegerar inte vidare, eftersom `Agent`-verktyget är avstängt för dem. De kan inte heller ställa frågor till användaren. Frågor lämnas under *Beslut som behövs* i rapporten.

| Fas | Innehåll | Kontrollpunkt |
|---|---|---|
| 0 Grund | Agenter, `CLAUDE.md`, mappstruktur | K0: agentlaget. Godkänd 2026-09-11 |
| 1 Krav och domän | Krav och backlog, domänmodell, generatorregler | K1: godkänd 2026-09-11 |
| 2 Design och arkitektur | Flöden, teknikval, datamodell, skissformat, behörighetsmodell | K2: godkänd 2026-09-12 |
| 3 Övningsbank | Övningar i omgångar per spelform. Pågår parallellt med fas 4 | K3 per omgång. Omgång 1, 7 mot 7, godkänd 2026-09-14. Omgång 2, 5 mot 5, och omgång 3, hålen i båda spelformerna, godkända 2026-09-21. Banken är 42 övningar |
| 4 Bygge i inkrement | Se ordningen nedan | K4 per inkrement |
| 5 Lansering | Säkerhets- och GDPR-genomgång, integritetspolicy, kontroll av åldersfaserna mot SvFF:s spelarutbildningsplan, byte från deploy-nyckel till GitHub-app (ADR 0014), driftsättning | K5 |

**Aktuell fas: 3 och 4, övningsbank och bygge.** Krav, domänmodell, design och arkitektur är godkända och styr arbetet. Generatorreglernas nummer är frysta: nya regler får lediga nummer och överflödiga markeras som *Utgår*. Arkitekturbesluten i `docs/adr/` ändras inte i efterhand; ett ändrat beslut skrivs som en ny ADR.

Inkrementen i fas 4, i tur och ordning:

1. Generatorn
2. Planskisser
3. Konton med klubbar och lag
4. Egna och inskickade övningar med redaktörskö
5. Planläge med timer
6. Utskrift/PDF
7. Säsongsplanering

Ingenting passerar en kontrollpunkt utan användarens uttryckliga godkännande. Huvudsessionen lägger fram underlaget och frågar.

### En övnings väg in i banken

`utkast` → fotbollsexperten granskar → `granskad` → redaktören godkänner → `godkand`

Om övningen inte håller sätter fotbollsexperten eller redaktören status `atgarda` med kommentarer. Övningsförfattaren åtgärdar och sätter tillbaka `utkast`.

### Ett inkrements väg till main

1. Produktägaren skriver acceptanskriterierna.
2. Senior systemutvecklare bygger på grenen `feature/<kort-namn>`.
3. Kvalitetssäkraren testar och granskar.
4. Säkerhetsagenten granskar när inloggning, behörighet, data, inskickat innehåll eller externa tjänster berörs.
5. UX-designern granskar när gränssnittet berörs.
6. Kontrollpunkt K4 med användaren.
7. Huvudsessionen mergar till main och pushar.

## Git

- `main` är skyddad och tar bara emot pull requests som du har godkänt. Det gäller även dokument. Skyddet är grunden för att en övning bara kan bli godkänd av en människa (ADR 0010).
- Varje ändring görs på en gren och läggs fram som en pull request. Statusraden i ett dokument ändras till `godkänd (K<n>, ÅÅÅÅ-MM-DD)` när du godkänt kontrollpunkten.
- Commit-meddelanden skrivs på svenska i imperativ, till exempel ”Lägg till regler för passuppbyggnad”.
- Använd aldrig force-push eller `reset --hard`, och skriv aldrig om publicerad historik.

## Gemensamma regler för alla agenter

- Håll dig inom din roll. Om uppgiften kräver en annan agents område, säg vilken agent och avsluta.
- Gissa aldrig fotbollsregler, krav eller säkerhetsfrågor. Lyft dem under *Beslut som behövs*, med en rekommendation.
- Återställ aldrig ändringar som du inte själv har gjort.
- Påstå aldrig att något är verifierat utan att ange vilken kontroll som kördes.

## Rapportformat

Varje agent avslutar sitt uppdrag med:

- **Ändrat:** vilka filer, vad som ändrades och varför.
- **Verifierat:** vilket kommando eller vilken kontroll som kördes och vad resultatet blev. Om inget verifierats: skriv ”Inte verifierat” och förklara varför.
- **Kvarstår:** risker, begränsningar och det som inte blev klart.
- **Beslut som behövs:** frågor som bara användaren kan avgöra, med rekommendation. Skriv ”Inga” om det inte finns några.

## Domänfakta i korthet

SvFF:s nationella spelformer (2025 års versioner, hämtade 2026-09-11). Den fullständiga och gällande beskrivningen finns i `docs/doman/spelformer.md`, godkänd vid K1.

| Spelform | Ålder | Plan (m) | Spelare per lag | Mål (m) |
|---|---|---|---|---|
| 3 mot 3 | 6–7 | 15 × 10–12 | 3, ingen målvakt | max 1,6 × 1,15 |
| 5 mot 5 | 8–9 | 30 × 15–20 | 4 + målvakt | 3 × 1,5 |
| 7 mot 7 | 10–12 | 50–55 × 30–35 | 6 + målvakt | max 5 × 2 |
| 9 mot 9 | 13–14 | 65–72 × 50–55 | 8 + målvakt | 6 × 2,2 |
| 11 mot 11 | 15–19 | 100–110 × 60–68 | 10 + målvakt | 7,32 × 2,44 |

## Teknik

Beslutad vid K2, se `docs/adr/`: React med TypeScript byggt med Vite som installerbar webbapp (PWA), Supabase (Postgres i EU-region) med åtkomstregler på radnivå, Cloudflare Pages och Brevo på gratisnivå, inloggning med engångskod via e-post, planskisser som SVG ritade ur skissdata, samt Vitest och Playwright för tester.
