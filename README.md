This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

E2E-Testing
Be sure to set the environment variable NEXTAUTH_URL to the correct value. If you are running locally, as the documentation within .env.example mentions, the value should be http://localhost:3000.

# In a terminal just run:
yarn test-e2e

# To open the last HTML report run:
yarn playwright show-report test-results/reports/playwright-html-report
Resolving issues
E2E test browsers not installed
Run npx playwright install to download test browsers and resolve the error below when running yarn test-e2e:

Executable doesn't exist at /Users/alice/Library/Caches/ms-playwright/chromium-1048/chrome-mac/Chromium.app/Contents/MacOS/Chromium
Upgrading from earlier versions
Pull the current version:

git pull
Check if dependencies got added/updated/removed

yarn
Apply database migrations by running one of the following commands:

In a development environment, run:

yarn workspace @sln/prisma db-migrate
(This can clear your development database in some cases)

In a production environment, run:

yarn workspace @sln/prisma db-deploy
Check for .env variables changes

yarn predev
Start the server. In a development environment, just do:

yarn dev
For a production build, run for example:

yarn build
yarn start
Enjoy the new version.
