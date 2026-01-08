"use client";

import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  // Helper to extract content between ```markdown and ```
  const formatContent = (text) => {
    if (!text) return "";

    // Regex to find text between triple backticks (handling 'markdown' tag or just plain backticks)
    const match = text.match(/```(?:markdown)?\s*([\s\S]*?)\s*```/);

    // If a match is found, return the captured group (index 1), otherwise return original text
    return match ? match[1].trim() : text;
  };

  const [editorValue, setEditorValue] = useState(formatContent(content));

  // Ensure state updates if the parent passes new content prop
  useEffect(() => {
    setEditorValue(formatContent(content));
  }, [content]);

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
