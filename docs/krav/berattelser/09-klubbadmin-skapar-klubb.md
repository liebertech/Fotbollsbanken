Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: ändrad vid K2 (2026-09-12)

# 09. Klubbadmin skapar klubb

**Roll:** klubbadmin

**Som** klubbadmin **vill jag** skapa min klubb i appen, **så att** klubbens lag och ledare kan samlas under en gemensam klubb.

Markeringar: **[Oförändrat]**, **[Skärpt]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K2* sist.

## Acceptanskriterier

1. **[Oförändrat]** **Givet** att en inloggad person ännu inte har skapat eller anslutit sig till en klubb, **när** personen skapar en klubb med ett namn, **då** finns klubben i appen, och personen är kopplad till den som klubbadmin.
2. **[Skärpt]** **Givet** att en klubb med samma namn redan finns i appen, **när** en person försöker skapa en klubb med det namnet, **då** informeras personen om att kontrollera om klubben redan finns, i stället för att en andra, identisk klubb skapas av misstag. Jämförelsen ignorerar versaler och extra blanksteg. Personen kan ändå välja "Skapa klubb ändå" (två klubbar på olika orter kan heta likadant), och då skapas klubben som en egen klubb utan koppling till den andra. Varningen visar inget om den andra klubben utöver att namnet finns, och kontrollen går inte att anropa utan att vara inloggad (ADR 0003 princip 3, S-06). **Test:** (a) "IK Exempel" och "ik  exempel" räknas som samma, (b) varningen avslöjar inga andra uppgifter, (c) ett anrop utan inloggning nekas.
3. **[Skärpt]** **Givet** att flera klubbar finns i appen (datamodellen ska klara flera klubbar, se `CLAUDE.md`), **när** en klubbadmin arbetar i sin klubb, **då** ser klubbadmin bara sin egen klubbs lag, ledare och övningar – inte andra klubbars, och inte ens att andra klubbar finns (utöver namnkontrollen i kriterium 2). **Test:** med två klubbar returnerar varje läsning som klubbadmin A gör mot klubb B:s lag, medlemmar, inbjudningar, pass och övningar noll rader, och varje skrivning nekas (se berättelse 28, kriterium 2).
4. **[Skärpt]** **Givet** att klubbadmin vill dela adminrollen med en annan person i klubben, **när** klubbadmin utser den personen till klubbadmin, **då** får den personen samma rättigheter som klubbadmin i klubben, utöver sina övriga roller (motsvarande hur en redaktör kan utse en till redaktör, se berättelse 18). En klubb kan alltså ha fler än en klubbadmin. Detta är en förutsättning för att den sista klubbadminen ska kunna utse en efterträdare innan hen raderar sitt konto (se berättelse 26, kriterium 3). Den som utses måste redan vara medlem i klubben, det vill säga ha accepterat en inbjudan till ett av klubbens lag (berättelse 11). En person utanför klubben kan inte utses direkt. Rollen går att ge bara via den funktion som kontrollerar att anroparen är klubbadmin i just den klubben. **Test:** (a) en vanlig ledare kan inte utse sig själv eller någon annan, inte heller genom att anropa databasen direkt, (b) en klubbadmin i klubb A kan inte utse någon i klubb B, (c) den utsedda personen ser och kan göra allt en klubbadmin kan i klubben.
5. **[Nytt]** **Givet** att personen skriver klubbens namn, **när** personen skriver, **då** visas hjälptexten "Använd klubbens riktiga namn, inte ett lags. Skriv inga namn på spelare någonstans i appen." (`texter.md` avsnitt 13, säkerhetsgranskning K2, S-20, beslut vid K2 punkt 8). Namnet får vara högst 100 tecken, och ett längre namn nekas med ett tydligt fel av databasen och inte bara av formuläret.
6. **[Nytt]** **Givet** att en klubb skapas, **när** klubben skapas, **då** sker det i en enda sammanhållen åtgärd: klubben och personens koppling som klubbadmin skapas tillsammans eller inte alls. En person kan inte själv lägga till sig som klubbadmin i en befintlig klubb, och det finns ingen väg att skapa en klubb utan en klubbadmin. **Test:** direkt skrivning mot klubb- och medlemstabellerna nekas för en inloggad person; bara funktionen för att skapa klubb fungerar.
7. **[Nytt]** **Givet** att nätet saknas, **när** personen försöker skapa klubben, **då** visas kravet på anslutning och det som skrivits ligger kvar (`texter.md` avsnitt 15).

8. **[Nytt 2026-10-13, S-46]** **Givet** att en klubb har flera klubbadminer, **när** en klubbadmin försöker ta bort en annan klubbadmin, ändra någon annans `is_admin` eller ta bort en klubbadmins medlemskap (direkt mot databasen eller via gränssnittet), **då** nekas det. Det enda som går är att utse en ny via funktionen i kriterium 4. Spärren ligger i databasen. **Test:** ett test per väg (ändra `is_admin`, ta bort medlemskap) som klubbadmin A mot klubbadmin B i samma klubb.
9. **[Nytt 2026-10-13, S-52]** **Givet** att en klubb skapas, **då** sätts fältet för vem som skapat den av databasen till den inloggade personen och kan inte sättas till någon annan.

## Beroenden

- 08 (registrera konto och logga in).
- 28 (databasens skydd och gränser), för isoleringstesterna.

## Utanför denna berättelse

- Att gå med i en befintlig klubb som en andra klubbadmin utan att bli utsedd (se kriterium 4 för att bli utsedd av en befintlig klubbadmin).
- Att en klubbadmin återkallar en annan klubbadmins behörighet – ligger i backloggen som Could, i linje med hur redaktörskapet återkallas i berättelse 18.
- Fakturering eller andra klubbuppgifter utöver namn och de lag/ledare som hör dit.
- Att en person är medlem i flera klubbar i gränssnittet (Should i backloggen). Datamodellen tillåter det från start (ADR 0003), men version 1 utgår från en klubb per person.
- Att byta namn på klubben eller ta bort klubben. Klubben tas bort bara när den enda medlemmen raderar sitt konto (berättelse 26, kriterium 9).

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3. Kriterium 2–4 gjorda testbara och rättade mot ADR 0003 (normaliserad namnjämförelse, anrop kräver inloggning, den som utses måste redan vara medlem). Nya kriterier 5–7: hjälptext och längdgräns för klubbnamn (S-20, S-08), att klubben skapas sammanhållet och inte kan kringgås, och kravet på nät. Kriterium 1 är oförändrat. |
| 2026-10-13 (säkerhetsgranskning av kriterierna) | Nya kriterier 8 (S-46: ingen klubbadmin kan ta bort en annan) och 9 (S-52: skaparfältet kan inte förfalskas). |
