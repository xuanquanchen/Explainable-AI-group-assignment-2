import { useState, useRef } from "react";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";
import { useNavigate } from "react-router-dom"; // Add navigate

interface NoAIPageProps {
  onComplete: (resultData: any) => void;
}

const groundTruth = "This is the correct transcript of the audio.";

export default function NoAIPage({ onComplete }: NoAIPageProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate(); // hook

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
      setStartTime(Date.now());
    }
  };

  const handleStartRecording = () => {
    alert("Live recording is optional. Please upload an audio file for now.");
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const durationSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;
    const wer = calculateWER(groundTruth, transcription);
    const cer = calculateCER(groundTruth, transcription);

    const resultData = {
      taskType: "No AI",
      transcription,
      startTime: startTime || endTime,
      endTime,
      durationSeconds,
      wer,
      cer,
    };

    if (onComplete) {
      onComplete(resultData);
    }

    navigate("/survey"); // Redirect immediately to survey page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col space-y-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          🎙️ Audio Transcription
        </h1>
        <p className="text-center text-gray-500 text-md mb-6">
          Upload an audio file or record live. Listen carefully and type what you hear.
        </p>

        {/* Upload and Record */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <label className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-xl p-6 cursor-pointer transition">
            <span className="text-blue-500 font-semibold mb-2">Upload Audio</span>
            <input type="file" accept="audio/*" className="hidden" onChange={handleUploadAudio} />
            <span className="text-xs text-blue-400">Accepted formats: .mp3, .wav</span>
          </label>

          <button
            onClick={handleStartRecording}
            className="w-full md:w-1/2 bg-red-400 hover:bg-red-500 text-white py-4 rounded-xl font-semibold shadow-md transition text-lg"
          >
            Record Live (Coming Soon)
          </button>
        </div>

        {/* Audio Player */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">▶️ Audio Playback</h2>
          {audioURL ? (
            <audio
              ref={audioRef}
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

        {/* Transcription Box */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">✏️ Type Your Transcription</h2>
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Type everything you hear here..."
            className="w-full h-72 p-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 resize-none shadow-inner text-md"
          ></textarea>
        </div>

        {/* Finalize Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition"
        >
          Finalize and Continue
        </button>

      </div>
    </div>
  );
}
