# Contributing

Hey! Thanks for your interest in improving `code-migrate`! There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Submitting an issue

Please provide us with an issue in case you've found a bug, want a new feature, have an awesome idea, or there is something you want to discuss.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

## Local Setup
Fork the repo, clone, install dependencies and run the tests:

```
git clone git@github.com:<username>/code-migrate.git
cd code-migrate
yarn install
yarn test
```

### Test

In order to run the tests in watch mode ([jest](https://github.com/facebook/jest)), run the following command:

```
yarn test:watch
``` 

### Lint

In order to run the linter ([eslint](https://github.com/eslint/eslint)), run the following command:

```
yarn lint
``` 

* The linter will run before commit on staged files, using [husky](https://github.com/typicode/husky) and [lint-stage](https://github.com/okonet/lint-staged).

## Release a new version

> This will work only if you have an admin over the npm package

Run the following command

```bash
yarn createVersion
```
