export interface Restaurant {
  id: string;
  name: string;
  rating: number; // 1-5 stars
  isVegetarian: boolean;
  isHalal: boolean;
}

export interface DietaryFilters {
  vegetarianOnly: boolean;
  halalOnly: boolean;
}
