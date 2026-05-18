import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import MyDesigns from './pages/MyDesigns';
import ProtectedRoute from './components/ProtectedRoute';
import DesignDetail from './pages/DesignDetail';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/design/:id" element={<DesignDetail />} />
          <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/my-designs" element={<ProtectedRoute><MyDesigns /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;