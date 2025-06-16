
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";

interface Restaurant {
  id: string;
  city: string;
  name: string;
}

interface Rating {
  food: number;
  service: number;
  ambience: number;
}

const FinalRatings = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingRating, setEditingRating] = useState<Rating>({ food: 0, service: 0, ambience: 0 });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

 useEffect(() => {
  const regional = localStorage.getItem('regionalRestaurants');
  const national = localStorage.getItem('nationalRestaurants');
  const storedRatings = localStorage.getItem('restaurantRatings');

  const regionalList = regional ? JSON.parse(regional) : [];
  const nationalList = national ? JSON.parse(national) : [];

  const allRestaurants = [...regionalList, ...nationalList];
  setRestaurants(allRestaurants);

  if (storedRatings) {
    setRatings(JSON.parse(storedRatings));
  }
}, []);

  const handleEditRating = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setEditingRating(ratings[restaurant.id] || { food: 0, service: 0, ambience: 0 });
    setIsEditDialogOpen(true);
  };

  const saveEditedRating = () => {
    if (editingRestaurant) {
      const updatedRatings = {
        ...ratings,
        [editingRestaurant.id]: editingRating
      };
      setRatings(updatedRatings);
      localStorage.setItem('restaurantRatings', JSON.stringify(updatedRatings));
      setIsEditDialogOpen(false);
      setEditingRestaurant(null);
    }
  };

  const updateEditingRating = (category: keyof Rating, value: number) => {
    setEditingRating(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const StarRating = ({ value, onChange, label, readonly = false }: { 
    value: number; 
    onChange?: (rating: number) => void; 
    label: string;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !readonly && onChange && onChange(star)}
              className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${!readonly ? 'hover:text-yellow-400 transition-colors' : ''}`}
              disabled={readonly}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("User not logged in.");
      return;
    }

    const entries = restaurants.map((restaurant) => ({
      user_id: user.id,
      restaurant_id: restaurant.id,
      food_rating: ratings[restaurant.id]?.food || 0,
      service_rating: ratings[restaurant.id]?.service || 0,
      ambience_rating: ratings[restaurant.id]?.ambience || 0,
      is_complete: true
    }));

    const { error: insertError } = await supabase.from("ratings_table").insert(entries);

    if (insertError) {
      console.error("Error submitting ratings:", insertError.message);
      alert("There was an error submitting your ratings. Please try again.");
      return;
    }

    const { error: updateError } = await supabase
    .from("users_table")
    .update({ is_completed: true })
    .eq("uid", user.id);

    if (updateError) {
      console.error("Failed to update completion status:", updateError.message);
      return;
    }
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <span className="text-lg font-medium">Your final ratings</span>
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

      <div className="p-4 md:p-6">
        {/* Desktop Layout - 2x4 grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
            {restaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-blue-600 font-medium text-sm">{restaurant.city}</div>
                    <div className="text-red-500 text-sm">{index + 1}/15</div>
                    <h3 className="text-lg font-bold border-b border-gray-300 pb-2">{restaurant.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRating(restaurant)}
                    className="p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <StarRating
                    label="Food"
                    value={ratings[restaurant.id]?.food || 0}
                    readonly
                  />
                  <StarRating
                    label="Service"
                    value={ratings[restaurant.id]?.service || 0}
                    readonly
                  />
                  <StarRating
                    label="Ambience"
                    value={ratings[restaurant.id]?.ambience || 0}
                    readonly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout - 1x3 grid */}
        <div className="block md:hidden">
          <div className="space-y-4 mb-8">
            {restaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-blue-600 font-medium text-sm">{restaurant.city}</div>
                    <div className="text-red-500 text-sm">{index + 1}/15</div>
                    <h3 className="text-lg font-bold border-b border-gray-300 pb-2">{restaurant.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRating(restaurant)}
                    className="p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <StarRating
                    label="Food"
                    value={ratings[restaurant.id]?.food || 0}
                    readonly
                  />
                  <StarRating
                    label="Service"
                    value={ratings[restaurant.id]?.service || 0}
                    readonly
                  />
                  <StarRating
                    label="Ambience"
                    value={ratings[restaurant.id]?.ambience || 0}
                    readonly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-8 py-3 rounded hover:bg-green-600"
          >
            Submit your final ratings
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          You have till 11:59 pm Sunday 30th June to fill this form
        </div>
      </div>

      {/* Edit Rating Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Rating - {editingRestaurant?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <StarRating
              label="Food"
              value={editingRating.food}
              onChange={(value) => updateEditingRating('food', value)}
            />
            <StarRating
              label="Service"
              value={editingRating.service}
              onChange={(value) => updateEditingRating('service', value)}
            />
            <StarRating
              label="Ambience"
              value={editingRating.ambience}
              onChange={(value) => updateEditingRating('ambience', value)}
            />
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEditedRating}
                className="flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-3 mt-8">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default FinalRatings;
