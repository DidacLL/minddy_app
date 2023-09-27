/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",],
    plugins: [require("daisyui"), require('@tailwindcss/forms')({
        strategy: 'class', // only generate classes
    }), plugin(function ({addUtilities}) {
        addUtilities({
            '.arrow-hide': {
                '&::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    'margin': 0
                },
                '&::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    'margin': 0
                },
            },

            '.container-snap &::-webkit-scrollbar': {
                'display': 'none'
            },
            '.container-snap': {
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none',
                'overflow': 'moz-scrollbars-none'
            },
            '.force-shadow-in': {
                'box-shadow': 'inset 0px 0.3em 0.1em 0px var(--primary-dark)!important',
            },
            '.right-shadow-in': {
                'box-shadow': 'inset -2px 0px 2px 0px var(--main-dark)!important',
            },
            '.left-shadow-in': {
                'box-shadow': 'inset 2px 0px 2px 0px var(--main-dark)!important',
            },
            '.center-shadow-in': {
                'box-shadow': "inset 0px 0px 4px 2px var(--main-dark)!important"
            },
            '.solid-shadow': {
                'box-shadow': '0.2em 0.2em 0 0.1em ',
            },
            '.btn-shadow': {
                'box-shadow': '0px 0.3em 0.1em 0px var(--primary-dark)',


                '&:hover': {
                    'box-shadow': '0px 0.2em 0.1em 0px var(--primary-dark)',
                    'background-color': 'var(--primary)'
                },
                '&:active': {
                    'box-shadow': 'inset 0px 0.3em 0.1em 0px var(--primary-dark)',
                    'background-color': 'var(--primary)'
                }
            },
            '.right-shadow': {
                'box-shadow': '0.3em 0.2em 0 0.5px var(--primary-dark)'
            },
            '.shadow-overlay': {
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    boxShadow: 'inset 0 10px 10px var(--main-dark)',
                    pointerEvents: 'none',
                },
            },


        })
    })],
    theme: {
        extend: {
            colors: {
                'tab-border-color': "var(--tab-border-color)",
                'primary-dark': "var(--primary-dark)",
                'primary-light': "var(--primary-light)",
                'main-dark': "var(--main-dark)",
                'main-grey': "var(--main-grey)",
                'main-light': "var(--main-light)",
                'uc-red': "var(--uc-red)",
                'uc-red-dark': "var(--uc-red-dark)",
                'uc-red-light': "var(--uc-red-light)",
                'uc-blue': "var(--uc-blue)",
                'uc-blue-light': "var(--uc-blue-light)",
                'uc-blue-dark': "var(--uc-blue-dark)",
                'uc-yellow': "var(--uc-yellow)",
                'uc-yellow-dark': "var(--uc-yellow-dark)",
                'uc-yellow-light': "var(--uc-yellow-light)",
                'uc-green': "var(--uc-green)",
                'uc-green-dark': "var(--uc-green-dark)",
                'uc-green-light': "var(--uc-green-light)",
                'uc-magenta': "var(--uc-magenta)",
                'uc-magenta-dark': "var(--uc-magenta-dark)",
                'uc-magenta-light': "var(--uc-magenta-light)",
                'uc-orange': "var(--uc-orange)",
                'uc-orange-light': "var(--uc-orange-light)",
                'uc-orange-dark': "var(--uc-orange-dark)",
            },
            boxShadow: {
                'inner-projected': 'inset 0 0 10px var(--main-dark)'
            }
        },
    },

    // // daisyUI config (optional - here are the default values)
    daisyui: {
        themes: [
            {
                minddy_light: {
                    "primary": "#8bb7b7",
                    //449696
                    "accent": "#37cdbe",
                    "neutral": "#79a89b",
                    '--primary-light': "#c0e8e2",
                    '--primary-dark': "rgba(89,137,227,0.38)",
                    "secondary": "#ffe798",
                    "base-100": "#ffffff",
                    '--main-dark': "#003232",
                    '--main-grey': "#cccccc",
                    '--main-light': "#ffffeb",
                    '--tab-border-color': "#ff0000",
                    "--rounded-box": "0.7rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--animation-btn": "0.25s", // duration of animation when you click on button
                    "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
                    "--btn-text-case": "uppercase", // set default text transform for buttons
                    "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
                    "--border-btn": "0", // border width of buttons
                    "--tab-border": "2px", // border width of tabs
                    // "--tab-border-color": "red", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs
                    "--uc-red-dark": "#8c2151",
                    "--uc-red": "#de4259",
                    "--uc-red-light": "#fc7599",

                    "--uc-blue-dark": "#36585d",
                    "--uc-blue": "#539d9d",
                    "--uc-blue-light": "#74cece",

                    "--uc-yellow-dark": "#b4985b",
                    "--uc-yellow": "#d5ba64",
                    "--uc-yellow-light": "#fdeaad",

                    "--uc-green-dark": "#2a492f",
                    "--uc-green": "#678d58",
                    "--uc-green-light": "#c1e59b",

                    "--uc-magenta-dark": "#353054",
                    "--uc-magenta": "#6e568f",
                    "--uc-magenta-light": "#bf9dd0",

                    "--uc-orange-dark": "#c24a1f",
                    "--uc-orange": "#d98d40",
                    "--uc-orange-light": "#e1bc5e",


                },
            }, {
                minddy_dark: {
                    '--primary-light': "#567373",
                    "primary": "#323f3f",
                    '--primary-dark': "rgba(29,44,61,0.9)",
                    //003232
                    // #8bb7b7
                    "accent": "#9eeab9",
                    "neutral": "#658a8c",
                    "secondary": "#88a1ab",
                    "base-100": "#445454",
                    // #2d3f3d
                    '--main-dark': "rgba(19,17,24,0.6)",
                    '--main-grey': "rgba(42,42,42,0.82)",
                    '--main-light': "#e6ffff",
                    "--rounded-box": "0.2rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.2rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--animation-btn": "0.2s", // duration of animation when you click on button
                    "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
                    "--btn-text-case": "camel-case", // set default text transform for buttons
                    "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
                    "--border-btn": "0", // border width of buttons
                    "--tab-border": "1px", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs
                    "--uc-red-dark": "#8c2151",
                    "--uc-red": "#de4259",
                    "--uc-red-light": "#fc7599",

                    "--uc-blue-dark": "#36585d",
                    "--uc-blue": "#539d9d",
                    "--uc-blue-light": "#74cece",

                    "--uc-yellow-dark": "#b4985b",
                    "--uc-yellow": "#d5ba64",
                    "--uc-yellow-light": "#fdeaad",

                    "--uc-green-dark": "#2a492f",
                    "--uc-green": "#678d58",
                    "--uc-green-light": "#c1e59b",

                    "--uc-magenta-dark": "#353054",
                    "--uc-magenta": "#6e568f",
                    "--uc-magenta-light": "#bf9dd0",

                    "--uc-orange-dark": "#c24a1f",
                    "--uc-orange": "#d98d40",
                    "--uc-orange-light": "#e1bc5e",

                },
            },
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
        ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: "dark", // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    },

    //...

}

// themes: ["light","retro","valentine","cupcake","pastel", "dark","dracula","forest","night","luxury"],
