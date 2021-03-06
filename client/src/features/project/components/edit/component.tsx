import { useQuery } from '@apollo/client';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { GET_PROJECT_QUERY } from '../../../../queries/project';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { getProjectService } from '../../../../services/project.service';
import { CommonUtil } from '../../../../util/common.util';
import { getLogger } from '../../../../util/logger';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { TransformUtil } from '../../../../util/transform.util';
import { Project, SaveProject } from '../../../../util/types';
import { Alert } from '../../../common/components/alert';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { Editor } from '../../../common/components/editor';
import { ProjectInfo } from '../info';
import { ProjectInfoTitle } from '../info-title';

const logger = getLogger();

export const ProjectEdit = () => {
  const { address } = useParams();
  const [project, setProject] = useState<Maybe<Project>>(undefined);
  const [values, setValues] = useState<SaveProject>({
    category: "",
    title: "",
    description: "",
    goal: "",
    expirationTimestamp: ""
  });
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const editorRef = React.createRef<any>();
  const projectService = getProjectService();

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
    setProject(TransformUtil.toProject(p));
    setValues({
      category: p?.category ?? "",
      title: p?.title ?? "",
      description: p?.description ?? "",
      goal: p?.goal ?? "",
      expirationTimestamp: p?.expirationTimestamp ?? ""
    });
  }, [address, projectQuery.data?.project]);

  const handleChange = (prop: keyof SaveProject) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const saveAsync = async () => {
    try {
      if (!address || CommonUtil.isNullOrWhitespace(address)) {
        throw new Error("Invalid address");
      }
      const markdown = editorRef?.current?.getInstance().getMarkdown();
      await projectService.editAsync(address, values, markdown);
      SnackbarUtil.enqueueMessage("Project updated!");
      navigate(`/projects/${address}`);
    } catch (error) {
      logger.error(error)();
      SnackbarUtil.enqueueError(error);
    }
  }

  if (error) {
    return (
      <Alert message="Could not find the specified project." type="warning"></Alert>
    );
  }

  return (
    <>
      <Typography sx={{ pt: 4 }} variant="h4" component="div" gutterBottom>
        Edit project
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Paper>
            <Box sx={{ p: 2 }}>
              {loading ? (
                <Skeleton animation="wave" height={30} width="60%" />
              ) : (
                <FormControl fullWidth>
                  <InputLabel htmlFor="title-input">Title</InputLabel>
                  <OutlinedInput
                    id="title-input"
                    value={values.title}
                    label="Title"
                    autoComplete="off"
                    onChange={handleChange('title')}
                  />
                </FormControl>
              )}
            </Box>
          </Paper>
          <Paper ref={containerRef} sx={{ maxHeight: "800px", minHeight: "670px", my: 2, overflow: "auto" }}>
            {!loading && (
              <Editor containerRef={containerRef} editorRef={editorRef} readOnly={false} markdownUrl={project?.url}></Editor>
            )}
          </Paper>
          <Paper>
            <Box sx={{ p: 2, textAlign: "right" }}>
              <Button variant="outlined" color="primary" sx={{ mr: 2 }} component={RouterLink} to={'/projects/' + address}>
                Cancel
              </Button>
              <ClickOnceButton size="medium" color="primary" callbackFn={saveAsync}>
                Save
              </ClickOnceButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={4} xs={12}>
          <Paper>
            <ProjectInfoTitle canEdit={false} loading={loading} project={project}></ProjectInfoTitle>
            <Box sx={{ px: 2, pt: 2 }}>
              <Stack spacing={3}>
                {loading ? (
                  <Skeleton animation="wave" height={30} width="80%" />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel htmlFor="description-input">Description</InputLabel>
                    <OutlinedInput
                      id="description-input"
                      value={values.description}
                      label="Description"
                      autoComplete="off"
                      multiline
                      rows={4}
                      size="small"
                      onChange={handleChange('description')}
                    />
                  </FormControl>
                )}
              </Stack>
            </Box>
            <ProjectInfo isEdit={true} loading={loading} project={project}></ProjectInfo>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
