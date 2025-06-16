import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserProvider } from "@/contexts/UserContext";
import AuthGuard from "./components/AuthGuard";
import RouteTracker from "./components/RouteTracker"; // 👈 Import RouteTracker

import Login from "./pages/Login";
import TermsAndConditions from "./pages/TermsAndConditions";
import ProcessDescription from "./pages/ProcessDescription";
import VotingRegions from "./pages/VotingRegions";
import RegionalSelection from "./pages/RegionalSelection";
import NationalSelection from "./pages/NationalSelection";
import RestaurantReview from "./pages/RestaurantReview";
import RatingPage from "./pages/RatingPage";
import FinalRatings from "./pages/FinalRatings";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <RouteTracker /> {/* 👈 Add RouteTracker inside BrowserRouter */}
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Auth-Guarded Routes */}
            <Route element={<AuthGuard />}>
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/process" element={<ProcessDescription />} />
              <Route path="/regions" element={<VotingRegions />} />
              <Route path="/regional-selection" element={<RegionalSelection />} />
              <Route path="/national-selection" element={<NationalSelection />} />
              <Route path="/restaurant-review" element={<RestaurantReview />} />
              <Route path="/rating" element={<RatingPage />} />
              <Route path="/final-ratings" element={<FinalRatings />} />
            </Route>

            {/* Unprotected Completion Route */}
            <Route path="/thank-you" element={<ThankYou />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
