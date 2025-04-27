import { useState } from "react";

interface AIOnlyPageProps {
  onComplete: (resultData: any) => void;
}

// Dummy AI transcription generator
function generateFakeTranscription(): string {
  const fakeTranscriptions = [
    "This is an automatically generated transcript of your audio.",
    "The AI attempted to transcribe your recording as follows.",
    "Generated transcription: please verify and confirm.",
    "AI thinks the audio said: 'The quick brown fox jumps over the lazy dog.'"
  ];
  return fakeTranscriptions[Math.floor(Math.random() * fakeTranscriptions.length)];
}

export default function AIOnlyPage({ onComplete }: AIOnlyPageProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [aiTranscription, setAITranscription] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
      // Simulate AI generating transcription
      setAITranscription(generateFakeTranscription());
    }
  };

  const handleStartRecording = () => {
    alert("Live recording feature is optional. Please upload audio for now.");
  };

  const handleAccept = () => {
    setConfirmed(true);
  };

  const handleRegenerate = () => {
    setAITranscription(generateFakeTranscription());
    setConfirmed(false);
  };

  const handleSubmit = () => {
    const resultData = {
      taskType: "AI Only",
      transcription: aiTranscription,
      accepted: confirmed,
    };

    if (onComplete) {
      onComplete(resultData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col space-y-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          🤖 AI-Generated Transcription
        </h1>
        <p className="text-center text-gray-500 text-md mb-6">
          Upload your audio and let the AI transcribe it for you. Accept or regenerate before confirming.
        </p>

        {/* Upload and Record Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <label className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-xl p-6 cursor-pointer transition">
            <span className="text-green-500 font-semibold mb-2">Upload Audio</span>
            <input type="file" accept="audio/*" className="hidden" onChange={handleUploadAudio} />
            <span className="text-xs text-green-400">Accepted: .mp3, .wav</span>
          </label>

          <button
            onClick={handleStartRecording}
            className="w-full md:w-1/2 bg-red-400 hover:bg-red-500 text-white py-4 rounded-xl font-semibold shadow-md transition text-lg"
          >
            Record Live (Coming Soon)
          </button>
        </div>

        {/* Audio Player */}
        {audioURL && (
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">▶️ Audio Playback</h2>
            <audio
              controls
              className="w-full rounded-xl border-2 border-gray-300 shadow-md transition hover:shadow-lg"
            >
              <source src={audioURL} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* AI Generated Text */}
        {aiTranscription && (
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">📝 AI-Generated Transcript</h2>
            <textarea
              value={aiTranscription}
              readOnly
              className="w-full h-48 p-4 rounded-2xl border-2 border-gray-300 focus:outline-none text-md bg-gray-100 shadow-inner resize-none"
            ></textarea>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <button
                onClick={handleAccept}
                className="w-full md:w-1/2 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-md transition-all"
              >
                Accept This Transcription
              </button>

              <button
                onClick={handleRegenerate}
                className="w-full md:w-1/2 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full shadow-md transition-all"
              >
                Regenerate Transcription
              </button>
            </div>
          </div>
        )}

        {/* Finalize Button */}
        <button
          onClick={handleSubmit}
          disabled={!confirmed}
          className={`w-full py-4 text-white font-bold text-lg rounded-xl transition ${
            confirmed ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Finalize and Continue
        </button>

      </div>
    </div>
  );
}
