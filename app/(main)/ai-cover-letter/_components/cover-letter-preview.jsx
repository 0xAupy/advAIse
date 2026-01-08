export default function CoverLetterPreview({ coverLetter }) {
  if (!coverLetter) return null;

  return (
    <div className="p-4 bg-gray-100 rounded whitespace-pre-line">
      <h3 className="text-xl font-bold mb-2">{coverLetter.jobTitle}</h3>
      <p className="mb-4 font-semibold">{coverLetter.companyName}</p>
      <pre className="whitespace-pre-line">{coverLetter.content}</pre>
    </div>
  );
}
