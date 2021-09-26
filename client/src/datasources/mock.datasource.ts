import { BigNumber } from "ethers";
import { BaseDataSource } from ".";
import { CommonUtil } from "../util/common.util";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { Project } from "../util/types";

export class MockDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private _projects: Project[];

  constructor() {
    super();
    this._fileUtil = new BrowserFileUtil();
    this._projects = [];
  }

  private async initAsync(): Promise<void> {
    if (!this._projects || this._projects.length <= 0) {
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
  }

  async getBalanceAsync(_address: string): Promise<BigNumber> {
    await this.initAsync();
    return BigNumber.from(0);
  }

  async getProjectAddressAsync(index: BigNumber): Promise<string> {
    await this.initAsync();
    return this._projects[index.toNumber()].address;
  }

  async getProjectAsync(address: string): Promise<Project> {
    await this.initAsync();
    const p = this._projects.find(e => e.address === address);
    if (!p) {
      throw new Error("Project not found.")
    }
    return p;
  }

  async getTimestampAsync(): Promise<BigNumber> {
    await this.initAsync();
    return BigNumber.from(Math.round(new Date().getTime() / 1000));
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    await this.initAsync();
    await CommonUtil.timeout(2000);
    return BigNumber.from(this._projects.length);
  }

  async createProjectAsync(_id: string, _category: string, _title: string, _url: string, _goal: BigNumber, _deadline: BigNumber): Promise<string> {
    await this.initAsync();
    throw new Error("Method not implemented.");
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}