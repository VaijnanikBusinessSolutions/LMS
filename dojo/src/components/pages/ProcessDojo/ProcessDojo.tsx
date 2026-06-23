import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLevels } from '../../hooks/ServiceApis';

interface Level {
  level_id?: number;
  level_name?: string;
  name: string;
  subheading: string;
}

interface ApiLevel {
  level_id: number;
  level_name: string;
  days: Array<{
    days_id: number;
    day: string;
  }>;
  topics: Array<{
    topic_id: number;
    topic_name: string;
    subtopics: any[];
  }>;
}

const ProcessDojo: React.FC = () => {
  const navigate = useNavigate();
  const [apiLevels, setApiLevels] = useState<ApiLevel[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getLevels();
        console.log('Levels:', data);
        setApiLevels(data);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchLevels();
  }, []);

  const [levels] = useState<Level[]>([
    {
      name: 'Level 0',
      subheading: '',
    },
    {
      name: 'Level 1',
      subheading: '',
    },
    {
      name: 'Level 2',
      subheading: '',
    },
    {
      name: 'Level 3',
      subheading: '',
    },
    {
      name: 'Level 4',
      subheading: '',
    },
    // {
    //   name: 'Multiskilling',
    //   subheading: '',
    // },
    // {
    //   name: 'Refresher Training',
    //   subheading: '',
    // },
    // {
    //   name: 'HANCHOU',
    //   subheading: '',
    // },
    // {
    //   name: 'SHOKU CHOU',
    //   subheading: '',
    // },
  ]);

  // Function to find API level data by level name
  const findApiLevelData = (levelName: string) => {
    return apiLevels.find(apiLevel => 
      apiLevel.level_name.toLowerCase() === levelName.toLowerCase()
    );
  };

  const handleClick = (level: Level) => {
    let route = '';
    let stateData = {};

    // Find corresponding API data for levels 1-4
    const apiLevelData = findApiLevelData(level.name);

    if (apiLevelData) {
      stateData = {
        levelId: apiLevelData.level_id,
        levelName: apiLevelData.level_name
      };
    }
    

    // Route mapping
    switch (level.name) {
      case 'Level 0':
        route = '/Level0';
        break;
      case 'Level 1':
        route = '/Level1';
        break;
      case 'Level 2':
        route = '/Levelwise';
        break;
      case 'Level 3':
        route = '/Levelwise';
        break;
      case 'Level 4':
        route = '/Levelwise';
        break;
      case 'Multiskilling':
        route = '/allocation';
        break;
      case 'Refresher Training':
        route = '/refreshment';
        break;
      case 'HANCHOU':
        route = '/Hanchou';
        break;
      case 'SHOKU CHOU':
        route = '/Shokuchou';
        break;
      default:
        route = '/UnderDevelopment';
    }

    // Navigate with state data
    navigate(route, { state: stateData });
  };

  const getGradientStyle = (index: number) => {
    const gradients = [
      'linear-gradient(90deg, #110b38ff, #673ab7)',      // purple
      'linear-gradient(90deg, #03a9f4, #00bcd4)',      // light-blue
      'linear-gradient(90deg, #4caf50, #8bc34a)',      // light-green
      'linear-gradient(90deg, #ff9800, #f44336)',      // orange
      'linear-gradient(90deg, #1976d2, #303f9f)',      // dark-blue
      'linear-gradient(90deg, #f44336, #e91e63)'       // red
    ];

    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto px-4 py-8 pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const gradientStyle = getGradientStyle(index);

            return (
              <div
                key={index}
                onClick={() => handleClick(level)}
                className={`
                  bg-surface border border-border rounded-lg cursor-pointer 
                  shadow-sm hover:shadow-lg transition-all duration-300 
                  h-[220px] w-full flex flex-col
                  relative overflow-hidden
                  group
                `}
              >
                {/* Gradient border top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: gradientStyle }}
                ></div>

                <div className="p-5 flex-1 flex flex-col">
                  {level.subheading && (
                    <h3 className="text-2xl font-bold text-text mb-1 group-hover:text-white transition-colors duration-300 z-10">
                      {level.subheading}
                    </h3>
                  )}
                  <h3 className="text-2xl font-bold text-muted group-hover:text-white transition-colors duration-300 z-10">
                    {level.name}
                  </h3>
                </div>

                {/* Hover overlay effect - using the same gradient */}
                <div
                  className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out z-0 opacity-0 group-hover:opacity-100"
                  style={{ background: gradientStyle }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessDojo;

// // ProcessDojo.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getLevels } from '../../hooks/ServiceApis';
// import { ChevronRight } from 'lucide-react';

// interface Level {
//   level_id?: number;
//   level_name?: string;
//   name: string;
//   subheading: string;
// }

// interface ApiLevel {
//   level_id: number;
//   level_name: string;
//   days: Array<{
//     days_id: number;
//     day: string;
//   }>;
//   topics: Array<{
//     topic_id: number;
//     topic_name: string;
//     subtopics: any[];
//   }>;
// }

// const ProcessDojo: React.FC = () => {
//   const navigate = useNavigate();
//   const [apiLevels, setApiLevels] = useState<ApiLevel[]>([]);

//   useEffect(() => {
//     const fetchLevels = async () => {
//       try {
//         const data = await getLevels();
//         console.log('Levels:', data);
//         setApiLevels(data);
//       } catch (error) {
//         console.error('Error fetching levels:', error);
//       }
//     };

//     fetchLevels();
//   }, []);

//   const [levels] = useState<Level[]>([
//     {
//       name: 'Level 0',
//       subheading: '',
//     },
//     {
//       name: 'Level 1',
//       subheading: 'Basic Training DOJO',
//     },
//     {
//       name: 'Level 2',
//       subheading: '',
//     },
//     {
//       name: 'Level 3',
//       subheading: '',
//     },
//     {
//       name: 'Level 4',
//       subheading: '',
//     },
//   ]);

//   // Function to find API level data by level name
//   const findApiLevelData = (levelName: string) => {
//     return apiLevels.find(apiLevel => 
//       apiLevel.level_name.toLowerCase() === levelName.toLowerCase()
//     );
//   };

//   const handleClick = (level: Level) => {
//     let route = '';
//     let stateData = {};

//     // Find corresponding API data for levels 1-4
//     const apiLevelData = findApiLevelData(level.name);

//     if (apiLevelData) {
//       stateData = {
//         levelId: apiLevelData.level_id,
//         levelName: apiLevelData.level_name
//       };
//     }

//     // Route mapping
//     switch (level.name) {
//       case 'Level 0':
//         route = '/Level0';
//         break;
//       case 'Level 1':
//         route = '/Level1';
//         break;
//       case 'Level 2':
//         route = '/Levelwise';
//         break;
//       case 'Level 3':
//         route = '/Levelwise';
//         break;
//       case 'Level 4':
//         route = '/Levelwise';
//         break;
//       case 'Multiskilling':
//         route = '/allocation';
//         break;
//       case 'Refresher Training':
//         route = '/refreshment';
//         break;
//       case 'HANCHOU':
//         route = '/Hanchou';
//         break;
//       case 'SHOKU CHOU':
//         route = '/Shokuchou';
//         break;
//       default:
//         route = '/UnderDevelopment';
//     }

//     // Navigate with state data
//     navigate(route, { state: stateData });
//   };

//   return (
//     <div className="min-h-screen bg-[#121a27ff]">
//       <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-8 pt-24">
//         {/* Page Header */}
//         <div className="max-w-[1600px] mx-auto mb-8 md:mb-12">
//           <div className="text-center">
//             <h1 
//               className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
//               // style={{
//               //   background: 'linear-gradient(135deg, #121a27ff 0%, #1e3a5f 50%, #0d1f3c 100%)',
//               //   WebkitBackgroundClip: 'text',
//               //   WebkitTextFillColor: 'transparent',
//               //   backgroundClip: 'text',
//               // }}
//             >
//               Process DOJO
//             </h1>
//             <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-4">
//               Select a training level to begin your learning journey
//             </p>
//             <div 
//               className="mx-auto"
//               style={{
//                 width: '80px',
//                 height: '3px',
//                 background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
//                 borderRadius: '2px',
//                 boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
//               }}
//             />
//           </div>
//         </div>

//         {/* Levels Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
//           {levels.map((level, index) => (
//             <div
//               key={index}
//               onClick={() => handleClick(level)}
//               className="relative group cursor-pointer"
//             >
//               {/* Gold Gradient Border */}
//               <div 
//                 className="absolute -inset-[1px] rounded-2xl transition-all duration-500 opacity-60 group-hover:opacity-100"
//                 style={{
//                   background: `linear-gradient(
//                     135deg, 
//                     rgba(212, 175, 55, 0.5) 0%, 
//                     rgba(255, 223, 100, 0.3) 25%, 
//                     rgba(212, 175, 55, 0.6) 50%, 
//                     rgba(255, 223, 100, 0.3) 75%, 
//                     rgba(212, 175, 55, 0.5) 100%
//                   )`,
//                   boxShadow: '0 0 15px rgba(212, 175, 55, 0.15)',
//                 }}
//               />
              
//               {/* Main Card - Dark Royal Slate */}
//               <div 
//                 className="relative rounded-2xl p-6 h-[200px] flex flex-col justify-between transition-all duration-500 ease-out group-hover:translate-y-[-4px] overflow-hidden"
//                 style={{
//                   background: `linear-gradient(
//                     145deg,
//                     #1e3a5f 0%,
//                     #1a3355 20%,
//                     #152d4a 40%,
//                     #12273f 60%,
//                     #0f2137 80%,
//                     #0d1c30 100%
//                   )`,
//                   boxShadow: `
//                     0 10px 40px rgba(13, 31, 60, 0.3),
//                     0 4px 12px rgba(0, 0, 0, 0.1),
//                     inset 0 1px 0 rgba(255, 255, 255, 0.05)
//                   `,
//                 }}
//               >
//                 {/* Diamond watermark */}
//                 <div 
//                   className="absolute pointer-events-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
//                   style={{
//                     width: '120px',
//                     height: '120px',
//                     bottom: '-20px',
//                     right: '-20px',
//                     transform: 'rotate(45deg)',
//                     border: '2px solid rgba(212, 175, 55, 1)',
//                   }}
//                 />
                
//                 {/* Small diamond accent */}
//                 <div 
//                   className="absolute pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
//                   style={{
//                     width: '40px',
//                     height: '40px',
//                     top: '20px',
//                     right: '40px',
//                     transform: 'rotate(45deg)',
//                     border: '1px solid rgba(212, 175, 55, 1)',
//                   }}
//                 />

//                 {/* Level Number Badge */}
//                 <div 
//                   className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110"
//                   style={{
//                     background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
//                     border: '1px solid rgba(212, 175, 55, 0.4)',
//                     color: '#d4af37',
//                     boxShadow: '0 0 15px rgba(212, 175, 55, 0.15)',
//                   }}
//                 >
//                   {index}
//                 </div>

//                 {/* Content */}
//                 <div className="relative z-10 flex-1 flex flex-col justify-center">
//                   {level.subheading && (
//                     <span 
//                       className="text-sm font-medium uppercase tracking-wider mb-2"
//                       style={{ color: '#d4af37' }}
//                     >
//                       {level.subheading}
//                     </span>
//                   )}
//                   <h3 className="text-2xl md:text-3xl font-bold text-white">
//                     {level.name}
//                   </h3>
//                 </div>

//                 {/* Footer with arrow */}
//                 <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
//                   <span className="text-white/60 text-sm font-medium group-hover:text-white/80 transition-colors duration-300">
//                     Click to explore
//                   </span>
//                   <div 
//                     className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
//                     style={{
//                       background: 'rgba(212, 175, 55, 0.15)',
//                       border: '1px solid rgba(212, 175, 55, 0.3)',
//                     }}
//                   >
//                     <ChevronRight 
//                       className="w-4 h-4 transition-colors duration-300"
//                       style={{ color: '#d4af37' }}
//                     />
//                   </div>
//                 </div>

//                 {/* Bottom accent line */}
//                 <div 
//                   className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500 group-hover:w-3/4"
//                   style={{
//                     width: '30%',
//                     background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)',
//                     boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProcessDojo;