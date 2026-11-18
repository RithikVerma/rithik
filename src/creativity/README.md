# Creativity gallery

Add your component to the Creativity repository and register it in its `src/catalog.js`. Give the entry a unique, stable slug, a title, and a React component that renders without props. The portfolio also displays the optional ISO date. The Creativity app uses the additional descriptive fields from its existing entries.

Starting Vite or running a production build fetches the current Creativity main branch. A push to that branch triggers the portfolio's Vercel deploy hook through the Creativity repository's GitHub Actions workflow. Restart a running local dev server to load newer designs.
