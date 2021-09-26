import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Skeleton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MomentUtil } from '../../../../util/moment.util';
import { GenericType, Project } from '../../../../util/types';
import { CommonUtil } from '../../../../util/common.util';
import { ProjectTypes } from '../../../../common/constants';

interface Props {
  canEdit: boolean;
  loading?: boolean;
  project?: Maybe<Project>;
}

export const ProjectInfo = (props: Props) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [category, setCategory] = useState<Maybe<GenericType>>(undefined);
  const momentUtil = new MomentUtil();

  useEffect(() => {
    setPercentage(CommonUtil.calculatePercentage(props.project?.totalFunding, props.project?.goal));
    setCategory(ProjectTypes.find(e => e.type === props.project?.category));
  }, [props.project]);

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  return (
    <Paper>
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
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Type</Typography>
        {props.loading || !category ? (
          <Skeleton animation="wave" height={15} width="50%" />
        ) : (
          <Typography fontSize={13} noWrap>{category?.name} ({category?.type})</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Creation date</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="40%" />
        ) : (
          <Typography fontSize={13} noWrap>{formatTimestamp(props.project?.createdTimestamp)}</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Goal</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="40%" />
        ) : (
          <Typography fontSize={13} noWrap>{props.project?.goal} CKB</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Reached</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="40%" />
        ) : (
          <Typography fontSize={13} noWrap>{props.project?.totalFunding} CKB ({percentage}%)</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Expiration date</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="40%" />
        ) : (
          <Typography fontSize={13} noWrap>{formatTimestamp(props.project?.expirationTimestamp)}</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Contributions / Contributors</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="30%" />
        ) : (
          <Typography fontSize={13} noWrap>{props.project?.totalContributions} / {props.project?.totalContributors}</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Creator</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="70%" />
        ) : (
          <Typography fontSize={13} noWrap>{props.project?.creator}</Typography>
        )}
      </Box>
      <Box sx={{ px: 2, py: 2 }} >
        <Typography fontWeight="bold">Contract</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="70%" />
        ) : (
          <Typography fontSize={13} noWrap>{props.project?.address}</Typography>
        )}
      </Box>
    </Paper>
  );
}
