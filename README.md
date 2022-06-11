# Node.js Challenge

## Installing

To install the project dependencies, run the command: `npm install`

## Build

This project was develop into TypeScript, so, before your run the project (non locally), you need to transpile the code base to `js`. To transpile the project, run the command: `npm run build`

## Static Code Analyzer

I used the tslint to do some static code analysis, to execute the lint, run the command: `npm run lint`.

## Automated Tests

This project has a strategy to tests using automated tests (only in stock-service). To execute the tests run the command `npm test` or `make test`(in this case it will run tests inside a docker container).

## Start the application

To start the applications, run the command: `docker-compose up` in the root of node-challenge folder

## API Documentation

The reference for the APIs can be seen in the `swagger.yaml` file inside the root of each project folder (stock-service and api-service). You can copy the content of the yaml file and paste here -> https://editor.swagger.io/ to see the specification.

## API authentication

The authentication process is not inside the swagger.yaml, but it is a simple JWT token authentication. After use the `/register` route you will receive an token that can be used in the other endpoints passing it through the request header:
`authorization: Bearer xxxxx`

- stock-service doesnt have any authentication
- api-service uses JWT authentication (except the /register route)

## Database

The database used in this project is a postgres and you can connect using the credentials in the `docker-compose.yaml` file (/api-service/docker-compose.yaml).
