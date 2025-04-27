import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SurveyPageProps {
  onSubmitSurvey: (surveyData: { satisfaction: number; workload: number }) => void;
}

export default function SurveyPage({ onSubmitSurvey }: SurveyPageProps) {
  const [satisfaction, setSatisfaction] = useState(5);
  const [workload, setWorkload] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = (location.state as { sessionId: string }) || {}; 

  const handleSubmit = async() => {
    const surveyData = {
      satisfaction,
      workload,
      surveyAt: serverTimestamp(),
    };

    if (!sessionId) {
      console.error("❌ No sessionId in route state");
      return;
    }

    try {
      await updateDoc(doc(db, "sessions", sessionId), surveyData);
      console.log("✅ Survery saved");
    } catch (error) {
      console.error("Fail to save survey: ", error);
    }
    onSubmitSurvey({ satisfaction, workload });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white p-8 space-y-10">

      {/* Title */}
      <div className="w-full max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">📝 Quick Survey</h1>
        <p className="text-lg text-gray-500">
          Please rate your experience with the transcription task.
        </p>
      </div>

      {/* Sliders */}
      <div className="w-full max-w-3xl flex flex-col space-y-10">

        {/* Satisfaction */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold text-gray-700">
            😊 Satisfaction with AI assistance
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={satisfaction}
            onChange={(e) => setSatisfaction(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="text-center text-gray-600 text-sm">
            Current: {satisfaction} / 10
          </div>
        </div>

        {/* Workload */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold text-gray-700">
            🧠 Mental Workload (How mentally tiring was it?)
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={workload}
            onChange={(e) => setWorkload(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="text-center text-gray-600 text-sm">
            Current: {workload} / 10
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <div className="w-full max-w-3xl">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xl rounded-full shadow-xl transition"
        >
          Submit Survey ✅
        </button>
      </div>

    </div>
  );
}
