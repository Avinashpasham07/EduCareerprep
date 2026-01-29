import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import Colleges from './pages/Colleges';
import Jobs from './pages/Jobs';
import Resume from './pages/Resume';
import Interviews from './pages/Interviews';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import CollegeDetails from './pages/CollegeDetails';
import InterviewDashboard from './pages/InterviewDashboard';
import InterviewRoom from './pages/InterviewRoom';
import InterviewFeedback from './pages/InterviewFeedback';
import CodePlayground from './pages/CodePlayground';
import Roadmap from './pages/Roadmap';
import CareerAssessment from './pages/CareerAssessment';
import Applications from './pages/Applications';
import Layout from './components/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import { fetchCurrentUser } from './store/slices/authSlice';

// Protected Route Component (Single Declaration)
function ProtectedRoute({ children, roles }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.auth); // Temporary fix if theme slice missing

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:id" element={<CollegeDetails />} />
          <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />

          <Route path="/interviews" element={<ProtectedRoute><InterviewDashboard /></ProtectedRoute>} />
          <Route path="/interview/room" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
          <Route path="/interview/feedback" element={<ProtectedRoute><InterviewFeedback /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedRoute><CodePlayground /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/career-assessment" element={<ProtectedRoute><CareerAssessment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        </Routes>
      </Layout>
    </div>
  );
}

export default App;
