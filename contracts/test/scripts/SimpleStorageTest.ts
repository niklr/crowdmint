import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { BigNumber } from "ethers";
import { SimpleManager__factory, SimpleStorage__factory, Utils__factory } from "../../typechain";
import { EmptyAddress } from "../constants";
import { assertCondition, assertEquals, getOverrideOptions, timeout, waitForBlocks } from "../utils";
import { BaseTest } from "./BaseTest";

class SimpleStorageTest extends BaseTest {
  constructor() {
    super();
  }

  public async deployUtils() {
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

  public async deploySimpleStorageContract() {
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

  public async deployManagerContract() {
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

  public async deployManager() {
    const manager = await this.deployManagerContract();
    assertCondition(EmptyAddress === (await manager.storageAddress()));
    await manager.create();
    assertCondition(EmptyAddress !== (await manager.storageAddress()));

    const storage = await this.getSimpleStorageContract(await manager.storageAddress(), this.deployer.privateKey);
    assertEquals("123", (await storage.get()).toString());

    await waitForBlocks(this.rpcProvider, 1);

    assertCondition(EmptyAddress !== (await manager.storageAddress()));
    assertEquals("123", (await storage.get()).toString());
  }

  public async getSimpleStorageContract(address: string, pk: string) {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return SimpleStorage__factory.connect(address, account);
  }

  public async deploy() {
    const storage = await this.deploySimpleStorageContract();
    let timestamp = await storage.getTimestamp();
    console.log("getTimestamp", timestamp.toNumber());

    assertEquals("123", (await storage.get()).toString());
    assertEquals("test1", await storage.category());

    const refTimestamp = timestamp.add(30);
    await storage.set(321, refTimestamp);
    assertEquals("321", (await storage.get()).toString());
    assertEquals(refTimestamp.toString(), (await storage.refTimestamp()).toString());

    await waitForBlocks(this.rpcProvider, 1);

    assertEquals("321", (await storage.get()).toString());

    const txResult = await this.submitTransaction(() => {
      return storage.setCategory("test2", {
        ...getOverrideOptions(this.nervosProviderUrl)
      });
    });
    assertEquals(false, txResult.success);
    assertEquals("test1", await storage.category());

    let tx = await this.rpcProvider.getTransaction(txResult.hash);
    console.log(txResult.hash, tx);

    console.log("Waiting for timestamp to expire...");
    timestamp = await storage.getTimestamp();
    while (refTimestamp > timestamp) {
      timestamp = await storage.getTimestamp();
      //console.log("Waiting for timestamp to expire...", refTimestamp.toNumber(), timestamp.toNumber());
      await timeout(2000);
    }

    timestamp = await storage.getTimestamp();
    console.log("Timestamp expired", refTimestamp.toNumber(), timestamp.toNumber());

    tx = await this.rpcProvider.getTransaction(txResult.hash);
    console.log(txResult.hash, tx);

    assertEquals("test1", await storage.category());

    // Reset
    await storage.set(321, timestamp.add(30));
    assertEquals("321", (await storage.get()).toString());
    await storage.setCategory("test1", {
      ...getOverrideOptions(this.nervosProviderUrl)
    });
    assertEquals("test1", await storage.category());
  }

  public async fund() {
    const storage = await this.deploySimpleStorageContract();
    const storage2 = await this.getSimpleStorageContract(storage.address, this.accounts.admin.privateKey);
    const deployerPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    const accountAddress = this.accounts.admin.address;

    const balanceBeforeFund = await this.rpcProvider.getBalance(accountAddress);
    assertCondition(balanceBeforeFund.gt(0), balanceBeforeFund.toString());

    const totalAmountBeforeFund = await storage2.totalAmount();
    assertCondition(totalAmountBeforeFund.eq(0), totalAmountBeforeFund.toString());

    const fundValue = BigNumber.from(100);
    await storage2.fund({
      value: fundValue,
      ...getOverrideOptions(this.nervosProviderUrl),
    });
    const totalAmountAfterFund = await storage2.totalAmount();
    assertCondition(totalAmountAfterFund.eq(fundValue), totalAmountAfterFund.toString());

    await waitForBlocks(this.rpcProvider, 2);

    const balanceAfterFund = await this.rpcProvider.getBalance(accountAddress);
    console.log(`before: ${balanceBeforeFund.toString()} after: ${balanceAfterFund.toString()}`);
    assertCondition(balanceBeforeFund.eq(balanceAfterFund.add(fundValue)));

    await storage2.refund({
      ...getOverrideOptions(this.nervosProviderUrl),
    });
    const totalAmountAfterRefund = await storage2.totalAmount();
    assertCondition(totalAmountAfterRefund.eq(0), totalAmountAfterRefund.toString());

    await waitForBlocks(this.rpcProvider, 2);

    const balanceAfterRefund = await this.rpcProvider.getBalance(accountAddress);
    console.log(`before: ${balanceBeforeFund.toString()} after: ${balanceAfterRefund.toString()}`);
    assertCondition(balanceBeforeFund.eq(balanceAfterRefund));
  }

  public async refund() {
    const storage = await this.deploySimpleStorageContract();
    const storage2 = await this.getSimpleStorageContract(storage.address, this.accounts.admin.privateKey);

    const fundValue = BigNumber.from(100);
    await storage2.fund({
      value: fundValue,
      ...getOverrideOptions(this.nervosProviderUrl),
    });
    const totalAmountAfterFund = await storage2.totalAmount();
    assertCondition(totalAmountAfterFund.eq(fundValue), totalAmountAfterFund.toString());

    await waitForBlocks(this.rpcProvider, 1);

    await storage2.refund({
      ...getOverrideOptions(this.nervosProviderUrl),
    });
    const totalAmountAfterRefund = await storage2.totalAmount();
    assertCondition(totalAmountAfterRefund.eq(0), totalAmountAfterRefund.toString());
  }

  public async run() {
    const adminWallet = new PolyjuiceWallet(
      this.accounts.admin.privateKey,
      this.nervosProviderConfig,
      this.rpcProvider,
    );
    console.log("deployer balance:", await this.rpcProvider.getBalance(this.deployer.address));
    console.log("admin balance:", await this.rpcProvider.getBalance(adminWallet.address));
    console.log(adminWallet.address, this.accounts.admin.address);
    const adminPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(adminWallet.address);
    console.log("admin polyjuice address", adminPolyjuiceAddress);
    await this.deployer.sendTransaction({
      value: BigNumber.from(1000),
      //to: adminWallet.address,
      //to: '0x56eaccaa2ce59c6c0400b1e0b2e70dfd2dddd166',
      to: adminPolyjuiceAddress.value,
      ...getOverrideOptions(this.nervosProviderUrl),
    });
  }
}

(async () => {
  const test = new SimpleStorageTest();
  await test.initAsync();
  await test.deploy();
  process.exit(0);
})();
