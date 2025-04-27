import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../Utils/firebase";
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
      <h1 className="page-title">🎤 ClearSpeech AI — Select Task</h1>

      <p className="page-subtitle">
        Enjoy your listening test! 🎧
      </p>

      <p className="disclaimer">
        We use recordings from speakers of different backgrounds and accents. Any accent‐related impressions are purely incidental and not intended to reflect  
        stereotypes or cultural judgments. All voices are equally valid—this test is inclusive, and any bias or discrimination will not be accepted.
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
            onClick={() => navigate("/human-ai")}
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
