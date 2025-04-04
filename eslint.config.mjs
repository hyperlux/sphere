import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';

export default tseslint.config(
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
