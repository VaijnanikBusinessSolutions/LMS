


// import React from 'react';
// // import { Camera, ImageIcon } from 'lucide-react';
// import { Camera, ImageIcon, Video } from 'lucide-react';

// interface PhotoUploadProps {
//   photoPreview: string | null;
//   error?: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   currentFileName?: string;
//   onOpenCameraClick: () => void;
// }

// export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
//   photoPreview, 
//   error, 
//   onChange, 
//   currentFileName,
//   onOpenCameraClick
// }) => (
//   <div className="relative">
//     <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//       <Camera className="w-4 h-4" />
//       Profile Photo
//       <span className="text-gray-400 font-normal">(Optional)</span>
//     </label>
    
//     {/* Changed to grid for equal sizing */}
//     <div className="grid grid-cols-2 gap-4">
//       {/* Upload Photo Section */}
//       <div className="relative">
//         <input 
//           id="photo" 
//           type="file" 
//           accept="image/*" 
//           capture="environment"
//           onChange={onChange} 
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
//         />
//         <div className="h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
//           {photoPreview ? (
//             <img src={photoPreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
//           ) : (
//             <>
//               <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
//               <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium mt-1 text-center px-2">
//                 {currentFileName || 'Click to upload or take photo'}
//               </p>
//             </>
//           )}
//         </div>
//       </div>
      
//       {/* Live Camera Section */}
//       <div className="relative">
//         <button 
//           type="button" 
//           onClick={onOpenCameraClick}
//           className="h-24 w-full flex flex-col items-center justify-center bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors duration-300"
//           title="Open Live Camera"
//         >
//           <Video size={32} />
//           <span className="text-xs mt-1">Live Cam</span>
//         </button>
//       </div>
//     </div>
    
//     {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
//   </div>
// );




import React from 'react';
// import { Camera, ImageIcon } from 'lucide-react';
import { Camera, ImageIcon, Video } from 'lucide-react';

interface PhotoUploadProps {
  photoPreview: string | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentFileName?: string;
  onOpenCameraClick: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  photoPreview, 
  error, 
  onChange, 
  currentFileName,
  onOpenCameraClick
}) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
      <Camera className="w-4 h-4 text-muted" />
      Profile Photo
      <span className="text-muted font-normal">(Optional)</span>
    </label>
    
    {/* Changed to grid for equal sizing */}
    <div className="grid grid-cols-2 gap-4">
      {/* Upload Photo Section */}
      <div className="relative">
        <input 
          id="photo" 
          type="file" 
          accept="image/*" 
          capture="environment"
          onChange={onChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div className="h-24 border-2 border-dashed border-border rounded-xl bg-background hover:bg-surface hover:border-blue-400 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted group-hover:text-blue-500 transition-colors duration-200" />
              <p className="text-sm text-muted group-hover:text-blue-500 font-medium mt-1 text-center px-2">
                {currentFileName || 'Click to upload or take photo'}
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Live Camera Section */}
      <div className="relative">
        <button 
          type="button" 
          onClick={onOpenCameraClick}
          className="h-24 w-full flex flex-col items-center justify-center bg-surface border border-border text-text rounded-xl hover:bg-background transition-colors duration-300"
          title="Open Live Camera"
        >
          <Video size={32} className="text-muted" />
          <span className="text-xs mt-1 text-muted">Live Cam</span>
        </button>
      </div>
    </div>
    
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);