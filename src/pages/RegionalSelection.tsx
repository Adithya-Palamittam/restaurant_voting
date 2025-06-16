import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import AddRestaurantDialog from "@/components/AddRestaurantDialog";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const RegionalSelection = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const regionId = userData?.assigned_region;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!regionId) return;

    const fetchRestaurants = async () => {
      const { data, error } = await supabase
        .from("restaurants_table")
        .select("*")
        .eq("region_id", regionId);

      if (error) {
        console.error("Error fetching restaurants:", error.message);
      } else {
        const mapped: Restaurant[] = data.map(r => ({
          id: r.restaurant_id,
          name: r.restaurant_name,
          city: r.city_name,
        }));
        setRestaurants(mapped);
      }
    };

    fetchRestaurants();
  }, [regionId]);

useEffect(() => {
  const fetchUserSelection = async () => {
    if (!userData?.uid || restaurants.length === 0) return;

    const { data, error } = await supabase
      .from("user_selection_table")
      .select("selected_regional_restaurants")
      .eq("user_id", userData.uid)
      .single();

    if (error) {
      console.error("Error fetching user selection:", error.message);
      return;
    }

    const selected = data?.selected_regional_restaurants || [];
    setSelectedRestaurants(selected); // safe because selected is full JSON
    setHasInitialized(true); // ✅ enable DB updates only after initial load
  };

  fetchUserSelection();
}, [userData?.uid, restaurants]);


useEffect(() => {
  const saveSelection = async () => {
    if (!userData?.uid || !hasInitialized) return;

    const { error } = await supabase
      .from("user_selection_table")
      .upsert({
        user_id: userData.uid,
        selected_regional_restaurants: selectedRestaurants,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving selection:", error.message);
    }
  };

  saveSelection();
}, [selectedRestaurants]);


  const cities = [...new Set(restaurants.map(r => r.city))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCity = selectedCity ? restaurant.city === selectedCity : false;
    const matchesSearch = searchTerm ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return (selectedCity && matchesCity && matchesSearch) || (searchTerm && matchesSearch);
  });

  const handleRestaurantToggle = (restaurant: Restaurant) => {
    const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
    if (isSelected) {
      setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } else if (selectedRestaurants.length < 10) {
      setSelectedRestaurants(prev => [...prev, restaurant]);
    }
  };

  const removeRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const addCustomRestaurant = async (restaurant: Restaurant) => {
    if (!regionId) {
      alert("Region ID not available. Cannot add restaurant.");
      return;
    }

    try {
      const { data: cityMatch, error: cityError } = await supabase
        .from("cities_table")
        .select("city_id")
        .eq("city_name", restaurant.city)
        .single();

      if (cityError || !cityMatch) {
        console.error("City lookup failed:", cityError?.message);
        alert(`City "${restaurant.city}" not found in cities_table.`);
        return;
      }

      const city_id = cityMatch.city_id;

      const { data: existing, error: fetchError } = await supabase
        .from("restaurants_table")
        .select("restaurant_id")
        .eq("restaurant_name", restaurant.name)
        .eq("city_name", restaurant.city)
        .eq("region_id", regionId);

      if (fetchError) {
        console.error("Error checking existing restaurant:", fetchError.message);
        alert("Something went wrong. Please try again.");
        return;
      }

      if (existing && existing.length > 0) {
        alert("This restaurant already exists.");
        return;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("restaurants_table")
        .insert([
          {
            restaurant_name: restaurant.name,
            city_name: restaurant.city,
            city_id: city_id,
            region_id: regionId,
          },
        ])
        .select()
        .single();

      if (insertError || !inserted) {
        console.error("Insert failed:", insertError?.message);
        alert("Failed to add restaurant.");
        return;
      }

      const newRestaurant: Restaurant = {
        id: inserted.restaurant_id,
        name: inserted.restaurant_name,
        city: inserted.city_name,
      };

      setSelectedRestaurants(prev => [...prev, newRestaurant]);
      setRestaurants(prev => [...prev, newRestaurant]);
      alert("Restaurant added successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An error occurred while adding the restaurant.");
    }
  };

  const canProceed = selectedRestaurants.length === 10;

  const handleProceed = () => {
    navigate("/national-selection");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4 text-left">Select 10 restaurant's from your region</h2>
        <hr className="border-t border-gray-300 mb-4" />
        {/* Mobile Layout */}
        <div className="block md:hidden">
          
          <div className="space-y-4 mb-6">
            <RestaurantSearchFilter
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />
          </div>

          {/* Mobile Restaurant List */}
          <div className="border border-gray-300 rounded-lg mb-6">
            <RestaurantList
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={10}
            />
          </div>

          {/* Mobile Add Restaurant Button */}
          <AddRestaurantDialog
            cities={cities}
            selectedRestaurants={selectedRestaurants}
            onAddRestaurant={addCustomRestaurant}
            maxSelections={10}
          />

          {/* Mobile Selected List */}
          <div className="border border-gray-300 rounded-lg mb-6">
            <h3 className="font-semibold p-3 border-b">Your Selection</h3>
            <div className="grid grid-cols-2 gap-4 p-3 font-semibold border-b border-gray-200 text-sm">
              <div>City</div>
              <div>Restaurant name</div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {selectedRestaurants.map(restaurant => (
                <div key={restaurant.id} className="grid grid-cols-2 gap-4 p-3 border-b border-gray-100 items-center text-sm">
                  <div>{restaurant.city}</div>
                  <div className="flex items-center justify-between">
                    <span>{restaurant.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRestaurant(restaurant.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))} 
            </div>
            <div className="p-3 text-center text-sm">
              {selectedRestaurants.length < 10 ? (
                <>
                  Please add <span className="text-red-500 font-semibold">{10 - selectedRestaurants.length}</span> restaurants
                </>
              ) : (
                <span className="text-green-600 font-semibold">You have added 10 restaurants.</span>
              )}
            </div>
          </div>

          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            Done
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6 h-[calc(100vh-200px)]">
          <div className="w-[60%] border border-gray-300 rounded-lg p-4">
            <RestaurantSearchFilter
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />

            <RestaurantList
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={10}
            />
          </div>

          <div className="w-[40%]">
            <AddRestaurantDialog
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={10}
            />

            <SelectedRestaurantsList
              selectedRestaurants={selectedRestaurants}
              onRemoveRestaurant={removeRestaurant}
              maxSelections={10}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/process")}
            className="flex items-center gap-2"
          >
            ← Back to Home
          </Button>
          
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done →
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-3">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default RegionalSelection;
