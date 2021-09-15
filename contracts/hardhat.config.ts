import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const privateKey: string | undefined = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

export default {
    defaultNetwork: "godwoken",
    networks: {
      hardhat: {
      },
      godwoken: {
        url: "http://localhost:8119",
        accounts: [privateKey],
        //chainId: "0xfa309"
      }
    },
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./src",
        tests: "./test",
    },
    solidity: '0.7.6',
    typechain: {
        target: 'ethers-v5'
    }
};
