import eslint from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import { configs as litConfigs } from 'eslint-plugin-lit';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import { configs as wcConfigs } from 'eslint-plugin-wc';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';

export default config(
  eslint.configs.recommended,
  ...tsConfigs.recommendedTypeChecked,
  ...tsConfigs.stylisticTypeChecked,
  wcConfigs['flat/best-practice'],
  litConfigs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',

      'import-x/newline-after-import': 'error',
      'import-x/no-deprecated': 'error',
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      'wc/guard-super-call': 'off',
      'wc/no-method-prefixed-with-on': 'error',

      'lit/lifecycle-super': 'error',
      'lit/no-legacy-imports': 'error',
      'lit/no-this-assign-in-render': 'error',
      'lit/no-useless-template-literals': 'error',
      'lit/no-value-attribute': 'error',
      'lit/prefer-nothing': 'error',

      eqeqeq: 'error',
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
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      elementBaseClasses: ['LitElement', 'BaseElement'],
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
    ...tsConfigs.disableTypeChecked,
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
      '!.storybook',
    ],
  },
);
