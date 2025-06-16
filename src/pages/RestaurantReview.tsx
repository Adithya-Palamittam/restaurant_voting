import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext"; // <- get UID here

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const RestaurantReview = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const [regionalRestaurants, setRegionalRestaurants] = useState<Restaurant[]>([]);
  const [nationalRestaurants, setNationalRestaurants] = useState<Restaurant[]>([]);
  const [removedFromRegional, setRemovedFromRegional] = useState(false);
  const [removedFromNational, setRemovedFromNational] = useState(false);
  const [loading, setLoading] = useState(true);

  const combinedRestaurants = [...regionalRestaurants, ...nationalRestaurants];
  const is15Restaurants = combinedRestaurants.length === 15;
  const hasRemovedRestaurants = removedFromRegional || removedFromNational;

  useEffect(() => {
    const fetchSelections = async () => {
      if (!userData?.uid) return;

      const { data, error } = await supabase
        .from("user_selection_table")
        .select("selected_regional_restaurants, selected_national_restaurants")
        .eq("user_id", userData.uid)
        .single();

      if (error) {
        console.error("Error fetching selections:", error.message);
        return;
      }

      setRegionalRestaurants(data?.selected_regional_restaurants || []);
      setNationalRestaurants(data?.selected_national_restaurants || []);
      setLoading(false);
    };

    fetchSelections();
  }, [userData?.uid]);

  const updateSelectionInSupabase = async (
    updatedRegional: Restaurant[],
    updatedNational: Restaurant[]
  ) => {
    const { error } = await supabase
      .from("user_selection_table")
      .update({
        selected_regional_restaurants: updatedRegional,
        selected_national_restaurants: updatedNational,
      })
      .eq("user_id", userData.uid);

    if (error) {
      console.error("Error updating selections in Supabase:", error.message);
    }
  };

  const removeRestaurant = (restaurantId: string) => {
    const isRegional = regionalRestaurants.some(r => r.id === restaurantId);
    const isNational = nationalRestaurants.some(r => r.id === restaurantId);

    let updatedRegional = [...regionalRestaurants];
    let updatedNational = [...nationalRestaurants];

    if (isRegional) {
      updatedRegional = regionalRestaurants.filter(r => r.id !== restaurantId);
      setRegionalRestaurants(updatedRegional);
      setRemovedFromRegional(true);
    } else if (isNational) {
      updatedNational = nationalRestaurants.filter(r => r.id !== restaurantId);
      setNationalRestaurants(updatedNational);
      setRemovedFromNational(true);
    }

    updateSelectionInSupabase(updatedRegional, updatedNational);
  };

  const handleAddRestaurant = () => {
    if (removedFromRegional) {
      navigate("/regional-selection");
    } else if (removedFromNational) {
      navigate("/national-selection");
    }
  };

  const handleProceedToRating = () => {
    navigate("/rating");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading your selections...</div>;
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <span className="text-lg font-medium">These are your top 15 restaurants</span>

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

            <div className="flex flex-col justify-center gap-4 mb-6">
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
                    : "bg-black text-white hover:bg-gray-800 "
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
