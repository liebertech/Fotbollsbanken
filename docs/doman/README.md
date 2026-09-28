# Fotbollsdomänen

**Ägare:** fotbollsexpert

Här beskrivs vad appen vet om fotboll. Dokumenten bygger på SvFF:s spelarutbildningsplan och nationella spelformer. Principerna används, men SvFF:s texter kopieras aldrig ordagrant.

| Fil | Innehåll |
|---|---|
| `spelformer.md` | Spelform per ålder, planmått, antal spelare och målstorlek |
| `aldrar-och-fokus.md` | Vad som betonas i varje åldersfas |
| `nivaer.md` | Nivåindelning |
| `fokusomraden.md` | Taxonomin som övningar taggas med |
| `passuppbyggnad.md` | Passets delar, tidsfördelning, stationer per antal ledare och materialtyperna |
| `generatorregler.md` | Regler för regelmotorn, med ID:n (R-001 …) |
| `sasongsprogression.md` | Progression över säsongen |
| `ytreferenser.md` | Ordlistan för fältet `ytreferens` (ADR 0017): vad som är uppritat per spelform, konventioner, när referens inte ges, och referensen per övning |

När regelmotorn byggs ska koden och testerna hänvisa till regel-ID:n i `generatorregler.md`. En regel som inte står här ska inte finnas i koden.

Varje dokument har en statusrad överst: `Status: utkast`, `Status: godkänd (K1, ÅÅÅÅ-MM-DD)` eller, för en fil som har ändrats efter en godkänd kontrollpunkt, `Status: ändrad vid K2 (ÅÅÅÅ-MM-DD)`. En fil med den sista statusen har en ändringstabell eller en daterad notering som säger vad som ändrades och varför.
