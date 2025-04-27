import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.css";
import "../styles/TextArea.css";
import "../styles/AudioPlayer.css";

const sampleAlternatives: Record<string, string[]> = {
  listening: ["listening", "listing", "lightening"],
  divided:   ["divided", "decided", "derived"],
};

export default function HumanAIStatementPage() {
  const navigate = useNavigate();
  const sampleRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [timer, setTimer] = useState<number>(0);
  const [isTiming, setIsTiming] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showBegin, setShowBegin] = useState(false);

  const sampleSuggestion =
    "The [listening] section is [divided] into two separately timed parts.";
  const sampleTruth =
    "The Listening section is divided into two separately timed parts.";

  // Parse suggestion tokens and identify uncertain positions
  const rawTokens = sampleSuggestion.replace(/[.,!?;]/g, "").split(" ");
  const cleanTokens = rawTokens.map((w) => w.replace(/\[|\]/g, ""));
  const uncertainPositions = rawTokens
    .map((w, i) => (/\[.*\]/.test(w) ? i : -1))
    .filter((i) => i >= 0);

  // Build initial HTML for highlighted suggestion
  const buildHtml = (tokens: string[]) =>
    tokens
      .map((word, i) =>
        uncertainPositions.includes(i)
          ? `<u style=\"background:#FEF3C7\">${word}</u>`
          : word
      )
      .join(" ");

  const [tokensState, setTokensState] = useState<string[]>(cleanTokens);
  const [html, setHtml] = useState<string>(buildHtml(cleanTokens));
  const [custom, setCustom] = useState<string>(cleanTokens.join(" "));

  // Play sample audio and show Begin button
  useEffect(() => {
    sampleRef.current?.play().catch(() => {});
    setShowBegin(true);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTiming) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [isTiming]);

  const handleBegin = () => {
    setTimer(0);
    setIsTiming(true);
    setShowBegin(false);
    setShowEditor(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    setIsTiming(false);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className="page-title">🤝 Human + AI Collaboration Overview</h1>

      {/* Top Instructions */}
      <div style={{ maxWidth: 650, margin: "0 auto", textAlign: "left", lineHeight: 1.7 }}>
        <p><strong>In this task, you will edit AI-generated transcripts for 9 clips.</strong></p>
        <p><strong>For each clip:</strong></p>
        <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem" }}>
          <li>Review the AI suggestion below.</li>
          <li>After reading, click <code>Begin Editing</code>.</li>
          <li>Timer starts and ai suggestion for uncertain place will show up.</li>
          <li>Select alternatives or edit text</li>
          <li>
            To choose an alternative: click the desired replacement button, then press <kbd>Enter</kbd> to submit.
          </li>
          <li>
          To edit the transcript manually: make your changes directly in the text area and press <kbd>Enter</kbd> when you’re done.
          </li>
        </ul>
        <p style={{ color: "#aa0000", fontWeight: 600 }}>
          ⚠️ You must correct at least one highlighted word. Leaving all unchanged will restart the test.
        </p>
        <p style={{ color: "#aa0000", fontWeight: 600 }}>
          ⚠️ Make sure the text area is focused before pressing Enter.
        </p>
      </div>

      {/* Sample Clip Section */}
      <div
        style={{
          backgroundColor: "#d8dada",
          borderRadius: "8px",
          padding: "1.5rem",
          maxWidth: "800px",
          margin: "2rem auto",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Sample Clip</h2>

        <audio
          ref={sampleRef}
          controls
          src="/Testing_Data/sample.wav"
          className="audio-player"
          style={{ width: "100%" }}
        />

        {/* Begin Editing Button */}
        {!showEditor && showBegin && <button className="btn" onClick={handleBegin}>Begin Editing</button>}

        {/* Alternatives Buttons */}
        {showEditor && (
          <>
            <h3 style={{ marginTop: "1.5rem" }}>Sample Suggestion</h3>
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </>
        )}
        {showEditor && uncertainPositions.map(pos => {
          const rawKey = cleanTokens[pos];
          const key = rawKey.replace(/[.,!?;:]/g, "");
          const alts = sampleAlternatives[key] || [];
          return (
            <div
              key={pos}
              style={{
                margin: "0 auto 1rem",
                textAlign: "left",
                maxWidth: "600px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>
                Alternatives for “{key}”:
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {alts.map((opt, idx) => (
                  <button
                    key={idx}
                    className="btn"
                    onClick={() => {
                      // 点击后更新 tokensState、custom 文本和高亮 html
                      const newTokens = [...tokensState];
                      newTokens[pos] = opt;
                      setTokensState(newTokens);
                      setCustom(newTokens.join(" "));
                      setHtml(buildHtml(newTokens));
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Timer Display */}
        <br />
        <div style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
          Timer will start after the transcription begins, ends when Enter is pressed.
        </div>
        <div style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
          Current Timer: {timer}s
        </div>

        {/* Textarea for final edit */}
        {showEditor && (
          <textarea
            ref={textareaRef}
            className="textarea"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Edit the transcript here, then press Enter"
            style={{ width: "100%", boxSizing: "border-box", padding: "0.5rem", }}
          />
        )}

        <div style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
          (Press Enter after typing your transcript or after you click the text area)
        </div>

        {showEditor && (
          <>
          <p><strong>Ground Truth:</strong> {sampleTruth}</p>
          <p style={{ color: "#aa0000", fontWeight: 600 }}>We don't have ground truth show up in the real task</p>
          </>
        )}
      </div>

      {/* Start Test Button */}
      {showEditor && (
      <button
        onClick={() => navigate("/human-ai")}
        className="btn"
        style={{ marginTop: "2rem" }}
      >
        Start Real 9-Clip Test
      </button>
      )}
    </div>
  );
}
