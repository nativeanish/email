import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Inbox from "../Page/Inbox";
import Index from "../Page/Index";
import OnBoard from "../Page/OnBoard";
import Login from "../Page/Login";
import { ToastProvider } from "../Components/UI/Toast/Toast-Context";
import { ToastContainer } from "../Components/UI/Toast";
function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboard" element={<OnBoard />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect /dashboard → /dashboard/inbox */}
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/inbox" replace />}
          />

          {/* Dashboard pages wrapped with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard/:slug/:id?" element={<Inbox />} />
          </Route>
        </Routes>

        <ToastContainer />
      </ToastProvider>
    </Router>
  );
}

export default App;
