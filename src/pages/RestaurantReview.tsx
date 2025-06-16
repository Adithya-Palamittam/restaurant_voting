import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const RestaurantReview = () => {
  const [regionalRestaurants, setRegionalRestaurants] = useState<Restaurant[]>([]);
  const [nationalRestaurants, setNationalRestaurants] = useState<Restaurant[]>([]);
  const [removedFromRegional, setRemovedFromRegional] = useState(false);
  const [removedFromNational, setRemovedFromNational] = useState(false);
  const navigate = useNavigate();

  const combinedRestaurants = [...regionalRestaurants, ...nationalRestaurants];
  const is15Restaurants = combinedRestaurants.length === 15;
  const hasRemovedRestaurants = removedFromRegional || removedFromNational;

  useEffect(() => {
    const regional = localStorage.getItem("regionalRestaurants");
    const national = localStorage.getItem("nationalRestaurants");

    if (regional) setRegionalRestaurants(JSON.parse(regional));
    if (national) setNationalRestaurants(JSON.parse(national));
  }, []);

  const removeRestaurant = (restaurantId: string) => {
    if (regionalRestaurants.some(r => r.id === restaurantId)) {
      const updatedRegional = regionalRestaurants.filter(r => r.id !== restaurantId);
      setRegionalRestaurants(updatedRegional);
      localStorage.setItem("regionalRestaurants", JSON.stringify(updatedRegional));
      setRemovedFromRegional(true);
    } else if (nationalRestaurants.some(r => r.id === restaurantId)) {
      const updatedNational = nationalRestaurants.filter(r => r.id !== restaurantId);
      setNationalRestaurants(updatedNational);
      localStorage.setItem("nationalRestaurants", JSON.stringify(updatedNational));
      setRemovedFromNational(true);
    }
  };

  const handleAddRestaurant = () => {
    if (removedFromRegional && removedFromNational) {
      navigate("/regional-selection");
    } else if (removedFromRegional) {
      navigate("/regional-selection");
    } else if (removedFromNational) {
      navigate("/national-selection");
    }
  };

  const handleProceedToRating = () => {
    navigate("/rating");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <span className="text-lg font-medium">These are your top 15 restaurants</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Traveller</span>
          <div className="w-px h-4 bg-gray-300"></div>
          <span className="text-sm font-medium">district</span>
          <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-black rounded-full ml-2">
            <span className="text-xs font-bold">T</span>
            <div className="w-2 h-2 border border-black rounded-full"></div>
            <span className="text-xs font-bold">P</span>
          </div>
          <div className="text-xs">
            <div>RESTAURANT</div>
            <div>AWARDS</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-300 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-4 p-4 font-semibold border-b border-gray-200">
                <div>City</div>
                <div>Restaurant Name</div>
                <div>Remove</div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {combinedRestaurants.map(restaurant => (
                  <div
                    key={restaurant.id}
                    className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center"
                  >
                    <div>{restaurant.city}</div>
                    <div>{restaurant.name}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRestaurant(restaurant.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={handleAddRestaurant}
                disabled={!hasRemovedRestaurants}
                className={`px-6 py-2 rounded ${
                  hasRemovedRestaurants
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add a restaurant
              </Button>

              <Button
                onClick={handleProceedToRating}
                disabled={!is15Restaurants}
                className={`px-8 py-2 rounded ${
                  is15Restaurants
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                }`}
              >
                Ready? It's time to rate
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="border border-gray-300 rounded-lg mb-6">
            <div className="grid grid-cols-3 gap-2 p-3 font-semibold border-b border-gray-200 text-sm">
              <div>City</div>
              <div>Restaurant Name</div>
              <div>Remove</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {combinedRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="grid grid-cols-3 gap-2 p-3 border-b border-gray-100 items-center text-sm"
                >
                  <div>{restaurant.city}</div>
                  <div>{restaurant.name}</div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRestaurant(restaurant.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleAddRestaurant}
              disabled={!hasRemovedRestaurants}
              className={`w-full py-2 rounded ${
                hasRemovedRestaurants
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add a restaurant
            </Button>

            <Button
              onClick={handleProceedToRating}
              disabled={!is15Restaurants}
              className={`w-full py-2 rounded ${
                is15Restaurants
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              }`}
            >
              Ready? It's time to rate
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-3">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default RestaurantReview;
