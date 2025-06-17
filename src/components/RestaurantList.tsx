
import { Checkbox } from "@/components/ui/checkbox";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedRestaurants: Restaurant[];
  onRestaurantToggle: (restaurant: Restaurant) => void;
  maxSelections: number;
}

const RestaurantList = ({ 
  restaurants, 
  selectedRestaurants, 
  onRestaurantToggle, 
  maxSelections 
}: RestaurantListProps) => {
  const isSelected = (restaurantId: string) => {
    return selectedRestaurants.some(r => r.id === restaurantId);
  };

  return (
    <div className="border-t border-gray-200">
      <div className="grid grid-cols-3 gap-4 p-2 font-semibold border-b border-gray-200">
        <div>City</div>
        <div>Restaurant Name</div>
        <div>Add</div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {[...restaurants]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(restaurant => (
          <div key={restaurant.id} className="grid grid-cols-3 gap-4 p-2 border-b border-gray-100 hover:bg-gray-50">
            <div>{restaurant.city}</div>
            <div className="break-words whitespace-normal">{restaurant.name}</div>
            <div>
              <Checkbox
                checked={isSelected(restaurant.id)}
                onCheckedChange={() => onRestaurantToggle(restaurant)}
                disabled={!isSelected(restaurant.id) && selectedRestaurants.length >= maxSelections}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
