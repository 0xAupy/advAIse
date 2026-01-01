"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  // 1. Initialize state with the server content ONCE
  // This creates a "buffer" so typing doesn't trigger server re-renders
  const [editorValue, setEditorValue] = useState(content);

  return (
    <div className="py-4">
      <MDEditor
        value={editorValue}
        onChange={setEditorValue} // 2. Update local state immediately as you type
        preview="edit" // 3. Switch to "edit" mode (or "live" for split view)
        height={700}
      />
    </div>
  );
};

export default CoverLetterPreview;
