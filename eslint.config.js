const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
	{
		files: ["src/**/*.js", "src/**/*.jsx"],
		rules: {
			"prettier/prettier": "error",
		},
	},
	{
		files: ["src/**/*.ts", "src/**/*.tsx"],
		plugins: {
			"@typescript-eslint": {
				parserOptions: {
					project: "./tsconfig.json",
				},
			},
			"eslint-plugin-prettier": {},
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
	eslintPluginPrettierRecommended,
];
