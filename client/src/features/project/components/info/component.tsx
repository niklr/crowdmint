import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { MomentUtil } from '../../../../util/moment.util';
import { GenericType, Project } from '../../../../util/types';
import { CommonUtil } from '../../../../util/common.util';
import { ProjectTypes } from '../../../../common/constants';
import { TransformUtil } from '../../../../util/transform.util';

interface Props {
  isEdit?: boolean;
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

  const toCKByte = (amount: Maybe<string>) => {
    return TransformUtil.toCKByte(amount).toString();
  }

  const toCKByteString = (amount: Maybe<string>) => {
    return TransformUtil.toCKByteString(amount);
  }

  return (
    <>
      <Box sx={{ px: 2, pt: 2, display: props.isEdit ? "none" : "block" }}>
        <Typography fontWeight="bold">Description</Typography>
        {props.loading || !category ? (
          <Skeleton animation="wave" height={15} width="50%" />
        ) : (
          <Typography fontSize={14}>
            {CommonUtil.isNullOrWhitespace(props.project?.description) ?
              "No description available." : CommonUtil.truncateString(props.project?.description, 256)
            }
          </Typography>
        )}
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
          <Tooltip title={toCKByteString(props.project?.goal)} placement="left" arrow>
            <Typography fontSize={13} noWrap>{toCKByte(props.project?.goal)} CKB</Typography>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ px: 2, pt: 2 }} >
        <Typography fontWeight="bold">Reached</Typography>
        {props.loading ? (
          <Skeleton animation="wave" height={15} width="40%" />
        ) : (
          <Tooltip title={toCKByteString(props.project?.totalFunding)} placement="left" arrow>
            <Typography fontSize={13} noWrap>{toCKByte(props.project?.totalFunding)} CKB ({percentage}%)</Typography>
          </Tooltip>
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
    </>
  );
}
