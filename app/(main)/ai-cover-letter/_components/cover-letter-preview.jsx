"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  const [editorValue, setEditorValue] = useState(content);

  return (
    <div className="py-4">
      <MDEditor
        value={editorValue}
        onChange={setEditorValue}
        preview="edit"
        height={700}
      />
    </div>
  );
};

export default CoverLetterPreview;
