// // Navbar.tsx
// import { Bell, ChevronDown, User, LogOut, Monitor } from 'lucide-react';
// import { useState } from 'react';

// type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

// interface NavbarProps {
//   selectedRole: UserRole;
//   onRoleChange: (role: UserRole) => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ selectedRole, onRoleChange }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

//   const handleRoleChange = (role: UserRole) => {
//     onRoleChange(role);
//     // Close dropdown after role change
//     setIsDropdownOpen(false);
//   };

//   const handleLogout = () => {
//     // Add your logout logic here
//     localStorage.removeItem('userRole');
//     console.log('Logging out...');
//     setIsDropdownOpen(false);
//   };

//   const handleProfileClick = () => {
//     // Add your profile navigation logic here
//     console.log('Navigate to profile...');
//     setIsDropdownOpen(false);
//   };

//   const handleLegacyInterface = () => {
//     // Add your legacy interface logic here
//     console.log('Navigate to legacy interface...');
//     setIsDropdownOpen(false);
//   };

//   return (
//     <div className="w-full h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
//       {/* Left: Logo + Title */}
//       <div className="flex items-center gap-3">
//         <div className="text-xl font-bold text-[#7A2FF4]">NL Technologies</div>
//       </div>
      
//       {/* Right: Notification + User */}
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Bell size={22} className="text-gray-600 hover:text-gray-800 cursor-pointer" />
//           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//         </div>
        
//         {/* User Dropdown */}
//         <div className="relative">
//           <div 
//             className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           >
//             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
//               F
//             </div>
//             <div className="flex flex-col">
//               <div className="text-sm font-medium text-gray-800">F. Biju</div>
//               <div className="text-xs text-gray-500">{selectedRole}</div>
//             </div>
//             <ChevronDown size={16} className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//           </div>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//               {/* Current Role Badge */}
//               <div className="px-4 py-2 border-b border-gray-100">
//                 <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded">
//                   {selectedRole}
//                 </span>
//               </div>

//               {/* Switch Role Section */}
//               <div className="px-4 py-3 border-b border-gray-100">
//                 <div className="text-sm font-medium text-gray-700 mb-3">Switch role</div>
//                 <div className="space-y-2">
//                   {(['Administrator', 'Team Leader', 'Employee'] as const).map((role) => (
//                     <label key={role} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
//                       <input
//                         type="radio"
//                         name="role"
//                         value={role}
//                         checked={selectedRole === role}
//                         onChange={(e) => handleRoleChange(e.target.value as UserRole)}
//                         className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-700">{role}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Menu Items */}
//               <div className="py-2">
//                 <button
//                   onClick={handleProfileClick}
//                   className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   <User size={16} />
//                   My profile
//                 </button>
                
//                 <button
//                   onClick={handleLegacyInterface}
//                   className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   <Monitor size={16} />
//                   Go to legacy interface
//                 </button>
                
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   <LogOut size={16} />
//                   Log out
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Overlay to close dropdown when clicking outside */}
//       {isDropdownOpen && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setIsDropdownOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Navbar;
// Navbar.tsx
import { Bell, ChevronDown, User, LogOut, Monitor, Sparkles } from 'lucide-react';
import { useState } from 'react';

type UserRole = 'Administrator' | 'Team Leader' | 'Employee';

interface NavbarProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedRole, onRoleChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleRoleChange = (role: UserRole) => {
    onRoleChange(role);
    // Close dropdown after role change
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('userRole');
    console.log('Logging out...');
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    // Add your profile navigation logic here
    console.log('Navigate to profile...');
    setIsDropdownOpen(false);
  };

  const handleLegacyInterface = () => {
    // Add your legacy interface logic here
    console.log('Navigate to legacy interface...');
    setIsDropdownOpen(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Administrator':
        return 'from-purple-600 to-indigo-600';
      case 'Team Leader':
        return 'from-blue-600 to-cyan-600';
      case 'Employee':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="w-full h-16 bg-gray-900 border-b border-gray-800 shadow-xl flex items-center justify-between px-6">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-50"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
        </div>
        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          NL Technologies
        </div>
      </div>
      
      {/* Right: Notification + User */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative group">
          <div className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all cursor-pointer border border-gray-700 hover:border-gray-600">
            <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </div>
        
        {/* User Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-gray-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={`w-9 h-9 bg-gradient-to-br ${getRoleBadgeColor(selectedRole)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
              F
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-white">F. Biju</div>
              <div className="text-xs text-gray-400">{selectedRole}</div>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
              {/* Current Role Badge */}
              <div className="px-5 py-3 border-b border-gray-700/50 bg-gray-900/50">
                <span className={`inline-flex items-center gap-2 bg-gradient-to-r ${getRoleBadgeColor(selectedRole)} text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg`}>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  {selectedRole}
                </span>
              </div>

              {/* Switch Role Section */}
              <div className="px-5 py-4 border-b border-gray-700/50 bg-gray-800/50">
                <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  Switch role
                </div>
                <div className="space-y-2">
                  {(['Administrator', 'Team Leader', 'Employee'] as const).map((role) => (
                    <label 
                      key={role} 
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg transition-all group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={selectedRole === role}
                          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border-2 border-gray-600 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all flex items-center justify-center">
                          {selectedRole === role && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all group"
                >
                  <div className="p-1.5 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 transition-all">
                    <User size={16} className="group-hover:text-blue-400 transition-colors" />
                  </div>
                  My profile
                </button>
                
                <button
                  onClick={handleLegacyInterface}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all group"
                >
                  <div className="p-1.5 bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-all">
                    <Monitor size={16} className="group-hover:text-purple-400 transition-colors" />
                  </div>
                  Go to legacy interface
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-red-500/10 transition-all group border-t border-gray-700/50 mt-2"
                >
                  <div className="p-1.5 bg-gray-700/50 rounded-lg group-hover:bg-red-500/20 transition-all">
                    <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
                  </div>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;