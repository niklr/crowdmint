import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, Skeleton, Typography } from '@mui/material';
import { ProjectInfo } from '../info';
import { Alert } from '../../../common/components/alert';
import { Editor } from '../../../common/components/editor';
import { GetProject, GetProjectVariables } from '../../../../queries/__generated__/GetProject';
import { GET_PROJECT_QUERY } from '../../../../queries/project';
import { Project } from '../../../../util/types';
import { TransformUtil } from '../../../../util/transform.util';
import { ClickOnceButton } from '../../../common/components/click-once-button';

interface EditProject {
  title: string;
}

export const ProjectEdit = () => {
  const { address } = useParams<{ address: any }>();
  const [project, setProject] = useState<Maybe<Project>>(undefined);
  const [values, setValues] = useState<EditProject>({
    title: "",
  });
  const editorRef = useRef(null);

  const projectQuery = useQuery<GetProject, GetProjectVariables>(GET_PROJECT_QUERY, {
    variables: {
      address: address
    },
    fetchPolicy: 'network-only'
  });

  const error = projectQuery.error;
  const loading = projectQuery.loading;

  useEffect(() => {
    const p = projectQuery.data?.project;
    setProject(TransformUtil.toProject(p));
    setValues({ title: p?.title ?? "" });
  }, [projectQuery.data?.project]);

  const handleChange = (prop: keyof EditProject) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const saveAsync = async () => {
    console.log(values);
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
          <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
            {!loading && (
              <Editor editorRef={editorRef} readOnly={false} markdownUrl={project?.url}></Editor>
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
          <ProjectInfo canEdit={false} loading={loading} project={project}></ProjectInfo>
        </Grid>
      </Grid>
    </>
  );
}
