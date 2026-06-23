// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, X, Upload, PlayCircle, Play } from "lucide-react";

// // CHANGE THIS to your actual Django Backend URL
// const API_BASE_URL = "http://127.0.0.1:8000";

// const VideoMaterials = () => {
//   const [videos, setVideos] = useState([]);
  
//   // Modal States
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [playingVideo, setPlayingVideo] = useState(null); // State for the video player
  
//   // Form States
//   const [topic, setTopic] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Fetch videos on component mount
//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/videos/`);
//       setVideos(response.data);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   // Helper to construct Video URL correctly
//   const getVideoUrl = (path) => {
//     if (!path) return "";
//     return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!topic || !selectedFile) {
//       alert("Please enter a topic and select a video.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("topic", topic);
//     formData.append("video_file", selectedFile);

//     setUploading(true);

//     try {
//       await axios.post(`${API_BASE_URL}/api/videos/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       // Cleanup & Refresh
//       setTopic("");
//       setSelectedFile(null);
//       setIsUploadModalOpen(false);
//       fetchVideos(); 
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload video.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-12 relative">
      
//       {/* Page Header */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           Video Library
//         </h1>
//         <p className="text-gray-500 mt-2">Browse and manage your course materials.</p>
//       </div>

//       {/* Video Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {videos.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
//             <PlayCircle size={64} className="mb-4 opacity-50" />
//             <p className="text-lg">No videos uploaded yet.</p>
//           </div>
//         ) : (
//           videos.map((video) => (
//             <div 
//               key={video.id} 
//               className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
//               onClick={() => setPlayingVideo(video)} // CLICK TO OPEN PLAYER
//             >
//               {/* Video Preview (Thumbnail area) */}
//               <div className="relative bg-gray-900 aspect-video">
//                 <video 
//                   className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity"
//                   src={getVideoUrl(video.video_file)} 
//                   preload="metadata"
//                   muted // Muted to allow autoplay on hover if you wanted, but here serves as preview
//                 />
                
//                 {/* Play Icon Overlay */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition-transform">
//                     <Play className="text-white fill-white" size={32} />
//                   </div>
//                 </div>
//               </div>
              
//               {/* Card Body */}
//               <div className="p-5">
//                 <h3 className="font-bold text-gray-800 text-lg truncate" title={video.topic}>
//                   {video.topic}
//                 </h3>
//                 <div className="flex justify-between items-center mt-3">
//                   <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
//                     Click to Watch
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     {new Date(video.uploaded_at).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Floating Action Button (FAB) */}
//       <button
//         onClick={() => setIsUploadModalOpen(true)}
//         className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-transform transform hover:scale-105 flex items-center gap-2 z-40"
//       >
//         <Plus size={28} />
//         <span className="font-semibold pr-2 hidden md:inline">Add Material</span>
//       </button>

//       {/* --- 1. FULL SCREEN VIDEO PLAYER MODAL --- */}
//       {playingVideo && (
//         <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4 animate-in fade-in duration-200">
//           {/* Close Button */}
//           <button 
//             onClick={() => setPlayingVideo(null)}
//             className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
//           >
//             <X size={32} />
//           </button>

//           <div className="w-full max-w-6xl max-h-[90vh] aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
//             <video 
//               controls 
//               autoPlay 
//               className="w-full h-full object-contain"
//               src={getVideoUrl(playingVideo.video_file)}
//             >
//               Your browser does not support the video tag.
//             </video>
//             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
//                 <h2 className="text-white text-2xl font-bold">{playingVideo.topic}</h2>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- 2. UPLOAD MODAL --- */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 relative">
            
