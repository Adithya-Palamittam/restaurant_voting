import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext"; // ✅ Import your custom hook
import { Button } from "@/components/ui/button";

const VotingRegions = () => {
  const navigate = useNavigate();
  const { user, userData } = useUser(); // ✅ Use context for user and userData

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-2xl font-semibold mb-6">You are voting for</h1>
          <p className="text-lg mb-2">
            Restaurants in the cities:&nbsp;
            {userData?.cities?.map((c: any) => c.city_name).join(", ") || "Loading..."}
          </p>

          <p className="text-lg mb-8">
            You will also have a chance to<br />
            nominate 5 restaurants from anywhere<br />
            in the country
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative w-80 h-60">
              <svg viewBox="0 0 320 240" className="w-full h-full">
                <path
                  d="M160 20 L280 60 L300 120 L280 180 L160 220 L40 180 L20 120 L40 60 Z"
                  fill="#D4AF37"
                  stroke="#8B7355"
                  strokeWidth="2"
                />
                <path
                  d="M120 80 L200 70 L220 100 L210 140 L190 170 L160 180 L130 170 L110 140 L100 110 Z"
                  fill="#20B2AA"
                  stroke="#1F7A8C"
                  strokeWidth="2"
                />
                <circle cx="140" cy="100" r="4" fill="#DC2626" />
                <circle cx="160" cy="110" r="4" fill="#DC2626" />
                <circle cx="150" cy="130" r="4" fill="#DC2626" />
                <circle cx="130" cy="140" r="4" fill="#DC2626" />
              </svg>
            </div>
          </div>

          <Button
            onClick={() => navigate("/regional-selection")}
            className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800"
          >
            Let's Go
          </Button>
        </div>
      </div>

      <footer className="bg-black text-white text-center py-3">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default VotingRegions;
