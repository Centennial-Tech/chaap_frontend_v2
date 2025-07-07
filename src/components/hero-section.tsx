import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  // Animated node network state
  const NODES = [
    { id: 1, base: [120, 100], color: "#2563eb", r: 5 },
    { id: 2, base: [300, 200], color: "#2563eb", r: 7 },
    { id: 3, base: [500, 120], color: "#f59e42", r: 6 },
    { id: 4, base: [700, 180], color: "#2563eb", r: 5 },
    { id: 5, base: [800, 350], color: "#2563eb", r: 8 },
    { id: 6, base: [650, 500], color: "#f59e42", r: 6 },
    { id: 7, base: [400, 480], color: "#2563eb", r: 5 },
    { id: 8, base: [200, 400], color: "#2563eb", r: 7 },
  ];
  const LINKS = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [1, 7], [2, 6], [3, 5], [4, 6], [0, 2], [1, 5], [3, 7]
  ];
  const [positions, setPositions] = useState(
    NODES.map(n => ({
      x: n.base[0],
      y: n.base[1],
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }))
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function animate() {
      setPositions((prev) =>
        prev.map((pos, i) => {
          // Gentle oscillation
          const t = Date.now() / 1200;
          const dx = Math.sin(t * positions[i].speed + positions[i].phase) * 10;
          const dy = Math.cos(t * positions[i].speed + positions[i].phase) * 10;
          return {
            ...pos,
            x: NODES[i].base[0] + dx,
            y: NODES[i].base[1] + dy,
          };
        })
      );
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // eslint-disable-next-line
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full bg-white text-gray-900 overflow-hidden flex items-center justify-center min-h-[calc(100vh-5rem)]">
      {/* Animated AI Network SVG Background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg
          width="900"
          height="600"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-30"
        >
          {/* Connectors */}
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              x1={positions[a]?.x}
              y1={positions[a]?.y}
              x2={positions[b]?.x}
              y2={positions[b]?.y}
              stroke="#2563eb"
              strokeWidth={1.2}
            />
          ))}
          {/* Nodes (animated) */}
          {positions.map((pos, i) => (
            <circle
              key={NODES[i].id}
              className="animate-pulse"
              cx={pos.x}
              cy={pos.y}
              r={NODES[i].r}
              fill={NODES[i].color}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
            ✨ Healthcare AI Revolution
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 text-gray-900 max-w-5xl mx-auto">
            AI That Understands{" "}
            <span className="text-gray-900 bg-clip-text">
              Regulation
            </span>
          </h1>
          <p className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4">
            So You Don't Have To.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Streamline regulatory compliance with AI-powered agents that understand healthcare regulations and accelerate your submission processes with unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg inline-flex items-center justify-center"
            >
              Book A Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button 
              onClick={scrollToFeatures}
              className="border-2 border-blue-600 hover:border-orange-500 text-blue-600 hover:text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
