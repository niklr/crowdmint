import { PolyjuiceWallet, PolyjuiceJsonRpcProvider } from '@polyjuice-provider/ethers';
import { Godwoker } from "@polyjuice-provider/base";
import { config as dotenvConfig } from 'dotenv';
import { BigNumber } from 'ethers';
import { resolve } from 'path';
import { SimpleStorage__factory } from '../../typechain';
import { assertCondition, getAccounts, getOverrideOptions } from '../utils';

dotenvConfig({ path: resolve(__dirname, '../../.env') });

const nervosProviderUrl: string | undefined = process.env.NERVOS_PROVIDER_URL;
if (!nervosProviderUrl) {
  throw new Error('Please set your NERVOS_PROVIDER_URL in a .env file');
}

const privateKey: string | undefined = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('Please set your PRIVATE_KEY in a .env file');
}

const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error('Please set your MNEMONIC in a .env file');
}

const accounts = getAccounts(mnemonic);

const nervosProviderConfig = {
  web3Url: nervosProviderUrl
};

const rpc = new PolyjuiceJsonRpcProvider(nervosProviderConfig, nervosProviderConfig.web3Url);
const deployer = new PolyjuiceWallet(privateKey, nervosProviderConfig, rpc);

async function deploySimpleStorageContract() {
  console.log('Deploying SimpleStorage...');

  const factory = new SimpleStorage__factory(deployer);
  const tx = factory.getDeployTransaction();
  const receipt = await (await deployer.sendTransaction({
    ...tx,
    ...getOverrideOptions(nervosProviderUrl)
  })).wait();
  const storage = SimpleStorage__factory.connect(receipt.contractAddress, deployer);

  console.log(`SimpleStorage deployed at: ${storage.address}`);

  return storage;
}

async function getSimpleStorageContract(address: string, pk: string) {
  const account = new PolyjuiceWallet(pk, nervosProviderConfig, rpc);
  return SimpleStorage__factory.connect(address, account);
}

async function deploy() {
  const storage = await deploySimpleStorageContract();
  const actualValue1 = await storage.get();
  assertCondition(BigNumber.from('123').eq(actualValue1), actualValue1.toString())
  await storage.set(321);
  const actualValue2 = await storage.get();
  assertCondition(BigNumber.from('321').eq(actualValue2), actualValue2.toString())
  await storage.set(123);
  const storage2 = await getSimpleStorageContract(storage.address, accounts.admin.privateKey);
  await storage2.set(123);
  const timestamp = await storage.getTimestamp();
  console.log('getTimestamp', timestamp.toNumber());
}

async function test() {
  const adminWallet = new PolyjuiceWallet(accounts.admin.privateKey, nervosProviderConfig, rpc);
  console.log('deployer balance:', await rpc.getBalance(deployer.address));
  console.log(adminWallet.address, accounts.admin.address);
  const godwoker = new Godwoker('http://localhost:8024');
  await godwoker.initSync();
  console.log('Admin Polyjuice address', await godwoker.getShortAddressByAllTypeEthAddress('0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8'))
  console.log('admin balance:', await rpc.getBalance(adminWallet.address));
  await deployer.sendTransaction({
    value: BigNumber.from(1000),
    to: adminWallet.address,
    //to: '0x56eaccaa2ce59c6c0400b1e0b2e70dfd2dddd166',
    ...getOverrideOptions(nervosProviderUrl)
  });
}

(async () => {
  await test();
  process.exit(0);
})();