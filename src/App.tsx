import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Inbox from "../Page/Inbox"
import Index from "../Page/Index";
import OnBoard from "../Page/OnBoard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboard" element={<OnBoard />} />
        <Route element={<Layout />}>
          <Route path="inbox" element={<Inbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
