import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        fetch: true,
        // ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: [
      '*.js',
      '*.config.{js,ts}',
      'packages/*/*.{js,ts,mjs,mts}',
      'tasks/*.js',
      'packages/*/bin/*.js',
      'packages/*/src/stories/**/*.ts',
      'packages/*/.storybook/*.ts',
      'packages/*/testResources/**/*',
    ],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Test-specific rules
    files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
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
);
