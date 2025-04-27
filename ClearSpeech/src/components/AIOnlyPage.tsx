import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../Utils/firebase";

interface AIOnlyPageProps {
  onComplete: (resultData: any) => void;
}

// Dummy AI transcription generator
function generateFakeTranscription(): string {
  const fakeTranscriptions = [
    "Hello, this is an AI-generated transcript of your uploaded audio. Please review and proceed.",
    "AI guesses you said: The quick brown fox jumps over the lazy dog.",
    "This text was automatically generated based on your audio input.",
    "Generated text: Welcome to your AI-powered transcription experience."
  ];
  return fakeTranscriptions[Math.floor(Math.random() * fakeTranscriptions.length)];
}

export default function AIOnlyPage({ onComplete }: AIOnlyPageProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [aiTranscription, setAITranscription] = useState<string>(generateFakeTranscription());
  const navigate = useNavigate(); // Setup navigation

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const handleStartRecording = () => {
    alert("Live recording feature is optional. Please upload an audio file for now.");
  };

  const handleRegenerate = () => {
    setAITranscription(generateFakeTranscription());
  };

  const handleSubmit = async() => {
    const resultData = {
      taskType: "AI Only",
      transcription: aiTranscription,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "sessions"), resultData);
      navigate("/survey", { state: { sessionId: docRef.id } });
    }
    catch (error) {
      console.error("Fail to save: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-start p-8 space-y-10">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col space-y-2">
        <h1 className="text-5xl font-bold text-gray-800">🤖 AI-Only Transcription</h1>
        <p className="text-lg text-gray-500">
          Upload your audio. View and edit the AI transcription if needed. Regenerate if you wish. Finalize when ready.
        </p>
      </div>

      {/* Upload and Audio Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Upload or Record */}
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">🎵 Upload or Record Audio</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-xl p-8 cursor-pointer transition">
              <span className="text-green-500 font-semibold mb-2">Click to Upload</span>
              <input type="file" accept="audio/*" className="hidden" onChange={handleUploadAudio} />
              <span className="text-xs text-green-400">Supported: .mp3, .wav</span>
            </label>
            <button
              onClick={handleStartRecording}
              className="w-full py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xl shadow-md transition text-lg"
            >
              Record Live (Coming Soon)
            </button>
          </div>

          {/* Audio Player */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">▶️ Audio Player</h2>
            {audioURL ? (
              <audio
                controls
                className="w-full rounded-xl border-2 border-gray-300 shadow-md transition hover:shadow-lg"
              >
                <source src={audioURL} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="text-center text-gray-400 text-sm py-6 border-2 border-dashed border-gray-300 rounded-xl">
                No audio uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* AI Transcription */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">📝 AI-Generated Transcription</h2>
          <textarea
            value={aiTranscription}
            readOnly
            className="w-full h-[28rem] p-6 rounded-2xl border-2 border-gray-300 bg-gray-100 shadow-inner text-md resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          ></textarea>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full shadow-md transition-all"
          >
            🔄 Regenerate Transcription
          </button>
        </div>

      </div>

      {/* Finalize Button */}
      <div className="w-full max-w-6xl">
        <button
          onClick={handleSubmit}
          className="w-full py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-2xl rounded-full shadow-xl transition"
        >
          Finalize and Continue
        </button>
      </div>

    </div>
  );
}
