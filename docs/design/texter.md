Status: godkänd (K2, 2026-09-12)

# Gränssnittstexter – Fotbollsbanken

Alla texter är på svenska och skrivna i klarspråk, med samma ord som ledare själva använder (spelform, station, coachningspunkter, med mera). Knappar säger exakt vad som händer när de trycks, inte bara "OK" eller "Skicka". Texterna nedan är förslag som senior-systemutvecklare implementerar och som kan finjusteras utan ny K2-behandling, så länge innebörden är densamma.

Platshållare skrivs inom `{hakparentes}`.

---

## 1. Allmänt, återkommande

| Sammanhang | Text |
|---|---|
| Primärknapp, generera | Generera pass |
| Primärknapp, spara pass | Spara pass |
| Primärknapp, spara övning | Spara övning |
| Byta övning | Byt övning |
| Ångra/avbryt | Avbryt |
| Ta bort (destruktiv, kräver bekräftelse) | Ta bort |
| Stäng dialog | Stäng |
| Ladda/vänta | Arbetar … |
| Obligatoriskt fält (skärmläsartext) | obligatoriskt |
| Generisk sparad-bekräftelse | Sparat. |

---

## 2. Inloggning och konto (berättelse 08, `skisser/14-inloggning.md`)

Inloggning sker med en engångskod via e-post, utan lösenord (`docs/adr/0004-inloggning.md`). Samma kodsteg används vid inloggning och registrering.

| Sammanhang | Text |
|---|---|
| Rubrik | Logga in |
| Rubrik, registrering | Skapa konto |
| Fält | E-post / Namn |
| Hjälptext, namn | Visas för andra ledare i dina lag. |
| Hjälptext, personuppgifter | Vi sparar bara det som behövs för ditt konto. Inga uppgifter om spelare. |
| Hjälptext, captcha | En kort kontroll som visar att det är en person som loggar in, inte ett program. |
| Knapp, steg 1 | Skicka kod |
| Knapp, logga ut | Logga ut |
| Rubrik, kodsteg | Skriv in koden |
| Ingress, kodsteg | Vi har skickat en kod till {e-post}. |
| Hjälptext, skräppost (lugn ton, ingen varningsikon) | Hittar du inget mejl om en liten stund? Kolla även i skräpposten. |
| Fält, kod | Kod (6 siffror) |
| Knapp, bekräfta kod | Bekräfta kod |
| Knapp, skicka ny kod (väntar) | Skicka ny kod ({sekunder} s) |
| Knapp, skicka ny kod (klar) | Skicka ny kod |
| Länk, fel adress angiven | Fel e-postadress? Gå tillbaka |
| Bekräftelse efter steg 1 (samma oavsett om kontot finns, S-13) | Om adressen finns hos oss har vi skickat en kod. |
| Fel: fel kod | Koden stämmer inte. Kontrollera siffrorna och försök igen. |
| Fel: för många felaktiga försök | Du har försökt för många gånger. Begär en ny kod för att fortsätta. |
| Fel: koden har gått ut | Koden har gått ut. Begär en ny kod. |
| Fel: obligatoriskt fält saknas | Fyll i {fältnamn} för att fortsätta. |
| Inbjudan, banner | Du är inbjuden till {lagnamn} i {klubbnamn}. |
| Efter accepterad inbjudan | Du är nu kopplad till {lagnamn}. |

**Viktigt:** appen ska aldrig säga att en adress "redan har ett konto" eller att uppgifter "inte stämmer" för en okänd adress (S-13). Vid fel kod, däremot, ska felmeddelandet vara tydligt – det handlar inte om att avslöja kontots existens, utan om att koden personen just skrev in är fel.

---

