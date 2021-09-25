import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { Alert } from '../../../common/components/alert';
import { MomentUtil } from '../../../../util/moment.util';
import { Editor } from '../../../common/components/editor';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { CommonUtil } from '../../../../util/common.util';
import { ProjectContributorList } from '../contributor-list';
import { ProjectInfo } from '../info';

export const ProjectOverview = () => {
  const { id } = useParams<{ id: any }>();
  const momentUtil = new MomentUtil();
  const editorRef = useRef(null);
  const isExpired = momentUtil.isExpired(momentUtil.get().add(1, "days"));

  if (false) {
    return (
      <Alert message="Could not find the specified project." type="warning"></Alert>
    );
  }

  const contributeAsync = async () => {
    await CommonUtil.timeout(2000);
  }

  return (
    <Grid sx={{ pt: 4 }} container spacing={2}>
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
            {isExpired ? (
              <Chip label="Expired" size="small" />
            ) : (
              <ClickOnceButton size="medium" color="secondary" callbackFn={contributeAsync}>
                Contribute
              </ClickOnceButton>
            )}
            <Typography color="GrayText" noWrap>75%</Typography>
          </Box>
        </Paper>
        <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
          <Editor editorRef={editorRef} readOnly={true} markdownUrl={'https://raw.githubusercontent.com/nhn/tui.editor/master/apps/react-editor/README.md'}></Editor>
        </Paper>
      </Grid>
      <Grid item md={4} xs={12}>
        <ProjectInfo id={id} canEdit={true}></ProjectInfo>
      </Grid>
      <Grid item xs={12}>
        <ProjectContributorList></ProjectContributorList>
      </Grid>
    </Grid>
  );
}
