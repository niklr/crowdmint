# CrowdMINT workers

## Setup

- create .env file based on [.env.example](./.env.example)
- yarn install

- yarn compile

```bash
yarn tsc ./cmd/main.ts --esModuleInterop
```

```bash
npx ts-node -P tsconfig.commonjs.json ./cmd/main.ts
```