## 3. Underlag för generatorn (berättelse 01, `skisser/01-underlag.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Nytt pass |
| Fält, ålder | Ålder |
| Hjälptext, ålder | Ange den ålder som flest i gruppen fyller i år. Har ni två lika vanliga åldrar, ange den yngre. |
| Fel, ogiltig ålder | Ange en ålder mellan 6 och 19 år. |
| Fält, spelform | Spelform |
| Hjälptext, spelform | Föreslagen utifrån åldern. Du kan också välja spelformen närmast före eller efter. |
| Fält, nivå | Nivå |
| Hjälptext, nivå | Välj den nivå som stämmer för ungefär två av tre spelare i gruppen. |
| Fält, antal spelare | Antal spelare |
| Fel, antal spelare | Antal spelare måste vara mellan 1 och 40. |
| Fält, antal ledare | Antal ledare |
| Fel, antal ledare | Antal ledare måste vara mellan 1 och 10. |
| Fält, passlängd | Passets längd (minuter) |
| Fel, för kort pass | Passet måste vara minst 30 minuter. |
| Fel, för långt pass | Det längsta passet för den här åldern är {maxlängd} minuter. |
| Fält, fokusområden | Fokusområden (välj 1–3) |
| Fokusområden, väntar på ålder | Ange ålder först, så visar vi de fokusområden som passar åldern. |
| Fokusområden, kärnområde (skärmläsarord för "(K)", tillagd vid uppföljningen 2026-09-23) | kärnområde |
| Fel, inget fokus valt | Välj minst ett fokusområde. |
| Fel, för många fokus | Du kan välja högst tre fokusområden. Ta bort ett för att lägga till ett nytt. |
| Fel, bara nickspel valt | Nickspel måste väljas tillsammans med minst ett annat fokusområde. |
| Fält, yta | Yta (valfritt) |
| Alternativ, yta | Ingen / Hel plan / Halv plan / Kvarts plan |
| Fel, ofullständigt underlag (samlat) | Några uppgifter saknas eller stämmer inte – se markeringarna ovan. |
| Primärknapp | Generera pass |

**Kärnområde och "(K)" (tillagd vid uppföljningen 2026-09-23):** varje kärnområde (K) i fokuslistan visar "(K)" för ögat. Ordet "kärnområde" läggs till *efter* "(K)" i kryssrutans tillgängliga namn, det ersätter inte "(K)": till exempel "Passning och mottagning (K), kärnområde". Se `skisser/01-underlag.md`, avsnittet Tillgänglighet, för skälet – kortfattat att WCAG 2.5.3 kräver att den synliga texten, inklusive "(K)", ordagrant ingår i det tillgängliga namnet, samtidigt som en ensam bokstav "K" utan sammanhang är obegriplig för en skärmläsare.

---

## 4. Genererat pass (berättelse 02, `skisser/02-genererat-pass.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Ditt pass |
| Faktisk tid, avviker | Faktisk tid: {x} min (du bad om {y} min) |
| Del, namn | Uppvärmning / Öva / Spelövning / Spel / Avslutning |
| Stationsetikett | Station A / Station B / Station C / Station D |
| Knapp, mer info | Visa mer |
| Knapp, mindre info | Visa mindre |
| Knapp, byt övning | Byt övning |
| Tips, många spelare per ledare (R-021) | Ni är fler spelare per ledare än vad som brukar rekommenderas för den här åldern. Ta gärna hjälp av en förälder eller en äldre spelare. |
| Varning, mål (R-084) | Kom ihåg att alla mål, även små, ska vara förankrade så att de inte kan välta. |
| Varning, benskydd (R-085) | Använd benskydd på träningen – spel innehåller alltid närkamper. |
| Tom del, kan lösas med ett val (R-100/R-103) | Vi kunde inte hitta en övning som passar här. Testa att ändra ett av de här: {lista av fält, t.ex. "Nivå, Antal spelare"}. |
| Tom del, går inte att kombinera (R-100 andra punkten) | De övningar som annars skulle passa här gick inte att kombinera med resten av passet. |
| Tom del, inget enskilt val hjälper (R-100/R-103, tredje läget, tillagd K4 2026-09-23) | Vi hittade inga övningar som passar den här delen, och inget enskilt val skulle ensamt lösa det. Prova att ändra flera uppgifter i underlaget samtidigt. |
| Ersättningsfokus i en del (R-121, tillagd K4 2026-09-23) | Inga övningar för {missing} passade den här delen, så vi använde {substitute} i stället. Dina val i underlaget är oförändrade. |
| Del borttagen pga för kort tid (R-033) | (visas inte alls – delen tas bort helt och nämns inte i passet) |

**Tillagt vid granskningen inför K4 (2026-09-23):**

