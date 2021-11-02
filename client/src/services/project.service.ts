import { ApolloClient, FetchPolicy, NormalizedCacheObject } from '@apollo/client';
import { BigNumber } from 'ethers';
import { getApolloClient } from '../clients/apollo.client';
import { getIpfsClient, IpfsClient } from '../clients/ipfs.client';
import { CommonConstants } from '../common/constants';
import { ConnectedWeb3Context } from '../contexts/connectedWeb3';
import { CREATE_PROJECT_MUTATION, EDIT_PROJECT_MUTATION } from '../mutations/project';
import { CreateProject, CreateProjectVariables } from '../mutations/__generated__/CreateProject';
import { EditProject, EditProjectVariables } from '../mutations/__generated__/EditProject';
import { GET_PROJECT_ADDRESS_QUERY } from '../queries/project';
import { GetProjectAddress, GetProjectAddressVariables } from '../queries/__generated__/GetProjectAddress';
import { GetProjectIndex, GetProjectIndexVariables } from '../queries/__generated__/GetProjectIndex';
import { CommonUtil } from '../util/common.util';
import { Ensure } from '../util/ensure';
import { getLogger } from '../util/logger';
import { TransformUtil } from '../util/transform.util';
import { SaveProject } from '../util/types';

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

  async getProjectIndexAsync(_id: string, _fetchPolicy: FetchPolicy = "network-only"): Promise<BigNumber> {
    const query = await this._apollo.query<GetProjectIndex, GetProjectIndexVariables>({
      query: GET_PROJECT_ADDRESS_QUERY,
      variables: {
        id: _id
      },
      fetchPolicy: _fetchPolicy
    });
    return BigNumber.from(query.data.projectIndex);
  }

  async getProjectAddressAsync(_index: string, _fetchPolicy: FetchPolicy = "network-only"): Promise<Maybe<string>> {
    const query = await this._apollo.query<GetProjectAddress, GetProjectAddressVariables>({
      query: GET_PROJECT_ADDRESS_QUERY,
      variables: {
        index: _index
      },
      fetchPolicy: _fetchPolicy
    });
    return query.data.projectAddress;
  }

  async createAsync(context: ConnectedWeb3Context, values: SaveProject, markdown: any): Promise<string> {
    this.validate(context, values, markdown);
    Ensure.notNullOrWhiteSpace(values.category, "category", "Please specify a valid project category.");
    Ensure.notNullOrWhiteSpace(values.goal, "goal", "Please specify a valid goal.");
    Ensure.notNull(values.expirationTimestamp, "expirationTimestamp", "Please specify a valid expiration date.");

    const now = BigNumber.from(TransformUtil.toTimestamp(new Date()));
    const deadline = BigNumber.from(values.expirationTimestamp);
    if (now.gte(deadline)) {
      throw new Error("Expiration date is in the past.");
    }
    const goal = TransformUtil.toCKBit(values.goal);
    if (goal.lte(0)) {
      throw new Error("Goal is not valid.");
    }

    const ipfsResult = await this._ipfs.uploadAsync(markdown);

    const id = CommonUtil.uuid();
    logger.info("Project id:", id)();
    const result = await this._apollo.mutate<CreateProject, CreateProjectVariables>({
      mutation: CREATE_PROJECT_MUTATION,
      variables: {
        id,
        category: values.category,
        title: values.title,
        description: values.description,
        url: ipfsResult.url,
        goal: goal.toString(),
        deadline: deadline.toString()
      }
    })
    logger.info(result.data?.createProject)();
    const projectIndex = await this.getProjectIndexAsync(id);
    const projectAddress = await this.getProjectAddressAsync(projectIndex.toString());
    if (!projectAddress || CommonUtil.isNullOrWhitespace(projectAddress)) {
      throw new Error("Project could not be created.");
    }
    return projectAddress;
  }

  async editAsync(context: ConnectedWeb3Context, address: string, values: SaveProject, markdown: any): Promise<void> {
    this.validate(context, values, markdown);
    Ensure.notNullOrWhiteSpace(address, "address", "Project address is empty.");

    const ipfsResult = await this._ipfs.uploadAsync(markdown);

    const result = await this._apollo.mutate<EditProject, EditProjectVariables>({
      mutation: EDIT_PROJECT_MUTATION,
      variables: {
        address,
        category: values.category,
        title: values.title,
        description: values.description,
        url: ipfsResult.url,
        goal: values.goal,
        deadline: values.expirationTimestamp
      }
    })
    logger.info(result.data?.editProject)();
  }
}

const service = new ProjectService();

export const getProjectService = () => {
  return service;
}