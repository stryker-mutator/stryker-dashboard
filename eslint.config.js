import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_*',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
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
    },
  },
  {
    ignores: [
      'node_modules',
      'packages/*/dist',
      'packages/website-frontend',
      'dist',
      '.stryker-tmp',
      'reports',
    ],
  },
];
