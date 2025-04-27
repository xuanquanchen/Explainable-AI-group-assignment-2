import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">ClearSpeech AI — Select Task</h1>

      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => navigate("/no-ai-statement")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Manual Transcription (No AI)
        </button>

        <button
          onClick={() => navigate("/ai-only")}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
        >
          AI-Only Transcription
        </button>

        <button
          onClick={() => navigate("/human-ai")}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Human + AI Collaboration
        </button>
      </div>
    </div>
  );
}
