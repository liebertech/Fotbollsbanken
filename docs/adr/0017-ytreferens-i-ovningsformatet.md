# 0017: Ytreferens i övningsformatet

Status: beslutad (2026-09-28)

## Kontext

Övningens yta står i `yta` som längd och bredd i meter (ADR 0010 avsnitt 1, R-092). Måttet är
exakt, och regelmotorn räknar på det: ytfiltret i R-090 till R-094 jämför övningens yta med den
yta ledaren valt.

Användaren, som själv är ungdomsledare, påpekade 2026-09-24 att ett mått som "55 × 40 meter"
inte går att använda på en plan utan måttband. Ledaren står på en grusplan med en påse koner och
tio minuter kvar innan passet börjar. Metertalet säger henne inte var hon ska sätta konerna.

Användarens beslut samma dag: **metertalet står kvar som huvudmått, och en referens som är
lättare att relatera till följer efter i parentes**, till exempel "18 × 12 meter (stora planens
målområde, dubbelt så djupt)". Fotbollsexperten har tagit fram referenserna för bankens alla 58
övningar och redovisat vad fältet ska innehålla fotbollsmässigt.

Tre saker i det underlaget styr utformningen:

1. **Referensen kan inte härledas ur måttet.** Två övningar med exakt samma mått, 20 × 20 meter,
   får olika behandling: `jonglera-och-boll-i-rorelse` är fri rörelse med egen boll och får en
   referens, medan `passningsrutor-med-langre-passningar` har fasta positioner där avståndet
   mellan dem är det som övas, och får ingen. Appen kan alltså inte räkna fram referensen ur
   `langd` och `bredd`.
2. **Tretton av 58 övningar ska medvetet sakna referens.** Det är positionsspel och stationer där
   måttet är själva poängen, och dueller med startavstånd. Där vore en parentes som antyder
   "ungefär" direkt fel.
3. **Samma mått förtjänar olika referens beroende på spelform.** 18 × 12 är *stora planens
   målområde, dubbelt så djupt* för ett 5 mot 5-lag och *ert eget straffområde* för ett 9 mot
   9-lag, vars straffområde är 24 × 9 meter och alltså exakt lika stort.

## Beslut

**1. Ett nytt valfritt fält `ytreferens` i övningsformatet.** Fältet är en karta med samma
nycklar som `yta`: `alla` eller en spelformsnyckel. Värdet är en kort text.

```yaml
yta:
  alla:
    langd: 18
    bredd: 12
ytreferens:
  alla: stora planens målområde, dubbelt så djupt
```

Fältet är en egen karta bredvid `yta` och inte ett `referens` inuti varje ytmått. Skälet är att
det då kan publiceras för sig: vitlistan i `schema/published.ts` (ADR 0016) avgör fält för fält
vad som når klienten, och ett fält som ligger inuti ett annat går inte att styra där.

**2. Fältet är valfritt, och det är inte en lucka när det saknas.** Ingen status kräver det: det
står inte i `BANK_FIELDS`, så en övning kan bli `granskad` och `godkand` utan det. Saknas det
visas bara metertalet, utan tom parentes och utan platshållare.

**3. Texten är fri, inte en sluten lista.** Vokabulären står i domändokumentet
`docs/doman/ytreferenser.md`, och fotbollsexperten granskar att referensen bygger på den. Ett
test läser facit där och prövar varje formulering mot schemats kontroller, så att ordlistan och
valideringen inte glider isär. En enum i schemat skulle tvinga fram
långsökta referenser i just de fall där svaret är att ingen referens ska ges (punkt 2 i
kontexten), och listan skulle behöva ändras varje gång en ny formulering behövs.

Schemat kontrollerar därför formen, inte innehållet:

- **Nycklarna hör ihop med spelformerna.** En nyckel som inte är `alla` måste finnas i
  `spelformer`, och en spelform får inte täckas både av `alla` och av sin egen nyckel. Samma
  kontroll som R-092 gör för `yta`, men utan kravet att någon nyckel alls ska finnas. Till
  skillnad från R-092 prövas överlappet också när `spelformer` saknas, eftersom det går att
  avgöra ur kartan ensam.
- **Texten får inte innehålla ett mått.** Metern står redan före parentesen, och referensen är en
  jämförelse, inte ett andra mått. Valideringen underkänner måttenheter (`meter`, `cm`, `m` och
  deras släktingar som egna ord, också direkt efter en siffra som i `12m`) och mönstret tal ×
  tal. Siffror i övrigt är tillåtna, eftersom
  spelformernas namn innehåller dem: *hela 7 mot 7-planen* är en giltig referens. Steg är också
  tillåtna, eftersom de uttrycker ungefärlighet: *tio steg utanför straffområdet*.
