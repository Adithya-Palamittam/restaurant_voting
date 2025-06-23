
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface AddRestaurantDialogProps {
  cities: string[];
  selectedRestaurants: Restaurant[];
  onAddRestaurant: (restaurant: Restaurant) => void;
  maxSelections: number;
}

const AddRestaurantDialog = ({ 
  cities, 
  selectedRestaurants, 
  onAddRestaurant, 
  maxSelections 
}: AddRestaurantDialogProps) => {
  const [newRestaurantCity, setNewRestaurantCity] = useState("");
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addCustomRestaurant = () => {
    if (newRestaurantCity.trim() && newRestaurantName.trim() && selectedRestaurants.length < maxSelections) {
      const newRestaurant: Restaurant = {
        id: `custom-${Date.now()}`,
        city: newRestaurantCity,
        name: newRestaurantName
      };
      onAddRestaurant(newRestaurant);
      setNewRestaurantCity("");
      setNewRestaurantName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="mb-2">
      <p className="text-center text-sm mb-3">Want to add a restaurant that is not on this list?</p>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-center">
        <DialogTrigger asChild>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <div>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-12 text-md disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={selectedRestaurants.length >= maxSelections}
        >
          Yes
        </Button>
      </div>
    </Tooltip.Trigger>
    {selectedRestaurants.length >= maxSelections && (
      <Tooltip.Content
        side="top"
        className="bg-black text-white px-4 py-2 rounded text-sm shadow-lg z-50"
      >
        You’ve already added {maxSelections} restaurants
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>
    )}
  </Tooltip.Root>
</Tooltip.Provider>

        </DialogTrigger>
        </div>
        <DialogContent className="max-w-md w-[90%]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-left pr-4">Nominate a restaurant not on this list</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Restaurant name, location/branch"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
            />
            <Select value={newRestaurantCity} onValueChange={setNewRestaurantCity}>
              <SelectTrigger>
                <SelectValue placeholder="City/Town" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addCustomRestaurant}
              className="w-full"
              disabled={!newRestaurantCity.trim() || !newRestaurantName.trim() || selectedRestaurants.length >= maxSelections}
            >
              Add Restaurant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRestaurantDialog;
