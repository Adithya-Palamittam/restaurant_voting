
import { Checkbox } from "@/components/ui/checkbox";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface RestaurantListPhoneProps {
  restaurants: Restaurant[];
  selectedRestaurants: Restaurant[];
  onRestaurantToggle: (restaurant: Restaurant) => void;
  maxSelections: number;
}

const RestaurantListPhone = ({ 
  restaurants, 
  selectedRestaurants, 
  onRestaurantToggle, 
  maxSelections 
}: RestaurantListPhoneProps) => {
  const isSelected = (restaurantId: string) => {
    return selectedRestaurants.some(r => r.id === restaurantId);
  };

  return (
    <div className="border-t border-gray-200 h-full overflow-x-hidden flex flex-col">
      <div className="grid grid-cols-[30%_60%_auto] p-2 font-semibold border-b border-gray-200">
        <div>City</div>
        <div>Restaurant name</div>
        <div className="text-center pr-6">Add</div>
      </div>
      
      <div className="max-h-72 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin">
        {[...restaurants]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(restaurant => (
          <div key={restaurant.id} className="grid grid-cols-[30%_60%_auto] p-2 border-b border-gray-100 hover:bg-gray-50">
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

export default RestaurantListPhone;
