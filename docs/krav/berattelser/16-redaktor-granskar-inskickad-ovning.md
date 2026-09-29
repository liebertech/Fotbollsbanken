Status: ändrad vid K2 (2026-09-12), uppdaterad inför K4 (2026-09-29)

# 16. Redaktören granskar en inskickad övning

**Roll:** redaktör

**Som** redaktör **vill jag** se en kö av inskickade övningar och kunna godkänna eller skicka tillbaka dem, **så att** bara granskat innehåll blir en del av den gemensamma banken.

> **Obs:** appens roller är ledare, klubbadmin och redaktör – det finns ingen egen apparoll för "fotbollsexpert" (den rollen finns i utvecklingsteamet, för att bygga upp banken i fas 3). Användaren beslutade vid K1 (2026-09-11, se `kravspec.md`) att redaktören i appen ensam avgör om en inskickad övning godkänns eller behöver åtgärdas.

## Acceptanskriterier

1. **Givet** att det finns inskickade övningar, **när** redaktören öppnar redaktörskön, **då** listas alla övningar som väntar på granskning, med den information som behövs för att bedöma dem (se `content/ovningar/README.md`).
2. **Givet** att redaktören anser att en övning håller måttet, **när** redaktören godkänner övningen, **då** får övningen status `godkand` och blir valbar för generatorn i alla klubbar.
3. **Givet** att redaktören anser att en övning behöver ändras, **när** redaktören sätter status `atgarda` och skriver en kommentar, **då** meddelas den ledare som skickade in övningen om att den behöver ändras, tillsammans med kommentaren.
4. **Givet** att ingen människa har godkänt en övning, **då** kan övningen aldrig få status `godkand` automatiskt, i linje med principen i `CLAUDE.md` att bara en människa sätter den statusen.
5. **Givet** att redaktören skriver en kommentar till den ledare som skickade in övningen, **när** redaktören skriver, **då** upplyser appen om att kommentaren inte ska innehålla namn på spelare (säkerhetsgranskning K2, fynd S-20).
6. **Givet** att den inskickade övningen har en planskiss, **när** redaktören öppnar övningen i redaktörskön, **då** visas skissen i den läsbara storleken `normal` (inte `miniatyr`), med alla texter i skissen – etiketter, köernas och zonernas/rutornas etiketter, rörelsernas etiketter och `beskrivning` – i klartext, så att redaktören faktiskt kan läsa dem, i stället för miniatyren som `docs/adr/0012-planskissformat.md` avsnitt 5 annars anger för listvyer. Kriteriet gäller även när klubbens egna övningar granskas, om det i en senare version blir aktuellt. (Beslutat 2026-09-29, ADR 0018, efter säkerhetsgranskningen `docs/sakerhet/granskning-inkrement-2-schema.md`, fynd F2 a och krav RK-9 på ritmotorn: en miniatyr utan etiketter gjorde att ett spelarnamn i skissen aldrig syntes för någon människa.)
7. **Givet** att redaktören granskar en inskickad övning, **då** har den checklista eller de kontrollpunkter redaktören stöder sig på (kriterium 1) punkten "inga namn i skissens etiketter eller beskrivning", som ett eget komplement till upplysningen i kriterium 5 om kommentartexten. (Beslutat 2026-09-29, ADR 0018, säkerhetsgranskningen fynd F2 c.)

## Beroenden

- 15 (skicka in en övning till banken).
- 06 (visa planskiss för en övning) – redaktörskön återanvänder samma ritmotor och samma skissdata, men i storleken `normal` i stället för `miniatyr` (kriterium 6).

## Utanför denna berättelse

- Att fler än en person granskar samma övning innan beslut (till exempel en separat fotbollsfacklig granskning i appen) – se beslutet ovan.
- Att redaktören redigerar övningens innehåll direkt i stället för att skicka tillbaka den (i version 1 skickas den tillbaka till ledaren för ändring).
- Att tekniskt upptäcka namn i skissens fritext (mönstermatchning eller liknande) – kriterium 6–7 gör bara texten läsbar för en människa, se säkerhetsgranskningens *Kvarstår*: "Namn på spelare går inte att upptäcka tekniskt."
- Skisseditorn för egna övningar (se backloggen, inkrement 4) – finns inte i version 1 (beslut vid K2), så fynd F2 b i säkerhetsgranskningen blir aktuellt först om en sådan editor byggs.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-29 | Kriterium 6 och 7 tillagda, samt beroendet till berättelse 06: redaktörskön ska visa planskissen i storleken `normal` med alla skisstexter i klartext, och redaktörens checklista ska innehålla punkten "inga namn i skissens etiketter eller beskrivning". Beslutat av användaren 2026-09-29 efter säkerhetsgranskningen av skissformatet (`docs/sakerhet/granskning-inkrement-2-schema.md`, fynd F2, krav RK-9), dokumenterat i ADR 0018. |
