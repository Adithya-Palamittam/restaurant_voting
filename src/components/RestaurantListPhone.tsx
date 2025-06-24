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
    <div className="border-t border-gray-200 h-full overflow-x-hidden flex flex-col bg-gray-100">
      <div className="grid grid-cols-[30%_60%_auto] p-1 border-b border-gray-200 text-sm shrink-0">
        <div>City</div>
        <div>Restaurant name</div>
        <div className="text-center pr-6">Add</div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin text-sm">
        {[...restaurants]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(restaurant => (
          <div key={restaurant.id} className="grid grid-cols-[30%_60%_auto] p-1 border-b border-gray-100 hover:bg-gray-50">
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
