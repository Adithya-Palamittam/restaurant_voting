
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProcessDescription = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col md:h-screen">
      {/* Main Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto md:flex md:items-center md:justify-center md:px-0 md:py-0">
        <div className="w-full max-w-2xl md:max-h-[calc(100vh-4rem)] md:overflow-hidden">
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="TP Awards Logo"
              className="mx-auto mb-2 w-[12rem] h-[12rem] object-contain"
            />
          </div>

          {/* Steps */}
          <div className="space-y-6 text-center text-md">
            <h1 className="text-xl font-semibold text-red-600 mb-4">
              Give us your 15 favourite restaurants
            </h1>

            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Step 1</h2>
              <p className="text-gray-700 leading-snug">
                Choose 10 favourite restaurants from your region.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Step 2</h2>
              <p className="text-gray-700 leading-snug mb-2">
                Pick 5 more restaurants. Here is your chance to nominate
                restaurants from outside your region. Alternatively, you
                can include more from your region.
              </p>
              <p className="text-gray-700 leading-snug">
                If there's a restaurant that's not in our list you can add it
                manually through the "Add a Restaurant" button.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Step 3</h2>
              <p className="text-gray-700 leading-snug mb-6">
                Once your list of 15 is ready, proceed to the final stage to
                rate these for Food, Service and Ambience.
              </p>

              <Button
                onClick={() => navigate("/regions")}
                className="bg-black text-white text-md px-6 py-2 rounded hover:bg-gray-800"
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-2 text-xs md:fixed md:bottom-0 md:left-0 md:right-0">
        <p>© 2025 Condé Nast</p>
      </footer>
    </div>
  );

};

export default ProcessDescription;