- **Ersättningsfokus (R-121):** visas som en egen informationsrad direkt under delens rubrik, före övningskortet, när `del-ovning` eller `del-spelovning` fylldes med ett annat fokus än det ledaren valde. `{missing}` är det eller de valda fokusområden som saknade övning i just den delen (kommaseparerat om flera), `{substitute}` är fokusområdet som användes i stället. Texten ändrar aldrig innebörden av R-102: underlagets fokusval står kvar precis som ledaren skrev dem.
- **Tom del, inget enskilt val hjälper:** en tredje variant av "tom del"-texten, som tidigare saknades. Den behövs för att "Tom del, går inte att kombinera" annars visas även när det inte stämmer att andra övningar skulle passa var för sig – till exempel när banken helt saknar övningar för den valda spelformen. Visas när delens `emptyReason` är `val-kan-andras` **och** listan över ändringsbara fält är tom (alltså varken en bekräftad kombinationskonflikt eller en lista att visa). `emptyReason` är en riktig, bekräftad signal från regelmotorn (samma prövning som `partCanBeFilled` gör för delen), inte en gissning utifrån att listan råkar vara tom – det gäller båda de två återstående lägena. Se `skisser/02-genererat-pass.md` för var i vyn den ska stå.

---

## 5. Inget matchande resultat (berättelse 03, `skisser/03-inget-matchande-resultat.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Vi kunde inte skapa ett pass med de här uppgifterna |
| Ingress, val kan lösa det (R-103) | Det finns för få övningar som matchar allt du valt. Prova att ändra ett av de här: |
| Ingress, kan inte kombineras (R-100 andra punkten) | Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val. |
| Ingress, inget enskilt val hjälper (tillagd K4 2026-09-23) | Vi hittade inga övningar som matchar de här valen, och vi kan inte peka ut ett enskilt val som skulle lösa det. Prova att ändra flera uppgifter i underlaget samtidigt. |
| Trygghetstext | Vi ändrar ingenting åt dig – gå tillbaka och justera det du vill testa. |
| Knapp | Ändra uppgifter |
| Sammanfattning, rubrik | Ditt underlag just nu |

**Viktigt:** de tre ingresserna ovan används aldrig samtidigt och ska vara tydligt olika formulerade, eftersom de betyder olika saker för ledaren (ett eget val löser det, ett kombinationsproblem som inget enskilt val löser, respektive att ingen övning matchar alls och inget enskilt val hjälper).

**Vilken av de tre som visas (rättat vid uppföljningen 2026-09-23):** `NoSessionReason` har fältet `cause` (`inget-matchar` eller `gar-inte-att-kombinera`), beräknat med samma prövning som `emptyReason` gör per del (se avsnitt 4 ovan). Ordningen: är listan över ändringsbara fält (`changeableFields`) inte tom, visas "val kan lösa det", oavsett `cause`. Är listan tom, avgör `cause`: `gar-inte-att-kombinera` ger "kan inte kombineras", `inget-matchar` ger "inget enskilt val hjälper" (se exemplet med 11 mot 11, där banken helt saknar övningar). En tidigare version av den här raden sa att en tom lista alltid skulle ge "inget enskilt val hjälper", i väntan på just den här signalen från regelmotorn – det gäller inte längre, se `skisser/03-inget-matchande-resultat.md`.

---

## 6. Byta övning (berättelse 04, `skisser/04-byt-ovning.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Byt övning: {delnamn} |
| Ingress | Byter ut: "{övningsnamn}" ({eventuell stationsetikett}, {tid} min) |
| Sektion | Från den gemensamma banken |
| Sektion | Klubbens egna övningar |
| Knapp per övning | Välj denna |
| Info, dolda ofullständiga egna övningar | Ingen av era egna övningar med ofullständiga uppgifter visas här – de kan inte användas i ett pass förrän de är kompletta. |
| Inga alternativ | Vi hittade ingen övning, varken i banken eller bland era egna, som passar precis här. Övningen ligger kvar som den är. |
| Bekräftelse efter byte | Bytt till: {nytt övningsnamn}. |

---

## 7. Spara pass och sparade pass (berättelse 05, 12, `skisser/05-sparade-pass.md`)

