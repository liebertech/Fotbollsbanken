// ESLint, flat config. Reglerna nedan följer ADR 0001 (kodkvalitet och kodstruktur),
// ADR 0011 (förbjudna slumpkällor i regelmotorn) och ADR 0012 (SVG-element i planskissen).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

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
 * De enda element som ritmotorn får skapa: den slutna listan i ADR 0012 avsnitt 6 (S-07).
 * Regeln är en vitlista, så ett element som inte står här underkänns även om ingen har tänkt
 * på det (säkerhetsgranskningen av schemat, F9).
 */
const ALLOWED_SVG_ELEMENTS = [
  'svg',
  'title',
  'desc',
  'defs',
  'pattern',
  'g',
  'rect',
  'circle',
  'polygon',
  'line',
  'path',
  'text',
  'tspan',
];

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
 * Det som ger direkt åtkomst till DOM:en i appen (säkerhetsgranskningen av ritmotorn, R3).
 * Samma förbud som i ritmotorn, så att skissens text inte kan nå innerHTML eller ett attribut
 * via appen, till exempel i utskriften (RK-8).
 */
const FORBIDDEN_DOM_SYNTAX_IN_APP = [
  {
    selector: "JSXAttribute[name.name='ref']",
    message:
      'ref ger åtkomst till DOM-noden och därmed till innerHTML och setAttribute. Behövs det, ta upp det med säkerhetsagenten (R3).',
  },
  {
    selector:
      'MemberExpression[property.name=/^(innerHTML|outerHTML|insertAdjacentHTML|setAttribute|setAttributeNS)$/]',
    message:
      'innerHTML, outerHTML, insertAdjacentHTML, setAttribute och setAttributeNS är förbjudna i appen (S-07, R3).',
  },
  {
    selector:
      'MemberExpression[computed=true][property.value=/^(innerHTML|outerHTML|insertAdjacentHTML|setAttribute|setAttributeNS)$/]',
    message:
      'innerHTML, outerHTML, insertAdjacentHTML, setAttribute och setAttributeNS är förbjudna i appen (S-07, R3).',
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

/** Namn i PascalCase, som React tolkar som en komponent när det står först i en JSX-tagg. */
const PASCAL_CASE = '/^[A-Z][a-z]/';
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
          selector: `JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]:not([name.name=/^(${ALLOWED_SVG_ELEMENTS.join('|')})$/])`,
          message: `Ritmotorn får bara skapa den slutna listan av SVG-element i ADR 0012 avsnitt 6 (S-07, F9): ${ALLOWED_SVG_ELEMENTS.join(', ')}.`,
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
          // const Tag = 'script' eller let Tag. En komponent skrivs som funktion.
          selector: `VariableDeclarator[id.name=${PASCAL_CASE}]:not([init.type=/^(ArrowFunctionExpression|FunctionExpression)$/])`,
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
      'no-restricted-globals': [
        'error',
        {
          name: 'XMLSerializer',
          message: 'XMLSerializer gör DOM till markup utanför Reacts kontroll (R3, RK-8).',
        },
      ],
      'no-restricted-imports': [
        'error',
        { paths: FORBIDDEN_DOM_IMPORTS_IN_APP, patterns: [PLANSKISS_ONLY_IN_VIEW] },
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
