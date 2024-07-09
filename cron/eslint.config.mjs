import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		rules: {
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
		}
	},
);
