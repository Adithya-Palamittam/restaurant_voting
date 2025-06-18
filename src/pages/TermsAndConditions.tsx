
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabaseClient";

const TermsAndConditions = () => {
  const [agreed, setAgreed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const checkAgreement = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const { data, error } = await supabase
        .from("users_table")
        .select("agreed_terms")
        .eq("uid", user.id)
        .single();

      if (data?.agreed_terms) {
        // Already agreed — skip to next step
        navigate("/process");
      } else {
        setChecking(false); // Allow rendering terms
      }
    };

    checkAgreement();
  }, []);


const handleProceed = async () => {
  if (!user?.id) {
    alert("User not logged in.");
    return;
  }

  if (agreed) {
    // 1. Update agreed_terms in users_table
    const { error: updateError } = await supabase
      .from("users_table")
      .update({ agreed_terms: true })
      .eq("uid", user.id);

    if (updateError) {
      console.error("Failed to update terms status:", updateError.message);
      return;
    }

    // 2. Insert empty record into user_selection_table
    const { error: insertError } = await supabase
      .from("user_selection_table")
      .insert([
        {
          user_id: user.id,
          selected_regional_restaurants: [],
          selected_national_restaurants: [],
        },
      ]);

    if (insertError) {
      console.error("Failed to initialize user selection:", insertError.message);
      return;
    }

    // 3. Navigate to next step
    navigate("/process");
  }
};


return (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-2">
          <img
            src="/logo.png"
            alt="TP Awards Logo"
            className="mx-auto mb-4 w-[15rem] h-[15rem] object-contain"
          />
        </div>

        <div className="space-y-4 text-center text-md">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">The Process</h2>
            <p className="text-gray-700 text-mdleading-snug">
              This voting process is designed to be as impartial and<br />
              comprehensive as possible, involving experts and<br />
              tastemakers such as yourself.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Keep it clean</h2>
            <p className="text-gray-700 text-md leading-snug">
              The terms and conditions primarily cover confidentiality,<br />
              conflict of interest and XXXX. Read them{" "}
              <a href="#" className="text-blue-600 underline">
                here
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Declaration</h2>
            <p className="text-gray-700 text-md leading-snug mb-4">
              You certify that all parts of the declaration and voting<br />
              form are true and correct. By participating in the awards,<br />
              you agree to abide by and be bound by the terms and<br />
              conditions.
            </p>

            <div className="flex items-center justify-center gap-2 mb-8 mt-8">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label htmlFor="agree" className="text-gray-700">
                I agree
              </label>
            </div>

            <Button
              onClick={handleProceed}
              disabled={!agreed}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-black text-white text-center py-2 text-xs">
      <p>© 2025 Condé Nast</p>
    </footer>
  </div>
);

};

export default TermsAndConditions;
