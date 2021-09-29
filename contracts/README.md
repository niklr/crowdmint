# CrowdMINT contracts

## Setup

- create .env file based on [.env.example](./.env.example)
- yarn install

### Typechain

```bash
yarn typechain
```

### Compile

```bash
yarn compile
```

### Test

```bash
yarn test:manager
```

### Convert between Ethereum adress and Polyjuice address:
https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/component-tutorials/3.setup.and.use.account.cli.md

cd godwoken-examples
node ./packages/tools/lib/account-cli.js to-short-address -a 0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8
-> 0x56eaccaa2ce59c6c0400b1e0b2e70dfd2dddd166

### Resources

polyjuice-provider
https://github.com/nervosnetwork/polyjuice-provider/blob/main/docs/get-started.md#usage

OpenZeppelin contracts
https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v3.4-solc-0.7