| Sammanhang | Text |
|---|---|
| Rubrik, dialog | Spara pass |
| Fält, namn | Namn på passet |
| Hjälptext, namn på passet | Skriv inga namn på spelare. |
| Namnförslag | {ålder} år · {spelform} · {huvudfokus} {datum} |
| Fält, lag | Lag |
| Hjälptext, lag | Delas med alla ledare i {lagnamn}. |
| Hjälptext, inget lag | Sparas bara för dig, tills du kopplar det till ett lag. |
| Rubrik, lista | Sparade pass |
| Flik | Mina pass / {lagnamn} |
| Tomt läge | Du har inga sparade pass än. Skapa ditt första pass. |
| Knapp, nytt | + Nytt pass |

---

## 8. Planskisser (berättelse 06, 07)

| Sammanhang | Text |
|---|---|
| Saknad skiss | Planskiss saknas |
| Alt-text för skärmläsare, skiss finns | Planskiss: {övningsnamn}, yta {mått} meter |

---

## 9. Planläget (berättelse 19, 20, 21, `skisser/06-planlage.md`)

| Sammanhang | Text |
|---|---|
| Knapp, starta | Starta planläge |
| Statusrad | {delnamn} · {nummer} av {totalt} |
| Knapp, avsluta | Avsluta |
| Bekräftelse, avsluta | Vill du avsluta planläget? Passets ordning och tider påverkas inte. |
| Knapp, timer start | Starta timer |
| Knapp, timer paus | Pausa |
| Knapp, timer förläng | +1 minut |
| Timer, tiden slut | Tiden är slut |
| Knapp, navigera | ◀ Föregående / Nästa övning ▶ |
| Sista övningen, meddelande | Passet är slut |
| Ingress, passet slut | Bra jobbat! Ni har gått igenom alla övningar. |
| Knapp | Till avslutningen / Avsluta planläget |
| Utfällbar info | Visa fullständig beskrivning, coachningspunkter och varianter |

---

## 10. Utskrift/PDF (berättelse 22, `skisser/07-utskrift.md`)

| Sammanhang | Text |
|---|---|
| Knapp | Skriv ut / Ladda ner PDF |
| Sidfot | Skapat i Fotbollsbanken · {datum} |
| Saknad skiss i utskrift | Planskiss saknas |
| Tom del i utskrift | Övning saknas för den här delen |

---

## 11. Egna övningar (berättelse 13–17, `skisser/10-skapa-egen-ovning.md`, `11-hantera-egna-ovningar.md`)

| Sammanhang | Text |
|---|---|
| Rubrik, ny | Ny egen övning |
| Rubrik, lista | Klubbens egna övningar |
| Knapp | + Ny övning |
| Sparad med saknade fält | Övningen är sparad, men saknar: {lista}. Den kan inte användas i ett pass förrän de är ifyllda. |
| Komplett-markering i lista (egen övning, inte inskickad) | Ofullständig / Klar att använda |
| Status i lista (efter insändning, ur `submissions.status`) | Inskickad, väntar på granskning / Godkänd / Åtgärda |
| Under granskning, spärr | Den här övningen är inskickad och väntar på granskning i den gemensamma banken. Du kan inte ändra eller ta bort den förrän granskningen är klar. |
| Ta bort, bekräftelse | Ta bort "{övningsnamn}"? Pass som redan använder den påverkas inte. |
| Skicka in, ofullständig | Komplettera för att skicka in |
| Skicka in, redan inskickad | Den här övningen är redan inskickad och väntar på granskning. |
| Skicka in, lyckad | Skickad till redaktören. Du ser status i din lista. |
| Åtgärda, rubrik | Redaktören vill att du ändrar något innan övningen kan godkännas: |
| Åtgärda, historik | Tidigare kommentarer |
| Knapp | Spara och skicka in igen |
| Nickspel, för låg ålder | Nickspel kan bara användas för övningar med lägsta ålder 13 år eller äldre. |

**Viktigt:** en egen övning har antingen komplett-markeringen (Ofullständig/Klar att använda) eller status i redaktörskön (Inskickad/Godkänd/Åtgärda), aldrig båda samtidigt (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4). Ordet "Utkast" används inte om egna övningar i appen – det finns bara som filstatus i `content/ovningar/`.

---

