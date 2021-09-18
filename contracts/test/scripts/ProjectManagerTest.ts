import { BigNumber } from "@ethersproject/bignumber";
import { HDNode } from "@ethersproject/hdnode";
import { PolyjuiceWallet } from "@polyjuice-provider/ethers";
import { v4 as uuidv4 } from "uuid";
import { Project, ProjectManager, ProjectManager__factory, Project__factory, Utils__factory } from "../../typechain";
import { EmptyAddress, ProjectCategory } from "../constants";
import { CreateProject, ProjectInfo } from "../types";
import { assertCondition, assertEquals, getOverrideOptions, timeout, waitForBlocks } from "../utils";
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
    let timestamp = await contract.getTimestamp();
    const expectedProject = this.createProject();
    // WARNING: if deadline value is too low the transaction will be rejected depending on the block interval
    // gw_mem_pool::pool] [mem pool] fail to re-inject tx ...
    expectedProject.deadline = timestamp.add(30);
    console.log("Submitting project...");
    let txResult = await this.submitProject(contract, expectedProject);
    assertEquals(true, txResult.success);
    assertEquals(1, (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    await waitForBlocks(this.rpcProvider, 1);

    const actualProjectIndex = await contract.indexes(expectedProject.id);
    assertEquals(expectedProjectIndex.toNumber(), actualProjectIndex.toNumber(), "Project index mismatch");

    const projectAddress = await contract.projects(actualProjectIndex);
    assertCondition(projectAddress !== EmptyAddress, "Expected project after creation");

    // Test duplicate identifier
    txResult = await this.submitProject(contract, expectedProject);
    assertEquals(false, txResult.success);
    assertEquals(1, (await contract.totalProjects()).toNumber(), "Duplicate identifier");

    // Test invalid category
    let invalidProject = this.createProject();
    invalidProject.category = "Invalid";
    txResult = await this.submitProject(contract, invalidProject);
    assertEquals(false, txResult.success);
    assertEquals(1, (await contract.totalProjects()).toNumber(), "Invalid category");

    // Test invalid deadline
    invalidProject = this.createProject();
    invalidProject.deadline = BigNumber.from(0);
    txResult = await this.submitProject(contract, invalidProject);
    assertEquals(false, txResult.success);
    assertEquals(1, (await contract.totalProjects()).toNumber(), "Invalid deadline");

    const projectContract = await this.getProjectContract(projectAddress, this.deployer.privateKey);
    let projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(0, projectInfo.totalContributions.toNumber());
    assertEquals(0, projectInfo.totalContributors.toNumber());
    assertEquals(0, projectInfo.totalFunding.toNumber());

    txResult = await this.submitTransaction(() => {
      return projectContract.contribute(this.deployer.address, {
        value: BigNumber.from(100),
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(true, txResult.success);

    // TODO: use project manager to contribute once other contracts can send funds
    // await contract.contribute(projectAddress, {
    //   value: BigNumber.from(100),
    // });

    projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(1, projectInfo.totalContributions.toNumber());
    assertEquals(1, projectInfo.totalContributors.toNumber());
    assertEquals(100, projectInfo.totalFunding.toNumber());

    txResult = await this.submitTransaction(() => {
      return projectContract.contribute(this.deployer.address, {
        value: BigNumber.from(100),
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(true, txResult.success);

    projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(2, projectInfo.totalContributions.toNumber());
    assertEquals(1, projectInfo.totalContributors.toNumber());
    assertEquals(200, projectInfo.totalFunding.toNumber());

    // Payout is not possible if project has not expired
    txResult = await this.submitTransaction(() => {
      return projectContract.payout({
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(false, txResult.success);

    projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(deployerPolyjuiceAddress.value.toLowerCase(), projectInfo.creator.toLowerCase());
    assertEquals(200, projectInfo.totalFunding.toNumber());

    await this.contribute(projectContract, this.accounts.admin);

    timestamp = await contract.getTimestamp();
    console.log(expectedProject.deadline.toNumber(), timestamp.toNumber());

    while (expectedProject.deadline > timestamp) {
      timestamp = await contract.getTimestamp();
      console.log("Waiting for project to expire...", expectedProject.deadline.toNumber(), timestamp.toNumber());
      await timeout(2000);
    }

    timestamp = await contract.getTimestamp();
    console.log("Project expired", expectedProject.deadline.toNumber(), timestamp.toNumber());

    projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(deployerPolyjuiceAddress.value.toLowerCase(), projectInfo.creator.toLowerCase());
    assertEquals(200, projectInfo.totalFunding.toNumber());

    await projectContract.payout({
      ...getOverrideOptions(this.nervosProviderUrl),
    });

    projectInfo = this.toProjectInfo(await projectContract.getInfo());
    assertEquals(0, projectInfo.totalFunding.toNumber());

    // Test events
    // while (true) {
    //   const timestamp = await contract.getTimestamp();
    //   console.log(Math.floor(Date.now() / 1000), timestamp.toNumber());
    //   await timeout(3000);
    // }
  }

  public async deployProject() {
    console.log("Deploying Project...");

    const utils = await this.deployUtils();
    const factory = new Project__factory(
      {
        "src/Utils.sol:Utils": utils.address,
      },
      this.deployer,
    );
    const tx = factory.getDeployTransaction(
      ProjectCategory.KIA,
      "title 1234",
      "http://localhost/1234",
      BigNumber.from(1234),
      BigNumber.from(Math.floor(Date.now() / 1000) + 3),
      this.deployer.address,
    );
    const receipt = await (
      await this.deployer.sendTransaction({
        ...tx,
        ...getOverrideOptions(this.nervosProviderUrl),
      })
    ).wait();
    const contract = Project__factory.connect(receipt.contractAddress, this.deployer);

    console.log(`Project deployed at: ${contract.address}`);

    let projectInfo = this.toProjectInfo(await contract.getInfo());
    assertEquals(0, projectInfo.totalFunding.toNumber());
    assertEquals(ProjectCategory.KIA, projectInfo.category);

    await waitForBlocks(this.rpcProvider, 1);

    projectInfo = this.toProjectInfo(await contract.getInfo());
    assertEquals(0, projectInfo.totalFunding.toNumber());
    assertEquals(ProjectCategory.KIA, projectInfo.category);
  }

  public async contribute(projectContract: Project, account: HDNode) {
    const adminBalance = await this.rpcProvider.getBalance(account.address);
    if (adminBalance.lte(0)) {
      return;
    }

    console.log("Contributing as:", account.address);
  }

  private createProject(
    id: string = uuidv4(),
    category: string = ProjectCategory.KIA,
    title: string = "title 1234",
    url: string = "http://localhost/1234",
    goal: BigNumber = BigNumber.from(1234),
    deadline: BigNumber = BigNumber.from(Math.floor(Date.now() / 1000) + 3),
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

  private toProjectInfo(
    projectInfo: [string, string, string, BigNumber, BigNumber, string, BigNumber, BigNumber, BigNumber, string],
  ): ProjectInfo {
    return {
      category: projectInfo[0],
      title: projectInfo[1],
      url: projectInfo[2],
      goal: projectInfo[3],
      deadline: projectInfo[4],
      creator: projectInfo[5],
      totalContributions: projectInfo[6],
      totalContributors: projectInfo[7],
      totalFunding: projectInfo[8],
      manager: projectInfo[9],
    };
  }

  private async submitProject(contract: ProjectManager, project: CreateProject) {
    return await this.submitTransaction(() => {
      return contract.create(project.id, project.category, project.title, project.url, project.goal, project.deadline, {
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
  }
}

(async () => {
  const test = new ProjectManagerTest();
  await test.initAsync();
  await test.deploy();
  process.exit(0);
})();
