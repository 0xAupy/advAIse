"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "@/app/(main)/ai-cover-letter/_components/cover-letter-generator";
import CoverLetterPreview from "@/app/(main)/ai-cover-letter/_components/cover-letter-preview";

export default function NewCoverLetterPage() {
  const router = useRouter();
  const [generatedLetter, setGeneratedLetter] = useState(null);

  // Callback for CoverLetterGenerator
  const handleGenerated = (coverLetter) => {
    setGeneratedLetter(coverLetter);
  };

  const handleGoToList = () => {
    router.push("/ai-cover-letter");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">Create New Cover Letter</h1>
        <Button onClick={handleGoToList}>Back to List</Button>
      </div>

      {/* Generator Form */}
      <CoverLetterGenerator onGenerated={handleGenerated} />

      {/* Preview of Generated Letter */}
      {generatedLetter && (
        <div>
          <h2 className="text-2xl font-bold mb-3">Preview</h2>
          <CoverLetterPreview coverLetter={generatedLetter} />
        </div>
      )}
    </div>
  );
}
