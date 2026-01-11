import { Leaf, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DietaryFilters as DietaryFiltersType } from "@/types/restaurant";

interface DietaryFiltersProps {
  filters: DietaryFiltersType;
  onFiltersChange: (filters: DietaryFiltersType) => void;
}

export function DietaryFilters({ filters, onFiltersChange }: DietaryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl border shadow-sm">
      <div className="flex items-center gap-3">
        <Switch
          id="vegetarian"
          checked={filters.vegetarianOnly}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, vegetarianOnly: checked })
          }
        />
        <Label
          htmlFor="vegetarian"
          className="flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <Leaf className="w-4 h-4 text-vegetarian" />
          Vegetarian Only
        </Label>
      </div>
      
      <div className="flex items-center gap-3">
        <Switch
          id="halal"
          checked={filters.halalOnly}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, halalOnly: checked })
          }
        />
        <Label
          htmlFor="halal"
          className="flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <Moon className="w-4 h-4 text-halal" />
          Halal Only
        </Label>
      </div>
    </div>
  );
}
