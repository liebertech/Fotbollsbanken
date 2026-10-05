// ESLint, flat config. Reglerna nedan följer ADR 0001 (kodkvalitet och kodstruktur),
// ADR 0011 (förbjudna slumpkällor i regelmotorn) och ADR 0012 (SVG-element i planskissen).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import { ALLOWED_SVG_ATTRIBUTES, ALLOWED_SVG_ELEMENTS } from './src/planskiss/vitlista.ts';

/**
 * Den virtuella bankmodulen får bara importeras av src/data/bank.ts (S-29, ADR 0015).
 *
 * Där, och bara där, märks övningarna som den gemensamma bankens (ADR 0016). En import
 * någon annanstans skulle gå förbi den märkningen, och i inkrement 4 kunna blanda ihop
 * bankens övningar med klubbens egna. Egenskapen höll på konvention tills nu.
 */
const FORBIDDEN_BANK_MODULE = {
  name: 'virtual:ovningsbanken',
  message:
    'Den inbyggda banken läses bara av src/data/bank.ts, som märker övningarna som bankens (S-29, ADR 0015, ADR 0016).',
};

/** Bibliotek och API:er som src/regelmotor/ inte får importera (ADR 0001, kodstruktur). */
const FORBIDDEN_IMPORTS_IN_ENGINE = {
  paths: [
    { name: 'react', message: 'src/regelmotor/ får inte importera React (ADR 0001).' },
    { name: 'react-dom', message: 'src/regelmotor/ får inte importera React (ADR 0001).' },
    {
      name: '@supabase/supabase-js',
      message: 'src/regelmotor/ får inte importera Supabase (ADR 0001).',
    },
    // Regelmotorn tar emot banken som argument och hämtar den aldrig själv (ADR 0011).
    FORBIDDEN_BANK_MODULE,
  ],
  patterns: [
    {
      group: ['react/*', 'react-dom/*', '@supabase/*'],
      message: 'src/regelmotor/ får inte importera React eller Supabase (ADR 0001).',
    },
    {
      group: ['node:*'],
      message:
        'src/regelmotor/ ska kunna köras i klienten och får därför inte importera Node-API:er (ADR 0001).',
    },
    {
      group: ['../app/*', '../planskiss/*', '../data/*', '../../app/*', '../../data/*'],
      message: 'Regelmotorn får inte bero på appen, ritmotorn eller datalagret (ADR 0001).',
    },
  ],
};

/** Slumpkällor utanför fröet är förbjudna i regelmotorn (ADR 0011, avsnitt 2). */
const FORBIDDEN_RANDOMNESS = [
  {
    object: 'Math',
    property: 'random',
    message: 'Använd den seedade PRNG:n i random/rng.ts (ADR 0011).',
  },
  {
    object: 'Date',
    property: 'now',
    message: 'Passet får inte bero på när det genereras (ADR 0011).',
  },
  {
    object: 'performance',
    property: 'now',
    message: 'Webbläsar-API:er är förbjudna i regelmotorn (ADR 0011).',
  },
];

/**
 * ALLOWED_SVG_ELEMENTS: de enda element som ritmotorn får skapa, den slutna listan i ADR 0012
 * avsnitt 6 (S-07). ALLOWED_SVG_ATTRIBUTES: de enda attribut som ritmotorn får sätta på ett
 * element (R4). Båda är vitlistor, så det som inte står där underkänns även om ingen har tänkt
 * på det (säkerhetsgranskningen av schemat, F9). Listorna står i src/planskiss/vitlista.ts,
 * där körtestet i sakerhet.test.tsx prövar att de stämmer med det som får finnas i SVG:n.
 */
const ALLOWED_ATTRIBUTE_NAMES = Object.keys(ALLOWED_SVG_ATTRIBUTES);

/** Ett reguljärt uttryck i esquery som bara matchar namnen i listan. Namnen är a–z, 0–9 och -. */
function exactly(names) {
  return `/^(${names.join('|')})$/`;
}

/** Attribut som kan ladda en resurs, köra kod eller bära data som CSS (F9, RK-2, RK-5). */
const FORBIDDEN_SVG_ATTRIBUTES = ['href', 'xlinkHref', 'style', 'dangerouslySetInnerHTML'];

/**
 * `as Planskissdata` gör ett ovaliderat värde till validerad skissdata och går förbi
 * `readPlanskiss` (F8, RK-1). Typen får man bara ur schemat.
 */
