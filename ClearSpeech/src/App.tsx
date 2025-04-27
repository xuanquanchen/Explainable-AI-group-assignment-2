import { Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NoAIPage from "./components/NoAIPage";
import AIOnlyPage from "./components/AIOnlyPage";
import HumanAIPage from "./components/HumanAIPage";
import SurveyPage from "./components/SurveyPage";
import NoAIStatementPage from "./components/NoAIStatementPage";
import HumanAIStatementPage from "./components/HumanAIStatementPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/no-ai" element={<NoAIPage />} />
        <Route path="/ai-only" element={<AIOnlyPage onComplete={(resultData) => console.log(resultData)} />} />
        <Route path="/human-ai" element={<HumanAIPage />} />
        <Route path="/survey" element={<SurveyPage onSubmitSurvey={(surveyData) => console.log(surveyData)} />} />
        <Route path="/no-ai-statement" element={<NoAIStatementPage />} />
        <Route path="/human-ai-statement" element={<HumanAIStatementPage />}
      />
      </Routes>
  );
}

export default App;
