module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/essential'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': 'off',
    'vue/no-use-v-if-with-v-for': ['error', {
      'allowUsingIterationVar': true
    }],
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 'off',
    'vue/attributes-order': 'off',
    'vue/v-on-style': 'off',
    'vue/name-property-casing': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'vue/order-in-components': 'off',
    'vue/html-indent': 'off',
    'vue/require-prop-types': 'off',
    'vue/attribute-hyphenation': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
