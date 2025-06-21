import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantList from "@/components/RestaurantList";
import SelectedRestaurantsList from "@/components/SelectedRestaurantsList";
import AddRestaurantDialog from "@/components/AddRestaurantDialog";
import RestaurantSearchFilter from "@/components/RestaurantSearchFilter";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";
import RestaurantSearchFilterPhone from "@/components/RestaurantSearchFilterPhone";
import RestaurantListPhone from "@/components/RestaurantListPhone";
import { toast } from "sonner";

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


// useEffect(() => {
//   const saveSelection = async () => {
//     if (!userData?.uid || !hasInitialized) return;

//     const { error } = await supabase
//       .from("user_selection_table")
//       .upsert({
//         user_id: userData.uid,
//         selected_regional_restaurants: selectedRestaurants,
//         updated_at: new Date().toISOString(),
//       });

//     if (error) {
//       console.error("Error saving selection:", error.message);
//     }
//   };

//   saveSelection();
// }, [selectedRestaurants]);


  const cities = [...new Set(restaurants.map(r => r.city))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCity = selectedCity ? restaurant.city === selectedCity : false;
    const matchesSearch = searchTerm ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return (selectedCity && matchesCity && matchesSearch) || (searchTerm && matchesSearch);
  });

const handleRestaurantToggle = async (restaurant: Restaurant) => {
  const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
  let updatedList: Restaurant[];

  if (isSelected) {
    updatedList = selectedRestaurants.filter(r => r.id !== restaurant.id);
  } else {
    if (selectedRestaurants.length >= 10) return;
    updatedList = [...selectedRestaurants, restaurant];
  }

  setSelectedRestaurants(updatedList);

  const { error } = await supabase
    .from("user_selection_table")
    .upsert({
      user_id: userData.uid,
      selected_regional_restaurants: updatedList,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving selection after toggle:", error.message);
  }
};


const removeRestaurant = async (restaurantId: string) => {
  const updatedList = selectedRestaurants.filter(r => r.id !== restaurantId);
  setSelectedRestaurants(updatedList);

  const { error } = await supabase
    .from("user_selection_table")
    .upsert({
      user_id: userData.uid,
      selected_regional_restaurants: updatedList,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving after removal:", error.message);
  }

  // Optional: You may re-fetch if needed for consistency
  // But keeping it local is faster unless strict consistency is critical
};


const addCustomRestaurant = async (restaurant: Restaurant) => {
  if (!regionId || !hasInitialized) {
    alert("Please wait until data is loaded before adding a restaurant.");
    return;
  }

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
      .eq("city_name", restaurant.city)
      .eq("region_id", regionId);

    if (fetchError) {
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
      alert("Failed to add restaurant.");
      return;
    }

    const newRestaurant: Restaurant = {
      id: inserted.restaurant_id,
      name: inserted.restaurant_name,
      city: inserted.city_name,
    };

    if (selectedRestaurants.length < 10) {
      const updatedList = [...selectedRestaurants, newRestaurant];
      setSelectedRestaurants(updatedList);

      const { error } = await supabase
        .from("user_selection_table")
        .upsert({
          user_id: userData.uid,
          selected_regional_restaurants: updatedList,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving after adding custom restaurant:", error.message);
      }
    }

    setRestaurants(prev => [...prev, newRestaurant]);

    toast.success("Restaurant added successfully!", {
      description: "Your restaurant has been added to the list.",
    });
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
  <div className="h-screen flex flex-col bg-white">
    {/* Main Content Wrapper */}
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      
      {/* Inner Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 md:h-[calc(100vh-48px)]">
        <h2 className="text-xl mb-4 text-left">Choose 10 restaurants from your region</h2>
        <hr className="border-t border-gray-300 mb-4" />

        {/* ---------- Mobile Layout ---------- */}
        <div className="block md:hidden flex-1 overflow-y-auto space-y-6 pb-4">
          {/* Search + Filter */}
          <RestaurantSearchFilterPhone
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            cities={cities}
          />

          {/* Restaurant List */}
          <div className="max-h-96 border border-gray-300 rounded-lg">
            <RestaurantListPhone
              restaurants={filteredRestaurants}
              selectedRestaurants={selectedRestaurants}
              onRestaurantToggle={handleRestaurantToggle}
              maxSelections={10}
            />
          </div>

          {/* Add Custom Restaurant */}
          <AddRestaurantDialog
            cities={cities}
            selectedRestaurants={selectedRestaurants}
            onAddRestaurant={addCustomRestaurant}
            maxSelections={10}
          />

          {/* Selected Restaurants Display */}
          <div className="border border-gray-300 rounded-lg">
            <h3 className="font-semibold p-3 border-b">Your Selection</h3>
            <div className="grid grid-cols-[30%_60%_auto] p-3 font-semibold border-b border-gray-200 text-sm">
              <div>City</div>
              <div>Restaurant name</div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {selectedRestaurants.map(restaurant => (
                <div key={restaurant.id} className="grid grid-cols-[30%_60%_auto] p-3 border-b border-gray-100 items-center text-sm">
                  <div>{restaurant.city}</div>
                  <div>{restaurant.name}</div>
                  <div className="text-center">
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
                <>Please add <span className="text-red-500 font-semibold">{10 - selectedRestaurants.length}</span> restaurants</>
              ) : (
                <span className="text-green-600 font-semibold">You have added 10 restaurants.</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </Button>
        </div>

        {/* ---------- Desktop Layout ---------- */}
        <div className="hidden md:flex gap-6 flex-1 overflow-hidden">
          {/* Left Column */}
          <div className="w-[60%] border border-gray-300 rounded-lg p-4 flex flex-col overflow-hidden">
            <RestaurantSearchFilter
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              cities={cities}
            />
            <div className="flex-1 overflow-hidden">
              <RestaurantList
                restaurants={filteredRestaurants}
                selectedRestaurants={selectedRestaurants}
                onRestaurantToggle={handleRestaurantToggle}
                maxSelections={10}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[40%] flex flex-col gap-1">
            <AddRestaurantDialog
              cities={cities}
              selectedRestaurants={selectedRestaurants}
              onAddRestaurant={addCustomRestaurant}
              maxSelections={10}
            />
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg">
              <SelectedRestaurantsList
                selectedRestaurants={selectedRestaurants}
                onRemoveRestaurant={removeRestaurant}
                maxSelections={10}
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex justify-between items-center mt-6 text-md">
          <Button
            variant="outline"
            onClick={() => navigate("/process")}
            className="flex items-center gap-2"
          >
            Back to Home
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
    </div>

    {/* Footer - Fixed on Desktop Only */}
    <footer className="bg-black text-white text-center py-3 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
      <p>© 2025 Condé Nast</p>
    </footer>
  </div>
);

};

export default RegionalSelection;
