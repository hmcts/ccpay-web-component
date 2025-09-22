// .eslintrc.js
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-require-imports": "off"
  },
  "overrides": [
    {
      "files": ["src/assets/**/*.js"],
      "rules": {
        "@typescript-eslint/no-unused-expressions": "off"
      }
    }
  ]
}
