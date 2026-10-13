# 0023: Inloggningens skydd i inkrement 3

Status: föreslagen. Ersätter gränsen per kod i ADR 0004 punkt 3 och åtkomstnyckelns giltighetstid i ADR 0004 punkt 5, och ändrar gränsen för inbjudningsnyckeln i ADR 0004 under *Inbjudan av ledare*, punkt 1

## Kontext

ADR 0004 (beslutad vid K2, 2026-09-12) bestämde inloggning med engångskod via e-post och ställde upp gränser som skulle verifieras mot ett riktigt Supabase-projekt i inkrement 3. Säkerhetsgranskningen av kriterierna för inkrement 3 (`docs/sakerhet/granskning-inkrement-3-krav.md`) visar att tre av dem inte håller som de står:

| Det ADR 0004 säger | Vad granskningen visar | Fynd |
|---|---|---|
| Högst 5 verifieringsförsök per kod, därefter ogiltig | Supabase har ingen gräns per kod. Det finns bara `token_verifications`, en gräns per IP-adress, som förval 30 per 5 minuter. Hookarna för verifieringsförsök gäller MFA och lösenord och kräver Teams eller Enterprise | S-40 |
| Åtkomstnyckeln gäller i en timme, andra enheter loggas ut när den gått ut | Giltighetstiden går att ändra på gratisnivån (*Authentication → Sessions*). Dessutom bär nyckeln anspråket `session_id`, som åtkomstreglerna kan pröva mot `auth.sessions` | S-57 |
| Misslyckade uppslagningar av inbjudningsnyckeln begränsas per IP | ”Per adress” är tvetydigt, och att räkna per IP kräver att IP-adresser lagras och att adresshuvudet bakom Supabases gateway inte går att förfalska, vilket inte är visat | S-53 |

Användaren har beslutat (2026-10-13): gränsen per kod ersätts med 8 siffror, 600 sekunders giltighet, högst 10 verifieringar per 5 minuter och Turnstile (avsnitt 6 i granskningen, punkt 1). Åtkomstnyckeln ska gälla i 15 minuter efter prov i staging. Sessionskontrollen i åtkomstreglerna ska prövas i delsteg 3b (punkt 7). En inbjudningsnyckel får högst 10 felförsök per konto och timme, därefter spärras kontot i en timme, räknat per konto och inte per IP.

ADR 0004 ändras inte i efterhand. Avvikelserna skrivs här.

## Beslut

### 1 Engångskoden

Följande ersätter listan med gränser i ADR 0004 punkt 3. Allt annat i punkt 3 gäller, också att gränserna verifieras mot projektet och att Turnstile aldrig ersätter dem.

| Gräns | Värde | Var den ställs |
|---|---|---|
| Kodlängd | **8 siffror**. Reservalternativet 6 siffror tas bort | `otp_length`, *Authentication → Sign In / Providers → Email* |
| Kodens giltighet | **600 sekunder** | *Email OTP Expiration* |
| Verifieringar | **högst 10 per 5 minuter per IP-adress** | `token_verifications`, *Authentication → Rate Limits* |
| Tid mellan beställningar till samma adress | **minst 60 sekunder** (oförändrat) | Supabases förval, *Rate Limits* |
| E-post per timme | **100** (oförändrat) | *Rate Limits*, kräver egen SMTP |
| Turnstile | **På** för kodbeställningen, i båda projekten | *Authentication → Attack Protection* |
| En ny kod ogiltigförklarar den förra | Behålls som krav. Prövas i testet för berättelse 08, kriterium 8 (c) | Supabases beteende, inte en inställning |

**Ingen egen verifiering byggs i version 1.** En egen räknare per kod skulle kräva en egen inloggningstjänst framför Supabase Auth, och det är just det ADR 0004 valde bort.

