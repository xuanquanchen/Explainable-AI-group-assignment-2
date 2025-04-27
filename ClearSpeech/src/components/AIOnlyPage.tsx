import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { audioList, transcriptPaths } from "../config/audioClips";
import { fakeTranscriptions } from "../config/aiOnlyFakeOutput";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";

export default function AIOnlyPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [clipIndex, setClipIndex] = useState(0);
  const [aiTranscription, setAITranscription] = useState("");
  const [groundTruth, setGroundTruth] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [results, setResults] = useState<Array<{
    clipIndex: number;
    transcription: string;
    durationSeconds: number;
    wer: number;
    cer: number;
  }>>([]);

  // Fetch audio and ground truth on clip change
  useEffect(() => {
    if (!hasStarted) return;

    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.log("Autoplay blocked:", error));
    }

    generateAndStart();

    fetch(transcriptPaths[clipIndex])
      .then((res) => res.text())
      .then((txt) => setGroundTruth(txt.trim()))
      .catch((err) => {
        console.error("Failed to load transcript:", err);
        setGroundTruth("");
      });
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

  const generateFakeTranscription = () => {
    return fakeTranscriptions[Math.floor(Math.random() * fakeTranscriptions.length)];
  };

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

  const handleNextClip = async () => {
    setIsTiming(false);
    const durationSeconds = Number(timer.toFixed(2));

    const wer = calculateWER(groundTruth, aiTranscription);
    const cer = calculateCER(groundTruth, aiTranscription);

    const newClipResult = {
      clipIndex,
      transcription: aiTranscription,
      durationSeconds,
      wer,
      cer,
    };

    const updatedResults = [...results, newClipResult];

    if (clipIndex < audioList.length - 1) {
      setResults(updatedResults);
      setClipIndex((prev) => prev + 1);
      setTimer(0);
    } else {
      // Last clip
      try {
        const sessionDoc = {
          taskType: "AI Only",
          clips: updatedResults,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "sessions"), sessionDoc);
        navigate("/survey", { state: { sessionId: docRef.id } });
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
  };

  const handleStartTest = () => {
    setHasStarted(true);
  };

  return (
    <div className="page-container bg-gradient-to-br from-green-50 to-white p-8">
      
      <h1 className="page-title">🤖 AI-Only Transcription Test</h1>

      {!hasStarted ? (
        <>
          <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem", textAlign: "left", maxWidth: "600px" }}>
            <li>Listen to 9 sample clips.</li>
            <li>Review AI-generated transcriptions. Regenerate if unsatisfied.</li>
            <li>Timer starts when the AI transcription is generated.</li>
            <li>Click Next to continue to the next clip.</li>
          </ul>

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

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center w-full mt-6">
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
