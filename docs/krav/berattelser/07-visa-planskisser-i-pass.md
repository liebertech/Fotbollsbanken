Status: godkänd (K4, 2026-10-05)

# 07. Visa planskisser för alla övningar i ett pass

**Roll:** ledare

**Som** ledare **vill jag** se planskisserna för alla övningar i ett pass samlade, **så att** jag kan förbereda material och uppställningar för hela träningen i förväg.

## Acceptanskriterier

1. **Givet** ett genererat eller sparat pass med flera övningar, inklusive eventuella stationer (berättelse 02, kriterium 4), **när** ledaren öppnar passet, **då** visas en planskiss i miniatyrstorlek för varje övning och station som har giltig skissdata, i den ordning de ska genomföras, som en del av respektive övningskort (samma vy som `docs/design/skisser/02-genererat-pass.md`).
2. **Givet** att en eller flera övningar i passet saknar skissdata, **när** ledaren öppnar passet, **då** visas passets övriga miniatyrer som vanligt, och den eller de saknade markeras med texten "Planskiss saknas" (berättelse 06, kriterium 2), i stället för att hela vyn slutar fungera.
3. **Givet** att en eller flera övningar i passet har skissdata som inte går att validera, **när** ledaren öppnar passet, **då** visas passets övriga miniatyrer som vanligt, och den eller de berörda markeras med texten "Planskissen kunde inte visas" (berättelse 06, kriterium 3), i stället för att hela vyn slutar fungera.
4. **Givet** en miniatyrskiss i passvyn, **när** ledaren trycker eller klickar på den, **då** förstoras skissen till normal storlek med tillhörande teckenförklaring, enligt samma regler som i berättelse 06, kriterium 6 (`docs/design/designsystem.md`, avsnitt 7).
5. **Givet** en del i passet som saknar övning (berättelse 02, kriterium 16, berättelse 03), **när** ledaren öppnar passet, **då** visas ingen planskiss för den delen – det finns ingen övning att rita – och delens text om att övning saknas visas som vanligt.
6. **Givet** att en del har fyllts med ett ersättningsfokus i stället för ledarens valda fokus (R-121, berättelse 02 kriterium 16, berättelse 03 kriterium 5–7), **när** passet öppnas, **då** visas planskissen för den valda övningen som vanligt; planskissen i sig påverkas inte av att fokus ersatts, bara informationsraden som berättelse 02 och 03 beskriver.

## Beroenden

- 02 (generera ett träningspass).
- 06 (visa planskiss för en övning), inklusive samma krav på innehåll, felhantering, skalning, färgläge och tillgänglighet.
- Innehåll: samma krav på skissdata i `content/ovningar/` som i berättelse 06. **Omfattningen är inte beslutad, se berättelse 06, *Beslut som behövs*.**

## Utanför denna berättelse

- Att exportera denna samlade vy som PDF (se berättelse 22, inkrement 6).
- Storleksvarianten `planlage` i genomförandeläget (se berättelse 19–21, inkrement 5).
- Att ändra ordningen på övningarna i den samlade vyn (backloggen, Could).
- Den exakta utformningen av kortlayouten och klick-för-att-förstora-interaktionen (ux-designerns ansvar, `docs/design/skisser/02-genererat-pass.md` och `designsystem.md`).

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-09-28 | Acceptanskriterierna skärpta inför K4 (bygget av inkrement 2, förarbete på `feature/planskisser-forarbete`). Tillagt: separat fallback för ogiltig skissdata (kriterium 3, skild från "saknas"), krav på att en miniatyr går att förstora till normal storlek med teckenförklaring (kriterium 4), och förtydligande av hur tomma delar och ersättningsfokus hanteras i den samlade vyn (kriterium 5–6, byggde tidigare på antaganden utan uttryckligt kriterium). Beroendeavsnittet utökat och statusraden ändrad från "godkänd" till "utkast" i linje med hur förarbetet för generatorn (berättelse 02, 03) hanterades inför K4. |
