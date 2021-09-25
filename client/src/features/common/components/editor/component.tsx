import { Box } from '@mui/system';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as TuiEditor, Viewer as TuiViewer } from '@toast-ui/react-editor';
import React, { useEffect, useState } from 'react';
import { BrowserFileUtil } from '../../../../util/file.util';
import { getLogger } from '../../../../util/logger';
import { Alert } from '../alert';

const logger = getLogger();

interface Props {
  readOnly?: boolean,
  markdownUrl?: string,
  editorRef: React.RefObject<any>
}

export const Editor = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  let height = "400px";
  if (props.editorRef?.current?.clientHeight) {
    height = props.editorRef?.current?.clientHeight + "px";
  }

  useEffect(() => {
    const fileUtil = new BrowserFileUtil();
    const downloadAsync = async () => {
      try {
        if (props.markdownUrl) {
          setIsLoading(true);
          const response = await fileUtil.readFileAsync(props.markdownUrl);
          setContent(response);
        }
      } catch (error) {
        logger.error(error)();
      } finally {
        setIsLoading(false);
      }
    }
    downloadAsync();
  }, [props.markdownUrl])

  if (isLoading) {
    return (
      <>
        <Box sx={{ m: 2 }}>
          <Alert message="Loading..." type="default"></Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      {props.readOnly ? (
        <Box sx={{ px: 2, py: 1 }}>
          <TuiViewer
            initialValue={content}
          />
        </Box>
      ) : (
        <TuiEditor
          initialValue={content}
          previewStyle="tab"
          initialEditType="markdown"
          height={height}
        />
      )}
    </>
  );
}
