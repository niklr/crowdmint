import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Alert } from '../../../common/components/alert';
import { MomentUtil } from '../../../../util/moment.util';
import { Editor } from '../../../common/components/editor';
import { ProjectInfo } from '../info';

function createData(
  index: string,
  name: string,
  date: string,
  amount: string
) {
  return { index, name, date, amount };
}

const rows = [
  createData('1', '0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c', '1632462812', '500'),
  createData('2', '0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c', '1632462812', '1500'),
];

export const ProjectOverview = () => {
  const { id } = useParams<{ id: any }>();
  const momentUtil = new MomentUtil();
  const editorRef = useRef(null);

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  if (false) {
    return (
      <Alert message="Could not find the specified project." type="warning"></Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Paper>
          <Box sx={{ p: 2, wordBreak: "break-all" }}>
            <Typography variant="h5">Project title</Typography>
          </Box>
          <Box sx={{ px: 2, pb: 2 }}>
            <LinearProgress sx={{ height: "20px", borderRadius: "5px" }} variant="determinate" value={75} />
          </Box>
          <Box sx={{
            px: 2, pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography color="GrayText" noWrap>7500 / 10000 CKB</Typography>
            {/* <Chip label="Expired" size="small" /> */}
            <Button variant="contained" color="secondary">
              Contribute
            </Button>
            <Typography color="GrayText" noWrap>75%</Typography>
          </Box>
        </Paper>
        <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
          <Editor editorRef={editorRef} readOnly={true} markdownUrl={'https://raw.githubusercontent.com/nhn/tui.editor/master/apps/react-editor/README.md'}></Editor>
        </Paper>
      </Grid>
      <Grid item md={4} xs={12}>
        <ProjectInfo id={id} canEdit={true}></ProjectInfo>
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
}
