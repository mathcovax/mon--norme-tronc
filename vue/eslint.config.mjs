import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import pluginVue from 'eslint-plugin-vue'

const rules = {
	"eol-last": ["error", "always"],
	"semi": ["error", "always"],
	"no-extra-semi": "error",
	"quotes": ["error", "double"],
	"indent": ["error", "tab"],
	"max-len": ["error", { "code": 120, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
	"@typescript-eslint/no-extraneous-class": "off",
	"object-curly-newline": [
		"error", 
		{
			"ObjectExpression": { 
				"consistent": true, 
				"multiline": true, 
				"minProperties": 4 
			}
		}
	],
	"object-curly-spacing": ["error", "always"],
	"array-bracket-newline": ["error", { "multiline": true, "minItems": 4 }],
	"array-bracket-spacing": ["error", "never"],
	"key-spacing": ["error", { "beforeColon": false }],
	"keyword-spacing": ["error", { "before": true, "after": true }], 
	"space-in-parens": ["error", "never"],
	"arrow-spacing": ["error", { "before": true, "after": true }],
	"space-before-blocks": ["error", "always"],
	"func-call-spacing": ["error", "never"],
	"@typescript-eslint/no-unused-vars": [
		"error",
		{
			"argsIgnorePattern": "^_",
			"caughtErrorsIgnorePattern": "^_",
			"destructuredArrayIgnorePattern": "^_",
			"varsIgnorePattern": "^_",
			"ignoreRestSiblings": true
		}
	]
};

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		files: ["src/**/*.ts"],
		rules
	},
	...pluginVue.configs["flat/strongly-recommended"],
	{
		files: ["src/**/*.vue"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				sourceType: "module",
			},
		},
		rules: {
			...rules,
			"vue/require-default-prop": "off",
			"vue/html-indent": ["error", "tab"],
			'no-undef': 'off',
			"max-len": "off",
			"vue/max-len": ["error", {
				"code": 120,
				"template": 1000
			}],
			"vue/padding-line-between-tags": ["error", [
				{ "blankLine": "always", "prev": "*", "next": "*" }
			]],
		},
	},
);