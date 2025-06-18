
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
    <div className="border-t border-gray-200 h-[calc(100%-90px)] overflow-x-hidden flex flex-col">
      <div className="grid grid-cols-[20%_70%_auto] gap-4 p-2 font-semibold border-b border-gray-200 ">
        <div>City</div>
        <div>Restaurant Name</div>
        <div>Add</div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {[...restaurants]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(restaurant => (
          <div key={restaurant.id} className="grid grid-cols-[20%_70%_auto] gap-4 p-2 border-b border-gray-100 hover:bg-gray-50">
            <div>{restaurant.city}</div>
            <div className="break-words whitespace-normal">{restaurant.name}</div>
            <div className="flex items-center justify-center">
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
