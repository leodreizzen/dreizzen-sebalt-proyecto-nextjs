import {colors, nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(accordion|badge|button|card|chip|divider|dropdown|image|link|navbar|ripple|spinner|menu|popover).js",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|badge|button|card|chip|dropdown|image|link|navbar|divider|ripple|spinner|menu|popover).js"

],
  theme: {
    extend: {
      colors: {
        "foreground": "white",
        "background": "#10101E",
        "primary": "blue",
        "secondary": "green",
        "content1": "#2E305E",
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
    },
  },
  plugins: [nextui()],
};
export default config;
