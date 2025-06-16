
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface SelectedRestaurantsListProps {
  selectedRestaurants: Restaurant[];
  onRemoveRestaurant: (restaurantId: string) => void;
  maxSelections: number;
}

const SelectedRestaurantsList = ({ 
  selectedRestaurants, 
  onRemoveRestaurant, 
  maxSelections 
}: SelectedRestaurantsListProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 h-[calc(100%-120px)]">
      <h3 className="font-semibold mb-4">Selected Restaurant's</h3>
      
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 p-2 font-semibold border-b border-gray-200">
          <div>City</div>
          <div>Restaurant Name</div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {selectedRestaurants.map(restaurant => (
            <div key={restaurant.id} className="grid grid-cols-2 gap-4 p-2 border-b border-gray-100 items-center">
              <div className="text-sm">{restaurant.city}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{restaurant.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveRestaurant(restaurant.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm">
        You need to add {maxSelections - selectedRestaurants.length} more restaurant's
      </div>
    </div>
  );
};

export default SelectedRestaurantsList;
