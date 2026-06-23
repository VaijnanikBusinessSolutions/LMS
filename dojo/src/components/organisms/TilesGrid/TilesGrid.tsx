

// // TilesGrid.tsx
// import React from 'react';
// import type { LucideIcon } from 'lucide-react';
// import Tile from '../../atoms/Tile';
// import type { LinkType } from '../../atoms/Tile/types';

// export interface TilesGridProps {
//   tiles: Array<{
//     id: string; // Ensure your data source has the 'id' (e.g., 'courses', 'dashboards')
//     title: string;
//     links: LinkType[];
//     icon: LucideIcon;
//     iconBgColor?: string;
//     iconColor?: string;
//     borderTopColor?: string;
//   }>;
//   userRole: string; // Add this prop to TilesGrid
// }

// const TilesGrid: React.FC<TilesGridProps> = ({ tiles, userRole }) => {
//   return (
//     <div className="px-4 sm:px-6 lg:px-12 xl:px-20 pb-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
//         {tiles.map((tile, index) => (
//           <div key={tile.id || index} className="flex">
//             <Tile
//               tileId={tile.id}   
//               userRole={userRole}    // <--- CRITICAL: Pass the Role here
//               title={tile.title}
//               links={tile.links}
//               icon={tile.icon}
//               iconBgColor={tile.iconBgColor}
//               iconColor={tile.iconColor}
//               borderTopColor={tile.borderTopColor}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TilesGrid;




// TilesGrid.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Tile from '../../atoms/Tile';
import type { LinkType } from '../../atoms/Tile/types';

export interface TilesGridProps {
  tiles: Array<{
    id: string; // Ensure your data source has the 'id' (e.g., 'courses', 'dashboards')
    title: string;
    links: LinkType[];
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    borderTopColor?: string;
  }>;
  userRole: string; // Add this prop to TilesGrid
}

const TilesGrid: React.FC<TilesGridProps> = ({ tiles, userRole }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-12 xl:px-20 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
        {tiles.map((tile, index) => (
          <div key={tile.id || index} className="flex">
            <Tile
              tileId={tile.id}   
              index={index}        // <--- Change 'idx' to 'index' here
              userRole={userRole} 
              title={tile.title}
              links={tile.links}
              icon={tile.icon}
              iconBgColor={tile.iconBgColor}
              iconColor={tile.iconColor}
              borderTopColor={tile.borderTopColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TilesGrid;


