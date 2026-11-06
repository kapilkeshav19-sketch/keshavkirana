# KeshavStore

KeshavStore is a kirana-store dashboard prototype for billing, inventory, customer records, and sales reporting.

## Run locally

```sh
cd client
npm ci
npm run dev
```

## Deploy

Push the `main` branch to GitHub and enable **Settings → Pages → GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds the Vite client and deploys `client/dist`.

The current app uses in-memory demo data; records reset when the page reloads. No backend is connected.