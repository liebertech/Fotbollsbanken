# 0020: Statusskrivningen kommer ikapp i stället för att följa en push

Status: föreslagen. Delvis ersätter 0013 avsnitt 4, 0014 avsnitt 8 och, i 0014 avsnitt 2, hur
nyckeln pekas ut och hur värdnyckeln förankras (avsnitt 5 nedan)

## Kontext

ADR 0013 och 0014 lät arbetsflödet `godkann-omgang` följa **en push i taget**: intervallet var
`github.event.before..github.sha`, pull requesten slogs upp med `commits/{sha}/pulls`, och
skrivjobbet stämplade de filer i intervallet som stod i `granskad`. Fyra saker har visat att den
konstruktionen tappar omgångar.

1. **Uppslaget av pull requesten är inte pålitligt direkt efter mergen.** Pull request #15
   (omgång 4, 16 övningar) mergades 2026-09-28 06:33:10. Körning 36387044602 frågade
   `commits/8f462a01…/pulls` 14 sekunder senare och fick ett tomt svar, som `gh api` inte kunde
   tolka: `unexpected end of JSON input`, slutkod 1, och steget föll under `set -e`. Kopplingen
   mellan en merge-commit och dess pull request byggs med fördröjning hos GitHub. Hade svaret i
   stället varit en tom lista `[]` hade steget skrivit "Ingen mergad pull request" och slutat
   **grönt**. Omgången hade då tappats utan att någon såg det.
2. **En omgång som missats går inte att köra om.** Dispatchvägen i ADR 0014 avsnitt 8 kräver att
   `content/ovningar` står orörd sedan omgången. Pull request #17 ändrade alla 16 filerna från
   #15 (ytreferenser) och #22 och #28 ändrade andra övningar. En dispatch för #15 faller därför i
   steget *Kontrollera att banken står orörd sedan omgången*. Kontrollen behövs: utan den skulle
   skrivningen lägga #15:s text över #17:s ändringar.
3. **En körning som väntar på miljön håller hela gruppen.** Körningen för #17 (36430230686) har
   väntat på miljögodkännandet sedan 2026-09-28. Gruppen `godkann-omgang` var satt på hela
   arbetsflödet, så varje senare körning blev väntande, och GitHub håller bara en väntande körning
   per grupp: när en ny kommer avbryts den äldre. Så avbröts #22 (18 s efter start, när #25
   köades) och #25 (när #28 köades). Ingen av dem hade granskade filer, men med push-semantiken
   hade en avbruten körning med granskade filer varit en tappad omgång.
4. **Skrivjobbet pushade den utlösande commiten.** Vid push checkade jobbet ut `github.sha` och
   pushade `HEAD:main`. Har main gått vidare medan jobbet väntade på miljön faller pushen som
   icke-snabbspolning. Körningen för #17 skulle falla så om den släpptes fram i dag.

## Beslut

### 1 Varje körning kommer ikapp

Arbetsflödet frågar inte längre vad en viss push innehöll. Det frågar vad som står i `granskad` på
main, och vem som förde in det.

- `planera` läser varje övningsfil på main som står i `granskad`. För varje fil letar det upp den
  commit på main:s första-förälderkedja som senast ändrade filen
  (`git log --first-parent -1 -- <fil>`). Det är den merge som förde in exakt den text som står
  där nu, och filens blob vid mergen kontrolleras mot blobben på main.
- Pull requesten för den mergen hämtas ur API:t med `pulls/{nummer}`, där numret läses ur GitHubs
  merge-meddelande. Numret är bara en kandidat: det godtas bara om pull requestens
  `merge_commit_sha` är precis mergen och `merged_at` och `merged_by` är satta. Saknar
  meddelandet nummer, eller godtas inte numret, frågas `commits/{sha}/pulls` innan uppslaget ger
  fel (avsnitt 5, F6). Varje anrop görs upp till fem gånger, och ett tomt svar räknas som ett fel
  som ska försökas igen.
- Planen skrivs som JSON: `bas` (main när planen lästes) och en post per fil med `fil`, `blob`,
  `commit`, `pr` och `av`. Den visas i loggen som torrkörning.
- **Hittas ingen pull request för en granskad fil faller jobbet rött**, och ingenting skrivs. Det
  gamla "Ingen mergad pull request. Ingenting skrivs." med grön slutkod finns inte längre.
- `workflow_dispatch` tar inga indata. Den kör samma ikappskrivning som en push.

En körning som faller eller avbryts tappar därför ingenting: nästa körning hittar samma filer.

### 2 Skrivjobbet skriver bara planen

- Jobbet checkar ut **main:s topp**, inte den utlösande commiten, så att pushen blir en
  snabbspolning även när main gått vidare.
- Planens `bas` måste ha formen av en sha och ligga på main. Det kontrolleras i skriptet, inte i
  skalet (avsnitt 5, F8).
