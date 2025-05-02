import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./login/page";
import SignUp from "./signup/page";
import "./App.css";
import SupabaseAuthProvider from "./context/supabase.context";
import { Toaster } from "sonner";
import { EmailDashboard } from "./dashboard/dashboard";

function App() {
  return (
    <Router>
      <SupabaseAuthProvider
        dashboardPath="/dashboard"
        loginPath="/login"
        redirectOnSession={true}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<EmailDashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </SupabaseAuthProvider>
    </Router>
  );
}

export default App;
