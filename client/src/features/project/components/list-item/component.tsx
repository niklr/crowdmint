import { useQuery } from '@apollo/client';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import {
  Avatar, Card, CardActionArea,
  CardActions, CardContent, CardHeader, Chip,
  Grid, Skeleton, Tooltip, Typography
} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Box } from '@mui/system';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getCommonContext } from '../../../../contexts/common.context';
import { GET_PROJECT_ADDRESS_QUERY, GET_PROJECT_QUERY } from '../../../../queries/project';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { GetProjectAddress, GetProjectAddressVariables } from '../../../../queries/__generated__/GetProjectAddress';
import { CommonUtil } from '../../../../util/common.util';
import { FormatUtil } from '../../../../util/format.util';
import { MomentUtil } from '../../../../util/moment.util';
import { Alert } from '../../../common/components/alert';

interface Props {
  index: BigNumber;
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.primary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export const ListItem: React.FC<Props> = (props: Props) => {
  const commonContext = getCommonContext();
  const chainUtil = commonContext.datasource.util;
  const momentUtil = new MomentUtil();

  const projectAddressQuery = useQuery<GetProjectAddress, GetProjectAddressVariables>(GET_PROJECT_ADDRESS_QUERY, {
    variables: {
      index: props.index.toString()
    }
  });

  const projectQuery = useQuery<GetProject, GetProjectVariables>(GET_PROJECT_QUERY, {
    skip: !projectAddressQuery.data,
    variables: {
      address: projectAddressQuery.data?.projectAddress
    }
  });

  const error = projectAddressQuery.error || projectQuery.error;
  const loading = projectAddressQuery.loading || projectQuery.loading;
  const project = projectQuery.data?.project;

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  if (error) {
    return (
      <Alert message={FormatUtil.formatMessage(error)} type="warning"></Alert>
    );
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardActionArea disabled={loading} component={RouterLink} to={'/projects/' + project?.address}>
        <CardHeader sx={{ paddingBottom: 1 }}
          avatar={
            loading ? (
              <Skeleton animation="wave" variant="circular" width={40} height={40} />
            ) : (
              <Tooltip title="Placeholder" placement="top" arrow>
                <Avatar sx={{ bgcolor: "secondary.main" }}>&nbsp;</Avatar>
              </Tooltip>
            )
          }
          // action={
          //   loading ? null : (
          //     <IconButton aria-label="settings">
          //       <MoreVertIcon />
          //     </IconButton>
          //   )
          // }
          title={
            loading ? (
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              <Box component="div" sx={{ width: "100%", whiteSpace: "nowrap" }}>
                <Box component="div" textOverflow="ellipsis" overflow="hidden">
                  {CommonUtil.truncateString(project?.title, 26)}
                </Box>
              </Box>
            )
          }
          subheader={
            loading ? (
              <Skeleton animation="wave" height={10} width="40%" />
            ) : (
              <Box sx={{ position: "relative" }}>
                <Typography variant="caption" color="GrayText">
                  {formatTimestamp(project?.createdTimestamp)}
                </Typography>
                {momentUtil.isExpired(project?.expirationTimestamp) && (
                  <Typography variant="caption" color="GrayText" sx={{ position: "absolute", top: 1, right: 0 }}>
                    <b>Expired</b>
                  </Typography>
                )}
              </Box>
            )
          }
        />
        {
          loading ? (
            <Box sx={{ paddingTop: 1 }}>
              <Skeleton sx={{ height: 115, marginBottom: 1 }} animation="wave" variant="rectangular" />
            </Box>
          ) : (
            <>
              {/* <CardMedia
            component="img"
            height="140"
            image="https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512"
            alt="Nicola Sturgeon on a TED talk stage"
          /> */}
            </>
          )
        }
        <CardContent sx={{ pt: 0, pb: 1 }}>
          {loading ? (
            <Box sx={{ paddingTop: 1, paddingBottom: 2 }}>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
            </Box>
          ) : (
            <>
              <Box>
                <LinearProgressWithLabel value={CommonUtil.calculatePercentage(project?.totalFunding, project?.goal)} />
              </Box>
              <Box component="div" style={{ width: "100%", whiteSpace: "nowrap" }}>
                <Box component="div" textOverflow="ellipsis" overflow="hidden">
                  <Tooltip title={chainUtil.toNativeString(project?.totalFunding) + ' / ' + chainUtil.toNativeString(project?.goal)} placement="bottom" arrow>
                    <Typography variant="body2" align="center">
                      {chainUtil.toNative(project?.totalFunding).toString()} / {chainUtil.toNative(project?.goal).toString()} {chainUtil.nativeName}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Card sx={{ height: "100px", overflow: "auto" }} variant="outlined">
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" color="GrayText">
                    {CommonUtil.isNullOrWhitespace(project?.description) ? "No description available." : project?.description}
                  </Typography>
                </Box>
              </Card>
            </>
          )}
        </CardContent>
      </CardActionArea>
      {!loading && (
        <CardActions sx={{ paddingTop: 0 }}>
          <Grid container rowSpacing={0} columnSpacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={6}>
              <Tooltip title={"Contract: " + project?.address} arrow>
                <Chip sx={{ width: "100%" }} icon={<DescriptionOutlinedIcon />} label={project?.address} size="small" />
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title={"Creator: " + project?.creator}>
                <Chip sx={{ width: "100%" }} icon={<PersonOutlineRoundedIcon />} label={project?.creator} size="small" />
              </Tooltip>
            </Grid>
          </Grid>
        </CardActions>
      )}
    </Card >
  );
}