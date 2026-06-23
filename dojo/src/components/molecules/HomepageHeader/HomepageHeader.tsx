
import React from 'react';
import { ChevronDown, Star } from 'lucide-react';

export interface HomepageHeaderProps {
  logo: string | null;
  logoLoading: boolean;
  companyName: string;
  onToggleFilter?: () => void;
  isFilterExpanded?: boolean;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({
  logo,
  logoLoading,
  companyName = 'KML',
  onToggleFilter,
  isFilterExpanded = false,
}) => {
  // Diamond configurations with varied sizes
  const diamonds = [
    { size: 'w-8 h-8', left: '5%', top: '55%', delay: '0s', duration: '9s' },
    { size: 'w-20 h-20', left: '25%', top: '2%', delay: '0.8s', duration: '10s' },
    { size: 'w-5 h-5', left: '40%', top: '60%', delay: '1.5s', duration: '9.5s' },
    { size: 'w-5 h-5', left: '65%', top: '15%', delay: '2s', duration: '11s' },
    { size: 'w-40 h-40', left: '70%', top: '45%', delay: '0.5s', duration: '9s' },
    { size: 'w-20 h-20', left: '85%', top: '30%', delay: '1.2s', duration: '10s' },
    { size: 'w-40 h-40', left: '15%', top: '55%', delay: '2.5s', duration: '10.5s' },
    { size: 'w-10 h-10', left: '90%', top: '70%', delay: '1.8s', duration: '9.5s' },
  ];

  return (
    <header className="relative overflow-hidden pt-8 md:pt-12 lg:pt-16 md:pb-16  px-4 md:px-8 antialiased transition-colors duration-500">

      {/* ================= BACKGROUND BASE WITH GLASS ================= */}
      <div className="absolute inset-0 bg-[rgb(var(--header-bg))] transition-colors duration-500" />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%, pointer-events-none" />

      {/* ================= FLOATING DIAMONDS (VARIED SIZES) ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {diamonds.map((diamond, i) => (
          <div
            key={i}
            className={`absolute ${diamond.size} rotate-45 border border-accent/100  backdrop-blur-sm animate-float`}
            style={{
              left: diamond.left,
              top: diamond.top,
              animationDelay: diamond.delay,
              animationDuration: diamond.duration,
            }}
          />
        ))}
      </div>

      {/* ================= THE GEOMETRIC PATTERN ================= */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="header-accent-grid" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#header-accent-grid)" />
        </svg>
      </div>

      {/* ================= STRUCTURAL ACCENT FRAMING ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--brand-accent) / 0.5), transparent)' }}
        />
        <div className="hidden md:block absolute top-[10%] left-[8%] w-3 h-3 border border-accent -translate-x-1.5 -translate-y-1.5 rotate-45 bg-accent/10" />
        <div className="hidden md:block absolute top-[10%] right-[8%] w-3 h-3 border border-accent translate-x-1.5 -translate-y-1.5 rotate-45 bg-accent/10" />
      </div>

      {/* ================= CONTENT LAYER ================= */}
      <div className="flex justify-center mb-5 md:mb-0">

        {/* Text Section - No box, just content with glow */}
        <div className="flex flex-col text-center py-4 px-6 relative">
          <div className="absolute inset-0 bg-black/10 blur-xl rounded-full -z-10" />

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black  py-8 text-center">
            <span className="relative inline-block">

              {/* LAYER 1: THE GOLD BASE & 3D EXTRUSION (Behind) */}
              <span
                className="absolute inset-0"
                style={{
                  WebkitTextStroke: '4px #dab00a', // Thick Gold Outline
                  // This creates the "Gold Block" look
                  textShadow: `
          0px 1px 0px var(--title-3d-shadow),
        
          0px 15px 30px rgba(0,0,0,0.5)
        `,
                  zIndex: 1,
                }}
                aria-hidden="true"
              >
                Digital Learning Platform
              </span>

              {/* LAYER 2: THE METALLIC FILL (On Top) */}
              <span
                className="relative inline-block"
                style={{
                  // Use the CSS variable we defined
                  background: 'var(--title-3d-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  zIndex: 2,
                  // This filter adds a crispness to the metallic reflection
                  filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.2)) brightness(1.1)',
                }}
              >
                Digital Learning Platform
              </span>

            </span>
          </h1>

          <h2
            className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 uppercase tracking-[0.2em] text-header-text flex items-center justify-center gap-3"
            style={{ textShadow: '0 0 20px rgb(var(--brand-accent) / 0.4)' }}
          >
            <Star className="w-4 h-4 text-accent fill-accent" />
            Skill India ! Build India
            <Star className="w-4 h-4 text-accent fill-accent" />
          </h2>

          <span className="text-small md:text-small opacity-60">

          </span>

          <div className="flex items-center justify-center gap-3 opacity-90 mt-2">
            <div className="h-[1px] w-12 bg-accent/60" />

            <button
              onClick={onToggleFilter}
              className="group p-1 rounded-full hover:bg-accent/20 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Toggle filters"
            >
              <ChevronDown
                className={`w-6 h-6 text-accent transition-transform duration-500 ${isFilterExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            <div className="h-[1px] w-12 bg-accent/60" />
          </div>
        </div>

      </div>

      {/* ================= BOTTOM CURVE ================= */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 lg:h-20"
          style={{ display: 'block' }}
        >
          <path
            d="M0,80 L0,40 Q360,0 720,30 T1440,40 L1440,80 Z"
            fill="rgb(var(--bg-main))"
            className="transition-colors duration-500"
          />
          <path
            d="M0,40 Q360,0 720,30 T1440,40"
            fill="none"
            stroke="url(#curveAccentNeat)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="curveAccentNeat" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgb(var(--brand-accent))" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ================= FLOATING ANIMATION STYLES ================= */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: rotate(45deg) translateY(0px); opacity: 0.4; }
          50% { transform: rotate(45deg) translateY(-20px); opacity: 0.8; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </header>
  );
};

export default HomepageHeader;

