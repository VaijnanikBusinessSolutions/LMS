// // Sidebar.tsx
// import {
//   LayoutDashboard,
//   BookOpen,
//   FileText,
//   HelpCircle,
//   Settings,
//   MessageSquare,
//   LogOut,
//   Plus,
//   Users,
//   UserPlus,
//   UserCheck,
//   UsersIcon,
//   BookPlus,
//   Bell,
//   Receipt
// } from 'lucide-react';
// import { NavLink, useLocation } from 'react-router-dom';

// type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

// interface SidebarProps {
//   userRole: UserRole;
// }

// const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
//   // Define navigation items based on role
//   const getNavigationItems = () => {
//     switch (userRole) {
//       case 'Administrator':
//         return [
//           { to: '/AdminDashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
//           { to: '/CourseList', icon: <BookOpen size={18} />, label: 'Courses' },
//           // { to: '/CourseList', icon: <BookPlus size={18} />, label: 'Add Course' },
//           { to: '/Group', icon: <UsersIcon size={18} />, label: 'Group' },
//           { to: '/NewUser', icon: <UserPlus size={18} />, label: 'Add User' },
//           { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
//           { to: '/report', icon: <Receipt size={18} />, label: 'Report' },
//           // { to: '/manage-users', icon: <Users size={18} />, label: 'Manage Users' },
//         ];

//       case 'Team Leader':
//         return [
//           { to: '/AdminDashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
//           { to: '/CourseList', icon: <BookOpen size={18} />, label: 'Courses' },
//           // { to: '/CourseList', icon: <BookPlus size={18} />, label: 'Add Course' },
//           { to: '/Group', icon: <UsersIcon size={18} />, label: 'Group' },
//           { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
//           { to: '/report', icon: <Receipt size={18} />, label: 'Report' },

//         ];

//       case 'Employee':
//       default:
//         return [
//           { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
//           { to: '/courses', icon: <BookOpen size={18} />, label: 'Courses' },
//           { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
//           { to: '/report', icon: <Receipt size={18} />, label: 'Report' },
//         ];
//     }
//   };

//   const navigationItems = getNavigationItems();

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col justify-between">
//       {/* Top Section */}
//       <div className='mt-4'>
//         <nav className="px-3 space-y-1">
//           {/* Dynamic nav items based on role */}
//           {navigationItems.map((item) => (
//             <NavItem key={item.to} to={item.to} icon={item.icon}>
//               {item.label}
//             </NavItem>
//           ))}

//           {/* Static, non-clickable items */}
//           {/* <NavStatic icon={<FileText size={18} />}>Chapter</NavStatic>
//           <NavStatic icon={<HelpCircle size={18} />}>Help</NavStatic>
//           <NavStatic icon={<Settings size={18} />}>Settings</NavStatic> */}
//         </nav>
//       </div>

//       {/* Bottom Section */}
//       <div className="border-t border-gray-200 px-3 py-4 space-y-1">
//         <NavStatic icon={<MessageSquare size={18} />}>
//           FAQ
//         </NavStatic>
//         <NavStatic icon={<LogOut size={18} />}>
//           Logout
//         </NavStatic>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// interface NavItemProps {
//   children: React.ReactNode;
//   icon: React.ReactNode;
//   to: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ children, icon, to }) => {
//   const location = useLocation();
//   const isActive = location.pathname === to;

//   return (
//     <NavLink
//       to={to}
//       className={`flex items-center w-full px-4 py-2.5 rounded-lg gap-3 text-sm font-medium transition-colors ${isActive
//         ? 'bg-[#7A2FF4] text-white'
//         : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//         }`}
//     >
//       <div
//         className={`p-1.5 rounded-md transition-colors ${isActive
//           ? 'text-white bg-white/10'
//           : 'text-gray-500 group-hover:text-indigo-600'
//           }`}
//       >
//         {icon}
//       </div>
//       {children}
//     </NavLink>
//   );
// };

// interface NavStaticProps {
//   children: React.ReactNode;
//   icon: React.ReactNode;
// }

// const NavStatic: React.FC<NavStaticProps> = ({ children, icon }) => {
//   return (
//     <div className="flex items-center w-full px-4 py-2.5 rounded-lg gap-3 text-sm font-medium text-gray-400 cursor-default">
//       <div className="p-1.5 rounded-md text-gray-400">{icon}</div>
//       {children}
//     </div>
//   );
// };

// Sidebar.tsx
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Settings,
  MessageSquare,
  LogOut,
  Plus,
  Users,
  UserPlus,
  UserCheck,
  UsersIcon,
  BookPlus,
  Bell,
  Receipt
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  // Define navigation items based on role
  const getNavigationItems = () => {
    switch (userRole) {
      case 'Administrator':
        return [
          { to: '/AdminDashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/CourseList', icon: <BookOpen size={18} />, label: 'Courses' },
          // { to: '/CourseList', icon: <BookPlus size={18} />, label: 'Add Course' },
          { to: '/Group', icon: <UsersIcon size={18} />, label: 'Group' },
          { to: '/usertable', icon: <UserPlus size={18} />, label: 'User' },
          { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
          { to: '/report', icon: <Receipt size={18} />, label: 'Report' },
          // { to: '/manage-users', icon: <Users size={18} />, label: 'Manage Users' },
        ];

      case 'Team Leader':
        return [
          { to: '/AdminDashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/CourseList', icon: <BookOpen size={18} />, label: 'Courses' },
          // { to: '/CourseList', icon: <BookPlus size={18} />, label: 'Add Course' },
          { to: '/Group', icon: <UsersIcon size={18} />, label: 'Group' },
          { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
          { to: '/report', icon: <Receipt size={18} />, label: 'Report' },

        ];

      case 'Employee':
      default:
        return [
          { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/lms/courses', icon: <BookOpen size={18} />, label: 'Courses' },
          { to: '/notification', icon: <Bell size={18} />, label: 'Notification' },
          { to: '/report', icon: <Receipt size={18} />, label: 'Report' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-full flex flex-col justify-between">
      {/* Top Section */}
      <div className='mt-4'>
        <nav className="px-3 space-y-1">
          {/* Dynamic nav items based on role */}
          {navigationItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}

          {/* Static, non-clickable items */}
          {/* <NavStatic icon={<FileText size={18} />}>Chapter</NavStatic>
          <NavStatic icon={<HelpCircle size={18} />}>Help</NavStatic>
          <NavStatic icon={<Settings size={18} />}>Settings</NavStatic> */}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 px-3 py-4 space-y-1">
        <NavStatic icon={<MessageSquare size={18} />}>
          FAQ
        </NavStatic>
        <NavStatic icon={<LogOut size={18} />}>
          Logout
        </NavStatic>
      </div>
    </div>
  );
};

export default Sidebar;

interface NavItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, icon, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center w-full px-4 py-2.5 rounded-lg gap-3 text-sm font-medium transition-all duration-200 group ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      <div
        className={`p-1.5 rounded-md transition-all duration-200 ${
          isActive
            ? 'text-white bg-white/20'
            : 'text-gray-500 group-hover:text-indigo-400'
        }`}
      >
        {icon}
      </div>
      {children}
    </NavLink>
  );
};

interface NavStaticProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavStatic: React.FC<NavStaticProps> = ({ children, icon }) => {
  return (
    <div className="flex items-center w-full px-4 py-2.5 rounded-lg gap-3 text-sm font-medium text-gray-500 hover:text-gray-400 transition-colors cursor-pointer hover:bg-gray-800/30">
      <div className="p-1.5 rounded-md text-gray-500">{icon}</div>
      {children}
    </div>
  );
};