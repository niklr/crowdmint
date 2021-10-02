import { BigNumber } from "@ethersproject/bignumber";
import { v4 as uuidv4 } from "uuid";
import { ProjectManager, Project__factory } from "../../typechain";
import { EmptyAddress, ProjectCategory } from "../constants";
import { Context } from "../context";
import { CreateProject, ProjectInfo } from "../types";
import { assertCondition, assertEquals, getOverrideOptions, timeout, waitForBlocks, waitForEvent } from "../utils";

class ProjectManagerTest extends Context {
  constructor() {
    super();
  }

  public async deploy() {
    const contract = await this.deployProjectManager();
    const actualOwner = await contract.owner();
    //const contractPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(contract.address);
    const deployerPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(this.deployer.address);
    console.log("Deployer address", deployerPolyjuiceAddress.value);
    assertEquals(actualOwner.toLowerCase(), deployerPolyjuiceAddress.value.toLowerCase(), "owner");
    assertEquals(0, (await contract.totalProjects()).toNumber(), "Total projects mismatch");

    //contract.interface.events["ProjectCreated(uint256,address,string,string,address)"];

    contract.on("ProjectCreated", (index: number, sender: string, category: string, title: string, addr: string) => {
      console.log("ProjectCreated", index, sender, category, title, addr);
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

    const managerAsOwner = await this.getProjectManagerContract(contract.address, this.deployer.privateKey);
    txResult = await this.submitTransaction(() => {
      return managerAsOwner.setInfo(
        projectAddress,
        expectedProject.category,
        expectedProject.title,
        expectedProject.description,
        expectedProject.url,
        expectedProject.goal,
        expectedProject.deadline,
        {
          ...getOverrideOptions(this.nervosProviderUrl),
        },
      );
    });
    assertEquals(true, txResult.success);

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
    let projectInfo = this.toProjectInfo(await projectContract.getExtendedInfo());
    assertEquals(expectedProject.title, projectInfo.title);
    assertEquals(expectedProject.description, projectInfo.description);
    assertEquals(0, projectInfo.totalContributions.toNumber());
    assertEquals(0, projectInfo.totalContributors.toNumber());
    assertEquals(0, projectInfo.totalFunding.toNumber());

    txResult = await this.submitTransaction(() => {
      return contract.contribute(projectAddress, {
        value: BigNumber.from(100),
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(true, txResult.success);

    projectInfo = this.toProjectInfo(await projectContract.getExtendedInfo());
    assertEquals(1, projectInfo.totalContributions.toNumber());
    assertEquals(1, projectInfo.totalContributors.toNumber());
    assertEquals(100, projectInfo.totalFunding.toNumber());

    const contribution0 = await projectContract.getContribution(BigNumber.from(0));
    assertEquals(deployerPolyjuiceAddress.value.toLowerCase(), contribution0.contributor.toLowerCase());
    assertEquals(100, contribution0.amount.toNumber());
    assertCondition(contribution0.created.gt(timestamp), "Invalid contribution created timestamp");

    txResult = await this.submitTransaction(() => {
      return contract.contribute(projectAddress, {
        value: BigNumber.from(100),
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(true, txResult.success);

    projectInfo = this.toProjectInfo(await projectContract.getExtendedInfo());
    assertEquals(2, projectInfo.totalContributions.toNumber());
    assertEquals(1, projectInfo.totalContributors.toNumber());
    assertEquals(200, projectInfo.totalFunding.toNumber());

    // Payout is not possible if project has not expired
    txResult = await this.submitTransaction(() => {
      return projectContract.payout({
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    const failedPayoutTxHash = txResult.hash;
    assertEquals(false, txResult.success);
    assertEquals(null, await this.rpcProvider.getTransaction(failedPayoutTxHash));

    projectInfo = this.toProjectInfo(await projectContract.getExtendedInfo());
    assertEquals(deployerPolyjuiceAddress.value.toLowerCase(), projectInfo.creator.toLowerCase());
    assertEquals(200, projectInfo.totalFunding.toNumber());

    timestamp = await contract.getTimestamp();
    console.log(expectedProject.deadline.toNumber(), timestamp.toNumber());

    while (expectedProject.deadline > timestamp) {
      timestamp = await contract.getTimestamp();
      console.log("Waiting for project to expire...", expectedProject.deadline.toNumber(), timestamp.toNumber());
      await timeout(2000);
    }

    timestamp = await contract.getTimestamp();
    console.log("Project expired", expectedProject.deadline.toNumber(), timestamp.toNumber());

    assertEquals(null, await this.rpcProvider.getTransaction(failedPayoutTxHash));

    projectInfo = this.toProjectInfo(await projectContract.getExtendedInfo());
    // By now the project should be mined (ProjectCreated event received)
    // -> may reset the state of unmined transactions such as contributions
    assertEquals(0, projectInfo.totalFunding.toNumber());

    console.log("Manager address, Project address", contract.address, projectAddress);

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
      "desc 4321",
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

    let projectInfo = this.toProjectInfo(await contract.getExtendedInfo());
    assertEquals(0, projectInfo.totalFunding.toNumber());
    assertEquals(ProjectCategory.KIA, projectInfo.category);

    await waitForBlocks(this.rpcProvider, 1);

    projectInfo = this.toProjectInfo(await contract.getExtendedInfo());
    assertEquals(0, projectInfo.totalFunding.toNumber());
    assertEquals(ProjectCategory.KIA, projectInfo.category);
  }

  public async contribute(managerAddress: string, projectAddress: string) {
    const account = this.accounts.admin;
    //const accountPolyjuiceAddress = await this.godwoker.getShortAddressByAllTypeEthAddress(account.address);
    const accountBalanceBefore = await this.rpcProvider.getBalance(account.address);
    if (accountBalanceBefore.lte(0)) {
      return;
    }

    console.log("Contributing as:", account.address);

    const manager = await this.getProjectManagerContract(managerAddress, account.privateKey);
    const project = await this.getProjectContract(projectAddress, account.privateKey);

    const projectBalanceBefore = await this.rpcProvider.getBalance(project.address);

    let timestamp = await manager.getTimestamp();
    let projectInfo = this.toProjectInfo(await project.getExtendedInfo());
    if (timestamp.gt(projectInfo.deadline)) {
      const newDeadlne = timestamp.add(86400);
      project.on("InfoUpdated", (addr: string, title: string, url: string) => {
        console.log("InfoUpdated", addr, title, url);
      });
      const managerAsOwner = await this.getProjectManagerContract(managerAddress, this.deployer.privateKey);
      await managerAsOwner.setInfo(
        projectAddress,
        projectInfo.category,
        projectInfo.title,
        projectInfo.description,
        projectInfo.url,
        projectInfo.goal,
        newDeadlne,
        {
          ...getOverrideOptions(this.nervosProviderUrl),
        },
      );
      await waitForEvent("InfoUpdated", project);
    }
    timestamp = await manager.getTimestamp();
    projectInfo = this.toProjectInfo(await project.getExtendedInfo());
    assertCondition(timestamp.lt(projectInfo.deadline), "Project deadline");

    const initialFunding = await project.totalFunding();
    console.log("Project total funding", initialFunding);

    project.on("ContributionReceived", (addr: string, contributor: string, amount: BigNumber) => {
      console.log("ContributionReceived", addr, contributor, amount);
    });

    const contribution = BigNumber.from(300);
    const txResult = await this.submitTransaction(() => {
      return manager.contribute(project.address, {
        value: contribution,
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
    assertEquals(true, txResult.success);

    await waitForEvent("ContributionReceived", project);

    projectInfo = this.toProjectInfo(await project.getExtendedInfo());
    assertEquals(initialFunding.add(contribution).toString(), projectInfo.totalFunding.toString());

    const projectBalanceAfter = await this.rpcProvider.getBalance(project.address);
    assertEquals(projectBalanceBefore.add(contribution).toString(), projectBalanceAfter.toString());
    assertEquals(projectInfo.totalFunding.toString(), projectBalanceAfter.toString());

    const accountBalanceAfter = await this.rpcProvider.getBalance(account.address);
    assertEquals(accountBalanceBefore.sub(contribution).toString(), accountBalanceAfter.toString());
  }

  private createProject(
    id: string = uuidv4(),
    category: string = ProjectCategory.KIA,
    title: string = "title 1234",
    description: string = "desc 4321",
    url: string = "http://localhost/1234",
    goal: BigNumber = BigNumber.from(1234),
    deadline: BigNumber = BigNumber.from(Math.floor(Date.now() / 1000) + 3),
  ): CreateProject {
    return {
      id,
      category,
      title,
      description,
      url,
      goal,
      deadline,
    };
  }

  private toProjectInfo(
    projectInfo: [
      [
        string,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        string
      ] & {
        category: string;
        title: string;
        description: string;
        url: string;
        goal: BigNumber;
        created: BigNumber;
        deadline: BigNumber;
        creator: string;
      },
      BigNumber,
      BigNumber,
      BigNumber,
      string
    ],
  ): ProjectInfo {
    return {
      category: projectInfo[0][0],
      title: projectInfo[0][1],
      description: projectInfo[0][2],
      url: projectInfo[0][3],
      goal: projectInfo[0][4],
      created: projectInfo[0][5],
      deadline: projectInfo[0][6],
      creator: projectInfo[0][7],
      totalContributions: projectInfo[1],
      totalContributors: projectInfo[2],
      totalFunding: projectInfo[3],
      manager: projectInfo[4],
    };
  }

  private async submitProject(contract: ProjectManager, project: CreateProject) {
    return await this.submitTransaction(() => {
      return contract.create(project.id, project.category, project.title, project.description, project.url, project.goal, project.deadline, {
        ...getOverrideOptions(this.nervosProviderUrl),
      });
    });
  }
}

(async () => {
  const test = new ProjectManagerTest();
  await test.initAsync();
  //await test.deployContract();
  await test.deploy();
  //await test.contribute("0x5B635aA13AE9c1907517087FD7C0a845F1aDb582", "0x817b7D90D74539D359aD68Cc14E1129802aF1615");
  process.exit(0);
})();
