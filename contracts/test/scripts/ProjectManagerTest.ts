import { BigNumber } from "@ethersproject/bignumber";
import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { ProjectManager__factory } from "../../typechain";
import { EmptyAddress, ProjectCategory } from "../constants";
import { CreateProject } from "../types";
import { assertCondition, assertExceptionAsync, getOverrideOptions } from "../utils";
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
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpc);
    return ProjectManager__factory.connect(address, account);
  }

  public async deploy() {
    const contract = await this.deployContract();
    const actualOwner = await contract.owner();
    const deployerAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    console.log("deployer address", deployerAddress.value);
    assertCondition(actualOwner.toLowerCase() === deployerAddress.value.toLowerCase(), "owner");
    assertCondition(0 === (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    // Test project creation
    const expectedProject = this.createProject();
    await contract.create(expectedProject.category, expectedProject.title, expectedProject.url, expectedProject.goal, expectedProject.deadline);
    assertCondition(1 === (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    // Test invalid deadline
    expectedProject.deadline = BigNumber.from(0);
    await assertExceptionAsync(async () => {
      await contract.create(expectedProject.category, expectedProject.title, expectedProject.url, expectedProject.goal, expectedProject.deadline);
    }, "Invalid deadline");
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