- Varje fil måste ha **exakt den blob** torrkörningen visade, den bloben måste vara filens
  blob i planens merge, och planens merge måste vara den som senast ändrade filen på main. Pull
  request och konto slås upp på nytt i API:t och måste stämma med planen (avsnitt 5, F5). Annars
  skrivs ingenting alls. Den bankövergripande kontrollen
  *Kontrollera att banken står orörd* ersätts av den här kontrollen per fil, som är både
  strängare (den gäller exakt de filer som skrivs) och smalare (andra filer får ha ändrats).
- En fil som redan står i `godkand` hoppas över. Två körningar med överlappande planer krockar
  därför inte.
- Ägarens klick i miljön godkänner alltså exakt den lista hen såg i torrkörningen.

### 3 Bara skrivjobbet har en grupp

`concurrency` flyttas från hela arbetsflödet till jobbet `skriv`, med `cancel-in-progress: false`.
Torrkörningen körs då alltid och visar fel direkt, också när en annan körning väntar på miljön.
Att GitHub avbryter en äldre väntande skrivning när en ny köas är ofarligt, eftersom den nyare
planen lästes senare och omfattar allt den äldre hade.

### 4 Vad som inte ändras

Allt annat i ADR 0013 och 0014 gäller: utlösaren är push till main, aldrig en pull request; bara
`granskad` lyfts; bara `status` och en rad i `granskning` skrivs; kontot kommer ur API:t; miljön
`godkannande` krävs; pushen sker med deploy-nyckeln utan `--force`; banken valideras före och
efter. Kommandot `godkann --fore --efter` finns kvar i skriptet för torrkörning för hand.

### 5 Härdning efter säkerhetsgranskningen

Säkerhetsgranskningen av den här konstruktionen gav fynd som rättas så här. Numren är
granskningens.

| Fynd | Risk | Åtgärd |
|---|---|---|
| **F3** Kod körs i jobbet som har nyckeln | Installationsskript i ett beroende eller en git-krok kunde köras i samma jobb som deploy-nyckeln och läsa den | `skriv` installerar med `npm ci --ignore-scripts`. Commit och push körs med `git -c core.hooksPath=/dev/null`. Commiten görs **före** nyckeln, och nyckeln skrivs, används och tas bort i ett och samma steg, så att inget nytt installeras eller körs efter att den skrivits. Pushen körs med absoluta sökvägar, `ssh -F /dev/null` och utan globala och systemvida git-inställningar. **Kvar, låg:** körtidskod som körts tidigare i jobbet (`yaml`, `zod`, regelmotorn via `tillampa` och valideringen) kan fortfarande påverka pushsteget genom `$GITHUB_ENV`, till exempel `BASH_ENV`. Det stängs helt först med ett eget pushjobb utan Node, vid bytet till GitHub-app i fas 5 (ADR 0014). Den pekas ut med `GIT_SSH_COMMAND` för just pushen i stället för `core.sshCommand`, och hamnar inte i git-konfigurationen. Steget med `if: always()` tar bort katalogen även om pushsteget faller |
| **F5** Skrivjobbet litade på planen | `pr` och `av` i planen gick rakt in i granskningsraden, och en plan vars merge inte längre var filens senaste ändring godtogs så länge bloben stämde | `tillampa` kräver att `git log --first-parent -1 -- <fil>` på main är planens `commit`. Pull request och konto slås upp på nytt i API:t med samma uppslag som i torrkörningen, och skiljer de sig från planen skrivs ingenting. Granskningsraden skrivs med API:ts värden. `skriv` får därför `pull-requests: read` |
| **F6** Numret i merge-meddelandet är en kandidat, inte ett faktum | Meddelandet går att skriva om vid mergen. Ett nummer som pekade på fel pull request gav fel direkt, utan att den riktiga söktes | Godtas inte numret ur meddelandet frågas `commits/{sha}/pulls` innan uppslaget ger fel. En pull request som redan prövats frågas inte igen, och `merge_commit_sha` måste fortfarande vara precis mergen. Inställningarna för squash och rebase ändras inte, se nedan |
| **F8** `bas` gick oprövad till skalet | Värdet lästes ur planen och lades i `git merge-base` i ett `run`-steg utan kontroll av formen | Kontrollen att `bas` ligger på main görs i `tillampa`, efter att formen stämts av mot `^[0-9a-f]{40}$` (också i `parsePlan`). Värdet når git som ett argument och passerar aldrig skalet |
| **F9** Värdnyckeln hämtades med `ssh-keyscan` | Förtroende vid första kontakten: körningen litade på det första svar nätet gav, för en anslutning som bär en nyckel med skrivrätt till main | GitHubs publicerade SSH-värdnycklar står ordagrant i arbetsflödet, hämtade 2026-10-05 ur `https://api.github.com/meta`, fältet `ssh_keys`, med källa, datum och fingeravtryck i en kommentar. Det ersätter valet av `ssh-keyscan` i ADR 0014 avsnitt 2 och *Konsekvenser*. Byter GitHub nycklar faller pushen på värdnyckeln, och raderna byts då för hand |

