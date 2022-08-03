module.exports = {
  env: {
    mocha: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [ '.js', '.ts', '.mjs' ],
      },
    },
  },
  overrides: [ {
    files: [ '*.js', '*.jsx', '*.mjs' ],
    extends: [
      'airbnb-base',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'array-bracket-spacing': [ 'warn', 'always' ],
      'arrow-body-style': 'warn',
      'arrow-parens': [ 'warn', 'always' ],
      'comma-dangle': [ 'warn', 'always-multiline' ],
      'import/extensions': [ 'error', 'always' ],
      'import/named': 'error',
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: [
            '**/test*/**',
            '**/build/**',
            '**/rollup.*.*',
            'scripts/**',
          ],
        },
      ],
      'import/prefer-default-export': 'off',
      indent: [
        'warn',
        2,
      ],
      'new-cap': 0,
      'no-cond-assign': [ 'error', 'except-parens' ],
      'no-multiple-empty-lines': [ 'warn', { max: 1, maxBOF: 0, maxEOF: 0 } ],
      'no-nested-ternary': 'off',
      'no-plusplus': 'off',
      'no-unexpected-multiline': 'error',
      semi: [ 'warn', 'never' ],
      'space-before-function-paren': [ 'warn', 'always' ],
    },
  }, {
    files: [ '*.ts', '*.tsx' ],
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      '@typescript-eslint/semi': [ 'warn', 'never' ],
      '@typescript-eslint/no-unused-vars': [ 'warn', {
        args: 'all',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: false,
        vars: 'all',
      } ],
    },
  } ],
}
