/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              'app',
              'config',
              'database',
              'entities',
              'modules',
              'repositories',
              'trpc',
              'utils',
            ].flatMap((path) => [`@server/${path}`, `@mono/server/src/${path}`]),
            message: 'Please only import from @server/shared or @mono/server/src/shared.',
          },
        ],
      },
    ],
  },
}
