import React from 'react';
import { BigNumber } from 'ethers';
import { Skeleton, TableCell } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GetProjectContribution, GetProjectContributionVariables } from '../../../../queries/__generated__/GetProjectContribution';
import { GET_PROJECT_CONTRIBUTION_QUERY } from '../../../../queries/project';
import { MomentUtil } from '../../../../util/moment.util';
import { TransformUtil } from '../../../../util/transform.util';

interface Props {
  address: Maybe<string>;
  index: BigNumber;
}

export const ProjectContributionListItem: React.FC<Props> = (props: Props) => {
  const momentUtil = new MomentUtil();

  const contributionQuery = useQuery<GetProjectContribution, GetProjectContributionVariables>(GET_PROJECT_CONTRIBUTION_QUERY, {
    variables: {
      address: props.address,
      index: props.index.toString()
    }
  });

  const loading = contributionQuery.loading;
  const contribution = contributionQuery.data?.projectContribution;

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  const toCKByteString = (amount: Maybe<string>) => {
    return TransformUtil.toCKByteString(amount);
  }

  return (
    <>
      <TableCell component="th" scope="row">
        {loading ? (
          <Skeleton animation="wave" height={30} width="50%" />
        ) : (
          <>{contribution?.contributor ?? "..."}</>
        )}
      </TableCell>
      <TableCell align="left">
        {loading ? (
          <Skeleton animation="wave" height={30} width="50%" />
        ) : (
          <>{contribution?.createdTimestamp ? formatTimestamp(contribution?.createdTimestamp) : "..."}</>
        )}
      </TableCell>
      <TableCell align="right">
        {loading ? (
          <Skeleton animation="wave" height={30} width="100%" />
        ) : (
          <>{contribution?.amount ? toCKByteString(contribution?.amount) : "..."} CKB</>
        )}
      </TableCell>
    </>
  );
}
