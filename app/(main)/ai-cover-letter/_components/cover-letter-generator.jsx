"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CoverLetterGenerator({ onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !jobDescription) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, jobDescription }),
      });
      const data = await res.json();
      onGenerated(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Generate New Cover Letter</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        rows={4}
      />

      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Cover Letter"}
      </Button>
    </div>
  );
}
