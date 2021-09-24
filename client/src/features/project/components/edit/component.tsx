import React, { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { Alert } from '../../../common/components/alert';
import { Editor } from '../../../common/components/editor';
import { ProjectInfo } from '../info';

export const ProjectEdit = () => {
  const { id } = useParams<{ id: any }>();
  const editorRef = useRef(null);

  if (false) {
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
              <TextField label="Title" defaultValue="Project title" variant="outlined" fullWidth />
            </Box>
          </Paper>
          <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
            <Editor editorRef={editorRef} readOnly={false} markdownUrl={'https://raw.githubusercontent.com/nhn/tui.editor/master/apps/react-editor/README.md'}></Editor>
          </Paper>
          <Paper>
            <Box sx={{ p: 2, textAlign: "right" }}>
              <Button variant="outlined" color="primary" sx={{ mr: 2 }} component={RouterLink} to={'/projects/' + id}>
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={4} xs={12}>
          <ProjectInfo id={id} canEdit={false}></ProjectInfo>
        </Grid>
      </Grid>
    </>
  );
}
