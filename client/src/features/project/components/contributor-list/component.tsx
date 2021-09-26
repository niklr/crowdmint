import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { MomentUtil } from '../../../../util/moment.util';

function createData(
  index: string,
  name: string,
  date: string,
  amount: string
) {
  return { index, name, date, amount };
}

const rows = [
  createData('1', '...', '1632462812', '...'),
];

export const ProjectContributorList = () => {
  const momentUtil = new MomentUtil();

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

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
          {rows.map((row) => (
            <TableRow
              key={row.index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">
                {formatTimestamp(row.date)}
              </TableCell>
              <TableCell align="right">
                {row.amount} CKB
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
