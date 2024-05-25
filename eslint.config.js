const eslintPluginPrettier = require("eslint-plugin-prettier");
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const noRelativeImportPaths = require("eslint-plugin-no-relative-import-paths");

module.exports = [
	{
		files: ["*/**/*.js", "*/**/*.jsx"],
		plugins: {
			"prettier": eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": "error",
			"sort-imports": "error",
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
			"no-relative-import-paths": noRelativeImportPaths,
		},
		rules: {
			"prettier/prettier": "error",
			"sort-imports": ["error", {
				ignoreDeclarationSort: true,
			}],
			"no-relative-import-paths/no-relative-import-paths": ["error", {
				allowSameFolder: true,
				rootDir: "src",
				prefix: "",
			}],
		},
	},
];
