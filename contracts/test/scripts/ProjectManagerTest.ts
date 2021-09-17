import { BigNumber } from "@ethersproject/bignumber";
import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { v4 as uuidv4 } from "uuid";
import { Project, ProjectManager, ProjectManager__factory, Project__factory, Utils__factory } from "../../typechain";
import { EmptyAddress, ProjectCategory } from "../constants";
import { CreateProject } from "../types";
import { assertCondition, assertEquals, assertExceptionAsync, getOverrideOptions, timeout } from "../utils";
import { BaseTest } from "./BaseTest";

class ProjectManagerTest extends BaseTest {
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
    const contract = ProjectManager__factory.connect(receipt.contractAddress, this.deployer);
    return contract;
  }

  public async deployContract() {
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

  public async getProjectManagerContract(address: string, pk: string) {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return ProjectManager__factory.connect(address, account);
  }

  public async getProjectContract(address: string, pk: string) {
    const account = new PolyjuiceWallet(pk, this.nervosProviderConfig, this.rpcProvider);
    return Project__factory.connect(address, account);
  }

  public async deploy() {
    const contract = await this.deployContract();
    const actualOwner = await contract.owner();
    //const contractPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(contract.address);
    const deployerPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    console.log("Deployer address", deployerPolyjuiceAddress.value);
    assertEquals(actualOwner.toLowerCase(), deployerPolyjuiceAddress.value.toLowerCase(), "owner");
    assertEquals(0, (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    //contract.interface.events["ProjectCreated(uint256,string,string,address,address)"];

    contract.on("ProjectCreated", (index: number, category: string, title: string, addr: string, sender: string) => {
      console.log("ProjectCreated", index, category, title, addr, sender);
    });

    const expectedProjectIndex = BigNumber.from(1);
    const expectedProjectBeforeCreation = await contract.projects(expectedProjectIndex);
    assertEquals(expectedProjectBeforeCreation, EmptyAddress, "Expected project before creation");
    assertEquals(0, (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    // Test project creation
    let expectedProject = this.createProject();
    await this.submitProject(contract, expectedProject);
    assertEquals(1, (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    const actualProjectIndex = await contract.indexes(expectedProject.id);
    assertCondition(expectedProjectIndex.eq(actualProjectIndex), "Project index mismatch");

    const projectAddress = await contract.projects(actualProjectIndex);
    assertCondition(projectAddress !== EmptyAddress, "Expected project after creation");

    // Test duplicate identifier
    await assertExceptionAsync(async () => {
      await this.submitProject(contract, expectedProject);
    }, "Duplicate identifier");

    // Test invalid category
    expectedProject = this.createProject();
    expectedProject.category = "Invalid";
    await assertExceptionAsync(async () => {
      await this.submitProject(contract, expectedProject);
    }, "Invalid category");

    // Test invalid deadline
    expectedProject = this.createProject();
    expectedProject.deadline = BigNumber.from(0);
    await assertExceptionAsync(async () => {
      await this.submitProject(contract, expectedProject);
    }, "Invalid deadline");

    const projectContract = await this.getProjectContract(projectAddress, this.deployer.privateKey);
    assertEquals(0, (await projectContract.totalContributions()).toNumber(), "Total contributions mismatch");
    assertEquals(0, (await projectContract.totalContributors()).toNumber(), "Total contributors mismatch");
    assertEquals(0, (await projectContract.totalFunding()).toNumber(), "Total funding mismatch");

    await projectContract.contribute(this.accounts.admin.address, {
      value: BigNumber.from(100),
    });

    // TODO: use project manager to contribute once other contracts can send funds
    // await contract.contribute(projectAddress, {
    //   value: BigNumber.from(100),
    // });

    assertEquals(1, (await projectContract.totalContributions()).toNumber(), "Total contributions mismatch");
    assertEquals(1, (await projectContract.totalContributors()).toNumber(), "Total contributors mismatch");
    assertEquals(100, (await projectContract.totalFunding()).toNumber(), "Total funding mismatch");

    await this.contribute(projectContract);

    // Test events
    // while (true) {
    //   const timestamp = await contract.getTimestamp();
    //   console.log(Math.floor(Date.now() / 1000), timestamp.toNumber());
    //   await timeout(3000);
    // }
  }

  public async contribute(projectContract: Project) {
    const adminBalance = await this.rpcProvider.getBalance(this.accounts.admin.address);
    if (adminBalance.lte(0)) {
      return;
    }

    console.log('Contributing as:', this.accounts.admin.address);
  }

  public createProject(
    id: string = uuidv4(),
    category: string = ProjectCategory.KIA,
    title: string = "title 1234",
    url: string = "http://localhost/1234",
    goal: BigNumber = BigNumber.from(1234),
    deadline: BigNumber = BigNumber.from(Math.floor(Date.now() / 1000) + 3600),
  ): CreateProject {
    return {
      id,
      category,
      title,
      url,
      goal,
      deadline,
    };
  }

  public async submitProject(contract: ProjectManager, project: CreateProject) {
    await contract.create(project.id, project.category, project.title, project.url, project.goal, project.deadline);
  }
}

(async () => {
  const test = new ProjectManagerTest();
  await test.initAsync();
  await test.deploy();
  process.exit(0);
})();
