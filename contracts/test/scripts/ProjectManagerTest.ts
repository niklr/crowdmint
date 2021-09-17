import { BigNumber } from "@ethersproject/bignumber";
import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { ProjectManager__factory } from "../../typechain";
import { EmptyAddress, ProjectCategory } from "../constants";
import { CreateProject } from "../types";
import { assertCondition, assertExceptionAsync, getOverrideOptions, timeout } from "../utils";
import { BaseTest } from "./BaseTest";

class ProjectManagerTest extends BaseTest {
  constructor() {
    super();
  }

  public async deployContract() {
    console.log("Deploying ProjectManager...");

    const factory = new ProjectManager__factory(this.deployer);
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

  public async getContract(address: string, pk: string) {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return ProjectManager__factory.connect(address, account);
  }

  public async deploy() {
    const contract = await this.deployContract();
    const actualOwner = await contract.owner();
    //const contractPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(contract.address);
    const deployerPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    console.log("deployer address", deployerPolyjuiceAddress.value);
    assertCondition(actualOwner.toLowerCase() === deployerPolyjuiceAddress.value.toLowerCase(), "owner");
    assertCondition(0 === (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    //contract.interface.events["ProjectCreated(uint256,string,string,address,address)"];

    contract.on("ProjectCreated", (index: number, category: string, title: string, addr: string, sender: string) => {
      console.log("ProjectCreated", index, category, title, addr, sender);
    });

    const expectedProjectBeforeCreation = await contract.projects(BigNumber.from(0));
    assertCondition(expectedProjectBeforeCreation === EmptyAddress, "Expected project before creation");

    // Test project creation
    const expectedProject = this.createProject();
    await contract.create(
      expectedProject.category,
      expectedProject.title,
      expectedProject.url,
      expectedProject.goal,
      expectedProject.deadline,
    );
    assertCondition(1 === (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    const expectedProjectAfterCreation = await contract.projects(BigNumber.from(0));
    assertCondition(expectedProjectAfterCreation !== EmptyAddress, "Expected project after creation");

    // Test invalid deadline
    expectedProject.deadline = BigNumber.from(0);
    await assertExceptionAsync(async () => {
      await contract.create(
        expectedProject.category,
        expectedProject.title,
        expectedProject.url,
        expectedProject.goal,
        expectedProject.deadline,
      );
    }, "Invalid deadline");

    // Test events
    // while (true) {
    //   const timestamp = await contract.getTimestamp();
    //   console.log(Math.floor(Date.now() / 1000), timestamp.toNumber());
    //   await timeout(3000);
    // }
  }

  public createProject(
    category: string = ProjectCategory.KIA,
    title: string = "title 1234",
    url: string = "http://localhost/1234",
    goal: BigNumber = BigNumber.from(1234),
    deadline: BigNumber = BigNumber.from(Math.floor(Date.now() / 1000) + 3600),
  ): CreateProject {
    return {
      category,
      title,
      url,
      goal,
      deadline,
    };
  }
}

(async () => {
  const test = new ProjectManagerTest();
  await test.initAsync();
  await test.deploy();
  process.exit(0);
})();
