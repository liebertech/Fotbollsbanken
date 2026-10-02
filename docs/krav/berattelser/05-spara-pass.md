Status: ändrad vid K2 (2026-09-12); flyttad till inkrement 3 (2026-10-02)

# 05. Spara ett pass

**Roll:** ledare

**Som** ledare **vill jag** kunna spara ett genererat och eventuellt justerat träningspass, **så att** jag kan använda det igen senare, till exempel i planläget eller vid en liknande träning.

## Acceptanskriterier

1. **Givet** att ledaren är nöjd med ett genererat pass, **när** ledaren väljer att spara passet, **då** sparas passets innehåll (övningar, ordning, tider och det underlag som användes för att skapa det) så att det kan öppnas igen senare.
2. **Givet** att ett pass har sparats, **när** ledaren senare öppnar sin lista över sparade pass, **då** visas det sparade passet med de uppgifter det sparades med.
3. **Givet** att ledaren sparar ett pass utan att själv ange ett namn, **när** passet sparas, **då** får det ett namnförslag som gör det möjligt att känna igen det, till exempel med datum, spelform och fokusområde.
4. **Givet** att ledaren sparar ett pass, **när** sparandet är klart, **då** kan ledaren fortsätta använda appen (till exempel generera ett nytt pass) utan att det sparade passet påverkas.
5. **Givet** att ledaren skriver ett eget namn på passet i stället för att använda namnförslaget, **när** ledaren skriver, **då** upplyser appen om att namnet inte ska innehålla namn på spelare (säkerhetsgranskning K2, fynd S-20).

## Beroenden

**Hör till inkrement 3, konton med klubbar och lag.** Berättelsen stod tidigare som Must i inkrement 1, men byggdes aldrig där trots att K4 för inkrement 1 godkändes 2026-09-23 (kvalitetssäkrarens fynd). Användaren beslutade 2026-10-02 att flytta den till inkrement 3, eftersom att spara ett pass kräver ett konto att spara det på och en databas att spara det i (se `docs/adr/`), som båda byggs i inkrement 3. Se backlog.

Beroende på kontona (berättelse 08, registrera konto och logga in) för att det ska finnas en ledare att knyta det sparade passet till. Att koppla ett sparat pass till ett lag och dela det med andra ledare byggs i samma inkrement (se berättelse 12) – fram till det är klart kan ett sparat pass vara knutet enbart till den ledare som skapade det.

## Utanför denna berättelse

- Att dela passet med andra ledare (se berättelse 12).
- Versionshantering av samma pass (till exempel att välja mellan att skriva över eller spara som nytt) – i version 1 skapar varje sparande ett nytt sparat pass.
- Att koppla passet till en säsongsplan (se berättelse 24).
