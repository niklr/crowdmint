import { GetProject_project } from '../queries/__generated__/GetProject';
import { Project } from './types';

export abstract class TransformUtil {
  static toProject(source: Maybe<GetProject_project>): Maybe<Project> {
    if (!source) {
      return;
    }
    return {
      address: source?.address,
      category: source?.category,
      createdTimestamp: source?.createdTimestamp,
      creator: source?.creator,
      description: source?.description,
      expirationTimestamp: source?.expirationTimestamp,
      goal: source?.goal,
      title: source?.title,
      totalContributions: source?.totalContributions,
      totalContributors: source?.totalContributors,
      totalFunding: source?.totalFunding,
      url: source?.url
    }
  }
}