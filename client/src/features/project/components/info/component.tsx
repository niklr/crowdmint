import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MomentUtil } from '../../../../util/moment.util';

interface Props {
  id: string;
  canEdit: boolean;
}

export const ProjectInfo = (props: Props) => {
  const momentUtil = new MomentUtil();

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  return (
    <Paper>
      <Box sx={{ display: 'flex', p: 2, bgcolor: "primary.main" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{
            display: "flex",
            alignItems: "center"
          }}>
            <InfoOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Project information</Typography>
          </Box>
        </Box>
        <Box>
          {props.canEdit && (
            <Button variant="contained" color="secondary" sx={{ ml: 2 }} component={RouterLink} to={'/projects/' + props.id + '/edit'}>
              Edit
            </Button>
          )}
        </Box>
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
  );
}
