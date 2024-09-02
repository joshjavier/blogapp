module.exports = {
  root: true,
  env: {
    'browser': true,
    'es2020': true,
    'node': true,
    'vitest-globals/env': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@stylistic/recommended-extends',
    'plugin:vitest-globals/recommended',
    'plugin:cypress/recommended',
  ],
  ignorePatterns: ['dist'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react-refresh',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/multiline-ternary': 'off',
  },
}
