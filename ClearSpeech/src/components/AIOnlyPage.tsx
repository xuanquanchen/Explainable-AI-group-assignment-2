import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { audioList, transcriptPaths } from "../config/audioClips";

// Dummy AI transcription generator
function generateFakeTranscription(): string {
  const fakeTranscriptions = [
    "This is an AI-generated transcription based on the audio clip.",
    "AI thinks you said: The quick brown fox jumps over the lazy dog.",
    "Auto-generated text based on your audio input.",
    "Simulated AI transcription for this sample clip."
  ];
  return fakeTranscriptions[Math.floor(Math.random() * fakeTranscriptions.length)];
}

export default function AIOnlyPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [clipIndex, setClipIndex] = useState(0);
  const [aiTranscription, setAITranscription] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasStarted) return; // Don't auto-play until user clicks Start

    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.log("Autoplay blocked:", error));
    }

    generateAndStart();
  }, [clipIndex, hasStarted]);

  useEffect(() => {
    if (isTiming) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTiming]);

  const generateAndStart = () => {
    setAITranscription(generateFakeTranscription());
    setTimer(0);
    setIsTiming(true);
  };

  const handleRegenerate = () => {
    setIsTiming(false);
    setTimer(0);
    setAITranscription(generateFakeTranscription());
    setTimeout(() => {
      setIsTiming(true);
    }, 200);
  };

  const handleNextClip = () => {
    setIsTiming(false);
    setTimer(0);
    if (clipIndex < audioList.length - 1) {
      setClipIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const resultData = {
      taskType: "AI Only",
      transcription: "AI-only session completed",
      createdAt: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, "sessions"), resultData);
      navigate("/survey", { state: { sessionId: docRef.id } });
    } catch (error) {
      console.error("Fail to save: ", error);
    }
  };

  const handleStartTest = () => {
    setHasStarted(true);
  };

  return (
    <div className="page-container bg-gradient-to-br from-green-50 to-white p-8">
      
      {/* Header */}
      <h1 className="page-title">🤖 AI-Only Transcription Test</h1>

      {!hasStarted ? (
        <>
          <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem", textAlign: "left", maxWidth: "600px" }}>
            <li>Listen to 9 sample clips.</li>
            <li>Review AI-generated transcriptions. Regenerate if unsatisfied.</li>
            <li>Timer starts when the AI transcription is generated.</li>
            <li>Click Next to continue to the next clip.</li>
          </ul>

          {/* Start Test Button */}
          <button
            onClick={handleStartTest}
            className="btn bg-green-500 hover:bg-green-600 w-full max-w-md text-2xl py-4"
          >
            Start Test
          </button>
        </>
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center space-y-8 mt-10">

          <div className="task-block w-full space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Clip {clipIndex + 1} of {audioList.length}
            </h2>

            {/* Audio Player */}
            <audio
              ref={audioRef}
              controls
              src={audioList[clipIndex]}
              className="audio-player"
            />

            {/* Timer */}
            <div className="text-lg text-gray-600 text-center">
              Timer: {timer}s
            </div>

            {/* AI Transcription */}
            <textarea
              value={aiTranscription}
              readOnly
              className="textarea"
              placeholder="AI-generated transcription appears here."
            />

            {/* Buttons Group */}
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full mt-6">
              <button
                onClick={handleRegenerate}
                className="btn bg-yellow-400 hover:bg-yellow-500 w-full md:w-auto py-3 px-6"
              >
                Regenerate Transcription
              </button>

              <button
                onClick={handleNextClip}
                className="btn bg-green-500 hover:bg-green-600 w-full md:w-auto py-3 px-6 text-lg"
              >
                {clipIndex === audioList.length - 1
                  ? "Accept and Finish Test"
                  : "Accept and Next Clip"}
              </button>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}
