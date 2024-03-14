const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  daisyui: {
    themes: [
      {
        eup: { 
          "primary": "#6ee7b7",
          "secondary": "#232323",      
          "accent": "#6ee7b7",    
          "neutral": "#232323",
          "base-100": "#000000",
          "info": "#38bdf8",
          "success": "#6ee7b7",
          "warning": "#fcd34d",
          "error": "#ef4444"
        }
      }
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
};
