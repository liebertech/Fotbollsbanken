/**
 * Två skisser som ritmotorn själv pekar ut som potentiellt trånga (ADR 0012 avsnitt 4 och
 * `src/planskiss/skalning.ts`): kösymboler som överlappar när avståndet är mindre än
 * symbolens diameter, och en kö som klipps vid bildens kant när den fylls utöver ytans mått.
 *
 * Det här är egen testdata för kvalitetssäkringens skärmbilder, skild från
 * src/planskiss/__testdata__/skisser.ts som ritmotorutvecklaren äger.
 */
import type { PlanskissInput } from '../../src/regelmotor/schema/planskiss.ts';

/**
 * Överlappande kösymboler: avståndet 0,5 m (minsta tillåtna, ADR 0012 avsnitt 4) är mindre än
 * symboldiametern D, som klamras till minst 1,2 m (avsnitt 5). Med åtta köade spelare (taket,
 * avsnitt 4) ritas de tätt inpå varandra.
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
 * En kö som klipps vid bildens kant: startspelaren står nära högerkanten, och kön fortsätter
 * åt höger ut mot och förbi ytan plus marginalen (3 m, avsnitt 1). `viewBox` är `omrade` plus
 * marginalen (avsnitt 5), så de sista köspelarna hamnar delvis eller helt utanför den synliga
 * bilden.
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
/** Basantal 1 plus fem köade: tredje och senare hamnar vid eller bortom ytans kant plus marginal. */
export const KO_VID_KANTEN_ANTAL = 6;
