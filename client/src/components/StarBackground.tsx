import { useEffect, useState } from "react";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    const generateStars = () => {
      const newStars: Star[] = [];
      const count = 50; // Number of stars

      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          size: Math.random() * 2 + 1, // 1px to 3px
          delay: Math.random() * 5, // 0s to 5s delay
          duration: Math.random() * 3 + 2, // 2s to 5s duration
          opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8 opacity
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Dark mode stars */}
      <div className="hidden dark:block absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
        
        {/* Subtle nebula/fog effects for extra atmosphere */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl filter mix-blend-screen opacity-30 animate-float" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl filter mix-blend-screen opacity-30 animate-float" style={{ animationDuration: '15s', animationDelay: '-5s' }} />
      </div>

      {/* Light mode - very subtle decorative elements if needed, keeping it clean for now */}
      <div className="block dark:hidden absolute inset-0">
         {/* Optional: Add very faint particles for light mode if requested, otherwise leave empty for clean look */}
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
      </div>
    </div>
  );
}
