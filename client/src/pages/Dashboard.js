import { useSelector } from 'react-redux';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import CollegeDashboard from '../components/dashboard/CollegeDashboard';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);

  if (user?.role === 'counselor') {
    return <CollegeDashboard />;
  }

  if (user?.role === 'employer') {
    return <RecruiterDashboard user={user} />;
  }

  return <StudentDashboard />;
}