## 12. Redaktörskö (berättelse 16, 18, `skisser/12-redaktorsko.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Redaktörskö ({antal} väntar) |
| Tomt läge | Inga övningar väntar på granskning just nu. |
| Knapp | Granska |
| Knapp | Godkänn |
| Bekräftelse, godkänd | Godkänd – nu valbar för alla klubbar. |
| Knapp | Skicka åtgärda |
| Fält, kommentar | Kommentar till {ledarens namn} |
| Hjälptext, kommentar | Skriv inga namn på spelare. |
| Fel, tom kommentar | Skriv en kommentar som förklarar vad som behöver ändras. |
| Rubrik, redaktörer | Redaktörer |
| Knapp | Gör till redaktör |
| Fel, person saknar konto | Personen har inget konto än. Be personen registrera sig först. |
| Knapp | Ta bort behörighet |

---

## 13. Klubbadmin (berättelse 09, 10, 11, `skisser/13-klubbadmin-lag.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Skapa din klubb |
| Fält | Klubbnamn |
| Hjälptext, klubbnamn (S-20) | Använd klubbens riktiga namn, inte ett lags. Skriv inga namn på spelare någonstans i appen. |
| Varning, namn upptaget | Det finns redan en klubb med det namnet. Kontrollera om din klubb redan är registrerad innan du skapar en ny. |
| Knapp | Skapa klubb / Skapa klubb ändå |
| Knapp | + Lag |
| Fält, lag | Lagnamn / Ålder / Spelform |
| Hjälptext, lagnamn (S-20) | Skriv inga namn på spelare. |
| Varning, arkivera lag | Laget har {antal} sparade pass{ och en säsongsplan, om aktuellt}. De påverkas inte, men laget tas bort från de aktiva listorna och kan inte längre väljas för nya pass. |
| Knapp | Arkivera ändå |
| Fält, inbjudan | Bjud in ledare via e-post |
| Knapp | Skicka inbjudan |
| Status | Inbjuden, väntar på svar |
| Knapp | Ta bort från lag |
| Bekräftelse, ta bort | Ta bort {namn} från {lagnamn}? Personen behåller sitt konto och det som inte enbart hör till laget. |

---

## 14. Säsongsplan (berättelse 23–25, `skisser/08-sasongsplan-vecka.md`, `09-sasongsplan-oversikt.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Säsongsplan för {lagnamn} |
| Tomt läge | Ni har ingen säsongsplan än. |
| Fält | Startdatum / Slutdatum |
| Knapp | Skapa säsongsplan |
| Befintlig plan finns | {Lagnamn} har redan en säsongsplan ({start}–{slut}). Vill du öppna den? |
| Vecka, rubrik | Vecka {nummer} · {datumspann} |
| Ålder denna vecka | Ålder denna vecka: {ålder} år |
| Veckans fokus | Veckans fokus: {lista} |
| Tom vecka | Inget pass planerat den här veckan. |
| Knapp | + Lägg till pass |
| Val, källa | Välj bland sparade pass / Generera nytt pass för den här veckan |
| **Varning, ålder skiljer sig (24.5, R-113)** | Passet skapades för {passets ålder} år, men veckans ålder är {veckans ålder} år. Kontrollera att passet fortfarande passar. |
| **Varning, nickspel under 13 år (24.5, R-080)** | Det här passet innehåller en övning med nickspel, men veckans ålder är under 13 år. SvFF rekommenderar ingen nickträning före 13 år – kontrollera passet innan ni kör det. |
| Rubrik, översikt | Säsongsplan {lagnamn} |
| Genväg | ↑ Till idag / aktuell vecka |
| Flera pass på en vecka | {antal} pass |

---

## 15. Generella fel och tillstånd

Vad som faktiskt fungerar utan nät styrs av `docs/adr/0005-daligt-nat-och-offline.md`. Sparade pass, planläget och utskrift fungerar offline; allt som ändrar något i databasen kräver nät, och det finns ingen kö som skickar iväg en ändring automatiskt när nätet kommer tillbaka (ADR 0005, punkt 6). Texterna nedan får därför aldrig antyda att en ändring "sparas ändå" – bara att den ligger kvar ifylld tills ledaren försöker igen.

| Sammanhang | Text |
|---|---|
| Något gick fel (oväntat tekniskt fel) | Något gick fel just nu. Försök igen om en liten stund. |
| Anslutningsindikator (banderoll, `designsystem.md` avsnitt 9) | Ingen anslutning · Visar sparad data från {tidpunkt} |
| Anslutningsindikator, återställd | Uppdaterat |
| Fel, handling kräver nät (spara, ändra, skicka in, godkänna, bjuda in, logga in, radera konto) | Du verkar sakna internetanslutning. Det du skrivit finns kvar – försök igen när du är uppkopplad. |
| Bekräftelse, osparade ändringar | Du har ändringar som inte är sparade. Vill du lämna sidan ändå? |
| Laddar innehåll | Hämtar … |

