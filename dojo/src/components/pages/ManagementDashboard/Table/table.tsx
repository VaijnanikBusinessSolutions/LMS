// import React from "react";
// import styles from "./table.module.css";

// interface TableProps {
//   headers: string[];
//   rows: string[];
// }

// const TableComponent: React.FC<TableProps> = ({ headers, rows }) => {
//   return (
//     <div className={styles.tableContainer}>
//       <table className={styles.table}>
//         <thead className={styles.thead}>
//           <tr className={styles.headerRow}>
//             {headers.map((header, index) => (
//               <th key={index} className={styles.th}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className={styles.tbody}>
//           {rows.map((row, index) => (
//             <tr key={index} className={styles.row}>
//               <td className={styles.td}>{row}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableComponent;



import React from "react";

interface TableProps {
  headers: string[];
  rows: string[];
}

const TableComponent: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    // Container: Surface background, takes full height of parent card
    <div className="w-full h-full overflow-hidden bg-surface flex flex-col">
      
      {/* Scrollable Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-xs font-bold text-text uppercase tracking-wider border-b border-border"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border">
            {rows.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-background/50 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-sm text-muted font-medium">
                  {row}
                </td>
              </tr>
            ))}
            
            {/* Fallback if no rows */}
            {rows.length === 0 && (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="px-4 py-8 text-center text-sm text-muted italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;