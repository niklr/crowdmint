import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { BigNumber } from "ethers";
import { SimpleStorage__factory } from "../../typechain";
import { assertCondition, getOverrideOptions, timeout, waitForBlocks } from "../utils";
import { BaseTest } from "./BaseTest";

class SimpleStorageTest extends BaseTest {
  constructor() {
    super();
  }

  public async deploySimpleStorageContract() {
    console.log("Deploying SimpleStorage...");

    const factory = new SimpleStorage__factory(this.deployer);
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

  public async getSimpleStorageContract(address: string, pk: string) {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return SimpleStorage__factory.connect(address, account);
  }

  public async deploy() {
    const storage = await this.deploySimpleStorageContract();
    const deployerPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    const actualValue1 = await storage.get();
    assertCondition(BigNumber.from("123").eq(actualValue1), actualValue1.toString());
    await storage.set(321, {
      ...getOverrideOptions(this.nervosProviderUrl),
    });

    const actualValue2 = await storage.get();
    assertCondition(BigNumber.from("321").eq(actualValue2), actualValue2.toString());
    await storage.set(123);

    const timestamp = await storage.getTimestamp();
    console.log("getTimestamp", timestamp.toNumber());
  }

  public async fund() {
    const storage = await this.deploySimpleStorageContract();
    const storage2 = await this.getSimpleStorageContract(storage.address, this.accounts.admin.privateKey);
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
  await test.fund();
  await test.run();
  process.exit(0);
})();
