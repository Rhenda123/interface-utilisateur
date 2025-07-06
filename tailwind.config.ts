
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Couleurs officielles SKOOLIFE
				skoolife: {
					primary: '#FFD51C',    // Jaune principal
					light: '#FFF9E5',      // Jaune très clair
					secondary: '#F5B43C',  // Jaune-orange
					white: '#FFFFFF'       // Blanc
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'responsive-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
				'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
				'responsive-md': 'clamp(1rem, 3vw, 1.5rem)',
				'responsive-lg': 'clamp(1.5rem, 4vw, 2rem)',
				'responsive-xl': 'clamp(2rem, 5vw, 3rem)',
				'responsive-2xl': 'clamp(3rem, 6vw, 4rem)',
			},
			fontSize: {
				'responsive-xs': 'clamp(0.75rem, 2.5vw, 0.875rem)',
				'responsive-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
				'responsive-base': 'clamp(1rem, 2.5vw, 1.125rem)',
				'responsive-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
				'responsive-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
				'responsive-2xl': 'clamp(1.5rem, 4vw, 2rem)',
				'responsive-3xl': 'clamp(2rem, 5vw, 2.5rem)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
