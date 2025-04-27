import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { audioList, transcriptPaths } from "../config/audioClips";
import { aiOnlyTranscripts } from "../config/aiOnlyFakeOutput";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";

export default function AIOnlyPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [clipIndex, setClipIndex] = useState(0);
  const [aiTranscription, setAITranscription] = useState("");
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [groundTruth, setGroundTruth] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [results, setResults] = useState<Array<{
    clipIndex: number;
    transcription: string;
    durationSeconds: number;
    wer: number;
    cer: number;
  }>>([]);

  useEffect(() => {
    if (!hasStarted) return;

    generateFakeTranscript();

    fetch(transcriptPaths[clipIndex])
      .then((res) => res.text())
      .then((txt) => setGroundTruth(txt.trim()))
      .catch((err) => {
        console.error("Failed to load transcript:", err);
        setGroundTruth("");
      });

    setAudioEnded(false); // reset audio ended state
    setIsTiming(false); // stop timer
    setTimer(0); // reset timer

    const audio = audioRef.current;
    if (audio) {
      audio.load();
  
      const checkAndPlay = () => {
        if (audio.readyState >= 1) {
          // Metadata loaded
          audio.play().catch((err) => console.log("Autoplay blocked:", err));
        } else {
          // Metadata not ready yet, check again soon
          setTimeout(checkAndPlay, 50);
        }
      };
  
      checkAndPlay();
  }
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

  const generateFakeTranscript = () => {
    const variations = aiOnlyTranscripts[clipIndex];
    if (variations && variations.length > 0) {
      const randomIndex = Math.floor(Math.random() * variations.length);
      setRegenerateCount(randomIndex); // start at the randomly picked one
      setAITranscription(variations[randomIndex]);
    } else {
      setAITranscription("AI-generated transcription not available.");
    }
  };
  

  const handleAudioEnded = () => {
    setAudioEnded(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
    setIsTiming(true); // Start timer when audio finished
  };

  const handleRegenerate = () => {
    if (!audioEnded) return;
    generateFakeTranscript();
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };
  

  const handleNextClip = async () => {
    if (!audioEnded) return;
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
    } else {
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

    setTimer(0); // Reset timer after pressing Enter
  };

  const handleStartTest = () => {
    setHasStarted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && audioEnded) {
      e.preventDefault();
      handleNextClip();
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-green-50 to-white p-8">
      <h1 className="page-title">🤖 AI-Only Transcription Test</h1>

      {!hasStarted ? (
        <>
          <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem", textAlign: "left", maxWidth: "600px" }}>
            <li>Listen to 9 sample clips.</li>
            <li>After the clip finishes, the AI transcription will appear.</li>
            <li>Press <kbd>Enter</kbd> to accept and move to the next clip.</li>
            <li>You can regenerate the AI text if unsatisfied before moving on.</li>
          </ul>

          <button
            onClick={handleStartTest}
            className="btn bg-green-500 hover:bg-green-600 w-full max-w-md text-2xl py-4"
          >
            Start Test
          </button>
        </>
      ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>            
            <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
              Clip {clipIndex + 1} of {audioList.length}
            </h2>
          
            {/* Audio Player */}
            <audio
              ref={audioRef}
              src={audioList[clipIndex]}
              className="audio-player"
              controls
              onEnded={handleAudioEnded}
            />

            {/* Timer */}
            {audioEnded && (
              <div className="text-lg text-gray-600 text-center">
                Timer: {timer}s
              </div>
            )}

            {/* AI Transcription */}
            {audioEnded && (
              <>
                <textarea
                  ref={textareaRef}
                  value={aiTranscription}
                  readOnly
                  className="textarea"
                  placeholder="AI-generated transcription appears here."
                  onKeyDown={handleKeyDown}
                />

                {/* Regenerate Button */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRegenerate}
                    className="btn bg-yellow-400 hover:bg-yellow-500 w-full max-w-sm py-3"
                  >
                    Regenerate AI Transcription
                  </button>
                </div>

                <div style={{ marginTop: "1rem", fontSize: "1rem", fontWeight: "bold", textAlign: "center" }}>
                  Press Enter to accept and move to next clip
                </div>
              </>
            )}
          
        </div>
      )}
    </div>
  );
}
