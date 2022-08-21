import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichTextInput.css';

const RichTextInput = ({ onEditorStateChange, editorState, placeholder }) => {
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbars"
        toolbar={{
          options: ['inline', 'link'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
        }}
        wrapperClassName="editorContainer"
        editorClassName="editors"
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
      />
    </div>
  );
  // }
};

export default RichTextInput;
