import React from 'react';
import { TableCell } from '@mui/material';
import { MomentUtil } from '../../../../util/moment.util';
import { BigNumber } from 'ethers';

interface Props {
  index: BigNumber;
}

export const ProjectContributionListItem: React.FC<Props> = (props: Props) => {
  const momentUtil = new MomentUtil();

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  return (
    <>
      <TableCell component="th" scope="row">
        ...
      </TableCell>
      <TableCell align="left">
        {formatTimestamp('0')}
      </TableCell>
      <TableCell align="right">
        ... CKB
      </TableCell>
    </>
  );
}
