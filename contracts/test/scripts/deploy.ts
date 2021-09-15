import { PolyjuiceWallet, PolyjuiceJsonRpcProvider } from '@polyjuice-provider/ethers';
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { SimpleStorage__factory } from '../../typechain';

dotenvConfig({ path: resolve(__dirname, "../../.env") });

const nervosProviderUrl: string | undefined = process.env.NERVOS_PROVIDER_URL;
if (!nervosProviderUrl) {
  throw new Error("Please set your NERVOS_PROVIDER_URL in a .env file");
}

const privateKey: string | undefined = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const nervosProviderConfig = {
  web3Url: nervosProviderUrl
};

const rpc = new PolyjuiceJsonRpcProvider(nervosProviderConfig, nervosProviderConfig.web3Url);
const deployer = new PolyjuiceWallet(privateKey, nervosProviderConfig, rpc);

async function deploySimpleStorageContract() {
  console.log('Deploying SimpleStorage...');

  const factory = new SimpleStorage__factory(deployer);
  const tx = factory.getDeployTransaction();
  tx.gasPrice = 0;
  tx.gasLimit = 1_000_000;
  const receipt = await (await deployer.sendTransaction(tx)).wait();
  const storage = SimpleStorage__factory.connect(receipt.contractAddress, deployer);

  console.log(`SimpleStorage deployed at: ${storage.address}`);

  return storage;
}

(async () => {
  await deploySimpleStorageContract();
  process.exit(0);
})();