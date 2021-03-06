import { useQuery } from '@apollo/client';
import { Box, Button, Chip, Grid, LinearProgress, Paper, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommonContext } from '../../../../contexts/common.context';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { GET_PROJECT_QUERY } from '../../../../queries/project';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { CommonUtil } from '../../../../util/common.util';
import { getLogger } from '../../../../util/logger';
import { MomentUtil } from '../../../../util/moment.util';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { TransformUtil } from '../../../../util/transform.util';
import { Project } from '../../../../util/types';
import { Alert } from '../../../common/components/alert';
import { Editor } from '../../../common/components/editor';
import { ProjectContributeDialog } from '../contribute-dialog';
import { ProjectContributionList } from '../contribution-list';
import { ProjectInfo } from '../info';
import { ProjectInfoTitle } from '../info-title';

const logger = getLogger();

export const ProjectOverview = () => {
  const { address } = useParams();
  const context = useConnectedWeb3Context();
  const commonContext = getCommonContext();
  const [project, setProject] = useState<Maybe<Project>>(undefined);
  const [percentage, setPercentage] = useState<number>(0);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [openContributeDialog, setOpenContributeDialog] = React.useState(false);
  const chainUtil = commonContext.datasource.util;
  const momentUtil = new MomentUtil();
  const containerRef = useRef(null);
  const editorRef = React.createRef<any>();

  const projectQuery = useQuery<GetProject, GetProjectVariables>(GET_PROJECT_QUERY, {
    variables: {
      address: address
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  const error = projectQuery.error;
  const loading = projectQuery.loading;

  useEffect(() => {
    const p = projectQuery.data?.project;
    const accountAddress = commonContext.datasource.util.toAlternateAddress(context.account);
    logger.info("Creator:", p?.creator, "Account:", accountAddress)();
    setProject(TransformUtil.toProject(p));
    setPercentage(CommonUtil.calculatePercentage(p?.totalFunding, p?.goal));
    setCanEdit(p?.creator?.toLowerCase() === accountAddress?.toLowerCase());
    return () => {
      // TODO: destroy contract event listeners
      logger.info("ProjectOverview cleaned up")();
    };
  }, [context.account, commonContext.datasource.util, projectQuery.data?.project]);

  if (error) {
    return (
      <Alert message="Could not find the specified project." type="warning"></Alert>
    );
  }

  const handleContributeCallback = async (success: boolean) => {
    if (success) {
      SnackbarUtil.enqueueMessage("Success!");
      await projectQuery.refetch();
    }
    setOpenContributeDialog(false);
  }

  return (
    <>
      <Grid sx={{ pt: 4 }} container spacing={2}>
        <Grid item md={8} xs={12}>
          <Paper>
            <Box sx={{ p: 2, wordBreak: "break-all" }}>
              {loading ? (
                <Skeleton animation="wave" height={30} width="60%" />
              ) : (
                <Typography variant="h5">{project?.title}</Typography>
              )}
            </Box>
            <Box sx={{ px: 2, pb: 2 }}>
              {loading ? (
                <Skeleton animation="wave" height={30} width="80%" />
              ) : (
                <LinearProgress sx={{ height: "20px", borderRadius: "5px" }} variant="determinate" value={percentage} />
              )}
            </Box>
            {!loading && (
              <Box sx={{
                px: 2, pb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Tooltip title={chainUtil.toNativeString(project?.totalFunding) + ' / ' + chainUtil.toNativeString(project?.goal)} placement="bottom" arrow>
                  <Typography color="GrayText" noWrap>
                    {chainUtil.toNative(project?.totalFunding).toString()} / {chainUtil.toNative(project?.goal).toString()} {chainUtil.nativeName}
                  </Typography>
                </Tooltip>
                {momentUtil.isExpired(project?.expirationTimestamp) ? (
                  <Chip label="Expired" size="small" />
                ) : (
                  <Button variant="contained" size="medium" color="secondary" onClick={() => setOpenContributeDialog(true)}>Contribute</Button>
                )}
                <Typography color="GrayText" noWrap>{percentage}%</Typography>
              </Box>
            )}
          </Paper>
          <Paper ref={containerRef} sx={{ maxHeight: "800px", minHeight: "670px", my: 2, overflow: "auto" }}>
            {!loading && (
              <Editor containerRef={containerRef} editorRef={editorRef} readOnly={true} markdownUrl={project?.url}></Editor>
            )}
          </Paper>
        </Grid>
        <Grid item md={4} xs={12}>
          <Paper>
            <ProjectInfoTitle canEdit={canEdit} loading={loading} project={project}></ProjectInfoTitle>
            <ProjectInfo loading={loading} project={project}></ProjectInfo>
          </Paper>
          <Paper sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', p: 2, bgcolor: "secondary.main" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5">Limited NFT shares</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ px: 2, pt: 2 }} >
              <Box sx={{ pb: 1 }}>
                <Chip label="0" size="small" variant="outlined" /> of <Chip label="1000" size="small" /> available
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                <TextField
                  label="NFT amount"
                  id="nft-amount"
                  defaultValue="0"
                  size="small"
                  type="number"
                  fullWidth
                  disabled
                />
                <Button sx={{ ml: 1 }} variant="outlined" disabled>Mint</Button>
              </Box>
              <Box sx={{ pb: 1 }}>
                <b>50%</b> of the overfunded amount will be distributed among NFT holders
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ProjectContributionList address={project?.address} total={TransformUtil.toBigNumber(project?.totalContributions)}></ProjectContributionList>
        </Grid>
      </Grid>
      <ProjectContributeDialog
        open={openContributeDialog}
        onClose={handleContributeCallback}
        project={project}>
      </ProjectContributeDialog>
    </>
  );
}
