import React, { useRef } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Button, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert } from '../../../common/components/alert';
import { MomentUtil } from '../../../../util/moment.util';
import { Editor } from '../../../common/components/editor';

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
  console.log("Project id:", id);
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
        <Paper>
          <Box sx={{
            padding: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center"
          }}>
            <InfoOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Project information</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Type</Typography>
            <Typography fontSize={13} noWrap>All-Or-Nothing (AON)</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Creation date</Typography>
            <Typography fontSize={13} noWrap>{formatTimestamp('1632462812')}</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Goal</Typography>
            <Typography fontSize={13} noWrap>10000 CKB</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Reached</Typography>
            <Typography fontSize={13} noWrap>7500 CKB (75%)</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Expiration date</Typography>
            <Typography fontSize={13} noWrap>{formatTimestamp('1632462812')}</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Contributions / Contributors</Typography>
            <Typography fontSize={13} noWrap>5 / 3</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Creator</Typography>
            <Typography fontSize={13} noWrap>0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c</Typography>
          </Box>
          <Box sx={{ px: 2, py: 2 }} >
            <Typography fontWeight="bold">Contract</Typography>
            <Typography fontSize={13} noWrap>0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c</Typography>
          </Box>
        </Paper>
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
