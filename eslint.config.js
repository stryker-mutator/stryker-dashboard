import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
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
    languageOptions: {
      globals: {
        fetch: true,
        // ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules', 'packages/*/dist', 'packages/website-frontend'],
  },
];
