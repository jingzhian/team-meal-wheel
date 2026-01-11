import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/types/restaurant";

interface SpinnerWheelProps {
  restaurants: Restaurant[];
  isSpinning: boolean;
  onSpinEnd: (winner: Restaurant) => void;
  spinTrigger: number;
}

const WHEEL_COLORS = [
  "hsl(0, 85%, 60%)",
  "hsl(25, 95%, 55%)",
  "hsl(45, 95%, 55%)",
  "hsl(142, 70%, 45%)",
  "hsl(168, 76%, 42%)",
  "hsl(200, 85%, 50%)",
  "hsl(262, 80%, 60%)",
  "hsl(320, 75%, 55%)",
];

export function SpinnerWheel({ restaurants, isSpinning, onSpinEnd, spinTrigger }: SpinnerWheelProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGGElement>(null);
  const hasSpunRef = useRef(false);

  useEffect(() => {
    if (isSpinning && restaurants.length > 0 && spinTrigger > 0) {
      hasSpunRef.current = true;
      
      // Calculate weighted random based on ratings
      const totalWeight = restaurants.reduce((sum, r) => sum + r.rating, 0);
      let random = Math.random() * totalWeight;
      let winnerIndex = 0;
      
      for (let i = 0; i < restaurants.length; i++) {
        random -= restaurants[i].rating;
        if (random <= 0) {
          winnerIndex = i;
          break;
        }
      }

      const segmentAngle = 360 / restaurants.length;
      const targetSegmentCenter = segmentAngle * winnerIndex + segmentAngle / 2;
      
      // Spin multiple full rotations plus land on winner (pointer at top = 270 degrees)
      const fullRotations = 5 + Math.floor(Math.random() * 3);
      const targetRotation = fullRotations * 360 + (270 - targetSegmentCenter);
      
      setRotation(prev => prev + targetRotation);

      // Call onSpinEnd after animation
      setTimeout(() => {
        onSpinEnd(restaurants[winnerIndex]);
      }, 4000);
    }
  }, [spinTrigger]);

  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center w-full aspect-square max-w-md mx-auto">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No restaurants available</p>
          <p className="text-sm">Add some restaurants or adjust your filters</p>
        </div>
      </div>
    );
  }

  const segmentAngle = 360 / restaurants.length;
  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArc = segmentAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const angle = ((index * segmentAngle) + (segmentAngle / 2) - 90) * (Math.PI / 180);
    const textRadius = radius * 0.65;
    return {
      x: centerX + textRadius * Math.cos(angle),
      y: centerY + textRadius * Math.sin(angle),
      rotation: index * segmentAngle + segmentAngle / 2,
    };
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-foreground drop-shadow-lg" />
      </div>
      
      {/* Wheel */}
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.25" />
          </filter>
        </defs>
        
        <g
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {/* Outer ring */}
          <circle cx={centerX} cy={centerY} r={radius + 8} fill="hsl(var(--foreground))" />
          <circle cx={centerX} cy={centerY} r={radius + 4} fill="hsl(var(--background))" />
          
          {/* Segments */}
          {restaurants.map((restaurant, index) => {
            const textPos = getTextPosition(index);
            const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
            const displayName = restaurant.name.length > 12 
              ? restaurant.name.substring(0, 11) + "…" 
              : restaurant.name;
            
            return (
              <g key={restaurant.id}>
                <path
                  d={createSegmentPath(index)}
                  fill={color}
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill="white"
                  fontSize={restaurants.length > 6 ? "14" : "16"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    transform: `rotate(${textPos.rotation}deg)`,
                    transformOrigin: `${textPos.x}px ${textPos.y}px`,
                    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  {displayName}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle cx={centerX} cy={centerY} r="30" fill="hsl(var(--foreground))" />
          <circle cx={centerX} cy={centerY} r="25" fill="hsl(var(--background))" />
          <circle cx={centerX} cy={centerY} r="20" fill="hsl(var(--primary))" />
        </g>
      </svg>
    </div>
  );
}