**Restrisken, räknad.** En kod har 10^8 möjligheter. En angripare med 100 IP-adresser hinner med 10 × 100 = 1 000 gissningar per 5 minuter, alltså cirka 2 000 under kodens 600 sekunder och cirka 290 000 per dygn om nya koder beställs hela tiden. Det ger en sannolikhet på cirka 0,3 % per dygn att ta över ett visst konto, under förutsättning att bara en kod gäller åt gången. Varje ny kod kräver dessutom en godkänd Turnstile-kontroll och skickar ett mejl till kontots ägare, som då ser att någon försöker. Med 6 siffror och förvalet 30 hade samma angrepp lyckats inom timmar (S-40).

Om testet för 08.8 (c) visar att flera koder gäller samtidigt multipliceras risken med antalet giltiga koder, som mest 10 med 600 sekunders giltighet och 60 sekunders mellanrum. Det tas då upp med säkerhetsagenten innan produktionen tar emot riktiga personuppgifter.

### 2 Åtkomstnyckelns giltighet: 15 minuter

Följande ersätter ”en åtkomsttoken som gäller i en timme” i ADR 0004 punkt 5:

- **Åtkomstnyckeln gäller i 900 sekunder** (*Authentication → Sessions*, *Access token expiry time*). Förnyelsenyckeln med rotation och att ledaren förblir inloggad på enheten är oförändrat.
- **Värdet sätts först i staging** och prövas där med appen: att förnyelsen sker utan att ledaren märker något, att appen fungerar utan nät enligt ADR 0005 punkt 7 och att gränsen för förnyelser (`token_refresh`, förval 150 per 5 minuter per IP) inte nås från ett delat nät. Därefter sätts samma värde i produktionen.
- **Följden för ”Logga ut på alla enheter”:** en annan enhet loggas ut senast när dess åtkomstnyckel går ut, nu inom 15 minuter i stället för en timme. Gäller också avsnitt 3 blir det omedelbart för databasen.

Sessioner med fast livslängd och utloggning efter inaktivitet kräver Pro och används inte (ADR 0004, oförändrat).

### 3 Sessionskontroll i åtkomstreglerna (prövas i 3b)

En hjälpfunktion, `public.session_is_active()`, markerad `stable` och `security definer` med `set search_path = ''`, svarar sant bara om det finns en rad i `auth.sessions` med id lika med anspråket `session_id` i nyckeln och `user_id = auth.uid()`. Varje policy för `authenticated` kräver `(select public.session_is_active())`, och varje `security definer`-funktion som appen anropar avbryter om den är falsk.

Då gäller utloggningen på alla enheter direkt för databasen: `signOut({ scope: 'global' })` tar bort personens rader i `auth.sessions`, och en nyckel som fortfarande är giltig ger noll rader och nekas skrivning. Samma sak stänger ute ett raderat kontos nyckel (S-43).

**Det här är villkorat.** Funktionen byggs och prövas i delsteg 3b med pgTAP:

- en nyckel vars session har tagits bort får noll rader på varje tabell och nekas skrivning
- kostnaden mäts: samma frågor med och utan kontrollen, mot testdata med två klubbar

Om provet håller behålls kontrollen, och det står i rapporten för 3b med mätvärdena. Om det inte håller, till exempel för att `auth.sessions` inte går att läsa från en `security definer`-funktion i det riktiga projektet eller för att kostnaden är för hög, tas kontrollen bort, och avsnitt 2 är det enda skyddet. Beslutet att behålla eller ta bort kontrollen tas vid K4 och skrivs då in i en ny ADR om det avviker från det här avsnittet.

### 4 Inbjudningsnyckeln: gräns per konto

Följande ersätter ”antalet misslyckade uppslagningar begränsas per IP” i ADR 0004, *Inbjudan av ledare*, punkt 1:

