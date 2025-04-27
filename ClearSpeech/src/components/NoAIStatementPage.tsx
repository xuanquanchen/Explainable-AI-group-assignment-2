import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.css";
import "../styles/TextArea.css";
import "../styles/AudioPlayer.css";

export default function NoAIStatementPage() {
  const navigate = useNavigate();
  const sampleRef = useRef<HTMLAudioElement>(null);

  // 自动播放示例音频（可选）
  useEffect(() => {
    sampleRef.current?.play().catch(() => {});
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Manual Transcription — Overview
      </h1>

      <p style={{ maxWidth: "600px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
        In the next step you will complete <strong>9 transcription tasks</strong>:
        <br />
        <br />

        <ol style={{ maxWidth: 600, margin: "0 auto 1.5rem", textAlign: "left" }}>
            <li>3 Easy clips </li>
            <li>3 Medium clips </li>
            <li>3 Hard clips </li>
        </ol>

        For each clip:
        <br />

        <ol style={{ maxWidth: 600, margin: "0 auto 1.5rem", textAlign: "left" }}>
            <li>You may play, pause, or replay the audio as much as you like.</li>
            <li>
                After you finish listening once, click the{" "}
                <code>Begin Transcription</code> button or press <kbd>Enter</kbd>.
            </li>
            <li>The timer starts and the text box will automatically gain focus.</li>
            <li>Type the transcript and press <kbd>Enter</kbd> to submit. The button below is just a prompt</li>
        </ol>
        After all 9 clips you will see a short survey. Filling it out and clicking “Submit” completes the test.
      </p>

      <p>
        Please ensure you enter a transcript for each clip. If you submit without typing any text, that attempt will be considered invalid, you will be returned to the beginning of the test, and none of its results will be recorded.
      </p>

      {/* 示例音频播放器 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Sample Clip</h2>
        <audio
          ref={sampleRef}
          controls
          src="/Testing_Data/Easy/Easy1.wav"
          className="audio-player"
        />
      </div>

      {/* 示例 Begin 按钮 */}
      <div style={{ marginBottom: "1rem" }}>
        <button className="btn">
          Begin Transcription (Press Enter)
        </button>
      </div>

      {/* 示例文本框 + 提示按钮 */}
      <div>
        <textarea
          className="textarea"
          placeholder="Type transcript here, then press Enter to submit"
        />
        <div style={{ marginTop: "1rem" }}>
          <button className="btn" disabled>
            Press Enter to Continue
          </button>
        </div>
      </div>

      {/* 开始正式测试 */}
      <button
        onClick={() => navigate("/no-ai")}
        className="btn"
        style={{ marginTop: "2rem" }}
      >
        Start the 9-Clip Test
      </button>
    </div>
  );
}
