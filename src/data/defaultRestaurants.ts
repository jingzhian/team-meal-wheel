import { Restaurant } from "@/types/restaurant";

export const defaultRestaurants: Restaurant[] = [
  { id: "1", name: "Panda Express", rating: 4, isVegetarian: true, isHalal: false },
  { id: "2", name: "Chipotle", rating: 5, isVegetarian: true, isHalal: false },
  { id: "3", name: "Halal Guys", rating: 5, isVegetarian: true, isHalal: true },
  { id: "4", name: "Subway", rating: 3, isVegetarian: true, isHalal: false },
  { id: "5", name: "Pizza Hut", rating: 3, isVegetarian: true, isHalal: false },
  { id: "6", name: "Tikka Masala", rating: 4, isVegetarian: true, isHalal: true },
  { id: "7", name: "Mediterranean Grill", rating: 4, isVegetarian: true, isHalal: true },
  { id: "8", name: "Thai Basil", rating: 4, isVegetarian: true, isHalal: false },
];
