import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "../pages/AdminPanel";
import AdminRoute from "../routes/ProtectedRoutes"; 
import AuthRoutes from "../routes/AuthRoutes"; 
import JobList from "../pages/JobList";
import LoginPage from "../pages/Login";
import CommonLayout from "../layout/CommonLayout"
function App() {
  return (
    <Router>
      <CommonLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
           	<Route path="/" element={<AuthRoutes element={JobList} />} />
          <Route path="/admin" element={<AdminRoute element={AdminPanel} />} />
        </Routes>
      </CommonLayout>
    </Router>
  );
}

export default App;
