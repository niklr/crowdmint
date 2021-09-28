import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Project } from '../../../../util/types';

interface Props {
  canEdit: boolean;
  loading?: boolean;
  project?: Maybe<Project>;
}

export const ProjectInfoTitle = (props: Props) => {
  return (
    <Box sx={{ display: 'flex', p: 2, bgcolor: "secondary.main" }}>
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
        {!props.loading && props.canEdit && (
          <Button variant="contained" color="primary" sx={{ ml: 2 }} component={RouterLink} to={'/projects/' + props.project?.address + '/edit'}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
}