**Inte genomfört, efter användarens val 2026-10-05.** Användaren valde att inte genomföra tre av
granskningens förslag:

- **F2:** regeluppsättningen *Skydd av main* delas inte upp.
- **F6, inställningsdelen:** squash- och rebase-merge slås inte av i repot. Rättelsen i skriptet
  ovan gäller ändå.
- **F10:** SHA-låsning krävs inte i repots inställningar.

Efter användarens beslut samma dag ställdes miljön `godkannande` om: den släpper sedan
2026-10-05 bara fram `main` (anpassad grenregel `main`), och kravet på användarens granskning står
kvar.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Bara försöka igen i det gamla steget** | Rättar symptomet för #15 men inte att en avbruten eller missad körning tappar omgången, och inte att en omgång inte går att köra om när banken har ändrats efteråt |
| **Läsa numret ur merge-meddelandet utan att fråga API:t** | Meddelandet går att skriva om vid mergen, och `merged_by` finns bara i API:t |
| **Låta en dispatch för en gammal omgång lägga statusen på main:s nuvarande text** | Då stämplas en text som omgången aldrig innehöll med omgångens nummer. Granskningsraden skulle påstå något som inte är sant |
| **`cancel-in-progress: true` för hela arbetsflödet** | Statuscommiten utlöser en ny körning medan den gamla städar upp, och den gamla skulle då visas som avbruten trots att den lyckades |
| **Spara vilka omgångar som behandlats i en fil eller en tagg** | Mer tillstånd att hålla rätt. Statusen i filerna är redan det tillståndet: det som står i `granskad` är det som återstår |

## Konsekvenser

**Fördelar**

- Ingen omgång kan tappas tyst. Antingen står filen kvar i `granskad` och nästa körning tar den,
  eller så faller körningen rött.
- Omkörning kräver inga indata och inga uträkningar av commits.
- Det ägaren godkänner i miljön är exakt den lista hen såg.

**Nackdelar och risker**

- **Mänskligt godkännande vilar på en regel, inte bara på teknik.** `gh` är inloggat som användaren med skrivrätt där agenterna kör, och miljön har `can_admins_bypass`. Användaren beslutade 2026-10-05 att behålla skrivrätten. CLAUDE.md säger i stället uttryckligen att bara användaren mergar och godkänner miljön, och gör det i webbläsaren (säkerhetsgranskningen, F4).
- **Granskningsraden nämner den merge som förde in texten, inte nödvändigtvis den omgång som
  först lade fram övningen.** De 16 övningarna från #15 ändrades i #17 och knyts därför till #17.
  Det är sant om texten, men det kan förvåna. Användaren har beslutat att det är så det ska vara,
  se *Användarens beslut*.
- **En merge som ändrar en granskad fils text utan att den granskas på nytt** gör att den nya
  texten stämplas. Det gällde redan med push-semantiken (körningen för #17 visade samma 16 filer)
  och skyddas av samma sak: ägaren läser diffen och klickar i miljön.
- **Squash- och rebase-merge stöds bara delvis.** Squash fungerar via `commits/{sha}/pulls`,
  både när meddelandet saknar nummer i GitHubs merge-form och när numret pekar fel. Vid
  rebase-merge kan filens senaste ändring vara en annan commit än `merge_commit_sha`, och då
  faller planen rött. Repot använder merge-commits, och squash och rebase är inte avslagna
  (användarens val, avsnitt 5).
- **Dispatch från en annan gren** stoppas av ett första steg, men det steget ligger i en fil som
  grenen själv kan ändra. Det verkliga skyddet är att miljön `godkannande` bara släpper fram
  `main`. Det gör den sedan 2026-10-05 (anpassad grenregel `main`, kontrollerat med
  `gh api repos/liebertech/Fotbollsbanken/environments/godkannande`). Före det datumet begränsade
  miljön inte grenar.
- **Skrivjobbet frågar API:t igen.** Det behöver `pull-requests: read` och kan falla på samma
  fördröjning som torrkörningen. Det faller då rött utan att skriva, och körningen kan göras om.
- **GitHubs värdnycklar står i arbetsflödet.** De måste bytas för hand om GitHub byter nycklar,
  och pushen faller tills dess.
- **Oprövat skarpt.** Logiken är enhetstestad och torrkörd lokalt mot main, men arbetsflödet har
  inte körts.

## Användarens beslut

| Fråga | Beslut |
|---|---|
| Ska de 16 övningarna från #15 stämplas med pull request #17, som är den merge som förde in deras nuvarande text? | Ja. Granskningsraden för de 16 övningarna hänvisar till #17, eftersom det är den merge som förde in texten som ligger på main |
| Ska F2, F6:s inställningsdel och F10 genomföras? | Nej, 2026-10-05. Se avsnitt 5 |
| Ska miljön `godkannande` begränsas till `main`? | Ja. Genomfört 2026-10-05 |

ADR:n står som föreslagen tills användaren beslutar om den vid granskningen av pull requesten.
