import { BigNumber } from "ethers";
import { BaseDataSource } from ".";
import { IChainUtil, MockChainUtil } from "../util/chain.util";
import { CommonUtil } from "../util/common.util";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { Contribution, Project } from "../util/types";

export class MockDataSource extends BaseDataSource {
  private readonly _chainUtil: IChainUtil;
  private readonly _fileUtil: FileUtil;
  private _projects: Project[];
  private _projectIndexMap: Map<string, number>;

  constructor() {
    super();
    this._chainUtil = new MockChainUtil();
    this._fileUtil = new BrowserFileUtil();
    this._projects = [];
    this._projectIndexMap = new Map<string, number>();
  }

  private clear(): void {
    this._projects = [];
    this._projectIndexMap = new Map<string, number>();
  }

  protected async initAsyncProtected(): Promise<void> {
    let projects = await this._fileUtil.readFileAsync("./assets/data/mock_projects.json");
    projects = JSON.parse(projects);
    this.clear();
    for (let index = 0; index < projects.length; index++) {
      const p = projects[index];
      const id = this.createId();
      this._projectIndexMap.set(id, index + 1);
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
      });
    }
  }

  protected disposeProtected(): void {
    this.clear();
  }

  get util(): IChainUtil {
    return this._chainUtil;
  }

  async getBalanceAsync(_address: string): Promise<BigNumber> {
    return BigNumber.from(0);
  }

  async getProjectIndexAsync(_id: string): Promise<BigNumber> {
    const index = this._projectIndexMap.get(_id)
    if (!index) {
      return BigNumber.from(0);
    }
    return BigNumber.from(index);
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
      contributor: _index.toString(),
      createdTimestamp: BigNumber.from(this._moment.get().unix()).add(_index).toString(),
      amount: '...'
    };
  }

  async getTimestampAsync(): Promise<BigNumber> {
    return BigNumber.from(this._moment.get().unix());
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    await CommonUtil.timeout(2000);
    return BigNumber.from(this._projects.length);
  }

  async createProjectAsync(_id: string, _category: string, _title: string, _description: string, _url: string, _goal: BigNumber, _deadline: BigNumber): Promise<string> {
    const index = this._projects.length + 1;
    this._projectIndexMap.set(_id, index);
    this._projects.push({
      address: this.createId(),
      category: _category,
      createdTimestamp: this._moment.get().unix().toString(),
      expirationTimestamp: _deadline.toString(),
      creator: this.getAccount(),
      description: _description,
      goal: _goal.toString(),
      title: _title,
      totalContributions: "0",
      totalContributors: "0",
      totalFunding: "0",
      url: _url
    });
    return _id;
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