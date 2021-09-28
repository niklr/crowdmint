import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BigNumber } from 'ethers';
import { getApolloClient } from '../clients/apollo.client';
import { getIpfsClient, IpfsClient } from '../clients/ipfs.client';
import { CommonConstants } from '../common/constants';
import { ConnectedWeb3Context } from '../contexts/connectedWeb3';
import { CommonUtil } from '../util/common.util';
import { Ensure } from '../util/ensure';
import { getLogger } from '../util/logger';
import { TransformUtil } from '../util/transform.util';
import { CreateProject, EditProject, SaveProject } from '../util/types';

const logger = getLogger();

class ProjectService {

  private readonly _apollo: ApolloClient<NormalizedCacheObject>;
  private readonly _ipfs: IpfsClient;

  constructor() {
    this._apollo = getApolloClient();
    this._ipfs = getIpfsClient();
  }

  private validate(context: ConnectedWeb3Context, values: SaveProject, markdown: any): void {
    Ensure.notNull(context, "context");
    Ensure.notNull(values, "values");
    Ensure.notNullOrWhiteSpace(context.account, "context.account", "Please connect your wallet first.");
    Ensure.notNullOrWhiteSpace(values.title, "title", "Please enter a title.");
    Ensure.notNullOrWhiteSpace(values.description, "description", "Please enter a description.");
    Ensure.notNullOrWhiteSpace(markdown, "markdown", "Please enter content in the markdown editor.");
    if (values.title.length > CommonConstants.PROJECT_TITLE_MAX_LENGTH) {
      throw new Error("Title is too long.")
    }
    if (values.description.length > CommonConstants.PROJECT_DESCRIPTION_MAX_LENGTH) {
      throw new Error("Description is too long.")
    }
  }

  async createAsync(context: ConnectedWeb3Context, values: CreateProject, markdown: any): Promise<string> {
    this.validate(context, values, markdown);
    Ensure.notNullOrWhiteSpace(values.type, "type", "Please specify a valid project type.");
    Ensure.notNullOrWhiteSpace(values.goal, "goal", "Please specify a valid goal.");
    Ensure.notNull(values.expirationDate, "expirationDate", "Please specify a valid expiration date.");

    const now = Math.floor(Date.now() / 1000);
    const expirationDate = values.expirationDate as Date;
    const deadline = Math.floor(expirationDate.getTime() / 1000);
    if (now >= deadline) {
      throw new Error("Expiration date is in the past.");
    }
    const goal = TransformUtil.toCKBit(values.goal);
    if (goal.lte(0)) {
      throw new Error("Goal is not valid.");
    }

    const ipfsResult = await this._ipfs.uploadAsync(markdown);

    const id = CommonUtil.uuid();
    logger.info("Project id:", id)();
    const tx = await context.datasource.createProjectAsync(id, values.type, values.title, values.description, ipfsResult.url, goal, BigNumber.from(deadline));
    logger.info(tx)();
    const projectIndex = await context.datasource.getProjectIndexAsync(id);
    const projectAddress = await context.datasource.getProjectAddressAsync(projectIndex);
    if (CommonUtil.isNullOrWhitespace(projectAddress)) {
      throw new Error("Project could not be created.");
    }
    // TODO: pin with pinata
    return projectAddress;
  }

  async editAsync(context: ConnectedWeb3Context, values: EditProject, markdown: any): Promise<void> {
    this.validate(context, values, markdown);
    Ensure.notNullOrWhiteSpace(values.address, "address", "Project address is empty.");

    const ipfsResult = await this._ipfs.uploadAsync(markdown);

    const empty = {
      category: "",
      goal: BigNumber.from(0),
      deadline: BigNumber.from(0)
    }

    const tx = await context.datasource.editProjectAsync(values.address, empty.category, values.title, values.description, ipfsResult.url, empty.goal, empty.deadline);
    logger.info(tx)();
  }
}

const service = new ProjectService();

export const getProjectService = () => {
  return service;
}