const VALIDATED_TYPES = ['Planskissdata', 'PlanskissReadResult'];
const VALIDATED_TYPES_PATTERN = `/^(${VALIDATED_TYPES.join('|')})$/`;
const RENAME_MESSAGE =
  'Planskissdata och PlanskissReadResult får inte byta namn vid import eller export, eftersom förbudet mot as bygger på namnet (F8).';
const FORBIDDEN_PLANSKISSDATA_CAST = [
  {
    // Nedärvande: fångar också Planskissdata[], Array<Planskissdata>, S.Planskissdata och
    // PlanskissReadResult var som helst i typen efter as.
    selector: `TSAsExpression > .typeAnnotation Identifier[name=${VALIDATED_TYPES_PATTERN}]`,
    message:
      'Skissdata blir Planskissdata bara genom readPlanskiss eller planskissSchema, aldrig med as (F8, ADR 0012 avsnitt 6).',
  },
  {
    selector: `TSTypeAssertion > .typeAnnotation Identifier[name=${VALIDATED_TYPES_PATTERN}]`,
    message:
      'Skissdata blir Planskissdata bara genom readPlanskiss eller planskissSchema, aldrig med en typomvandling (F8, ADR 0012 avsnitt 6).',
  },
  {
    // Ett annat namn vid import skulle gå förbi selektorerna ovan.
    selector: `ImportSpecifier[imported.name=${VALIDATED_TYPES_PATTERN}]:not([local.name=${VALIDATED_TYPES_PATTERN}])`,
    message: RENAME_MESSAGE,
  },
  {
    selector: `ExportSpecifier[local.name=${VALIDATED_TYPES_PATTERN}]:not([exported.name=${VALIDATED_TYPES_PATTERN}])`,
    message: RENAME_MESSAGE,
  },
];

/**
 * Importer som kan skapa element utan JSX och därmed gå förbi vitlistan (F9). Namnen spärras
 * också när de importeras under ett annat namn. Den inbyggda banken får inte heller importeras
 * här, eftersom den här listan ersätter den allmänna regeln för src/planskiss/.
 */
const FORBIDDEN_IMPORTS_IN_RENDERER = {
  paths: [
    FORBIDDEN_BANK_MODULE,
    {
      name: 'react',
      importNames: ['createElement', 'cloneElement', 'createFactory'],
      message: 'Ritmotorn skapar element bara med JSX, så att vitlistan gäller (S-07, F9).',
    },
    {
      name: 'react/jsx-runtime',
      message: 'jsx och jsxs skapar element utan JSX och går förbi vitlistan (S-07, F9).',
    },
    {
      name: 'react/jsx-dev-runtime',
      message: 'jsxDEV skapar element utan JSX och går förbi vitlistan (S-07, F9).',
    },
    {
      name: 'react-dom',
      message:
        'Ritmotorn ritar bara SVG och behöver varken createPortal eller DOM-API:er (S-07, F9).',
    },
  ],
  patterns: [
    {
      group: ['react-dom/*'],
      message: 'Ritmotorn ritar bara SVG och behöver inga DOM-API:er (S-07, F9).',
    },
  ],
};

/**
 * Ritmotorns `Planskiss` får bara användas av `Planskissvy.tsx`, som bara låter utfallet
 * `giltig` av `readPlanskiss` nå den och lägger varje skiss i en felgräns (RK-1, R3).
 */
const PLANSKISS_ONLY_IN_VIEW = {
  group: ['**/planskiss', '**/planskiss/index.ts', '**/planskiss/Planskiss.tsx'],
  importNames: ['Planskiss'],
  message:
    'Planskiss används bara i src/app/planskiss/Planskissvy.tsx, som visar platshållarna och lägger skissen i en felgräns (RK-1, R3). Använd Planskissvy.',
};

/** Importer som skapar element eller DOM utan JSX och går förbi Reacts skydd (R3, RK-8). */
const FORBIDDEN_DOM_IMPORTS_IN_APP = [
  FORBIDDEN_BANK_MODULE,
  {
    name: 'react',
    importNames: ['createElement', 'cloneElement', 'createFactory'],
    message: 'Appen skapar element bara med JSX (S-07, R3).',
  },
  {
    name: 'react/jsx-runtime',
    message: 'jsx och jsxs skapar element utan JSX (S-07, R3).',
  },
  {
    name: 'react/jsx-dev-runtime',
    message: 'jsxDEV skapar element utan JSX (S-07, R3).',
  },
  {
    name: 'react-dom',
    importNames: ['createPortal'],
    message: 'createPortal flyttar innehåll ut ur sin felgräns och sin plats i DOM:en (R3).',
  },
];

