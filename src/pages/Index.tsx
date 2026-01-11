import { useState, useMemo, useEffect } from "react";
import { Restaurant, DietaryFilters as DietaryFiltersType } from "@/types/restaurant";
import { defaultRestaurants } from "@/data/defaultRestaurants";
import { SpinnerWheel } from "@/components/SpinnerWheel";
import { DietaryFilters } from "@/components/DietaryFilters";
import { RestaurantList } from "@/components/RestaurantList";
import { WinnerModal } from "@/components/WinnerModal";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

const STORAGE_KEY = "restaurant-spinner-data";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultRestaurants;
  });

  const [filters, setFilters] = useState<DietaryFiltersType>({
    vegetarianOnly: false,
    halalOnly: false,
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (filters.vegetarianOnly && !r.isVegetarian) return false;
      if (filters.halalOnly && !r.isHalal) return false;
      return true;
    });
  }, [restaurants, filters]);

  const handleSpin = () => {
    if (filteredRestaurants.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSpinTrigger(prev => prev + 1);
  };

  const handleSpinEnd = (selectedWinner: Restaurant) => {
    setWinner(selectedWinner);
    setIsSpinning(false);
    setShowWinner(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Utensils className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Team Lunch Spinner</h1>
              <p className="text-sm text-muted-foreground">Let fate decide where we eat!</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Left Column - Wheel */}
          <div className="space-y-6">
            {/* Dietary Filters */}
            <DietaryFilters filters={filters} onFiltersChange={setFilters} />

            {/* Wheel */}
            <div className="bg-card rounded-2xl border p-6 shadow-lg">
              <SpinnerWheel
                restaurants={filteredRestaurants}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
                spinTrigger={spinTrigger}
              />

              {/* Spin Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleSpin}
                  disabled={isSpinning || filteredRestaurants.length === 0}
                  className={`text-lg px-12 py-6 font-bold transition-all ${
                    isSpinning ? "" : "animate-pulse-glow hover:scale-105"
                  }`}
                >
                  {isSpinning ? "Spinning..." : "🎰 SPIN THE WHEEL!"}
                </Button>
              </div>

              {filteredRestaurants.length > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} in the wheel
                  {(filters.vegetarianOnly || filters.halalOnly) && " (filtered)"}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Restaurant List */}
          <div>
            <RestaurantList
              restaurants={restaurants}
              onRestaurantsChange={setRestaurants}
            />
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        isOpen={showWinner}
        onClose={() => setShowWinner(false)}
      />

      {/* Add confetti keyframe animation */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
