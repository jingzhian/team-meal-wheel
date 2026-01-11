import { useState } from "react";
import { Star, Leaf, Moon, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { Restaurant } from "@/types/restaurant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onRestaurantsChange: (restaurants: Restaurant[]) => void;
}

export function RestaurantList({ restaurants, onRestaurantsChange }: RestaurantListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Restaurant | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState<Omit<Restaurant, "id">>({
    name: "",
    rating: 3,
    isVegetarian: false,
    isHalal: false,
  });

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditForm({ ...restaurant });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onRestaurantsChange(
        restaurants.map((r) => (r.id === editForm.id ? editForm : r))
      );
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    onRestaurantsChange(restaurants.filter((r) => r.id !== id));
  };

  const handleAdd = () => {
    if (newRestaurant.name.trim()) {
      const newId = Date.now().toString();
      onRestaurantsChange([...restaurants, { ...newRestaurant, id: newId }]);
      setNewRestaurant({ name: "", rating: 3, isVegetarian: false, isHalal: false });
      setIsAdding(false);
    }
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-star text-star" : "text-muted-foreground/30"
            } ${onChange ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Restaurants</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {isAdding && (
          <div className="p-3 border rounded-lg bg-secondary/50 space-y-3">
            <Input
              placeholder="Restaurant name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              {renderStars(newRestaurant.rating, (rating) =>
                setNewRestaurant({ ...newRestaurant, rating })
              )}
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={newRestaurant.isVegetarian}
                  onCheckedChange={(checked) =>
                    setNewRestaurant({ ...newRestaurant, isVegetarian: !!checked })
                  }
                />
                <Leaf className="w-4 h-4 text-vegetarian" />
                Vegetarian
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={newRestaurant.isHalal}
                  onCheckedChange={(checked) =>
                    setNewRestaurant({ ...newRestaurant, isHalal: !!checked })
                  }
                />
                <Moon className="w-4 h-4 text-halal" />
                Halal
              </label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newRestaurant.name.trim()}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="p-3 border rounded-lg hover:bg-secondary/30 transition-colors"
          >
            {editingId === restaurant.id && editForm ? (
              <div className="space-y-3">
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  {renderStars(editForm.rating, (rating) =>
                    setEditForm({ ...editForm, rating })
                  )}
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={editForm.isVegetarian}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, isVegetarian: !!checked })
                      }
                    />
                    <Leaf className="w-4 h-4 text-vegetarian" />
                    Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={editForm.isHalal}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, isHalal: !!checked })
                      }
                    />
                    <Moon className="w-4 h-4 text-halal" />
                    Halal
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{restaurant.name}</span>
                    {restaurant.isVegetarian && (
                      <Leaf className="w-4 h-4 text-vegetarian" />
                    )}
                    {restaurant.isHalal && (
                      <Moon className="w-4 h-4 text-halal" />
                    )}
                  </div>
                  <div className="mt-1">{renderStars(restaurant.rating)}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEdit(restaurant)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(restaurant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {restaurants.length === 0 && !isAdding && (
          <p className="text-center text-muted-foreground py-8">
            No restaurants yet. Add some to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
