import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, Award, Brain, CheckCircle } from 'lucide-react';

// --- Helper Components for the Isometric Laptop ---

const LaptopBase = () => (
  <div className="absolute inset-0 w-full h-full bg-slate-200 rounded-3xl shadow-2xl transform-style-3d">
    {/* Keyboard Area */}
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] h-[55%] bg-slate-100 rounded-lg flex flex-wrap gap-1.5 p-3 justify-center content-start border border-slate-300/50">
      {[...Array(45)].map((_, i) => (
        <div key={i} className="w-6 h-4 bg-slate-300 rounded-[2px] shadow-sm" />
      ))}
    </div>
    {/* Trackpad */}
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[35%] h-[22%] bg-slate-100 rounded-lg border border-slate-300/50 shadow-inner" />
    {/* Laptop Thickness (Side) */}
    <div className="absolute top-full left-0 w-full h-5 bg-slate-300 rounded-b-3xl origin-top transform rotateX(-90deg) brightness-90" />
    {/* Laptop Thickness (Front Lip) */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-400/20" />
  </div>
);

const LaptopScreen = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-[140%] bg-slate-800 rounded-t-2xl p-1 shadow-2xl transform-style-3d origin-bottom transform rotateX(-90deg)">
    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 rounded-t-xl overflow-hidden relative transform-style-3d border-[3px] border-slate-800/80">
      {/* Subtle Screen Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
      />
      {children}
      {/* Screen Glare Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
    </div>
    {/* Back of the screen (Outer Shell) */}
    <div className="absolute inset-0 bg-slate-300 rounded-t-2xl transform translateZ(-2px) shadow-xl" />
  </div>
);

const IsometricVLogo = () => (
  <div className="relative w-32 h-32 transform-style-3d drop-shadow-2xl">
    {/* The 'V' Shape - Left Leg */}
    <div className="absolute left-4 bottom-0 w-8 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transform -skew-x-[20deg] origin-bottom shadow-lg" />
    {/* The 'V' Shape - Right Leg */}
    <div className="absolute left-10 bottom-0 w-8 h-32 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full transform skew-x-[20deg] origin-bottom shadow-lg z-10" />
    
    {/* Graduation Cap */}
    <motion.div 
      className="absolute -top-6 left-6 w-20 h-12 z-20"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-full bg-slate-700 transform skew-x-12 rotate-[-10deg] rounded-sm shadow-md flex items-center justify-center">
         <div className="w-16 h-16 border-2 border-slate-600/30 rounded-full opacity-20" />
      </div>
      <div className="absolute right-0 top-4 w-1 h-8 bg-yellow-400 origin-top rotate-12 shadow-sm" />
    </motion.div>

    {/* Verified Badge */}
    <motion.div 
      className="absolute bottom-6 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl z-30"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <CheckCircle className="text-blue-500 w-7 h-7 fill-blue-100" />
    </motion.div>
  </div>
);

// --- Floating Element Components ---

const FloatingIconBubble = ({ icon: Icon, color, delay, x, y, size = "w-14 h-14" }: any) => (
  <motion.div
    className={`absolute ${size} rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg backdrop-blur-md border border-white/40 z-50`}
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: [0, -12, 0],
      rotate: [0, 5, 0]
    }}
    transition={{
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay, type: "spring" },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay },
      rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay }
    }}
  >
    <Icon className="text-white w-[50%] h-[50%] drop-shadow-md" />
  </motion.div>
);

const FloatingBook = ({ color, delay, x, y, rotate = "0deg", size = "w-16 h-20" }: any) => (
  <motion.div
    className={`absolute ${size} ${color} rounded-r-md shadow-xl transform-style-3d z-40`}
    style={{ left: x, top: y }}
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 0.9,
      y: [0, -15, 0],
      rotateY: [-20, -10, -20],
      rotateZ: [parseInt(rotate) - 5, parseInt(rotate) + 5, parseInt(rotate) - 5]
    }}
    transition={{
      opacity: { duration: 0.8, delay },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 1.5 },
      rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      rotateZ: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {/* Book Spine */}
    <div className="absolute left-0 top-0 w-3 h-full bg-white/30 rounded-l-sm" />
    {/* Book Cover Detail */}
    <div className="absolute right-3 top-4 w-2/3 h-2 bg-white/20 rounded-full" />
    <div className="absolute right-3 bottom-4 w-1/2 h-2 bg-white/20 rounded-full" />
  </motion.div>
);

// --- MAIN EXPORTED COMPONENT ---

export const HeroIllustration = () => {
  return (
    // Increased height and width container to allow spreading
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000 overflow-visible">
      
      {/* 1. THE LAPTOP (Centerpiece) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: 45, rotateZ: -30 }}
        animate={{ opacity: 1, scale: 1, rotateX: 55, rotateZ: -45 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        className="relative w-80 h-56 transform-style-3d z-20"
      >
        <LaptopBase />
        <LaptopScreen>
          <div className="absolute inset-0 flex items-center justify-center transform translateZ(20px)">
            <IsometricVLogo />
          </div>
          {/* Decorative mini blocks inside screen */}
          <div className="absolute top-8 left-6 w-8 h-8 bg-white/50 rounded-md backdrop-blur-sm" />
          <div className="absolute top-20 right-8 w-12 h-6 bg-blue-200/50 rounded-md backdrop-blur-sm" />
        </LaptopScreen>
      </motion.div>

      {/* 2. FLOATING ELEMENTS (Spread out widely) */}
      {/* Note: Percentages are relative to the large container. 
          Negative values or values > 100% push them further out. */}
      
      {/* Left Side Group */}
      <FloatingBook 
        color="bg-indigo-400" 
        delay={0.2} 
        x="5%" 
        y="25%" 
        rotate="-15deg" 
        size="w-20 h-24" // Big book
      />
      <FloatingIconBubble 
        icon={BookOpen} 
        color="from-blue-400 to-blue-600" 
        delay={0.5} 
        x="15%" 
        y="55%" 
      />
       <FloatingBook 
        color="bg-cyan-300" 
        delay={1.2} 
        x="-5%" 
        y="45%" 
        rotate="-45deg"
        size="w-14 h-16" 
      />

      {/* Right Side Group */}
      <FloatingBook 
        color="bg-blue-500" 
        delay={0.8} 
        x="85%" 
        y="20%" 
        rotate="15deg"
        size="w-18 h-22"
      />
      <FloatingIconBubble 
        icon={Award} 
        color="from-purple-500 to-pink-500" 
        delay={1.5} 
        x="80%" 
        y="50%" 
        size="w-16 h-16"
      />
      <FloatingBook 
        color="bg-purple-300" 
        delay={2.0} 
        x="95%" 
        y="40%" 
        rotate="30deg" 
        size="w-16 h-20"
      />

      {/* Top/Bottom Scatter */}
      <FloatingIconBubble 
        icon={Brain} 
        color="from-emerald-400 to-teal-500" 
        delay={1.8} 
        x="65%" 
        y="10%" 
        size="w-12 h-12"
      />
      <FloatingIconBubble 
        icon={ClipboardCheck} 
        color="from-orange-400 to-amber-500" 
        delay={2.2} 
        x="30%" 
        y="80%" 
        size="w-14 h-14"
      />
    </div>
  );
};