import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantRatingCard from "@/components/RestaurantRatingCard";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext";

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

const RatingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("user_selection_table")
        .select("selected_regional_restaurants, selected_national_restaurants, restaurant_ratings")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user selections:", error.message);
        return;
      }

      const regionalList: Restaurant[] = data?.selected_regional_restaurants || [];
      const nationalList: Restaurant[] = data?.selected_national_restaurants || [];
      const all: Restaurant[] = [...regionalList, ...nationalList];

      setRestaurants(all);
      const savedRatings: Record<string, Rating> = data?.restaurant_ratings || {};
      setRatings(savedRatings);

      const firstUnratedIndex = all.findIndex((r) => {
        const rating = savedRatings[r.id];
        return !rating || rating.food === 0 || rating.service === 0 || rating.ambience === 0;
      });

      setCurrentIndex(firstUnratedIndex === -1 ? 0 : firstUnratedIndex);
    };

    fetchData();
  }, [user]);

  const currentRestaurant = restaurants[currentIndex];
  const currentRating: Rating = currentRestaurant
    ? {
        food: ratings[currentRestaurant.id]?.food || 0,
        service: ratings[currentRestaurant.id]?.service || 0,
        ambience: ratings[currentRestaurant.id]?.ambience || 0,
      }
    : { food: 0, service: 0, ambience: 0 };

  const isCurrentRated =
    currentRating.food > 0 &&
    currentRating.service > 0 &&
    currentRating.ambience > 0;

  const canGoNext =
    currentIndex < restaurants.length - 1 && isCurrentRated;
  const canSubmit =
    currentIndex === restaurants.length - 1 && isCurrentRated;

  const updateRating = (category: keyof Rating, value: number) => {
    if (!currentRestaurant) return;

    const existing = ratings[currentRestaurant.id] || {
      food: 0,
      service: 0,
      ambience: 0,
    };

    setRatings((prev) => ({
      ...prev,
      [currentRestaurant.id]: {
        ...existing,
        [category]: value,
      },
    }));
  };

  const saveRatingsToSupabase = async (
    updatedRatings: Record<string, Rating>
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_selection_table")
      .update({ restaurant_ratings: updatedRatings })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error saving ratings:", error);
    }
  };

  const goNext = async () => {
    if (canGoNext) {
      await saveRatingsToSupabase(ratings);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (canSubmit) {
      await saveRatingsToSupabase(ratings);
      navigate("/final-ratings");
    }
  };

  if (!currentRestaurant) return null;

  const NavigationButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={goPrevious}
        disabled={currentIndex === 0}
        className="flex items-center gap-2"
      >
        ← Previous
      </Button>

      {canSubmit ? (
        <Button
          onClick={handleSubmit}
          disabled={!isCurrentRated}
          className={`bg-black text-white hover:bg-gray-800 disabled:opacity-50 ${isMobile ? 'px-6' : 'px-8'} py-2 rounded`}
        >
          Submit
        </Button>
      ) : (
        <Button
          onClick={goNext}
          disabled={!isCurrentRated}
          className={`bg-black text-white hover:bg-blue-700 disabled:opacity-50 ${isMobile ? 'px-6' : 'px-8'} py-2 rounded`}
        >
          Next →
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="block md:hidden p-4">
        <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[12.5rem] h-[12.5rem] object-contain" />
        <p className="text-lg mb-2 text-center">Rate the top 15 restaurants you selected</p>
        <RestaurantRatingCard
          restaurant={currentRestaurant}
          rating={currentRating}
          currentIndex={currentIndex}
          totalCount={restaurants.length}
          onRatingChange={updateRating}
          isMobile={true}
        />
        <NavigationButtons isMobile={true} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
   <img src="/logo.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[12.5rem] h-[12.5rem] object-contain" />
   <p className="text-lg mb-2">Rate the top 15 restaurants you selected</p>
          <RestaurantRatingCard
            restaurant={currentRestaurant}
            rating={currentRating}
            currentIndex={currentIndex}
            totalCount={restaurants.length}
            onRatingChange={updateRating}
          />
          <NavigationButtons />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-3 mt-8">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default RatingPage;