/**
 * Namn som skriver markup eller attribut direkt i DOM:en (S-07, R3, N3). De spärras som
 * egenskap, som nyckel i ett objekt (till exempel i Object.assign) och som sträng, eftersom
 * en sträng är det som når dem via el['innerHTML'] eller Object.defineProperty.
 */
const MARKUP_NAMES = exactly([
  'innerHTML',
  'outerHTML',
  'insertAdjacentHTML',
  'setAttribute',
  'setAttributeNS',
  'srcdoc',
]);
const MARKUP_MESSAGE =
  'innerHTML, outerHTML, insertAdjacentHTML, setAttribute, setAttributeNS och srcdoc är förbjudna i appen, också som nyckel eller sträng (S-07, R3, N3).';

/** Namn som skriver till dokumentet eller når det via en nod (N3). */
const DOCUMENT_WRITE_NAMES = exactly(['write', 'writeln', 'execCommand', 'ownerDocument']);
const DOCUMENT_WRITE_MESSAGE =
  'write, writeln, execCommand och ownerDocument skriver förbi React eller når dokumentet via en nod (N3).';

/** Attribut som laddar en resurs eller skickar ett formulär och därför bara får vara text (N3). */
const URL_ATTRIBUTES = exactly(['href', 'src', 'action', 'xlinkHref']);

/** Element som laddar eller kör innehåll utanför Reacts kontroll (N3). */
const FORBIDDEN_ELEMENTS = ['iframe', 'frame', 'object', 'embed', 'script', 'base'];

/** Globaler som ger vägar förbi lintningen: hela dokumentet, reflektion och serialisering (N3). */
const FORBIDDEN_GLOBALS_IN_APP = [
  {
    name: 'XMLSerializer',
    message: 'XMLSerializer gör DOM till markup utanför Reacts kontroll (R3, RK-8).',
  },
  {
    name: 'Reflect',
    message: 'Reflect når egenskaper med namn som sträng, förbi förbuden mot innerHTML (N3).',
  },
  {
    name: 'document',
    message:
      'document ger hela DOM:en. Bara src/app/main.tsx och testerna får använda det (N3, R3).',
  },
];

/**
 * `ref` i appen får bara vara `focusOnMount` ur `useFocusOnMount()` (säkerhetsgranskningen av
 * inkrement 2b). Hooken ger en callback-ref som bara anropar focus(), så komponenten får aldrig
 * tag i DOM-noden. Ett RefObject, en inline-funktion eller en ref från props släpps inte igenom.
 */
/**
 * Hooken under ett annat namn, en egen definition av den eller ett värde ur den som inte är ett
 * anrop. Gäller överallt utom i hookfilen.
 */
const HOOK_NAME_RULE = {
  selector:
    "Identifier[name='useFocusOnMount']:not(ImportSpecifier > Identifier, CallExpression > Identifier.callee)",
  message:
    'useFocusOnMount får bara importeras under sitt eget namn och anropas. Den definieras bara i src/app/fokus/useFocusOnMount.ts (säkerhetsgranskningen av inkrement 2b).',
};

