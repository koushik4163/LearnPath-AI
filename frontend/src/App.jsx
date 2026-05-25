import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
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

export default function App() {
  const withLayout = (page) => (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={withLayout(<Dashboard />)} />
          <Route path="/goal-setup" element={withLayout(<GoalSetup />)} />
          <Route path="/roadmap" element={withLayout(<Roadmap />)} />
          <Route path="/tasks" element={withLayout(<DailyTask />)} />
          <Route path="/quiz" element={withLayout(<Quiz />)} />
          <Route path="/progress" element={withLayout(<Progress />)} />
          <Route path="/profile" element={withLayout(<Profile />)} />
          <Route path="/quiz-history" element={withLayout(<QuizHistory />)} />
          <Route path="/certificate" element={withLayout(<Certificate />)} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}