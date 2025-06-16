
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
    const { error: updateError } = await supabase
    .from("users_table")
    .update({ agreed_terms: true })
    .eq("uid", user.id);

    if (updateError) {
      console.error("Failed to update terms status:", updateError.message);
      return;
    }
      navigate("/process");
    }
  };

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
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">The Process</h2>
              <p className="text-gray-700">
                This voting process is designed to be as impartial and<br />
                comprehensive as possible, involving experts and<br />
                tastemakers such as yourself.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Keep it clean</h2>
              <p className="text-gray-700">
                The terms and conditions primarily cover confidentiality,<br />
                conflict of interest and XXXX Read them <a href="#" className="text-blue-600 underline">here</a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Declaration</h2>
              <p className="text-gray-700 mb-6">
                You certify that all parts of the declaration and voting<br />
                form are true and correct. By participating in the awards,<br />
                You agree to abide by and be bound by the terms and<br />
                conditions.
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-8">
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
                className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default TermsAndConditions;