//             <div className="flex justify-between items-center p-6 border-b border-gray-100">
//               <h2 className="text-xl font-bold text-gray-800">Upload New Material</h2>
//               <button 
//                 onClick={() => setIsUploadModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <form onSubmit={handleUpload} className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Topic Title</label>
//                 <input
//                   type="text"
//                   value={topic}
//                   onChange={(e) => setTopic(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                   placeholder="e.g. Chapter 1: Introduction"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Video File</label>
//                 <div className="relative group">
//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={handleFileChange}
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                     required
//                   />
//                   <div className="border-2 border-dashed border-gray-300 group-hover:border-blue-400 bg-gray-50 group-hover:bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center transition-all">
//                     <Upload className="text-gray-400 group-hover:text-blue-500 mb-3" size={32} />
//                     <p className="text-sm text-gray-600 font-medium">
//                       {selectedFile ? (
//                         <span className="text-blue-600 break-all">{selectedFile.name}</span>
//                       ) : (
//                         "Click to browse or drag video here"
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${
//                   uploading 
//                     ? "bg-gray-400 cursor-not-allowed" 
//                     : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-200"
//                 }`}
//               >
//                 {uploading ? "Uploading..." : "Upload Material"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoMaterials;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Upload, PlayCircle, Play, Film, Calendar, Sparkles, Video } from "lucide-react";

// CHANGE THIS to your actual Django Backend URL
const API_BASE_URL = "http://127.0.0.1:8000";

const VideoMaterials = () => {
  const [videos, setVideos] = useState([]);
  
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  
  // Form States
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/videos/`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Helper to construct Video URL correctly
  const getVideoUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!topic || !selectedFile) {
      alert("Please enter a topic and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("video_file", selectedFile);

    setUploading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/videos/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Cleanup & Refresh
      setTopic("");
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      fetchVideos(); 
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-main))] transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[rgb(var(--brand-primary))] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-[rgb(var(--brand-accent))] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[rgb(var(--brand-primary))] opacity-[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[rgb(var(--brand-primary))]/10 rounded-xl">
              <Film className="w-6 h-6 text-[rgb(var(--brand-primary))]" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-[rgb(var(--brand-primary))]">
              Learning Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--text-main))] tracking-tight mb-3">
            Video Library
          </h1>
          <p className="text-[rgb(var(--text-muted))] text-lg max-w-2xl">
            Browse and manage your course materials. Click on any video card to start watching.
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8 pt-6 border-t border-[rgb(var(--border-main))]">
            <div className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--bg-card))] rounded-xl border border-[rgb(var(--border-main))]/50">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-[rgb(var(--text-muted))]">
                <span className="font-bold text-[rgb(var(--text-main))]">{videos.length}</span> {videos.length === 1 ? 'Video' : 'Videos'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--bg-card))] rounded-xl border border-[rgb(var(--border-main))]/50">
              <Sparkles className="w-4 h-4 text-[rgb(var(--brand-primary))]" />
              <span className="text-sm text-[rgb(var(--text-muted))]">Ready to learn</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center py-24 px-6 bg-[rgb(var(--bg-card))] rounded-3xl border-2 border-dashed border-[rgb(var(--border-main))] transition-colors duration-300">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[rgb(var(--brand-primary))]/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative p-8 bg-gradient-to-br from-[rgb(var(--brand-primary))]/10 to-[rgb(var(--brand-accent))]/10 rounded-full">
                    <PlayCircle className="w-20 h-20 text-[rgb(var(--brand-primary))]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[rgb(var(--text-main))] mb-3">No videos yet</h3>
                <p className="text-[rgb(var(--text-muted))] text-center max-w-md mb-8">
                  Your video library is empty. Start building your collection by uploading your first course material.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[rgb(var(--brand-primary))] text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-[rgb(var(--brand-primary))]/25 hover:shadow-2xl hover:shadow-[rgb(var(--brand-primary))]/30 hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First Video
                </button>
              </div>
            </div>
          ) : (
            videos.map((video, index) => (
              <div 
                key={video.id} 
                className="group bg-[rgb(var(--bg-card))] rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[rgb(var(--border-main))]/50 hover:border-[rgb(var(--brand-primary))]/40 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setPlayingVideo(video)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Video Preview (Thumbnail area) */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video overflow-hidden">
                  <video 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                    src={getVideoUrl(video.video_file)} 
                    preload="metadata"
                    muted
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 group-hover:scale-110 group-hover:bg-[rgb(var(--brand-primary))]/80 transition-all duration-300 shadow-2xl">
                      <Play className="text-white fill-white" size={28} />
                    </div>
                  </div>

                  {/* Duration Badge (Optional placeholder) */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
                    <span className="text-xs font-semibold text-white">Video</span>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0 p-2 bg-[rgb(var(--brand-primary))]/10 rounded-xl mt-0.5">
                      <Video className="w-4 h-4 text-[rgb(var(--brand-primary))]" />
                    </div>
                    <h3 className="font-bold text-[rgb(var(--text-main))] text-lg leading-snug line-clamp-2 group-hover:text-[rgb(var(--brand-primary))] transition-colors duration-300" title={video.topic}>
                      {video.topic}
                    </h3>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-[rgb(var(--border-main))]/50">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[rgb(var(--brand-primary))]/10 text-[rgb(var(--brand-primary))] rounded-full group-hover:bg-[rgb(var(--brand-primary))] group-hover:text-white transition-all duration-300">
                      <Play className="w-3 h-3" />
                      Watch Now
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted))]">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(video.uploaded_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-primary))] hover:shadow-2xl hover:shadow-[rgb(var(--brand-primary))]/30 text-white p-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3 z-40 group"
      >
        <div className="relative">
          <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
        </div>
        <span className="font-bold pr-1 hidden md:inline">Add Material</span>
      </button>

      {/* --- 1. FULL SCREEN VIDEO PLAYER MODAL --- */}
      {playingVideo && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Now Playing</p>
                <h2 className="text-white text-lg md:text-xl font-bold truncate max-w-md">{playingVideo.topic}</h2>
              </div>
            </div>
            <button 
              onClick={() => setPlayingVideo(null)}
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X size={24} />
            </button>
          </div>

          {/* Video Container */}
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <video 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
              src={getVideoUrl(playingVideo.video_file)}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-6 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
              <Calendar className="w-4 h-4" />
              Uploaded {new Date(playingVideo.uploaded_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}

      {/* --- 2. UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsUploadModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[rgb(var(--bg-card))] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-[rgb(var(--border-main))]/50">
            
            {/* Modal Header */}
            <div className="relative px-8 pt-8 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-br from-[rgb(var(--brand-primary))]/20 to-[rgb(var(--brand-accent))]/10 rounded-2xl">
                  <Upload className="w-7 h-7 text-[rgb(var(--brand-primary))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[rgb(var(--text-main))]">Upload Material</h2>
                  <p className="text-sm text-[rgb(var(--text-muted))] mt-0.5">Add a new video to your library</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-6 right-6 p-2.5 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-main))] hover:bg-[rgb(var(--border-main))]/30 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpload} className="px-8 pb-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[rgb(var(--text-main))] mb-2.5">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[rgb(var(--bg-main))] border border-[rgb(var(--border-main))] text-[rgb(var(--text-main))] placeholder-[rgb(var(--text-muted))]/60 focus:border-[rgb(var(--brand-primary))] focus:ring-4 focus:ring-[rgb(var(--brand-primary))]/10 outline-none transition-all duration-200"
                  placeholder="e.g. Chapter 1: Introduction"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(var(--text-main))] mb-2.5">
                  Video File
                </label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
                    selectedFile 
                      ? 'border-[rgb(var(--brand-primary))] bg-[rgb(var(--brand-primary))]/5' 
                      : 'border-[rgb(var(--border-main))] group-hover:border-[rgb(var(--brand-primary))]/50 bg-[rgb(var(--bg-main))] group-hover:bg-[rgb(var(--brand-primary))]/5'
                  }`}>
                    <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                      selectedFile 
                        ? 'bg-[rgb(var(--brand-primary))]/20' 
                        : 'bg-[rgb(var(--border-main))]/50 group-hover:bg-[rgb(var(--brand-primary))]/20'
                    }`}>
                      <Upload className={`w-8 h-8 transition-colors duration-300 ${
                        selectedFile 
                          ? 'text-[rgb(var(--brand-primary))]' 
                          : 'text-[rgb(var(--text-muted))] group-hover:text-[rgb(var(--brand-primary))]'
                      }`} />
                    </div>
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-bold text-[rgb(var(--brand-primary))] break-all max-w-xs">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-[rgb(var(--text-main))]">
                          Drop your video here or <span className="text-[rgb(var(--brand-primary))] font-semibold">browse</span>
                        </p>
                        <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                          Supports MP4, MOV, AVI, WebM and more
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-[rgb(var(--text-main))] bg-[rgb(var(--bg-main))] border border-[rgb(var(--border-main))] hover:bg-[rgb(var(--border-main))]/30 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    uploading 
                      ? "bg-[rgb(var(--text-muted))] cursor-not-allowed" 
                      : "bg-[rgb(var(--brand-primary))] hover:shadow-lg hover:shadow-[rgb(var(--brand-primary))]/25 hover:-translate-y-0.5"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMaterials;