import { useState, useEffect } from "react";

interface HumanAIPageProps {
  onComplete: (resultData: any) => void;
}

// Simulated AI-generated text with uncertain flags
function generateFakeHumanAITranscription(): string {
  return "Hello, this is an [uncertain] transcript based on the [uncertain] audio you uploaded.";
}

// Utility: properly build highlighted HTML
function getHighlightedHTML(text: string): string {
  return text
    .split(' ')
    .map(word => {
      if (word.includes('[uncertain]')) {
        const cleanWord = word.replace('[]', '');
        return `<span style="background-color: yellow; padding: 2px; border-radius: 4px;">${cleanWord}</span>`;
      }
      return word;
    })
    .join(' ');
}

export default function HumanAIPage({ onComplete }: HumanAIPageProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>(generateFakeHumanAITranscription());
  const [highlightedHTML, setHighlightedHTML] = useState<string>('');
  const [editedTranscription, setEditedTranscription] = useState<string>("");

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

  const handleSubmit = () => {
    const resultData = {
      taskType: "Human+AI",
      transcription: editedTranscription,
    };

    if (onComplete) {
      onComplete(resultData);
    }
  };

  useEffect(() => {
    const html = getHighlightedHTML(transcription);
    setHighlightedHTML(html);
  }, [transcription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-start p-8 space-y-10">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col space-y-2">
        <h1 className="text-5xl font-bold text-gray-800">🧑‍🤝‍🧑 Human + AI Transcription</h1>
        <p className="text-lg text-gray-500">
          Upload audio. AI suggests a transcription. Uncertain words are highlighted for you to edit.
        </p>
      </div>

      {/* Upload and Audio */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Upload + Player */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">🎵 Upload or Record Audio</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 rounded-xl p-8 cursor-pointer transition">
            <span className="text-indigo-500 font-semibold mb-2">Click to Upload</span>
            <input type="file" accept="audio/*" className="hidden" onChange={handleUploadAudio} />
            <span className="text-xs text-indigo-400">Supported formats: .mp3, .wav</span>
          </label>
          <button
            onClick={handleStartRecording}
            className="w-full py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-xl shadow-md transition text-lg"
          >
            Record Live (Coming Soon)
          </button>

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

        {/* Highlighted Transcription + Editable Text */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">📝 AI-Suggested (Highlighted)</h2>

          {/* Highlighted Display */}
          <div
            className="w-full h-60 p-6 rounded-2xl border-2 border-gray-300 bg-white shadow-inner text-md overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: highlightedHTML }}
          />

          {/* Editable Final Correction */}
          <h2 className="text-lg font-semibold text-gray-600">✏️ Edit Your Final Transcript</h2>
          <textarea
            value={editedTranscription}
            onChange={(e) => setEditedTranscription(e.target.value)}
            className="w-full h-48 p-6 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 shadow-inner text-md resize-none transition"
            placeholder="Edit the transcript here..."
          ></textarea>
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
