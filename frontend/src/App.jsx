import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GoalSetup from './pages/GoalSetup';
import Roadmap from './pages/Roadmap';
import DailyTask from './pages/DailyTask';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import QuizHistory from './pages/QuizHistory';
import Certificate from './pages/Certificate';
import ChatAssistant from './components/ChatAssistant';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/goal-setup" element={<ProtectedRoute><GoalSetup /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><DailyTask /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/quiz-history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </AuthProvider>
  );
}