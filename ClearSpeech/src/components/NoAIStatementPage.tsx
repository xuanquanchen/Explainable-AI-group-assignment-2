import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.css";
import "../styles/TextArea.css";
import "../styles/AudioPlayer.css";

const base = import.meta.env.BASE_URL;

export default function NoAIStatementPage() {
  const navigate = useNavigate();
  const sampleRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    sampleRef.current?.play().catch(() => {});
  }, []);

  // Start timer only after button click
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

  const handleBeginTranscription = () => {
    setTimer(0);
    setIsTiming(true);
    textareaRef.current?.focus();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsTiming(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className="page-title">
        Manual Transcription Overview
      </h1>

      {/* Top Instructions */}
      <div style={{ maxWidth: "650px", margin: "0 auto", textAlign: "left", lineHeight: 1.7 }}>
        <p><strong>You will transcribe 9 audio clips with 3 difficulty levels</strong></p>

        <p><strong>For each clip:</strong></p>
        <ul style={{ paddingLeft: "1.2rem", marginBottom: "2rem" }}>
          <li>Play, pause, and replay freely.</li>
          <li>After the first listen, click "<code>Begin Transcription</code>" Button.</li>
          <li>Timer starts and the text box will auto-focus.</li>
          <li>Type your transcript and press "<kbd>Enter</kbd>" to submit and move to next.</li>
        </ul>

        <p style={{ color: "#aa0000", fontWeight: 600 }}>
          ⚠️ You must type something for each clip. Submitting empty text restarts the entire test.
        </p>
      </div>

      {/* Sample Clip Section */}
      <div style={{
        backgroundColor: "#d8dada",
        borderRadius: "8px",
        padding: "1.5rem",
        maxWidth: "800px",
        margin: "2rem auto"
      }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Sample Clip</h2>

        <audio
          ref={sampleRef}
          controls
          src={`${base}Testing_Data/sample.wav`}
          className="audio-player"
          style={{ width: "100%" }}
        />

        {/* Instruction + Button */}
        <div style={{ marginTop: "1.5rem", fontSize: "1rem", color: "#333" }}>
          The Begin button will show up after the clip ends playing. Click the button to start transcribing:
        </div>

        <div style={{ margin: "1rem 0" }}>
          <button className="btn" onClick={handleBeginTranscription}>
            Begin Transcription for this clip
          </button>
        </div>

        {/* Timer Display */}
        <div style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
          Timer will start after the transcription begins, ends when Enter is pressed.
        </div>
        <div style={{ fontSize: "1rem", color: "#555", marginBottom: "1.5rem" }}>
          Current Timer: {timer}s
        </div>

        {/* Textarea + Submit Hint */}
        <div>
          <textarea
            ref={textareaRef}
            className="textarea"
            placeholder="Type transcript here, then press Enter to submit"
            onKeyDown={handleKeyDown}
          />
          <div style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
            (Press Enter after typing your transcript)
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <button
        onClick={() => navigate("/no-ai")}
        className="btn"
        style={{ marginTop: "2rem" }}
      >
        Start Real 9-Clip Test
      </button>
    </div>
  );
}