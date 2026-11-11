import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['assets/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.browser },
  },
  {
    files: ['scripts/**/*.mjs', 'data/**/*.mjs', '*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.node },
  },
];