const FOCUS_ON_MOUNT_RULES = [
  {
    selector:
      "JSXAttribute[name.name='ref']:not([value.type='JSXExpressionContainer'][value.expression.type='Identifier'][value.expression.name='focusOnMount'])",
    message:
      'ref får bara vara ref={focusOnMount}, med focusOnMount ur useFocusOnMount() (R3, säkerhetsgranskningen av inkrement 2b).',
  },
  {
    // Namnet focusOnMount får bara bindas med const focusOnMount = useFocusOnMount() och bara
    // läsas som värdet i ref={focusOnMount}: inte ur props, inte i en tilldelning, inte som
    // parameter eller nyckel och inte under ett annat namn.
    selector:
      "Identifier[name='focusOnMount']:not(VariableDeclaration[kind='const'] > VariableDeclarator[init.type='CallExpression'][init.callee.type='Identifier'][init.callee.name='useFocusOnMount'][init.arguments.length=0] > Identifier.id, JSXAttribute[name.name='ref'] > JSXExpressionContainer > Identifier.expression)",
    message:
      'focusOnMount får bara komma från const focusOnMount = useFocusOnMount() och bara användas som ref={focusOnMount} (säkerhetsgranskningen av inkrement 2b).',
  },
  HOOK_NAME_RULE,
  {
    selector:
      "ImportSpecifier[imported.name='useFocusOnMount']:not([local.name='useFocusOnMount'])",
    message:
      'useFocusOnMount får inte byta namn vid import (säkerhetsgranskningen av inkrement 2b).',
  },
  {
    selector:
      "ImportDeclaration:not([source.value=/^(\\.\\/|(\\.\\.\\/)+(app\\/)?fokus\\/)useFocusOnMount(\\.ts)?$/]) > ImportSpecifier[imported.name='useFocusOnMount']",
    message:
      'useFocusOnMount importeras bara från src/app/fokus/useFocusOnMount.ts (säkerhetsgranskningen av inkrement 2b).',
  },
  {
    // {...{ ref: x }} och { ref } i ett objekt går annars förbi förbudet mot JSX-attributet (F1).
    selector: "Property:matches([key.name='ref'], [key.value='ref'])",
    message:
      'ref som egenskap i ett objekt går förbi förbudet mot ref i JSX (F1). Byt namn på fältet, till exempel till place.',
  },
];

/**
 * Det som ger direkt åtkomst till DOM:en i appen (säkerhetsgranskningen av ritmotorn, R3, och
 * av inkrement 2b, F1 och N3). Samma förbud som i ritmotorn, så att skissens text inte kan nå
 * innerHTML eller ett attribut via appen, till exempel i utskriften (RK-8). Gäller också
 * testerna. Förbudet mot globalerna i FORBIDDEN_GLOBALS_IN_APP gäller allt utom main.tsx och
 * testerna.
 */
const FORBIDDEN_DOM_SYNTAX_IN_APP = [
  ...FOCUS_ON_MOUNT_RULES,
  {
    selector: `MemberExpression[property.name=${MARKUP_NAMES}]`,
    message: MARKUP_MESSAGE,
  },
  {
    selector: `Property[key.name=${MARKUP_NAMES}]`,
    message: MARKUP_MESSAGE,
  },
  {
    // Strängen var den än står: el['innerHTML'], { 'innerHTML': x }, Reflect.set(el, 'innerHTML')
    // eller Object.defineProperty(el, 'innerHTML').
    selector: `Literal[value=${MARKUP_NAMES}]`,
    message: MARKUP_MESSAGE,
  },
  {
    selector: `TemplateLiteral[expressions.length=0] > TemplateElement[value.cooked=${MARKUP_NAMES}]`,
    message: MARKUP_MESSAGE,
  },
  {
    selector: `MemberExpression[property.name=${DOCUMENT_WRITE_NAMES}]`,
    message: DOCUMENT_WRITE_MESSAGE,
  },
  {
    selector: `MemberExpression[computed=true][property.value=${DOCUMENT_WRITE_NAMES}]`,
    message: DOCUMENT_WRITE_MESSAGE,
  },
  {
    selector: `MemberExpression[computed=true] > TemplateLiteral.property[expressions.length=0] > TemplateElement[value.cooked=${DOCUMENT_WRITE_NAMES}]`,
    message: DOCUMENT_WRITE_MESSAGE,
  },
  {
    selector: `Property[key.name=${DOCUMENT_WRITE_NAMES}], Property[key.value=${DOCUMENT_WRITE_NAMES}]`,
    message: DOCUMENT_WRITE_MESSAGE,
  },
  {
    selector: 'JSXAttribute[name.name=/^(srcDoc|srcdoc|formAction|formaction)$/]',
    message: 'srcDoc och formAction är förbjudna i appen (N3).',
  },
  {
    selector: `JSXAttribute[name.name=${URL_ATTRIBUTES}][value.type='JSXExpressionContainer']`,
    message:
      'href, src, action och xlinkHref får bara vara text i appen, aldrig ett uttryck, så att javascript:-adresser inte kan nå dem (N3).',
  },
  {
    selector: "JSXAttribute[name.type='JSXNamespacedName']",
    message: 'Attribut med namnrymd, till exempel xlink:href, är förbjudna i appen (N3).',
  },
  {
    selector: `JSXOpeningElement[name.name=${exactly(FORBIDDEN_ELEMENTS)}]`,
    message: `Elementen ${FORBIDDEN_ELEMENTS.join(', ')} laddar eller kör innehåll utanför Reacts kontroll och är förbjudna i appen (N3).`,
  },
  {
    // window.document, globalThis.Reflect och liknande går annars förbi no-restricted-globals.
    selector: 'MemberExpression[property.name=/^(XMLSerializer|Reflect|document)$/]',
    message:
      'document, Reflect och XMLSerializer är förbjudna i appen, också via window eller globalThis (N3).',
  },
  {
    selector:
      'CallExpression[callee.property.name=/^(createElement|createElementNS|cloneElement|createPortal)$/]',
    message:
      'createElement, cloneElement och createPortal går förbi JSX och felgränsen. Skriv JSX (S-07, R3).',
  },
  {
    selector:
      'CallExpression[callee.name=/^(createElement|createElementNS|cloneElement|createPortal)$/]',
    message:
      'createElement, cloneElement och createPortal går förbi JSX och felgränsen. Skriv JSX (S-07, R3).',
  },
  {
    selector: "NewExpression[callee.name='XMLSerializer']",
    message: 'XMLSerializer gör DOM till markup utanför Reacts kontroll (R3, RK-8).',
  },
  {
    selector: "JSXAttribute[name.name='style'][value.type='JSXExpressionContainer']",
    message:
      'style med ett uttryck kan bära data som CSS. Använd en klass i en CSS-modul (RK-5, R3).',
  },
];