- **Högst 10 misslyckade försök per konto och timme.** Ett försök är misslyckat när `accept_invitation` inte hittar en giltig inbjudan för nyckelns hash: okänd nyckel, utgången, återkallad, redan använd eller bunden till en annan adress.
- **Därefter spärras kontot i en timme** från fler försök, med ett eget felbesked. Spärren gäller bara inbjudningar, inte resten av appen.
- **Ingen IP-adress lagras.** Försöken lagras i tabellen `invitation_attempts` med `user_id` och tidpunkt. Rader äldre än 24 timmar rensas, och raderna tas bort med kontot (ADR 0024).
- **Försöket måste sparas också när det misslyckas.** `accept_invitation` returnerar därför ett felbesked i stället för att kasta ett fel, eftersom ett kastat fel rullar tillbaka raden som räknar försöket.

`accept_invitation` kräver inloggning, så kontot är alltid känt. Nyckeln är minst 128 bitar slumpmässig, så gränsen skyddar inte mot att gissa nyckeln, vilket ändå är ogörligt. Den begränsar brus och missbruk.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Behålla ”högst 5 försök per kod”** | Går inte att uppfylla i Supabase utan en betalplan eller en egen inloggningstjänst (S-40) |
| **En egen verifiering av koden i en Edge Function** | Hela inloggningen skulle gå genom egen kod med servicenyckeln, och det är den känsligaste delen av appen. Supabases verifiering används i stället, med skärpta gränser |
| **6 siffror som reserv** | Ett angrepp från 100 IP-adresser lyckas inom timmar. Supabase tillåter 6–10 siffror, så reserven behövs inte |
| **Åtkomstnyckeln kvar på en timme** | Dröjsmålet för ”Logga ut på alla enheter” blir onödigt långt när det kan kortas gratis |
| **Kortare än 15 minuter** | Supabase avråder från under 5 minuter. Varje förnyelse är ett anrop, och på ett dåligt nät på planen ökar risken att en förnyelse misslyckas just när ledaren behöver appen. Med avsnitt 3 behövs ingen kortare tid |
| **Sessionskontrollen utan prov** | Den läser en tabell i Supabases eget schema i varje policy. Det måste visas att det går och vad det kostar innan den gäller |
| **Gräns per IP för inbjudningsnyckeln** | Kräver att IP-adresser lagras, som är personuppgifter, och att adresshuvudet går att lita på. Kontot är redan känt |

## Konsekvenser

**Fördelar**

- Gränserna för koden går att ställa in och verifiera på gratisnivån, och restrisken är räknad och dokumenterad.
- ”Logga ut på alla enheter” verkar inom 15 minuter, och omedelbart för databasen om avsnitt 3 håller.
- Inga IP-adresser lagras för inbjudningar.

**Nackdelar och risker**

- **Gränsen för verifieringar gäller per IP, inte per konto.** Ett angrepp från många adresser är det som räknas i avsnitt 1. Restrisken är cirka 0,3 % per dygn och konto under ett ihållande angrepp, och kontots ägare får ett mejl för varje beställd kod.
- **Ledare på samma nät delar gränsen på 10 verifieringar per 5 minuter.** Vid en gemensam genomgång på klubbens wifi kan en ledare som skriver fel några gånger få vänta. Det mäts i staging. Höjs gränsen ökar restrisken i samma takt.
- **Kortare nyckel ger fler förnyelser**, ungefär fyra i timmen per öppen app. Det ryms i gratisnivån.
- **Kriterierna och texterna behöver följa med.** Berättelse 08, kriterium 8 (b) och (e), berättelse 27, kriterium 2 och 4, och `texter.md` säger i dag ”högst en timme” och ”5 försök”. Produktägaren och UX-designern ändrar dem när beslutet godkänts.
- **ADR 0004 läses tillsammans med den här.** När den här ADR:n godkänns får ADR 0004 status ”delvis ersatt av 0023”, enligt `docs/adr/README.md`. Huvudsessionen gör den ändringen vid K4.
- **Ej verifierat:** att en ny kod ogiltigförklarar den förra, att `auth.sessions` kan läsas från en `security definer`-funktion i det riktiga projektet och kostnaden för det. Allt prövas i 3b och 3c.
