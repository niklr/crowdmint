# CrowdMINT client

## Setup

- create .env file based on [.env.example](./.env.example)
- yarn install

### Start

Starts the client at http://localhost:3000

```bash
yarn start
```

### GraphQL codegen

Downloads the GraphQL scheme from the server running locally and generates the code.
This command has to be executed whenever the GraphQL scheme changes.

```bash
yarn codegen
```

### Build

Builds the client into `build` folder.

```bash
yarn build
```

### Test

```bash
yarn test
```

## Fix build error after adding @polyjuice-provider/ethers

```
/home/ubuntu/Projects/nervos/nervos-hackathon/client/node_modules/@polyjuice-provider/godwoken/src/normalizer.ts
TypeScript error in /home/ubuntu/Projects/nervos/nervos-hackathon/client/node_modules/@polyjuice-provider/godwoken/src/normalizer.ts(56,56):
Object is of type 'unknown'.  TS2571
```

Replace local yarn.lock with version from https://github.com/RetricSu/polyjuice-provider-example