# GitHub Profile Finder

React + Vite app that looks up any GitHub user with the GitHub REST API.

## Features
- Search by username (with validation and clear error messages)
- Profile picture, name, bio, username, repos / followers / following
- Visit-profile button and the user's latest public repositories
- Search history (saved in localStorage) and dark/light toggle

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy
Push to GitHub, then Settings > Pages > Source > **GitHub Actions**.
`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

## Note
The GitHub API allows 60 unauthenticated requests per hour per IP.
If you hit the limit the app shows a message; wait a few minutes.
