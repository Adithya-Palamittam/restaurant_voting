import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext"; // ✅ Import your custom hook
import { Button } from "@/components/ui/button";

const VotingRegions = () => {
  const navigate = useNavigate();
  const { user, userData } = useUser(); // ✅ Use context for user and userData

return (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Main Content */}
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-2xl font-semibold mb-4">You are voting for</h1>

        <p className="text-lg mb-1">
          Restaurants in the cities:&nbsp;
          {userData?.cities?.map((c: any) => c.city_name).join(", ") || "Loading..."}
        </p>

        <p className="text-lg mb-6">
          You will also have a chance to<br />
          nominate 5 restaurants from anywhere<br />
          in the country
        </p>

        <div className="flex justify-center mb-6">
          <div className="relative">
<img src="/map.png" alt="TP Awards Logo" className="mx-auto mb-4 w-[22rem] h-[22rem] object-contain" />
          </div>
        </div>

        <Button
          onClick={() => navigate("/regional-selection")}
          className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 text-md"
        >
          Let's Go
        </Button>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black text-white text-center py-2 text-sm">
      <p>© 2025 Condé Nast</p>
    </footer>
  </div>
);

};

export default VotingRegions;
