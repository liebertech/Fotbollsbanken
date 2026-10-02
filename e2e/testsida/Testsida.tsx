/**
 * Testsidan (kvalitetssäkring av `feature/ritmotor`, berättelse 06 och 07).
 *
 * Renderar ritmotorns egna produktionskomponenter (`ExerciseCard`, som i sin tur innehåller
 * `KortSkiss`, `Planskissvy` och `Teckenforklaring`) med ögonblicksbildernas testdata, eftersom
 * bankens övningar saknar skissdata på den här grenen (0 av 58 i content/ovningar/). Sidan
 * importerar bara befintliga produktionsmoduler och lägger ingenting till dem.
 */
import { PER_SPELFORM } from '../../src/planskiss/__testdata__/skisser.ts';
import type { GameFormat, Layout } from '../../src/regelmotor/index.ts';
import { contentExercise } from '../../src/regelmotor/__testdata__/bank-fixtur.ts';
import { ExerciseCard } from '../../src/app/session/ExerciseCard.tsx';
import {
  KO_VID_KANTEN,
  KO_VID_KANTEN_ANTAL,
  OVERLAPPANDE_KO,
  OVERLAPPANDE_KO_ANTAL,
} from './trangafall.ts';

const GAME_FORMATS: readonly GameFormat[] = ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11'];

/** Spelformens vanliga antal i en grupp, så att skalningen (köer, platser) syns i bilden. */
const GROUP: Record<GameFormat, number> = {
  '3mot3': 6,
  '5mot5': 7,
  '7mot7': 9,
  '9mot9': 12,
  '11mot11': 7,
};

/**
 * Åldersspannet för varje spelform (CLAUDE.md, "Domänfakta i korthet"). Övningsschemat kräver
 * att `spelformer` är tillåten för någon ålder i `alder` (R-004, R-014), så testsidans
 * fixturer måste ange en ålder som faktiskt hör till spelformen.
 */
const AGE_FOR_FORMAT: Record<GameFormat, { min: number; max: number }> = {
  '3mot3': { min: 6, max: 7 },
  '5mot5': { min: 8, max: 9 },
  '7mot7': { min: 10, max: 12 },
  '9mot9': { min: 13, max: 14 },
  '11mot11': { min: 15, max: 19 },
};

function layoutOf(size: number): Layout {
  return {
    groups: 1,
    sizes: [size],
    coachesPerGroup: 0,
    coachesNeeded: 0,
    oddSolution: null,
    oddText: null,
  };
}

export function Testsida() {
  return (
    <main>
      <h1>Testsida för planskisser</h1>
      <p>
        Kvalitetssäkringens testsida. Varje kort är appens riktiga <code>ExerciseCard</code>, fylld
        med ögonblicksbildernas testdata i stället för bankens övningar.
      </p>

      <h2>Ett exempel per spelform</h2>
      <ul data-testid="per-spelform">
        {GAME_FORMATS.map((format) => {
          const exercise = contentExercise({
            id: `testsida-${format}`,
            namn: `Exempel, ${format}`,
            planskiss: PER_SPELFORM[format],
            spelformer: [format],
            alder: AGE_FOR_FORMAT[format],
          });
          return (
            <li key={format} data-testid={`kort-${format}`}>
              <ExerciseCard
                exercise={exercise}
                minutes={10}
                layout={layoutOf(GROUP[format])}
                format={format}
                placeKey={`testsida-${format}`}
              />
            </li>
          );
        })}
      </ul>

      <h2>Trånga fall</h2>
      <p>
        Två fall som ritmotorn själv pekar ut som trånga (ADR 0012 avsnitt 4,
        `src/planskiss/skalning.ts`): kösymboler som överlappar när avståndet är mindre än symbolens
        diameter, och en kö som klipps vid bildens kant.
      </p>
      <ul>
        <li data-testid="kort-overlappande-ko">
          <h3>Överlappande kösymboler</h3>
          <ExerciseCard
            exercise={contentExercise({
              id: 'testsida-overlappande-ko',
              namn: 'Överlappande kösymboler',
              planskiss: OVERLAPPANDE_KO,
            })}
            minutes={10}
            layout={layoutOf(OVERLAPPANDE_KO_ANTAL)}
            format="7mot7"
            placeKey="testsida-overlappande-ko"
          />
        </li>
        <li data-testid="kort-ko-vid-kanten">
          <h3>Kö som klipps vid kanten</h3>
          <ExerciseCard
            exercise={contentExercise({
              id: 'testsida-ko-vid-kanten',
              namn: 'Kö som klipps vid kanten',
              planskiss: KO_VID_KANTEN,
            })}
            minutes={10}
            layout={layoutOf(KO_VID_KANTEN_ANTAL)}
            format="7mot7"
            placeKey="testsida-ko-vid-kanten"
          />
        </li>
      </ul>
    </main>
  );
}