---

## 16. Mitt konto och radera konto (berättelse 26, `skisser/15-radera-konto.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Mitt konto |
| Knapp | Logga ut på alla enheter |
| Knapp, destruktiv | Radera mitt konto |
| Rubrik, blockerad | Radera mitt konto |
| Blockerad, ensam klubbadmin | Du är den enda klubbadminen i {klubbnamn}. Utse en efterträdare innan du kan radera ditt konto. |
| Knapp, blockerad | Utse en efterträdare |
| Rubrik, vad som händer | Det här raderas |
| Rubrik, vad som blir kvar | Det här blir kvar, avidentifierat |
| Text, avidentifierat | Skaparen visas då som "Borttagen användare". |
| Varning, kan inte ångras | Det går inte att ångra. |
| Fält, bekräfta med namn | Skriv ditt namn för att bekräfta |
| Fel, namnet stämmer inte | Namnet du skrev stämmer inte. Kontrollera stavningen. |
| Knapp | Radera mitt konto |
| Knapp | Avbryt |
| Bekräftelse efter radering | Ditt konto är raderat. Du är utloggad. |

---

## Principer bakom formuleringarna

1. **Aktiv röst och konkret handling.** "Byt övning", inte "Övningsbyte". "Spara pass", inte "Spara".
2. **Fel förklarar både vad och varför.** Till exempel "Antal spelare måste vara mellan 1 och 40", inte bara "Ogiltigt värde".
3. **Appen ändrar aldrig ledarens val åt henne eller honom** – texterna säger alltid "testa att ändra" eller "kontrollera", aldrig "vi har ändrat".
4. **Samma ord som ledare använder:** spelform (inte "matchformat"), station (inte "grupp" när det gäller stationer), coachningspunkter (inte "tips till tränaren"), planskiss (inte "diagram").
5. **Varningar om säkerhet är alltid synliga, aldrig gömda** bakom en meny eller ett klick, eftersom de handlar om barns säkerhet (mål, benskydd, nickspel).

---

## Ändringar efter K2

Det här dokumentet godkändes vid K2, 2026-09-12. Ändringarna nedan är tillägg som gjordes vid granskningen av det byggda gränssnittet inför K4 (2026-09-23), eftersom R-121 (ersättningsfokus) och det tredje "inget matchande resultat"-läget tillkom efter K2. Statusraden överst ändras inte av en agent – det gör huvudsessionen tillsammans med användaren.

| Datum | Ändring |
|---|---|
| 2026-09-23 | **Avsnitt 3:** ny rad för texten som visas i stället för fokuslistan innan ålder är ifylld. |
| 2026-09-23 | **Avsnitt 4:** två nya rader – ersättningsfokus (R-121) och "tom del, inget enskilt val hjälper", det tredje läget för en tom del. Texter.md hade bara två lägen för en tom del sedan tidigare; det tredje saknades eftersom det upptäcktes först vid granskningen inför K4. |
| 2026-09-23 | **Avsnitt 5:** ny rad för "inget enskilt val hjälper" samt ett tillägg som förklarar vilken av de tre ingresserna som ska visas, eftersom vyn i praktiken bara kan skilja på "lista med fält" och "listan är tom" (se `skisser/03-inget-matchande-resultat.md`). |
| 2026-09-23 (uppföljning samma dag) | **Avsnitt 4 och 5:** förklaringarna om vilken "tom del"/"inget matchande resultat"-text som visas är omskrivna. Regelmotorn har fått den bekräftade signalen (`emptyReason` per del fanns redan, `NoSessionReason.cause` är ny) som avsnitten tidigare sa saknades – "kan inte kombineras" visas nu bara när orsaken är bekräftad, inte som en gissning utifrån en tom fältlista. |
| 2026-09-23 (uppföljning samma dag) | **Avsnitt 3:** ny rad för skärmläsarordet "kärnområde" och en förklaring av hur det vävs in i fokuskryssrutornas tillgängliga namn tillsammans med "(K)" (WCAG 2.5.3). |
