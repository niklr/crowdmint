import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Chip,
  Grid,
  Tooltip,
  Skeleton,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  CardActionArea,
  CardActions
} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Box } from '@mui/system';
import { BigNumber } from 'ethers';
import { MomentUtil } from '../../../../util/moment.util';
import { CommonUtil } from '../../../../util/common.util';
import { GET_PROJECT_ADDRESS_QUERY, GET_PROJECT_QUERY } from '../../../../queries/project';
import { GetProjectAddress, GetProjectAddressVariables } from '../../../../queries/__generated__/GetProjectAddress';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { Alert } from '../../../common/components/alert';
import { FormatUtil } from '../../../../util/format.util';

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
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export const ListItem: React.FC<Props> = (props: Props) => {
  const momentUtil = new MomentUtil();

  const projectAddressQuery = useQuery<GetProjectAddress, GetProjectAddressVariables>(GET_PROJECT_ADDRESS_QUERY, {
    variables: {
      index: props.index.toString()
    },
    fetchPolicy: 'network-only'
  });

  const projectQuery = useQuery<GetProject, GetProjectVariables>(GET_PROJECT_QUERY, {
    skip: !projectAddressQuery.data,
    variables: {
      address: projectAddressQuery.data?.projectAddress
    },
    fetchPolicy: 'network-only'
  });

  const error = projectAddressQuery.error || projectQuery.error;
  const loading = projectAddressQuery.loading || projectQuery.loading;
  const project = projectQuery.data?.project;

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  const truncate = (text: Maybe<string>) => {
    return CommonUtil.truncateString(text, 26);
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
                <Avatar>&nbsp;</Avatar>
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
                  {truncate(project?.title)}
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
                <Typography variant="caption" color="GrayText" sx={{ position: "absolute", top: 1, right: 0 }}>
                  <b>Expired</b>
                </Typography>
              </Box>
            )
          }
        />
        {
          loading ? (
            <Box sx={{ paddingTop: 1 }}>
              <Skeleton sx={{ height: 20, marginBottom: 1 }} animation="wave" variant="rectangular" />
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
        <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {loading ? (
            <Box sx={{ paddingTop: 1, paddingBottom: 2 }}>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
            </Box>
          ) : (
            <>
              {/* <Typography variant="body2" color="text.secondary" component="p">
              {
                "Why First Minister of Scotland Nicola Sturgeon thinks GDP is the wrong measure of a country's success:"
              }
            </Typography> */}
              <Box>
                <LinearProgressWithLabel value={75} />
              </Box>
              <Box component="div" style={{ width: "100%", whiteSpace: "nowrap" }}>
                <Box component="div" textOverflow="ellipsis" overflow="hidden">
                  <Typography variant="body2" align="center">{project?.totalFunding} / {project?.goal} CKB</Typography>
                </Box>
              </Box>
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