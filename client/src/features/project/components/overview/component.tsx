import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Grid, Paper, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert } from '../../../common/components/alert';
import { MomentUtil } from '../../../../util/moment.util';

export const ProjectOverview = () => {
  const { id } = useParams<{ id: any }>();
  const momentUtil = new MomentUtil();


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
          Hello
        </Paper>
      </Grid>
      <Grid item md={4} xs={12}>
        <Paper>
          <Box sx={{
            padding: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <InfoOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Project information</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Creation date</Typography>
            <Typography variant="caption" noWrap>{formatTimestamp('1632462812')}</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Goal</Typography>
            <Typography variant="caption" noWrap>10000 CKB</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Reached</Typography>
            <Typography variant="caption" noWrap>7500 CKB (75%)</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Expiration date</Typography>
            <Typography variant="caption" noWrap>{formatTimestamp('1632462812')}</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Contributions / Contributors</Typography>
            <Typography variant="caption" noWrap>5 / 3</Typography>
          </Box>
          <Box sx={{ px: 2, pt: 2 }} >
            <Typography fontWeight="bold">Creator</Typography>
            <Typography variant="caption" noWrap>0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c</Typography>
          </Box>
          <Box sx={{ px: 2, py: 2 }} >
            <Typography fontWeight="bold">Contract</Typography>
            <Typography variant="caption" noWrap>0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          Contributors
        </Paper>
      </Grid>
    </Grid>
  );
}
