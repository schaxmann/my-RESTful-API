# Schaxmann News API

## Hosted API

<font size="4">Hosted on Heroku [here](https://schaxmann-news.herokuapp.com/)</font>

## Project Summary

This project is a reddit-style news website which allows users to explore, sort, open, comment on and upvote articles.

## Cloning the Repo

If you wish to experiment and make your own changes to this project, press the 'fork' button to create a copy of the repository.

To clone the repo, click on the 'code' button at the top of the page and copy the URL you require (HTTPS, SSH, or GitHub CLI).

Navigate to the directory that you wish to clone the repo to locally and write the following command in your terminal:

```
git clone *your_url_here*
```

## Install Dependencies

The following devDependencies and dependencies are required for this project to run. Please see the linked documentation for information on how to install each of these dependencies. Alternatively, run the following command in the terminal.

```
npm install
```

### Dependencies

- [express](https://expressjs.com/en/starter/installing.html): for creating the application and using middleware functions
- [pg](https://www.npmjs.com/package/pg): for querying the PSQL database
- [pg-format](https://www.npmjs.com/package/pg-format): to seed the database
- [dotenv](https://www.npmjs.com/package/dotenv): loads the environment variables from a .env file
- [husky](https://www.npmjs.com/package/husky): utilise git hooks to run a pre-commit file

### devDependencies

- [supertest](https://www.npmjs.com/package/supertest) - integration testing of endpoints
- [jest](https://jestjs.io/docs/getting-started): for testing
- [jest-sorted](https://www.npmjs.com/package/jest-sorted): for custom jest matchers/assertions
- [jest-extended](https://www.npmjs.com/package/jest-extended): addition jest matchers/assertions
- [nodemon](https://www.npmjs.com/package/nodemon): restarts the node application after a file change (when testing using Insomnia)

You will also find these dependencie in the package.json file.

## Seeding the Database

To seed the local database, navigate to the repo in your terminal and write the following commands:

```
npm run setup-dbs
npm run seed
```

## Environment Variables Setup

There are two databases in this repository. One for dev data and another for test data.

You will need to create two .env files to utilise this repository: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## Running Tests

To run the tests using jest, write the following command:

```
npm test
```

This will run all of the tests stored in the \_\_tests\_\_ folder. The tests folder contains unit tests for the utility functions and integrated tests for the application. If you wish to run a specific test file, use the following command:

```
npm test name_of_file
```

## Version Requirements

- node.js: ^16.15.0
- pg: ^8.7.3
