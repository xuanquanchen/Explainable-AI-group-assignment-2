import { useState, useRef, useEffect } from "react";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";
import { useNavigate } from "react-router-dom"; // Add navigate
import { db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { audioList, transcriptPaths } from "../config/audioClips";
import "../styles/Button.css";
import "../styles/TextArea.css";
import "../styles/AudioPlayer.css";


export default function NoAIPage() {
  const [transcription, setTranscription] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isTiming, setIsTiming] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [groundTruth, setGroundTruth] = useState<string>("");
  const navigate = useNavigate(); // hook
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showStartBtn, setShowStartBtn] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [results, setResults] = useState<Array<{
    clipIndex: number;
    wer: number;
    cer: number;
    durationSeconds: number;
  }>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTiming) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTiming]);

  useEffect(() => {
      if (showTextarea) {
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    }, [showTextarea]);

    
  useEffect(() => {
    fetch(transcriptPaths[currentIndex])
      .then((res) => res.text())
      .then((txt) => setGroundTruth(txt.trim()))
      .catch((err) => {
        console.error("Failed to load transcript:", err);
        setGroundTruth("");
      });
  }, [currentIndex]);

  const onAudioEnded = () => setShowStartBtn(true);

  const handleBeginTranscription = () => {
    setTimer(0);
    setStartTime(performance.now());
    setIsTiming(true);
    setShowTextarea(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showStartBtn && !showTextarea) {
        handleBeginTranscription();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showStartBtn, showTextarea, handleBeginTranscription]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (!isTiming) return;
    e.preventDefault();

    if (!transcription.trim()) {
      alert("No text entered. Test aborted; please restart from the beginning.");
      return navigate("/");
    }

    setIsTiming(false);
    textareaRef.current?.blur()

    const endTime = performance.now();
    const durationSeconds = Number(((endTime - startTime) / 1000).toFixed(2));

    const wer = calculateWER(groundTruth, transcription);
    const cer = calculateCER(groundTruth, transcription);

    const newResult = { clipIndex: currentIndex, wer, cer, durationSeconds,transcription };

    // move to next clip or finish
    if (currentIndex < audioList.length - 1) {
      setResults((prev) => [...prev, newResult]);
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setTranscription("");
      setShowTextarea(false);
      setShowStartBtn(false);
      // auto-play next clip
      setTimeout(() => {
        audioRef.current?.load();
        audioRef.current
          ?.play()
          .catch((err) => {
            console.log('play interrupted:', err);
          });
      }, 0);
    } else {
      const finalResults = [...results, newResult];

      const sessionDoc = {
        taskType: "No AI",
        clips: finalResults,
        createdAt: serverTimestamp(),
      };
  
      try {
        const docRef = await addDoc(collection(db, "sessions"), sessionDoc);
        navigate("/survey", { state: { sessionId: docRef.id } });
      } catch (err) {
        console.error("Fail to save session :", err);
      }
    }
  };
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        {/* Title */}
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
          🎙️ Audio Transcription
        </h1>

        {/* Audio player for current clip */}
        <audio
          className="audio-player"
          ref={audioRef}
          src={audioList[currentIndex]}
          controls
          onEnded={onAudioEnded}
        />

        {/* Transcription Box */}
        {showStartBtn && !showTextarea && (
          <button
          onClick={handleBeginTranscription}
          className="btn"
          >
            Begin Transcription
          </button>
        )}

      {/* Textarea for transcription */}
      {showTextarea && (
        <>
          <div style={{ fontSize: "1rem", color: "#555", margin: "1rem 0" }}>
            Current Timer: {timer}s
          </div>
          <p>Press Enter to Continue</p>
          <textarea
            className="textarea"
            ref={textareaRef}
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type transcript here, then press Enter to submit"
          />
        </>
      )}
    </div>
  );
}