/**
 * I hookfilen får noden bara få focus() anropat (säkerhetsgranskningen av inkrement 2b). Inga
 * andra anrop än useCallback och focus, och ingen annan egenskap än focus.
 */
const FOCUS_HOOK_FILE_RULES = [
  {
    selector: "MemberExpression:not([property.name='focus'])",
    message:
      'I useFocusOnMount.ts får noden bara få focus() anropat (säkerhetsgranskningen av inkrement 2b).',
  },
  {
    selector:
      "CallExpression:not([callee.type='MemberExpression'][callee.property.name='focus']):not([callee.type='Identifier'][callee.name='useCallback'])",
    message:
      'I useFocusOnMount.ts får bara useCallback och focus() anropas (säkerhetsgranskningen av inkrement 2b).',
  },
];

/** Testfilerna i appen, som får använda document (FORBIDDEN_GLOBALS_IN_APP). */
const APP_TEST_FILES = ['src/app/**/*.test.{ts,tsx}', 'src/app/**/__testdata__/**'];

/**
 * Namn som börjar med versal, som React tolkar som en komponent när det står först i en
 * JSX-tagg. Också namn med bara versaler, som TAG (R4).
 */
const PASCAL_CASE = '/^[A-Z]/';
const PASCAL_BINDING_MESSAGE =
  'Ett namn med versal kan användas som JSX-tagg och välja element under körning, förbi vitlistan. Ge variabeln ett namn med gemen, eller skriv en komponent som funktion (S-07, F9).';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // S-07: innehåll från ledare får aldrig nå innerHTML.
      'react/no-danger': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML är förbjudet i hela projektet (S-07, ADR 0001).',
        },
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['src/regelmotor/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-imports': ['error', FORBIDDEN_IMPORTS_IN_ENGINE],
      'no-restricted-properties': ['error', ...FORBIDDEN_RANDOMNESS],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'Webbläsar-API:er är förbjudna i regelmotorn (ADR 0001).' },
        { name: 'document', message: 'Webbläsar-API:er är förbjudna i regelmotorn (ADR 0001).' },
        { name: 'navigator', message: 'Webbläsar-API:er är förbjudna i regelmotorn (ADR 0001).' },
        {
          name: 'localStorage',
          message: 'Webbläsar-API:er är förbjudna i regelmotorn (ADR 0001).',
        },
        { name: 'fetch', message: 'Regelmotorn hämtar aldrig något (ADR 0011).' },
        { name: 'crypto', message: 'Slump utanför fröet är förbjuden (ADR 0011).' },
        { name: 'performance', message: 'Slump utanför fröet är förbjuden (ADR 0011).' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'new Date() utan argument gör passet beroende av tidpunkten (ADR 0011).',
        },
        {
          selector: "MemberExpression[property.name='localeCompare']",
          message: 'localeCompare sorterar olika i olika miljöer. Jämför med < på id (ADR 0011).',
        },
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
    },
  },

  {
    // Alla utom src/data/bank.ts. Regelmotorn har sin egen lista ovan, som redan innehåller
    // modulen, och skulle annars få den här regeln i stället för sin egen.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/data/bank.ts', 'src/regelmotor/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { paths: [FORBIDDEN_BANK_MODULE] }],
    },
  },

  {
    files: ['src/planskiss/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // Små bokstäver är element i DOM:en. Komponenter (stor bokstav) prövas där de skrivs.
          selector: `JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]:not([name.name=${exactly(ALLOWED_SVG_ELEMENTS)}])`,
          message: `Ritmotorn får bara skapa den slutna listan av SVG-element i ADR 0012 avsnitt 6 (S-07, F9): ${ALLOWED_SVG_ELEMENTS.join(', ')}.`,
        },
        {
          // Vitlista för attributen på element (R4). Komponenter prövas där de skrivs.
          selector: `JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/] > JSXAttribute[name.type='JSXIdentifier']:not([name.name=${exactly(ALLOWED_ATTRIBUTE_NAMES)}])`,
          message: `Ritmotorn får bara sätta attributen i vitlistan i src/planskiss/vitlista.ts (S-07, F9, R4): ${ALLOWED_ATTRIBUTE_NAMES.join(', ')}. Ett nytt attribut läggs till där och i ALLOWED_ATTRIBUTES i sakerhet.test.tsx.`,
        },
        {
          selector: 'JSXOpeningElement[name.type=/^JSX(NamespacedName|MemberExpression)$/]',
          message:
            'Ritmotorn får bara skapa elementen i ADR 0012 avsnitt 6, inte element med namnrymd eller via ett objekt (S-07, F9).',
        },
        {
          selector: `JSXAttribute[name.name=/^(${FORBIDDEN_SVG_ATTRIBUTES.join('|')})$/]`,
          message: `Attributen ${FORBIDDEN_SVG_ATTRIBUTES.join(', ')} är förbjudna i ritmotorn (S-07, S-17, F9, RK-5).`,
        },
        {
          selector: 'JSXAttribute[name.name=/^on/]',
          message:
            'Händelseattribut (on…) är förbjudna i ritmotorn. Skissen är en ren bild (S-07, F9).',
        },
        {
          selector: 'JSXAttribute[name.type="JSXNamespacedName"]',
          message:
            'Attribut med namnrymd, till exempel xlink:href, är förbjudna i ritmotorn (S-07, F9).',
        },
        {
          selector: 'JSXSpreadAttribute',
          message:
            'Spridda attribut ({...props}) går förbi attributkontrollen. Skriv ut varje attribut (S-07, F9).',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(createElement|createElementNS|cloneElement)$/]',
          message:
            'createElement och cloneElement kan skapa godtyckliga element och går förbi vitlistan. Skriv JSX (S-07, F9).',
        },
        {
          selector: 'CallExpression[callee.name=/^(createElement|createElementNS|cloneElement)$/]',
          message:
            'createElement och cloneElement kan skapa godtyckliga element och går förbi vitlistan. Skriv JSX (S-07, F9).',
        },
        {
          selector: "JSXAttribute[name.name='ref']",
          message:
            'ref ger åtkomst till DOM-noden och därmed till innerHTML och setAttribute. Ritmotorn behöver det inte (S-07, F9).',
        },
        {
          selector:
            'MemberExpression[property.name=/^(innerHTML|outerHTML|insertAdjacentHTML|setAttribute|setAttributeNS)$/]',
          message:
            'innerHTML, outerHTML, insertAdjacentHTML, setAttribute och setAttributeNS är förbjudna i ritmotorn (S-07, F9).',
        },
        {
          selector:
            'MemberExpression[computed=true][property.value=/^(innerHTML|outerHTML|insertAdjacentHTML|setAttribute|setAttributeNS)$/]',
          message:
            'innerHTML, outerHTML, insertAdjacentHTML, setAttribute och setAttributeNS är förbjudna i ritmotorn (S-07, F9).',
        },
        {
          // const Tag = 'script', const TAG = 'script' eller let Tag (R4). En komponent skrivs
          // som funktion. Undantagna är konstanter som inte kan vara en sträng: funktioner,
          // objekt och listor, också med as const, new Set, Map, RegExp och Proxy, tal och reguljära uttryck i klartext, och konstanter som är
          // typade som tal eller sanningsvärde.
          selector: `VariableDeclarator[id.name=${PASCAL_CASE}]:not([init.type=/^(ArrowFunctionExpression|FunctionExpression|ObjectExpression|ArrayExpression)$/], [init.type=/^TS(As|Satisfies)Expression$/][init.expression.type=/^(ObjectExpression|ArrayExpression)$/], [init.type='NewExpression'][init.callee.name=/^(Set|Map|WeakMap|WeakSet|RegExp|Proxy)$/], [init.value=type(number)], [init.value=type(boolean)], [init.regex], [id.typeAnnotation.typeAnnotation.type=/^(TSNumberKeyword|TSBooleanKeyword)$/])`,
          message: PASCAL_BINDING_MESSAGE,
        },
        {
          // Bara bindningar, aldrig typannoteringar: const { Tag } = props, const [Tag] = lista,
          // function Skiss({ as: Tag }), function Skiss(Tag) och standardvärden som { as: Tag = 'g' }.
          selector: `:matches(VariableDeclarator, :function) :matches(ObjectPattern > Property > Identifier.value, ObjectPattern > Property > AssignmentPattern > Identifier.left, ArrayPattern > Identifier, RestElement > Identifier.argument)[name=${PASCAL_CASE}]`,
          message: PASCAL_BINDING_MESSAGE,
        },
        {
          selector: `:matches(:function > Identifier.params, :function > AssignmentPattern > Identifier.left)[name=${PASCAL_CASE}]`,
          message: PASCAL_BINDING_MESSAGE,
        },
        {
          selector: `AssignmentExpression[left.name=${PASCAL_CASE}]`,
          message: PASCAL_BINDING_MESSAGE,
        },
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
      'no-restricted-imports': ['error', FORBIDDEN_IMPORTS_IN_RENDERER],
    },
  },

  {
    // Appen visar skissen. Samma DOM-förbud som i ritmotorn, och Planskiss bara i
    // Planskissvy.tsx (säkerhetsgranskningen av ritmotorn, R3).
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML är förbjudet i hela projektet (S-07, ADR 0001).',
        },
        ...FORBIDDEN_DOM_SYNTAX_IN_APP,
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
      'no-restricted-globals': ['error', ...FORBIDDEN_GLOBALS_IN_APP],
      'no-restricted-imports': [
        'error',
        { paths: FORBIDDEN_DOM_IMPORTS_IN_APP, patterns: [PLANSKISS_ONLY_IN_VIEW] },
      ],
    },
  },

  {
    // main.tsx monterar appen i #root, och testerna läser fokus och DOM:en. Bara document
    // släpps; Reflect och XMLSerializer är förbjudna också här (N3).
    files: ['src/app/main.tsx', ...APP_TEST_FILES],
    rules: {
      'no-restricted-globals': [
        'error',
        ...FORBIDDEN_GLOBALS_IN_APP.filter((item) => item.name !== 'document'),
      ],
    },
  },

  {
    // Den enda filen som definierar useFocusOnMount, och där får noden bara få focus()
    // anropat (säkerhetsgranskningen av inkrement 2b).
    files: ['src/app/fokus/useFocusOnMount.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML är förbjudet i hela projektet (S-07, ADR 0001).',
        },
        ...FORBIDDEN_DOM_SYNTAX_IN_APP.filter((rule) => rule !== HOOK_NAME_RULE),
        ...FOCUS_HOOK_FILE_RULES,
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
    },
  },

  {
    // Den enda filen i appen som får rita med Planskiss (RK-1, R3).
    files: ['src/app/planskiss/Planskissvy.tsx'],
    rules: {
      'no-restricted-imports': ['error', { paths: FORBIDDEN_DOM_IMPORTS_IN_APP }],
    },
  },

  {
    // Typad lint där skissdata tas emot, visas och ritas (F8, R3). no-unsafe-* hindrar att ett
    // värde av typen any, till exempel ur JSON.parse eller en databasrad, blir Planskissdata
    // utan readPlanskiss. Bara de här mapparna, så att resten av lintningen förblir snabb.
    files: ['src/planskiss/**/*.{ts,tsx}', 'src/data/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
    },
  },

  {
    files: ['scripts/**/*.ts', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
);