- **Texten är kort.** Högst 90 tecken. Fotbollsexpertens riktmärke är ungefär 70, så att texten
  ryms i en parentes efter måttet på en mobilskärm. Expertens längsta färdiga formulering är 76
  tecken, och taket är satt med marginal över den, inte som ett andra riktmärke.

**4. Fältet rör ingenting i generatorn.** Det läses inte av R-092, det filtrerar inte och det
räknas inte. Ytkontrollen arbetar vidare på `langd` och `bredd` precis som i dag. Fältet finns
bara för att visas, och uppslagningen per spelform ligger därför i appen och inte i
`filter/area.ts`.

**5. Fältet publiceras.** `ytreferens` skrivs in i `PUBLISHED_FIELDS`. Utan det når texten aldrig
ledaren, eftersom vitlistan (ADR 0016) släpper igenom bara det som står i den.

**6. Referensen visas alltid tillsammans med måttet.** Kortet visar `Yta: 18 × 12 meter (stora
planens målområde, dubbelt så djupt)`. Referensen står aldrig ensam: den är ungefärlig, och en
ledare som bara ser parentesen har inget exakt mått att falla tillbaka på. Måttet visades inte
alls på övningskortet före det här beslutet, så visningen av `yta` tillkommer samtidigt.

## Alternativ

**Byta ut metertalet mot referensen.** Fotbollsexpertens första underlag. Det faller på att en
referens som inte passar då kostar något: ledaren skickas ut för att leta efter en linje som
kanske inte är uppritad på hennes plan, och regelmotorn skulle behöva ett mått att räkna på ändå.
Användaren valde parentesen just därför.

**Räkna fram referensen ur `langd` och `bredd`.** Billigast av allt, och inget innehållsarbete.
Det faller på punkt 1 i kontexten: samma mått får olika referens beroende på vad övningen går ut
på, och en uträknad referens skulle ge en parentes till de tretton övningar som medvetet ska
sakna en.

**En sluten lista med referensnycklar, en enum.** Skulle ge en garanterat kontrollerad vokabulär
och möjlighet att översätta texten i appen. Det faller på att formuleringarna skiljer sig i
ordföljd och precision av fotbollsmässiga skäl — *ungefär en fjärdedel* och *en fjärdedel*
betyder olika saker, och `spela-ut-med-malvakten` behöver sin egen ordföljd för att säga både
storlek och plats — och på att en enum gör det bekvämare att välja en långsökt referens än att
låta bli.

**Fältet inuti varje ytmått, som `yta.alla.referens`.** Nyckeln kan då inte peka på en spelform
som saknar mått. Det faller på vitlistan: ett fält inuti ett annat följer med ut i paketet utan
att någon tar ställning till det, och ADR 0016 infördes just för att ingenting ska nå klienten
oavsiktligt.

## Konsekvenser

**Fördelar**

- Ledaren får ett mått hon kan ställa upp efter utan måttband, utan att förlora det exakta
  måttet.
- Ingenting som är beslutat rivs upp: ingen regel, inget golv, ingen godkänd övnings innehåll. En
  parentes ändrar ingen övning, och övningsfilernas diff blir en ny rad per fil.
- Ytan syns nu på övningskortet. Den saknades, och ledaren behövde den även utan referens.

**Nackdelar och risker**

- Ett fält till i formatet som ingen regel tvingar fram. Det kan glömmas bort i nya övningar, och
  ingen validering fångar det, eftersom "ingen referens" är ett giltigt och ofta riktigt svar.
  Fotbollsexperten är den som kan se skillnad på en glömd och en medvetet utelämnad referens.
- Kontrollen mot måttenheter är en textkontroll och kan i princip fälla en formulering som råkar
  innehålla ordet `m` för sig självt. Ingen av expertens 21 färdiga formuleringar gör det, och en
  referens ska ändå inte innehålla en enhet.
- Fältet är fri text som skrivs in i banken och visas för ledaren. Det är samma klass av innehåll
  som `syfte` och `beskrivning` och går genom samma kontroller mot e-postadresser (S-21, S-32)
  och samma tak för filens storlek (S-08).
- Övningskortet blir en rad längre. Ux-designern granskar formen.
