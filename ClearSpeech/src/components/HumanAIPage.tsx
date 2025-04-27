import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { calculateWER, calculateCER } from "../utils/werCerCalculator";
import { audioList, transcriptPaths } from "../config/audioClips";
import { humanAISuggestions, humanAIWordAlternatives } from "../config/fakeOutput";
import "../styles/Button.css";
import "../styles/TextArea.css";
import "../styles/AudioPlayer.css";

// Utility: properly build highlighted HTML
function getHighlightedHTML(text: string): string {
  return text
    .split(' ')
    .map(word => 
      word.includes('[uncertain]')
        ? `<u style="background:#FEF3C7">${word.replace(/\[|\]/g, "")}</u>`
        : word
    )
    .join(' ');
}

export default function HumanAIPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBegin, setShowBegin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const [tokens, setTokens] = useState<string[]>([]);
  const [rawTokens, setRawTokens] = useState<string[]>([]);
  const [uncertainPositions, setUncertainPositions] = useState<number[]>([]);

  const [html, setHtml] = useState("");
  const [custom, setCustom] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [groundTruth, setGroundTruth] = useState("");
  const [results, setResults] = useState<
    Array<{
      clipIndex: number;
      transcription: string;
      wer: number;
      cer: number;
      duration: number;
    }>
  >([]);

  // load ground truth & generate AI when index changes
  useEffect(() => {
    fetch(transcriptPaths[currentIndex])
      .then((r) => r.text())
      .then((t) => setGroundTruth(t.trim()))
      .catch(() => setGroundTruth(""));

    const suggestion = humanAISuggestions[currentIndex]
      .replace(/[^\w\s\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const rawTokens = suggestion.split(" ");
    const cleanTokens = rawTokens.map(w => w.replace(/\[|\]/g, ""));
    setTokens(cleanTokens);

    const idxs: number[] = [];
    rawTokens.forEach((w, i) => { if (/\[.*\]/.test(w)) idxs.push(i) });   
    setUncertainPositions(idxs);

    setCustom(cleanTokens.join(" "));

    setHtml(
      cleanTokens.map((word,i) =>
          idxs.includes(i)
          ? `<u style="background:#FEF3C7">${word.replace(/\[|\]/g,"")}</u>`
          : word
        )
      .join(" ")
    );

    setShowBegin(false);
    setShowEditor(false);
  }, [currentIndex]);

  // after audio ends, show Begin Editing
  const onEnded = () => setShowBegin(true);

  // start editor → start timer + focus textarea
  const beginEdit = () => {
    setStartTime(performance.now());
    setShowEditor(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };
  
  // Enter at button level
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && showBegin && !showEditor) {
        beginEdit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBegin, showEditor]);

  // handle submit in textarea
  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!custom.trim()) {
      alert("You must enter or edit some text. Test aborted.");
      navigate("/");
      return;
    }

    const end = performance.now();
    const duration = Number(((end - startTime) / 1000).toFixed(2));
    const wer = calculateWER(groundTruth, custom);
    const cer = calculateCER(groundTruth, custom);

    const entry = {
      clipIndex: currentIndex,
      transcription: custom,
      wer,
      cer,
      duration,
    };

    if (currentIndex < audioList.length - 1) {
      setResults((r) => [...r, entry]);
      // next clip
      setCurrentIndex((i) => i + 1);
      // autoplay next
      setTimeout(() => {
        audioRef.current?.load();
        audioRef.current?.play().catch(() => {});
      }, 0);
    } else {
      // finish all → save session
      const sessionDoc = {
        taskType: "Human+AI",
        clips: [...results, entry],
        createdAt: serverTimestamp(),
      };
      try {
        const docRef = await addDoc(
          collection(db, "sessions"),
          sessionDoc
        );
        navigate("/survey", { state: { sessionId: docRef.id } });
      } catch {
        console.error("Failed to save");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      
      {/* Header */}
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🧑‍🤝‍🧑 Human + AI Transcription
      </h1>

      <audio
        ref={audioRef}
        src={audioList[currentIndex]}
        controls
        onEnded={onEnded}
        className="audio-player"
      />

      {!showEditor && showBegin && (
        <button onClick={beginEdit} className="btn">
          Begin Editing (Press Enter)
        </button>
      )}

      {showEditor && (
        <div style={{ marginTop: "1.5rem" }}>
          {/* Main AI suggestion */}
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              textAlign: "left",
              maxWidth: "600px",
              margin: "0 auto 1rem",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Alternatives */}
          {uncertainPositions.map((pos) => {
            const originalClean = humanAISuggestions[currentIndex]
              .split(" ")
              .map(w => w.replace(/\[|\]/g, ""));
            const rawKey = originalClean[pos];
            const key = rawKey.replace(/[.,!?;:]/g, "");
            const alts = humanAIWordAlternatives[currentIndex][key] || [];
            return (
              <div key={pos} style={{ margin: "0 auto 1rem", textAlign: "left", maxWidth: "600px" }}>
                <p style={{ fontWeight: "bold" }}>Alternatives for “{key}”:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {alts.map((opt, idx) => (
                    <button
                      className="btn"
                      key={idx}
                      onClick={() => {
                        const newTokens = [...tokens];
                        newTokens[pos] = opt;
                        setTokens(newTokens);
                        setCustom(newTokens.join(" "));
                        setHtml(
                          newTokens.map((w,i) =>
                            uncertainPositions.includes(i)
                              ? `<u style="background:#FEF3C7">${w}</u>`
                              : w
                          ).join(" ")
                        );
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

        {/* Customize */}
        <textarea
          ref={textareaRef}
          className="textarea"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Customize or edit the transcript, then press Enter"
        />

        <div style={{ marginTop: "1rem" }}>
          <button className="btn" disabled>
            Press Enter to Continue
          </button>
        </div>
      </div>
      )}
    </div>
  );
}