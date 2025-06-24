import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface SelectedRestaurantListPhoneProps {
  selectedRestaurants: Restaurant[];
  onRemoveRestaurant: (restaurantId: string) => void;
  maxSelections: number;
}

const SelectedRestaurantListPhone = ({
  selectedRestaurants,
  onRemoveRestaurant,
  maxSelections,
}: SelectedRestaurantListPhoneProps) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white h-full flex flex-col mx-4">
      <div className="grid grid-cols-[30%_60%_auto] p-1 border-b border-gray-200 text-sm shrink-0">
        <div>City</div>
        <div>Restaurant name</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="grid grid-cols-[30%_60%_auto] p-1 border-b border-gray-100 items-center text-sm"
          >
            <div>{restaurant.city}</div>
            <div>{restaurant.name}</div>
            <div className="text-center">
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
      <div className="p-1 text-center text-xs shrink-0">
        {selectedRestaurants.length < maxSelections ? (
          <>
            Please add <span className="text-red-500 font-semibold">{maxSelections - selectedRestaurants.length}</span> restaurants
          </>
        ) : (
          <span className="text-green-600 font-semibold">You have added {maxSelections} restaurants.</span>
        )}
      </div>
    </div>
  );
};

export default SelectedRestaurantListPhone; 