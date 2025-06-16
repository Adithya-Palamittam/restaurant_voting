import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RestaurantRatingCard from "@/components/RestaurantRatingCard";

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

  // Load regional + national restaurants
  useEffect(() => {
    const regional = localStorage.getItem('regionalRestaurants');
    const national = localStorage.getItem('nationalRestaurants');

    const parsedRegional = regional ? JSON.parse(regional) : [];
    const parsedNational = national ? JSON.parse(national) : [];

    const all = [...parsedRegional, ...parsedNational];
    setRestaurants(all);
  }, []);

  const currentRestaurant = restaurants[currentIndex];
  const currentRating = ratings[currentRestaurant?.id] || { food: 0, service: 0, ambience: 0 };

  const isCurrentRated = currentRating.food > 0 && currentRating.service > 0 && currentRating.ambience > 0;
  const canGoNext = currentIndex < restaurants.length - 1 && isCurrentRated;
  const canSubmit = currentIndex === restaurants.length - 1 && isCurrentRated;

  const updateRating = (category: keyof Rating, value: number) => {
    setRatings(prev => ({
      ...prev,
      [currentRestaurant.id]: {
        ...prev[currentRestaurant.id],
        [category]: value
      }
    }));
  };

  const goNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (canSubmit) {
      localStorage.setItem('restaurantRatings', JSON.stringify(ratings));
      navigate("/final-ratings");
    }
  };

  if (!currentRestaurant) return null;

  const AppHeader = () => (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-lg font-medium">Traveller</span>
        <div className="w-px h-6 bg-gray-300"></div>
        <span className="text-lg font-medium">district</span>
      </div>
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black rounded-full mb-4">
          <span className="text-xl font-bold">T</span>
          <div className="w-4 h-4 border border-black rounded-full"></div>
          <span className="text-xl font-bold">P</span>
        </div>
        <div className="text-xs font-medium mb-4">
          <div>RESTAURANT</div>
          <div>AWARDS 2025</div>
        </div>
      </div>
      <h1 className="text-xl font-semibold mb-2">Rate the top 15 restaurants you selected</h1>
    </div>
  );

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
          className={`bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${isMobile ? 'px-6' : 'px-8'} py-2 rounded`}
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
        <AppHeader />
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
          <AppHeader />
          <RestaurantRatingCard
            restaurant={currentRestaurant}
            rating={currentRating}
            currentIndex={currentIndex}
            totalCount={restaurants.length}
            onRatingChange={updateRating}
          />
          <NavigationButtons />
          {/* {canSubmit && isCurrentRated && (
            <div className="text-right text-sm text-gray-600 mb-4">
              The "Next" button will only<br />
              turn green and become<br />
              clickable after you have<br />
              rated that restaurant are<br />
              completed.
            </div>
          )} */}
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
