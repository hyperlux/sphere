import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';
import globals from 'globals';

export default tseslint.config(
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
      },
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      // Add or override rules here
    },
  }
);
