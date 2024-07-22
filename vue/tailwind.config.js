/* eslint-disable */
const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	safelist: ["dark"],
	prefix: "",

	content: [
		'./pages/**/*.{ts,tsx,vue}',
		'./components/**/*.{ts,tsx,vue}',
		'./app/**/*.{ts,tsx,vue}',
		'./src/**/*.{ts,tsx,vue}',
	],

	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			backgroundColor: {
				"glassmorphism": "rgba(255, 255, 255, 0.41)"
			},
			maxWidth: {
				"144": "36rem",
				"192": "48rem",
				"240": "60rem",
			},
			height: {
				"192": "48rem",
				"screen-nh": "calc(100vh - 6rem)", // screen - header
			},
			minHeight: {
				"screen-nh": "calc(100vh - 6rem)", // screen - header
				"screen-nhm-mobile": "calc(100vh - 6rem - 6rem)", // screen - header - margin
				"screen-nhm-desktop": "calc(100vh - 6rem - 8rem)", // screen - header - margin
			},
			aspectRatio:{
				portrait: "3 / 4",
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				invalide: "var(--invalide)",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				whiteless: "#F0F0F0",
			},
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				"inner-top-left": "inset 0 4px 2px -2px rgba(0, 0, 0, 0.10), inset 4px 0 2px -2px rgba(0, 0, 0, 0.10)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				"collapsible-down": {
					from: { height: 0 },
					to: { height: 'var(--radix-collapsible-content-height)' },
				},
				"collapsible-up": {
					from: { height: 'var(--radix-collapsible-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"collapsible-down": "collapsible-down 0.2s ease-in-out",
				"collapsible-up": "collapsible-up 0.2s ease-in-out",
			},
			backgroundImage: theme => ({
				'gold-gradient': 'linear-gradient(to bottom, white 70%, #FFD700 100%)',
				'silver-gradient': 'linear-gradient(to bottom, white 70%, #C0C0C0 100%)',
				'bronze-gradient': 'linear-gradient(to bottom, white 70%, #CD7F32 100%)',
				'copper-gradient': 'linear-gradient(to bottom, white 70%, #7a5735 100%)',
				'black-gradient': 'linear-gradient(to bottom, white 70%, #000 100%)',
			  }),
		},
	},
	plugins: [
		animate,
		require('@tailwindcss/typography'),
		function writingModePlugin({ addComponents, theme }) {
			addComponents({
			  ".vertical-writing": {
				writingMode: "vertical-rl",
			  },
			  ".inverted-vertical-writing": {
				writingMode: "vertical-lr",
			  },
			});
		  },
	],
}