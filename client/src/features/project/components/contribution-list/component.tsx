import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { BigNumber } from 'ethers';
import React, { useCallback, useEffect } from 'react';
import { CommonUtil } from '../../../../util/common.util';
import { getLogger } from '../../../../util/logger';
import { ProjectContributionListItem } from '../contribution-list-item';

const logger = getLogger();

interface Props {
  address: Maybe<string>;
  total: BigNumber;
}

export const ProjectContributionList: React.FC<Props> = (props: Props) => {
  const total = props.total.toNumber();
  const rpp = 5;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rpp);
  const [indexes, setIndexes] = React.useState<number[]>([]);

  const updateIndexes = useCallback(() => {
    const indexes: number[] = [];
    const maxRows = CommonUtil.calculateMaxRows(total, rowsPerPage, page);
    for (let index = rowsPerPage * page + maxRows - 1; indexes.length < maxRows; index--) {
      indexes.push(index);
    }
    setIndexes(indexes);
    logger.info("ProjectContributionList indexes", indexes)();
  }, [total, rowsPerPage, page]);

  useEffect(() => {
    setRowsPerPage(rpp);
    setLastPage(total, rpp);
  }, [total, rpp]);

  useEffect(() => {
    updateIndexes();
  }, [total, rpp, page, updateIndexes]);

  const setLastPage = (total: number, rpp: number) => {
    setPage(Math.max(Math.floor(total / rpp) - 1, 0));
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rpp = parseInt(event.target.value, 10);
    setRowsPerPage(rpp);
    setLastPage(total, rpp);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
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
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
