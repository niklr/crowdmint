import { Godwoker, PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceJsonRpcProvider, PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider, PolyjuiceWebsocketProvider } from "@polyjuice-provider/web3";
import { config as dotenvConfig } from "dotenv";
import { ContractTransaction } from "ethers";
import { resolve } from "path";
import Web3 from "web3";
import { Project, ProjectManager, ProjectManager__factory, Project__factory, SimpleManager, SimpleManager__factory, SimpleStorage, SimpleStorage__factory, Utils, Utils__factory } from "../typechain";
import { Accounts, TransactionResult } from "./types";
import { getAccounts, getOverrideOptions } from "./utils";

dotenvConfig({ path: resolve(__dirname, "../.env") });

export class Context {
  nervosProviderUrl: string;
  privateKey: string;
  mnemonic: string;
  nervosProviderConfig: PolyjuiceConfig;
  rpcProvider!: PolyjuiceJsonRpcProvider;
  httpProvider!: PolyjuiceHttpProvider;
  wsProvider!: PolyjuiceWebsocketProvider;
  web3!: Web3;
  deployer!: PolyjuiceWallet;
  accounts!: Accounts;
  godwoker!: Godwoker;

  constructor() {
    const _nervosProviderUrl = process.env.NERVOS_PROVIDER_URL;
    if (!_nervosProviderUrl) {
      throw new Error("Please set your NERVOS_PROVIDER_URL in a .env file");
    }
    this.nervosProviderUrl = String(_nervosProviderUrl);

    const _privateKey = process.env.PRIVATE_KEY;
    if (!_privateKey) {
      throw new Error("Please set your PRIVATE_KEY in a .env file");
    }
    this.privateKey = String(_privateKey);

    const _mnemonic = process.env.MNEMONIC;
    if (!_mnemonic) {
      throw new Error("Please set your MNEMONIC in a .env file");
    }
    this.mnemonic = String(_mnemonic);

    this.nervosProviderConfig = {
      web3Url: this.nervosProviderUrl,
    };
  }

  public async initAsync(): Promise<void> {
    this.rpcProvider = new PolyjuiceJsonRpcProvider(this.nervosProviderConfig, this.nervosProviderConfig.web3Url);
    this.deployer = new PolyjuiceWallet(this.privateKey, this.nervosProviderConfig, this.rpcProvider);
    this.accounts = getAccounts(this.mnemonic);
    this.godwoker = new Godwoker(this.nervosProviderUrl);
    await this.godwoker.initSync();
  }

  public async submitTransaction(callbackFn: () => Promise<ContractTransaction>): Promise<TransactionResult> {
    const contractTransaction = await callbackFn();
    const tx = await this.rpcProvider.getTransaction(contractTransaction.hash);
    if (!tx) {
      return {
        hash: contractTransaction.hash,
        success: false
      };
    }
    await tx.wait(1);
    return {
      hash: contractTransaction.hash,
      success: true
    };
  }

  public async deployUtils(): Promise<Utils> {
    const factory = new Utils__factory(this.deployer);
    const tx = factory.getDeployTransaction();
    const receipt = await (
      await this.deployer.sendTransaction({
        ...tx,
        ...getOverrideOptions(this.nervosProviderUrl),
      })
    ).wait();
    const contract = Utils__factory.connect(receipt.contractAddress, this.deployer);
    return contract;
  }

  public async deployProjectManager(): Promise<ProjectManager> {
    console.log("Deploying ProjectManager...");

    const utils = await this.deployUtils();
    const factory = new ProjectManager__factory(
      {
        "src/Utils.sol:Utils": utils.address,
      },
      this.deployer,
    );
    const tx = factory.getDeployTransaction();
    const receipt = await (
      await this.deployer.sendTransaction({
        ...tx,
        ...getOverrideOptions(this.nervosProviderUrl),
      })
    ).wait();
    const contract = ProjectManager__factory.connect(receipt.contractAddress, this.deployer);

    console.log(`ProjectManager deployed at: ${contract.address}`);

    return contract;
  }

  public async deploySimpleStorageContract(): Promise<SimpleStorage> {
    console.log("Deploying SimpleStorage...");

    const utils = await this.deployUtils();
    const factory = new SimpleStorage__factory(
      {
        "src/Utils.sol:Utils": utils.address,
      },
      this.deployer,
    );
    const tx = factory.getDeployTransaction();
    const receipt = await (
      await this.deployer.sendTransaction({
        ...tx,
        ...getOverrideOptions(this.nervosProviderUrl),
      })
    ).wait();
    const storage = SimpleStorage__factory.connect(receipt.contractAddress, this.deployer);

    console.log(`SimpleStorage deployed at: ${storage.address}`);

    return storage;
  }

  public async deploySimpleManagerContract(): Promise<SimpleManager> {
    console.log("Deploying SimpleManager...");

    const utils = await this.deployUtils();
    const factory = new SimpleManager__factory(
      {
        "src/Utils.sol:Utils": utils.address,
      },
      this.deployer,
    );
    const tx = factory.getDeployTransaction();
    const receipt = await (
      await this.deployer.sendTransaction({
        ...tx,
        ...getOverrideOptions(this.nervosProviderUrl),
      })
    ).wait();
    const storage = SimpleManager__factory.connect(receipt.contractAddress, this.deployer);

    console.log(`SimpleManager deployed at: ${storage.address}`);

    return storage;
  }

  public getProjectManagerContract(address: string, pk: string): ProjectManager {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return ProjectManager__factory.connect(address, account);
  }

  public getProjectContract(address: string, pk: string): Project {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return Project__factory.connect(address, account);
  }
}
