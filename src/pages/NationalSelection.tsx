import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import AddRestaurantDialog from "@/components/AddRestaurantDialog";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext"; // Ensure this is correctly implemented
import RestaurantSearchFilterPhone from "@/components/RestaurantSearchFilterPhone";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

const NationalSelection = () => {
  const navigate = useNavigate();
  const { userData } = useUser(); // Make sure userData.uid is available
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false);


  // Fetch restaurant list and excluded (regional) selections
useEffect(() => {
  const fetchData = async () => {
    const regional = localStorage.getItem("regionalRestaurants");
    const excluded = regional ? JSON.parse(regional).map((r: Restaurant) => r.id) : [];
    setExcludedIds(excluded);

    const { data, error } = await supabase.from("restaurants_table").select("*");
    if (error) {
      console.error("Error fetching national restaurants:", error.message);
      return;
    }

    const mapped: Restaurant[] = data
      .map(r => ({
        id: r.restaurant_id,
        name: r.restaurant_name,
        city: r.city_name,
      }))
      .filter(r => !excluded.includes(r.id));

    setRestaurants(mapped);
    setRestaurantsLoaded(true); // ✅ Only after setting restaurants
  };

  fetchData();
}, []);


  // Load national selection from Supabase
useEffect(() => {
  const fetchNationalSelection = async () => {
    if (!userData?.uid || !restaurantsLoaded) return;

    const { data, error } = await supabase
      .from("user_selection_table")
      .select("selected_national_restaurants")
      .eq("user_id", userData.uid)
      .single();

    if (error) {
      console.error("Error fetching national selection:", error.message);
      return;
    }

    const selected = data?.selected_national_restaurants || [];
    setSelectedRestaurants(selected);
  };

  fetchNationalSelection();
}, [userData?.uid, restaurantsLoaded]); // ✅ Now it waits for both


  // Sync changes to Supabase
  useEffect(() => {
    const updateSelection = async () => {
      if (!userData?.uid || !restaurantsLoaded) return;
      const { error } = await supabase
        .from("user_selection_table")
        .upsert(
          {
            user_id: userData.uid,
            selected_national_restaurants: selectedRestaurants,
          },
          { onConflict: "user_id" }
        );
      if (error) {
        console.error("Error updating national selection:", error.message);
      }
    };

    updateSelection();
  }, [selectedRestaurants, userData?.uid]);

  const cities = [...new Set(restaurants.map(r => r.city))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCity = selectedCity ? restaurant.city === selectedCity : false;
    const matchesSearch = searchTerm
      ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return (selectedCity && matchesCity && matchesSearch) || (searchTerm && matchesSearch);
  });

  const handleRestaurantToggle = (restaurant: Restaurant) => {
    const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
    if (isSelected) {
      setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } else if (selectedRestaurants.length < 5) {
      setSelectedRestaurants(prev => [...prev, restaurant]);
    }
  };

  const removeRestaurant = (restaurantId: string) => {
    setSelectedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const addCustomRestaurant = async (restaurant: Restaurant) => {
    try {
      const { data: cityMatch, error: cityError } = await supabase
        .from("cities_table")
        .select("city_id")
        .eq("city_name", restaurant.city)
        .single();

      if (cityError || !cityMatch) {
        alert(`City "${restaurant.city}" not found in cities_table.`);
        return;
      }

      const city_id = cityMatch.city_id;

      const { data: existing, error: fetchError } = await supabase
        .from("restaurants_table")
        .select("restaurant_id")
        .eq("restaurant_name", restaurant.name)
        .eq("city_name", restaurant.city);

      if (fetchError || (existing && existing.length > 0)) {
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
          },
        ])
        .select()
        .single();

      if (insertError || !inserted) {
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
      alert("An error occurred while adding the restaurant.");
    }
  };

  const canProceed = selectedRestaurants.length === 5;

  const handleProceed = () => {
    navigate("/restaurant-review");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4 text-left"> Select 5 restaurant’s from anywhere across the country</h2>
        <hr className="border-t border-gray-300 mb-4" />
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="space-y-4 mb-6">
            <RestaurantSearchFilterPhone
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />
          </div>

          <div className="border border-gray-300 rounded-lg mb-6">
            <RestaurantList
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={5}
            />
          </div>

          <AddRestaurantDialog
            cities={cities}
            selectedRestaurants={selectedRestaurants}
            onAddRestaurant={addCustomRestaurant}
            maxSelections={5}
          />

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
              {selectedRestaurants.length < 5 ? (
              <>
                Please add <span className="text-red-500 font-semibold">{5 - selectedRestaurants.length}</span> restaurants
              </>
              ) : (
                <span className="text-green-600 font-semibold">You have added 5 restaurants.</span>
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
              maxSelections={5}
            />
          </div>

          <div className="w-[40%]">
            <AddRestaurantDialog
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={5}
            />

            <SelectedRestaurantsList
              selectedRestaurants={selectedRestaurants}
              onRemoveRestaurant={removeRestaurant}
              maxSelections={5}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/regional-selection")}
            className="flex items-center gap-2"
          >
            Back to Regional Selection
          </Button>
          
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </Button>
        </div>
      </div>

      <footer className="bg-black text-white text-center py-3">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default NationalSelection;
