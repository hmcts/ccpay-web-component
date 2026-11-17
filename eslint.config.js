const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'dist/**', 'out-tsc/**', 'coverage/**', '.angular/**', '.yarn/**',
      '**/*.d.ts', 'src/main/public/**', 'src/main/types/**',
      'jest.*config.js', 'src/test/*/codecept.conf.js', 'src/test/config.ts',
      '**/*.js', '.pnp.*'
    ]
  },
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.jasmine }
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript checks declarations and references, including type-only names.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
];
