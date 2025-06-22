import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Inbox from "../Page/Inbox"
import Index from "../Page/Index";
import OnBoard from "../Page/OnBoard";
import Login from "../Page/Login"
import { ToastProvider } from "../Components/UI/Toast/Toast-Context";
import { ToastContainer } from "../Components/UI/Toast";
function App() {
  return (
    <Router>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboard" element={<OnBoard />} />
        <Route element={<Layout />}>
          <Route path="inbox" element={<Inbox />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
      </ToastProvider>
    </Router>
  );
}

export default App;
