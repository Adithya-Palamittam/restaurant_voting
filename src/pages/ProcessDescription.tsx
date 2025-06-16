
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProcessDescription = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-lg font-medium">Traveller</span>
              <div className="w-px h-6 bg-gray-300"></div>
              <span className="text-lg font-medium">district</span>
            </div>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 border-4 border-black rounded-full mb-4">
                <span className="text-2xl font-bold">T</span>
                <div className="w-6 h-6 border-2 border-black rounded-full ml-1"></div>
                <span className="text-2xl font-bold">P</span>
              </div>
              <div className="text-sm font-medium">
                <div>RESTAURANT</div>
                <div>AWARDS 2025</div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-8">Give us your 15 favourite restaurants</h1>
            
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Step 1</h2>
              <p className="text-gray-700">
                Choose 10 favourite restaurants from your region.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Step 2</h2>
              <p className="text-gray-700 mb-4">
                Pick 5 more restaurants. Here is your chance to nominate<br />
                restaurants from outside your region. Alternatively, you<br />
                can include more from your region.
              </p>
              <p className="text-gray-700">
                If there's a restaurant that's not in our list you can add it<br />
                manually through the "Add a Restaurant" button.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Step 3</h2>
              <p className="text-gray-700 mb-8">
                Once your list of 15 is ready, proceed to the final stage to<br />
                rate these for<br />
                Food, Service and Ambience.
              </p>
              
              <Button
                onClick={() => navigate("/regions")}
                className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800"
              >
                Proceed
              </Button>
            </div>
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

export default ProcessDescription;
