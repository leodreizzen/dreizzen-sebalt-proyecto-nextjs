import {colors, nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
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
        "background": "#101010",
        "primary": "blue",
        "secondary": "green",
        "content1": "#171717",
        "navbar-bg": "black",
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
