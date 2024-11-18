import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import Navbar from './components/NavBar';

// ProtectedRoute component to handle redirection if no JWT token is found
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const role = localStorage.getItem('role');
  return token ? element : <Navigate to="/login" />;
};


function App() {

  return (
    <Router>
      <Navbar />
      <div className="flex">
        <ProtectedRoute element={<Sidebar />} />
        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
{localStorage.getItem("role") === "admin" &&  <><Route
              path="/"
              element={<ProtectedRoute element={<Home />} />} /><Route
                path="/doctor-management"
                element={<ProtectedRoute element={<AdminDashboard />} />} /></>}
            <Route
              path="/patients"
              element={<ProtectedRoute element={<PatientDashboard />} />}
            />

            {/* Redirect any other routes to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
