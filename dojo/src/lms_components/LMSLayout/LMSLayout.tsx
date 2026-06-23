// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Outlet } from 'react-router-dom';
// import Sidebar from '../Sidebar/Sidebar';
// import Navbar from '../Navbar/Navbar';

// type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

// interface LMSLayoutProps {
//   initialRole?: UserRole;
// }

// const LMSLayout: React.FC<LMSLayoutProps> = ({ initialRole = 'Administrator' }) => {
//   const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
//     const savedRole = localStorage.getItem('userRole') as UserRole;
//     return savedRole || initialRole;
//   });
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ FIXED: Routes are now relative to the parent '/home' route
//   const getDashboardRoute = (role: UserRole): string => {
//     switch (role) {
//       case 'Administrator':
//         return 'AdminDashboard'; // No leading '/'
//       case 'Team Leader':
//         return 'AdminDashboard'; // No leading '/'
//       case 'Employee':
//       default:
//         return 'dashboard'; // No leading '/'
//     }
//   };

//   const handleRoleChange = (role: UserRole) => {
//     setSelectedRole(role);
//     localStorage.setItem('userRole', role);
//     console.log('Role changed to:', role);
    
//     const dashboardRoute = getDashboardRoute(role);
    
//     // This will now navigate to '/home/AdminDashboard' or '/home/dashboard'
//     navigate(dashboardRoute);
//   };

//   // Effect to handle initial route and role-based redirection
//   useEffect(() => {
//     // If the user lands on just '/home', redirect them to their specific dashboard
//     if (location.pathname === '/home' || location.pathname === '/home/') {
//       const dashboardRoute = getDashboardRoute(selectedRole);
//       navigate(dashboardRoute, { replace: true });
//     }
//   }, [selectedRole, location.pathname, navigate]);

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar 
//         selectedRole={selectedRole} 
//         onRoleChange={handleRoleChange} 
//       />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar userRole={selectedRole} />
//         <div className="flex-1 p-6 overflow-auto bg-gray-50">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LMSLayout;

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';

type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

interface LMSLayoutProps {
  initialRole?: UserRole;
}

const LMSLayout: React.FC<LMSLayoutProps> = ({ initialRole = 'Administrator' }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    return savedRole || initialRole;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIXED: Routes are now relative to the parent '/home' route
  const getDashboardRoute = (role: UserRole): string => {
    switch (role) {
      case 'Administrator':
        return 'AdminDashboard'; // No leading '/'
      case 'Team Leader':
        return 'AdminDashboard'; // No leading '/'
      case 'Employee':
      default:
        return 'dashboard'; // No leading '/'
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem('userRole', role);
    console.log('Role changed to:', role);
    
    const dashboardRoute = getDashboardRoute(role);
    
    // This will now navigate to '/home/AdminDashboard' or '/home/dashboard'
    navigate(dashboardRoute);
  };

  // Effect to handle initial route and role-based redirection
  useEffect(() => {
    // If the user lands on just '/home', redirect them to their specific dashboard
    if (location.pathname === '/home' || location.pathname === '/home/') {
      const dashboardRoute = getDashboardRoute(selectedRole);
      navigate(dashboardRoute, { replace: true });
    }
  }, [selectedRole, location.pathname, navigate]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar 
        selectedRole={selectedRole} 
        onRoleChange={handleRoleChange} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole={selectedRole} />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95">
          <div className="min-h-full p-6">
            <div className="max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSLayout;