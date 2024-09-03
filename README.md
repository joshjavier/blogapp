# blogapp

> A Full Stack Open Exercise

This repo combines the blogapp built in parts 4 and 5 into a single repo, adding a CI/CD pipeline via GitHub Actions.

This is what I came up with while working on **exercises 11.20 and 11.21 of part 11**.

## Requirements

- Node.js 22.7.0
- flyctl 0.2.124

## Setting up

Install dependencies:

```sh
git clone https://github.com/joshjavier/blogapp.git
cd blogapp
npm install
```

Next, create an `.env.local` file that contains the following variables:

- `MONGODB_URI` - connection string of production/dev database
- `TEST_MONGODB_URI` - connection string of test database
- `PORT` - set to "3003" for now (TODO: refactor parts of the codebase where this value is hardcoded)
- `SECRET` - used to sign and verify the JSON Web Tokens for authentication

Then, in separate terminals, run Vite dev server (frontend) and Express server (backend):

```sh
# Start the Vite dev server
npm run dev

# Start the Express server
npm run backend:dev
```

## Running tests

The frontend uses Vitest test runner.

```sh
# Run this in a separate terminal to practice test-driven development (TDD)
npm test

# Or, to exit immediately after performing a single "test run"
npm test run
```

The backend uses Node.js's built-in test runner. To test the backend:

```sh
# Run an Express app that uses the test database
npm run backend:test-start

# Run tests in a separate terminal
npm run backend:test
```

**Remember to use a test database for testing to prevent data loss in the production database!**

## Deployments

Deployments are set up using Fly.io. Pushes and pull requests to the main branch will automatically trigger a new version to be deployed at https://blogapp-4057.fly.dev

To manually invoke a deployment, use:

```sh
fly deploy
```

To skip invoking a deployment when pushing or merging a pull request to main, include the tag "#skip" in the commit or pull request message.
