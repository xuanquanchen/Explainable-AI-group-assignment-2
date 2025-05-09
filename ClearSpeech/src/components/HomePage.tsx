import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import "../styles/Button.css";
import "../styles/Layout.css"; 

export default function HomePage() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    noAI: 0,
    aiOnly: 0,
    humanAI: 0,
  });

  useEffect(() => {
    // helper to load a count
    async function loadCount(taskType: string) {
      const q = query(
        collection(db, "sessions"),
        where("taskType", "==", taskType)
      );
      const snap = await getCountFromServer(q);
      return snap.data().count;
    }

    Promise.all([
      loadCount("No AI"),
      loadCount("AI Only"),
      loadCount("Human+AI"),
    ]).then(([noAI, aiOnly, humanAI]) => {
      setCounts({ noAI, aiOnly, humanAI });
    });
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">🎤 ClearSpeech AI</h1>

      <p className="page-subtitle">
        Enjoy your listening test(lmao 🎧
      </p>

      <p className="page-subtitle">
        Thank you for participating our transcription test!
      </p>

      <p className="disclaimer">
        We use recordings from speakers of different backgrounds and accents. Any accent‐related impressions are purely incidental and not intended to reflect  
        stereotypes or cultural judgments. All voices are equally valid—this test is inclusive, and any bias or discrimination will not be accepted.
      </p>

      <p
        className="warning"
        style={{
          color: "#aa0000",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        ⚠️ Please choose only one of the three tests below. When you enter your transcription, you do NOT need to worry about letter-case or punctuation differences.
      </p>

      <p
        className="warning"
        style={{
          color: "#50A2A7",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        ⚠️ Please refer to the participant counts below to help keep all three groups roughly balanced.
      </p>

      <div className="button-group">
        <div className="task-block">
          <button
            onClick={() => navigate("/no-ai-statement")}
            className="btn"
          >
            Manual Transcription (No AI)
          </button>
          <p className="count-text">Participants: {counts.noAI}</p>
        </div>

        <div className="task-block"> 
          <button
            onClick={() => navigate("/ai-only")}
            className="btn"
          >
            AI-Only Transcription
          </button>
          <p className="count-text">Participants: {counts.aiOnly}</p>
        </div>

        <div className="task-block">
          <button
            onClick={() => navigate("/human-ai-statement")}
            className="btn"
          >
            Human + AI Collaboration
          </button>
          <p className="count-text">Participants: {counts.humanAI}</p>
        </div>
      </div>
    </div>
  );
}
