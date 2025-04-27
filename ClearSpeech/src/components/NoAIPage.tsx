import { useState, useRef, useEffect } from "react";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";
import { useNavigate } from "react-router-dom"; // Add navigate
import { db } from "../Utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NoAIPage({ onComplete }: NoAIPageProps) {
  const [transcription, setTranscription] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [groundTruth, setGroundTruth] = useState<string>("");
  const navigate = useNavigate(); // hook
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showStartBtn, setShowStartBtn] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);

  const [results, setResults] = useState<Array<{
    clipIndex: number;
    wer: number;
    cer: number;
    durationSeconds: number;
  }>>([]);

  const audioList = [
    // Easy
    "../../public/Testing_Data/Easy/Easy1.wav",
    "../../public/Testing_Data/Easy/Easy2.wav",
    "../../public/Testing_Data/Easy/Easy3.wav",
    // Medium
    "../../public/Testing_Data/Medium/Medium1.wav",
    "../../public/Testing_Data/Medium/Medium2.wav",
    "../../public/Testing_Data/Medium/Medium3.wav",
    // Hard
    "../../public/Testing_Data/Hard/Hard1.wav",
    "../../public/Testing_Data/Hard/Hard2.wav",
    "../../public/Testing_Data/Hard/Hard3.wav",
  ];

  const transcriptPaths = [
    "../../public/Testing_Data/Easy/Easy1.txt",
    "../../public/Testing_Data/Easy/Easy2.txt",
    "../../public/Testing_Data/Easy/Easy3.txt",
    "../../public/Testing_Data/Medium/Medium1.txt",
    "../../public/Testing_Data/Medium/Medium2.txt",
    "../../public/Testing_Data/Medium/Medium3.txt",
    "../../public/Testing_Data/Hard/Hard1.txt",
    "../../public/Testing_Data/Hard/Hard2.txt",
    "../../public/Testing_Data/Hard/Hard3.txt",
  ];

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
    setStartTime(performance.now());
    setShowTextarea(true);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (!transcription.trim()) {
      alert("No text entered. Test aborted; please restart from the beginning.");
      return navigate("/");
    }

    const endTime = performance.now();
    const durationSeconds = Number(((endTime - startTime) / 1000).toFixed(2));

    const wer = calculateWER(groundTruth, transcription);
    const cer = calculateCER(groundTruth, transcription);

    const newResult = { clipIndex: currentIndex, wer, cer, durationSeconds };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          🎙️ Audio Transcription
        </h1>

        {/* Audio player for current clip */}
        <audio
          ref={audioRef}
          src={audioList[currentIndex]}
          controls
          onEnded={onAudioEnded}
          className="block mb-4"
        />

        {/* Transcription Box */}
        {showStartBtn && !showTextarea && (
          <button
          onClick={handleBeginTranscription}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Begin Transcription
          </button>
        )}

      {/* Textarea for transcription */}
      {showTextarea && (
        <textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type transcript here, then press Enter to submit"
          className="w-full h-48 p-2 border rounded"
        />
      )}
    </div>
  );
}
