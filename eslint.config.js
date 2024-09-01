import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      globals: {
        fetch: true,
        // ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // Test-specific rules
    files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },
  {
    ignores: [
      'node_modules',
      'packages/*/dist',
      'dist',
      '.stryker-tmp',
      'packages/*/reports',
      'test-results',
      'playwright-report',
    ],
  },
];
