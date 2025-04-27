import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NoAIPage from "./components/NoAIPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/no-ai" element={<NoAIPage onComplete={(resultData) => console.log(resultData)} />} />
      </Routes>
    </Router>
  );
}

export default App;
