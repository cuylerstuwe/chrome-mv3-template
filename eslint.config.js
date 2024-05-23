const eslintPluginPrettier = require("eslint-plugin-prettier");
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
	{
		files: ["*/**/*.js", "*/**/*.jsx"],
		plugins: {
			"prettier": eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
	{
		files: ["*/**/*.ts", "*/**/*.tsx"],
		languageOptions: {
			parser: tsParser,
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
			"prettier": eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
];
