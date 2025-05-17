- Setup Tailwind css

npm install tailwindcss @tailwindcss/vite

- add this line into the vite.config.js

import tailwindcss from '@tailwindcss/vite'

- and add this into the export default defineConfig

tailwindcss()

- add this in the index.css

@import "tailwindcss";