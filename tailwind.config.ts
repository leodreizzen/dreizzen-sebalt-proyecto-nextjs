import {colors, nextui} from '@nextui-org/theme';
import type {Config} from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries"
import animatePlugin from "tailwindcss-animate";

const config: Config = {
    content:
        ["./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
            "./node_modules/@nextui-org/theme/dist/components/(accordion|autocomplete|badge|button|card|checkbox|chip|date-input|divider|dropdown|image|input|link|modal|navbar|radio|slider|toggle|popover|ripple|spinner|listbox|scroll-shadow|menu).js"
        ],
    theme: {
        extend: {
            colors: {
                "foreground": "white",
                "background": "#10101E",
                "primary": "blue",
                "secondary": "green",
                "content1": "#222344",
                "navbar-bg": "black",
                "navbar-border": "#303030",
                "borders": "#334155",
            },
            textColor: {
                primary: "blue",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            screens: {
                "xs": "360px",
                "2xs": "320px"
            },
            containers: {
                "2xs": "16rem"
            },
            animation: {
                marqueeX: "marqueeXA 10s linear infinite",
                marqueeX2: "marqueeXB 10s linear infinite",

                marqueeSlowX: "marqueeXA 40s linear infinite",
                marqueeSlowX2: "marqueeXB 40s linear infinite",

                marqueeY: "marqueeYA 10s linear infinite",
                marqueeY2: "marqueeYB 10s linear infinite",
            },
            keyframes: {
                marqueeXA: {
                    "0%": {transform: "translateX(0%)"},
                    "100%": {transform: "translateX(-100%)"}
                },
                marqueeXB: {
                    "0%": {transform: "translateX(100%)"},
                    "100%": {transform: "translateX(0%)"}
                },

                marqueeYA: {
                    "0%": {transform: "translateY(0%)"},
                    "100%": {transform: "translateY(-100%)"}
                },
                marqueeYB: {
                    "0%": {transform: "translateY(100%)"},
                    "100%": {transform: "translateY(0%)"}
                }
            }

        },
    },
    darkMode: "selector",
    plugins: [nextui(), containerQueries, animatePlugin],
};
export default config;