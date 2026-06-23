
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardView from '../Dashboard/Dashboard';
import CoursesView from '../Courses/Courses';
import Sidebar from '../Sidebar/Sidebar';

const LMSDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar userRole={'Administrator'} />
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/courses" element={<CoursesView />} />
        </Routes>
      </div>
    </div>
  );
};

export default LMSDashboard;
