// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt(
	{
		rules: {
			// Vue/Nuxt specific rules
			"vue/multi-word-component-names": "warn",
			"vue/no-v-html": "warn",
			"vue/require-default-prop": "off",
			"vue/require-explicit-emits": "warn",
			"vue/component-name-in-template-casing": ["error", "PascalCase"],
			"vue/padding-line-between-blocks": "warn",

			// General JavaScript/TypeScript rules
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "warn",
			"prefer-const": "error",
			"no-var": "error",

			// Code quality
			eqeqeq: ["error", "always", { null: "ignore" }],
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		},
	},
	// Disable ESLint rules that conflict with Prettier
	eslintConfigPrettier
);
