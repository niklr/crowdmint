import { BigNumber } from "ethers";
import { BaseDataSource } from ".";
import { CommonUtil } from "../util/common.util";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { Contribution, Project } from "../util/types";

export class MockDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private _projects: Project[];

  constructor() {
    super();
    this._fileUtil = new BrowserFileUtil();
    this._projects = [];
  }

  protected async initAsyncProtected(): Promise<void> {
    let projects = await this._fileUtil.readFileAsync("./assets/data/mock_projects.json");
    projects = JSON.parse(projects);
    this._projects = [];
    for (let index = 0; index < projects.length; index++) {
      const p = projects[index];
      this._projects.push({
        address: p.address,
        category: p.category,
        createdTimestamp: p.created,
        expirationTimestamp: p.deadline,
        creator: p.creator,
        description: p.description,
        goal: p.goal,
        title: p.title,
        totalContributions: p.totalContributions,
        totalContributors: p.totalContributors,
        totalFunding: p.totalFunding,
        url: p.url
      })
    }
  }

  protected disposeProtected(): void {
    this._projects = [];
  }

  async getBalanceAsync(_address: string): Promise<BigNumber> {
    return BigNumber.from(0);
  }

  async getProjectIndexAsync(_id: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getProjectAddressAsync(_index: BigNumber): Promise<Maybe<string>> {
    return this._projects[_index.toNumber() - 1].address;
  }

  async getProjectAsync(_address: string): Promise<Project> {
    await CommonUtil.timeout(CommonUtil.random(500, 3000));
    const p = this._projects.find(e => e.address === _address);
    if (!p) {
      throw new Error("Project not found.")
    }
    return p;
  }

  async getProjectContributionAsync(_address: string, _index: BigNumber): Promise<Contribution> {
    return {
      contributor: '...',
      createdTimestamp: '...',
      amount: '...'
    };
  }

  async getTimestampAsync(): Promise<BigNumber> {
    return BigNumber.from(Math.round(new Date().getTime() / 1000));
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    await CommonUtil.timeout(2000);
    return BigNumber.from(this._projects.length);
  }

  async createProjectAsync(_id: string, _category: string, _title: string, _description: string, _url: string, _goal: BigNumber, _deadline: BigNumber): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async editProjectAsync(_address: string, _category: string, _title: string, _description: string, _url: string, _goal: BigNumber, _deadline: BigNumber): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async contributeAsync(_address: string, _amount: BigNumber): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}