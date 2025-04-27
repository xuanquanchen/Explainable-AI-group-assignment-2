import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NoAIPage from "./components/NoAIPage";
import AIOnlyPage from "./components/AIOnlyPage";
import HumanAIPage from "./components/HumanAIPage";
import SurveyPage from "./components/SurveyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/no-ai" element={<NoAIPage onComplete={(resultData) => console.log(resultData)} />} />
        <Route path="/ai-only" element={<AIOnlyPage onComplete={(resultData) => console.log(resultData)} />} />
        <Route path="/human-ai" element={<HumanAIPage onComplete={(resultData) => console.log(resultData)} />} />
        <Route path="/survey" element={<SurveyPage onSubmitSurvey={(surveyData) => console.log(surveyData)} />} />
      </Routes>
    </Router>
  );
}

export default App;
