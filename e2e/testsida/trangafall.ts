/**
 * Två skisser som ritmotorn själv pekar ut som potentiellt trånga (ADR 0012 avsnitt 4 och
 * `src/planskiss/skalning.ts`): en kö där det angivna avståndet är mindre än symbolens
 * diameter, och en kö som fylls utöver ytans mått och når bildens kant.
 *
 * Sedan rättelsen av fynd A (`minQueueSpacing`, `insideImage` i `src/planskiss/skalning.ts`)
 * krockar kösymbolerna aldrig: ett för kort angivet avstånd höjs till det minsta som inte
 * överlappar, och en köspelare som inte ryms innanför bildytan ritas inte alls utan räknas i
 * stället in i köns "+N". De två skisserna är ändå kvar här, dels som regressionsskydd för de
 * gränserna, dels för att de fortfarande ger den tätast möjliga och den mest kantnära kön som
 * går att rita, och är därför bra underlag för mänsklig granskning av hur det ser ut.
 *
 * Det här är egen testdata för kvalitetssäkringens skärmbilder, skild från
 * src/planskiss/__testdata__/skisser.ts som ritmotorutvecklaren äger.
 */
import type { PlanskissInput } from '../../src/regelmotor/schema/planskiss.ts';

/**
 * Den tätast tillåtna kön: det angivna avståndet 0,5 m är mindre än symboldiametern D, som
 * klamras till minst 1,2 m (avsnitt 5), så ritmotorn höjer avståndet till det minsta som inte
 * överlappar (`minQueueSpacing`, fynd A) – cirka 1,44 m för lag a. Med sju köade spelare (inom
 * taket på åtta, avsnitt 4) ritas de tätt inpå varandra, men krockar inte.
 */
export const OVERLAPPANDE_KO: PlanskissInput = {
  version: 1,
  omrade: { langd: 20, bredd: 14 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 20, bredd: 14, stil: 'streckad' },
    { id: 'start', typ: 'spelare', x: 2, y: 7, lag: 'a', etikett: '1' },
  ],
  skalning: {
    strategi: 'koer',
    koer: [{ vid: 'start', riktning: 0, avstand: 0.5, etikett: 'Nästa i kön' }],
  },
};
/** Basantal 1 plus sju köade, så att kön fylls till taket på åtta ritade (ADR 0012 avsnitt 4). */
export const OVERLAPPANDE_KO_ANTAL = 8;

/**
 * En kö som når bildens kant: startspelaren står nära högerkanten, och kön fortsätter åt höger
 * mot ytan plus marginalen (3 m, avsnitt 1). Ritmotorn ritar bara de köspelare som ryms helt
 * innanför bildytan (`insideImage`, fynd A); den tredje och senare köspelaren ritas inte alls
 * och räknas i stället in i texten "+3" vid den sista ritade köspelaren, i stället för att
 * klippas av bildens kant.
 */
export const KO_VID_KANTEN: PlanskissInput = {
  version: 1,
  omrade: { langd: 10, bredd: 8 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 10, bredd: 8, stil: 'heldragen' },
    { id: 'start', typ: 'spelare', x: 9, y: 4, lag: 'b', etikett: '1' },
  ],
  skalning: {
    strategi: 'koer',
    koer: [{ vid: 'start', riktning: 0, avstand: 1.5, etikett: 'Väntar' }],
  },
};
/** Basantal 1 plus fem köade: bara de två första ryms, resten redovisas som "+3". */
export const KO_VID_KANTEN_ANTAL = 6;
