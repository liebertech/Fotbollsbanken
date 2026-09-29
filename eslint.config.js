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
const FORBIDDEN_PLANSKISSDATA_CAST = [
  {
    selector: "TSAsExpression > TSTypeReference[typeName.name='Planskissdata']",
    message:
      'Skissdata blir Planskissdata bara genom readPlanskiss eller planskissSchema, aldrig med as (F8, ADR 0012 avsnitt 6).',
  },
  {
    selector: "TSTypeAssertion > TSTypeReference[typeName.name='Planskissdata']",
    message:
      'Skissdata blir Planskissdata bara genom readPlanskiss eller planskissSchema, aldrig med en typomvandling (F8, ADR 0012 avsnitt 6).',
  },
];

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
        ...FORBIDDEN_PLANSKISSDATA_CAST,
      ],
    },
  },

  {
    files: ['scripts/**/*.ts', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
);
