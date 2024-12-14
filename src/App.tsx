import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Consultants from "./pages/Consultants";
import AddConsultant from "./pages/AddConsultant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/consultants" element={<Consultants />} />
        <Route path="/consultants/add" element={<AddConsultant />} />
      </Routes>
    </Router>
  );
}

export default App;
