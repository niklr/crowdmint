import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BigNumber } from 'ethers';
import React from 'react';
import { getLogger } from '../../../../util/logger';
import { ProjectContributionListItem } from '../contribution-list-item';

const logger = getLogger();

interface Props {
  address: Maybe<string>;
  total: BigNumber;
}

export const ProjectContributionList: React.FC<Props> = (props: Props) => {
  const total = props.total.toNumber();
  const indexes: number[] = [];
  for (let index = total - 1; indexes.length < 5 && indexes.length < total; index--) {
    indexes.push(index);
  }
  logger.info("ProjectContributionList indexes", indexes)();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              Contributor address
            </TableCell>
            <TableCell align="left">
              Date
            </TableCell>
            <TableCell align="right">
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indexes.map((index: number) => (
            <TableRow
              key={index.toString()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <ProjectContributionListItem address={props.address} index={BigNumber.from(index)}>
              </ProjectContributionListItem>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
