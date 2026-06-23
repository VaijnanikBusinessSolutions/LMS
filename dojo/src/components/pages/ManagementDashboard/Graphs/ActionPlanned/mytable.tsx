// import React from "react";
// import TableComponent from '../../Table/table'

// const MyTable = () => {
//   return (
//     <TableComponent
//       headers={["Action Planned Rejection"]}
//       rows={[
//         "Red Bin Analysis",
//         "Re-Training of Operators",
//         "Top 5 defects Analysis",
//          ]}
//     />
//   );
// };

// export default MyTable;



import React from "react";
import TableComponent from '../../Table/table';

const MyTable = () => {
  return (
    // Container ensures the table fills the parent card
    <div className="w-full h-full overflow-hidden">
      <TableComponent
        headers={["Action Planned Rejection"]}
        rows={[
          "Red Bin Analysis",
          "Re-Training of Operators",
          "Top 5 defects Analysis",
        ]}
      />
    </div>
  );
};

export default MyTable;