import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Button, Chip, Grid, LinearProgress, Paper, Skeleton, Typography } from '@mui/material';
import { ProjectContributeDialog } from '../contribute-dialog';
import { ProjectInfo } from '../info';
import { Alert } from '../../../common/components/alert';
import { MomentUtil } from '../../../../util/moment.util';
import { Editor } from '../../../common/components/editor';
import { CommonUtil } from '../../../../util/common.util';
import { ProjectContributorList } from '../contributor-list';
import { GET_PROJECT_QUERY } from '../../../../queries/project';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { getLogger } from '../../../../util/logger';
import { Project } from '../../../../util/types';
import { TransformUtil } from '../../../../util/transform.util';

const logger = getLogger();

export const ProjectOverview = () => {
  const { address } = useParams<{ address: any }>();
  const context = useConnectedWeb3Context();
  const [project, setProject] = useState<Maybe<Project>>(undefined);
  const [percentage, setPercentage] = useState<number>(0);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [openContributeDialog, setOpenContributeDialog] = React.useState(false);
  const momentUtil = new MomentUtil();
  const editorRef = useRef(null);

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
    logger.info("Creator:", p?.creator)();
    setProject(TransformUtil.toProject(p));
    setPercentage(CommonUtil.calculatePercentage(p?.totalFunding, p?.goal));
    setCanEdit(p?.creator === context.account);
    return () => {
      // TODO: destroy contract event listeners
      console.log("cleaned up");
    };
  }, [context.account, projectQuery.data?.project]);

  if (error) {
    return (
      <Alert message="Could not find the specified project." type="warning"></Alert>
    );
  }

  const handleContributeCallback = async (success: boolean) => {
    if (success) {
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
                <Typography color="GrayText" noWrap>{project?.totalFunding} / {project?.goal} CKB</Typography>
                {momentUtil.isExpired(project?.expirationTimestamp) ? (
                  <Chip label="Expired" size="small" />
                ) : (
                  <Button variant="contained" size="medium" color="secondary" onClick={() => setOpenContributeDialog(true)}>Contribute</Button>
                )}
                <Typography color="GrayText" noWrap>{percentage}%</Typography>
              </Box>
            )}
          </Paper>
          <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
            {!loading && (
              <Editor editorRef={editorRef} readOnly={true} markdownUrl={project?.url}></Editor>
            )}
          </Paper>
        </Grid>
        <Grid item md={4} xs={12}>
          <ProjectInfo canEdit={canEdit} loading={loading} project={project}></ProjectInfo>
        </Grid>
        <Grid item xs={12}>
          <ProjectContributorList></ProjectContributorList>
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
