# 0022: Bollens plats när den ligger på en spelare

Status: föreslagen. Tolkar ADR 0012 avsnitt 2 och kompletterar tolkningarna i ADR 0019 avsnitt 4

## Kontext

ADR 0012 avsnitt 2 säger att varje objekt har en position `x` och `y`, och ritmotorn har hittills ritat alla objekt på sina koordinater. En övningsförfattare som vill visa vem som har bollen lägger den på spelaren. Bollen ritas sist, ovanpå spelarna, och har diametern 0,35 × `D` (ADR 0012 avsnitt 5). Därför täckte den spelarens etikett, så att det till exempel stod ”M⊗” eller ”1⊗” (UX-fynd 8). Målvakter har alltid etiketten `MV` (avsnitt 2) och drabbades lika.

Felet syns i alla läsbara storlekar: `normal`, `planlage` och `utskrift`. I `miniatyr` ritas inga etiketter (avsnitt 5), så där finns inget att täcka.

Underlaget är commit 24cb889 på grenen `feature/visuell-skiss`, funktionen `objectPlacer` och konstanten `BALL_ON_PLAYER` i `src/planskiss/Planskiss.tsx`. Användaren beslutade 2026-10-12 att tolkningen ska dokumenteras i en ny ADR och att den gäller också i planläget och utskriften.

## Beslut

### 1 En boll på en spelare med etikett ritas vid spelarens kant

| Fråga | Tolkning |
|---|---|
| När ligger bollen ”på spelaren”? | När bollens mitt ligger närmare spelarens mitt än **0,75 × `D`**. Gränsen är halva spelarsymbolen plus bollens radie (0,175 × `D`) med lite luft |
| Vilka spelare räknas? | Spelare med en etikett som inte är tom, och **alla målvakter**, eftersom de alltid har etiketten `MV`. Spelare utan etikett, ledare och övriga objekt räknas inte |
| Var ritas bollen? | Exakt 0,75 × `D` från spelarens mitt, **i samma riktning som den låg från mitten**. Ligger den nära flera spelare gäller den närmaste |
| Och om bollen ligger exakt i mitten? | Den flyttas snett nedåt höger, vid spelarens fötter |
| Vilka storlekar? | `normal`, `planlage` och `utskrift`. I `miniatyr` ritas bollen på sina koordinater, eftersom miniatyren saknar etiketter |
| Vad mer använder bollens nya läge? | Rörelser som pekar på bollen med `objekt` börjar eller slutar vid det nya läget, och etiketterna placeras runt bollen där den faktiskt ritas |

**Skissdatan och skissformatet ändras inte.** Flytten görs bara när skissen ritas. Schemat, valideringen och övningarna i `content/ovningar/` är desamma, och en övningsförfattare skriver fortfarande bollen på spelaren när spelaren har den.

**Skäl.** Etiketten är det som skiljer spelarna åt i texten till övningen (”1 passar 2”). En skiss där etiketten inte går att läsa säger mindre än en skiss där bollen ligger en halv symbol fel. Att behålla riktningen gör att en boll som författaren lagt framför spelaren fortfarande hamnar framför. Att lösa det i ritmotorn i stället för i datan gör att alla befintliga och framtida skisser blir rätt utan att någon övning skrivs om.

### 2 Lag B behålls ofylld

När skissen nu ritas på gräsmattan (designsystemets riktning A) beslutade användaren samtidigt, 2026-10-12, att lag B ritas **ofylld enligt ADR 0012 avsnitt 2**, med en vit kontur som syns mot gräset. Det nämns här för att den som läser ritmotorn inte ska tro att symbolen har ändrats. ADR 0012 gäller oförändrad på den punkten.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Rita bollen på sina koordinater, som tidigare** | Etiketten går inte att läsa i de storlekar där den ska läsas |
| **Rita bollen under spelaren** | Bollen försvinner helt bakom en fylld symbol, och det syns inte vem som har den |
| **Flytta etiketten i stället för bollen** | Etiketten står inne i symbolen och identifierar spelaren. Står den utanför kan den läsas som en etikett till en annan spelare eller en rörelse |
| **Kräva att övningsförfattaren lägger bollen bredvid spelaren** | Kräver en ny valideringsregel och att befintliga skisser skrivs om. Avståndet beror dessutom på `D`, som beror på ytan, så samma skiss kan vara rätt i en spelform och fel i en annan |
| **Flytta bollen åt ett fast håll** | En boll framför spelaren skulle hamna bakom. Att behålla riktningen respekterar det författaren ritat |
| **Flytta bollen även i miniatyren** | Miniatyren har inga etiketter, så flytten skulle bara göra bilden mindre lik skissdatan |

## Konsekvenser

**Fördelar**

- Spelarens etikett går att läsa också när spelaren har bollen, i appen, i planläget och i utskriften.
- Ingen övning behöver skrivas om, och skissformatet är oförändrat.
- Rörelser och etiketter följer bollen dit den ritas, så pilarna pekar på den boll som syns.

**Nackdelar och risker**

- **Skissen ritar inte längre exakt det som står i datan.** Bollen kan hamna upp till 0,75 × `D` från sina koordinater. Den som jämför skissdatan med bilden, till exempel i redaktörskön, måste känna till regeln.
- **Miniatyren och den stora skissen skiljer sig åt.** I miniatyren ligger bollen på spelaren, i den stora skissen vid kanten. Skillnaden är under en symbol och syns knappt i 96 px.
- **En boll på en ledare flyttas inte.** Ledaren har förvald etikett `L` men räknas inte. Visar det sig att bollar läggs på ledare behöver tolkningen utökas.
- **En boll som författaren lagt strax bredvid en spelare kan flyttas något**, eftersom gränsen 0,75 × `D` är generös. Den flyttas då utåt, aldrig inåt, så den kommer aldrig närmare spelaren än den låg.
- **Ögonblicksbilder och skärmbilder ändras** för skisser där bollen ligger på en spelare. Det gäller 11 mot 11-ögonblicksbilden och tre bankövningar i commit 24cb889.
- **ADR 0012 och den här ADR:n läses tillsammans.** ADR 0012 får ingen ny status, eftersom inget av dess beslut ersätts: koordinaterna gäller som förut, och tolkningen gäller bara var bollen ritas.
