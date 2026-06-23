


// import { Link, useLocation } from "react-router-dom";
// import { Calendar, UserCheck, Table } from "lucide-react";
// import { Icon } from "../../atoms/LucidIcons/LucidIcons";

// const Level0Nav = () => {
//   const location = useLocation();

//   const navItems = [
//     { name: "Add New User", path: "/Level0", icon: Calendar },
//     { name: "Human Body CheckSheet", path: "/TempEmployeeSearch", icon: UserCheck },
//     { name: "Employee Details", path: "/PassedUsersTable", icon: Table },
//   ];

//   return (
//     <nav className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 shadow-lg border-b-2 border-indigo-200">
//       <div className="mx-auto px-6 sm:px-8 lg:px-12">
//         <div className="flex justify-between items-center h-20 sm:h-24">
//           {/* Title */}
//           <div className="flex items-center space-x-3">
//             <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-600 via-purple-600 to-blue-600 rounded-full"></div>
//             <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
//              Employee Registration 
//             </h1>
//           </div>

//           {/* Nav Links */}
//           <div className="flex items-center gap-3 sm:gap-4">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`group flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out ${
//                     isActive
//                       ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-300/50 scale-105"
//                       : "text-gray-700 bg-white/70 backdrop-blur-sm hover:text-white hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-indigo-300/50 hover:scale-105 border border-indigo-200/50"
//                   }`}
//                 >
//                   <Icon 
//                     icon={item.icon} 
//                     className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${
//                       isActive ? "" : "group-hover:rotate-6"
//                     }`}
//                   />
//                   <span className="whitespace-nowrap">{item.name}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Level0Nav;



import { Link, useLocation } from "react-router-dom";
import { Calendar, UserCheck, Table } from "lucide-react";
import { Icon } from "../../atoms/LucidIcons/LucidIcons";

const Level0Nav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Add New User", path: "/Level0", icon: Calendar },
    { name: "Human Body CheckSheet", path: "/TempEmployeeSearch", icon: UserCheck },
    { name: "Employee Details", path: "/PassedUsersTable", icon: Table },
  ];

  return (
    // 1. Navbar Container: Changed from gradient to 'bg-surface' and 'border-border'
    <nav className="bg-surface shadow-sm border-b border-border">
      <div className="mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 sm:h-24">
          
          {/* Title Section */}
          <div className="flex items-center space-x-3">
            {/* Decorative Brand Bar (Kept gradient as brand accent) */}
            <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-600 via-purple-600 to-blue-600 rounded-full"></div>
            
            {/* 2. Main Title: Changed from gradient text to 'text-text' for better readability and token usage */}
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
             Employee Registration 
            </h1>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out border ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-300/50 scale-105 border-transparent"
                      : // 3. Inactive State: Used 'bg-background', 'text-muted', and 'border-border'
                        "bg-background text-muted border-border hover:text-text hover:border-text/30 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <Icon 
                    icon={item.icon} 
                    className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${
                      isActive ? "text-white" : "group-hover:rotate-6"
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Level0Nav;