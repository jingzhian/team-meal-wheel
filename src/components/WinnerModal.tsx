import { useEffect, useState } from "react";
import { Restaurant } from "@/types/restaurant";
import { Star, PartyPopper, Leaf, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WinnerModalProps {
  winner: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WinnerModal({ winner, isOpen, onClose }: WinnerModalProps) {
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = [
        "hsl(0, 85%, 60%)",
        "hsl(45, 95%, 55%)",
        "hsl(168, 76%, 42%)",
        "hsl(200, 85%, 50%)",
        "hsl(262, 80%, 60%)",
      ];
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setConfetti(newConfetti);
    }
  }, [isOpen]);

  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${piece.left}%`,
                top: "-20px",
                backgroundColor: piece.color,
                animation: `confetti 2s ease-out ${piece.delay}s forwards`,
              }}
            />
          ))}
        </div>

        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <PartyPopper className="w-6 h-6 text-accent" />
            We're ordering from...
            <PartyPopper className="w-6 h-6 text-accent" />
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <div className="animate-bounce-in">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {winner.name}
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= winner.rating
                        ? "fill-star text-star"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              {winner.isVegetarian && (
                <span className="flex items-center gap-1 text-sm bg-vegetarian/10 text-vegetarian px-3 py-1 rounded-full">
                  <Leaf className="w-4 h-4" />
                  Vegetarian Options
                </span>
              )}
              {winner.isHalal && (
                <span className="flex items-center gap-1 text-sm bg-halal/10 text-halal px-3 py-1 rounded-full">
                  <Moon className="w-4 h-4" />
                  Halal
                </span>
              )}
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full" size="lg">
          Start Ordering! 🍕
        </Button>
      </DialogContent>
    </Dialog>
  );
}
