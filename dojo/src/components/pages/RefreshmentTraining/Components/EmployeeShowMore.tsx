// import React, { useState, type ChangeEvent } from 'react';
// import { X } from 'lucide-react';

// interface Employee {
//   full_name: string;
//   employee_code: string;
// }

// interface EmployeeShowMoreProps {
//   employees: Employee[];
// }

// const EmployeeShowMore: React.FC<EmployeeShowMoreProps> = ({ employees }) => {
//   /* ---------- preview logic ---------- */
//   const previewCount = 2;
//   const previewEmployees = employees.slice(0, previewCount);
//   const hasMore = employees.length > previewCount;

//   /* ---------- modal state ---------- */
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [search, setSearch] = useState('');

//   const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
//     setSearch(e.target.value);

//   const filteredEmployees = employees.filter(({ full_name, employee_code }) =>
//     `${full_name} ${employee_code}`
//       .toLowerCase()
//       .includes(search.toLowerCase().trim())
//   );

//   return (
//     <>
//       {/* ----------- preview cell (table) ----------- */}
//       <div className="text-sm text-black">
//         {previewEmployees.map((emp, idx) => (
//           <span key={idx}>
//             {emp.full_name}
//             {idx < previewEmployees.length - 1 ? ', ' : ''}
//           </span>
//         ))}

//         {hasMore && (
//           <>
//             {previewEmployees.length ? ',' : ''}
//             <button
//               type="button"
//               onClick={() => setModalOpen(true)}
//               className="ml-1 text-blue-600 hover:underline text-xs"
//             >
//               Show all
//             </button>
//           </>
//         )}
//       </div>

//       {/* ----------- modal ------------ */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
//             {/* close btn */}
//             <button
//               onClick={() => setModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* title */}
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Employee List ({employees.length})
//             </h3>

//             {/* search bar */}
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearch}
//               placeholder="Search by code or name..."
//               className="w-full mb-3 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
//             />

//             {/* list */}
//             <ul className="max-h-96 overflow-y-auto text-sm space-y-1 text-black">
//               {filteredEmployees.length ? (
//                 filteredEmployees.map(({ full_name, employee_code }, idx) => (
//                   <li key={idx} className="border-b py-1">
//                     {full_name} <span className="text-gray-500">({employee_code})</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-500">No matches</li>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EmployeeShowMore;




import React, { useState, type ChangeEvent } from 'react';
import { X, Search, Users } from 'lucide-react';

interface Employee {
  full_name: string;
  employee_code: string;
}

interface EmployeeShowMoreProps {
  employees: Employee[];
}

const EmployeeShowMore: React.FC<EmployeeShowMoreProps> = ({ employees }) => {
  /* ---------- preview logic ---------- */
  const previewCount = 2;
  const previewEmployees = employees.slice(0, previewCount);
  const hasMore = employees.length > previewCount;

  /* ---------- modal state ---------- */
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const filteredEmployees = employees.filter(({ full_name, employee_code }) =>
    `${full_name} ${employee_code}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <>
      {/* ----------- preview cell (table) ----------- */}
      <div className="text-sm text-text flex flex-wrap items-center gap-1">
        {previewEmployees.map((emp, idx) => (
          <span key={idx} className="inline-block">
            {emp.full_name}
            {idx < previewEmployees.length - 1 ? ',' : ''}
          </span>
        ))}

        {hasMore && (
          <>
            <span>{previewEmployees.length ? ',' : ''}</span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="ml-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors"
            >
              +{employees.length - previewCount} more
            </button>
          </>
        )}
      </div>

      {/* ----------- modal ------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-border flex flex-col max-h-[80vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">
                    Participants
                  </h3>
                  <p className="text-xs text-muted font-medium">
                    Total: {employees.length} employees
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-muted hover:text-text hover:bg-background rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-background border-b border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by code or name..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-4 bg-background flex-1">
              <ul className="space-y-2">
                {filteredEmployees.length ? (
                  filteredEmployees.map(({ full_name, employee_code }, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {full_name.charAt(0)}
                        </div>
                        <span className="font-bold text-text text-sm">{full_name}</span>
                      </div>
                      <span className="text-xs font-medium text-muted bg-surface px-2 py-1 rounded-md border border-border group-hover:border-purple-200 group-hover:text-purple-700 transition-colors">
                        {employee_code}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex flex-col items-center justify-center py-10 text-muted">
                    <Search className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No employees found</span>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-surface border-t border-border text-center">
               <span className="text-xs text-muted">
                 Showing {filteredEmployees.length} result{filteredEmployees.length !== 1 ? 's' : ''}
               </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeShowMore;