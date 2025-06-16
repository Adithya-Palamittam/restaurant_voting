import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const user = authData.user;

    if (!user) {
      setError("Failed to get user information.");
      return;
    }

    // Fetch user record from users_table
    const { data: userMeta, error: metaError } = await supabase
      .from("users_table")
      .select("last_visited_page, is_completed, agreed_terms, is_admin")
      .eq("uid", user.id)
      .single();

    if (metaError || !userMeta) {
      setError("Failed to fetch user metadata.");
      return;
    }

    // ✅ Redirect based on last visited page or fallback
  if (userMeta.is_admin) {
    navigate("/admin"); // Redirect to admin dashboard
  } else if (userMeta.is_completed) {
    navigate("/thank-you");
  } else if (userMeta.last_visited_page) {
    navigate(userMeta.last_visited_page);
  } else if (!userMeta.agreed_terms) {
    navigate("/terms");
  } else {
    navigate("/process");
  }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg font-medium">Traveller</span>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-lg font-medium">district</span>
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-black rounded-full mb-4">
              <span className="text-3xl font-bold">T</span>
              <div className="w-8 h-8 border-2 border-black rounded-full ml-1"></div>
              <span className="text-3xl font-bold">P</span>
            </div>
            <div className="text-sm font-medium">
              <div>RESTAURANT</div>
              <div>AWARDS 2025</div>
            </div>
          </div>
          <div className="text-center mb-8">
            <p className="text-lg mb-2">Your votes will crown India's top 50 restaurants.</p>
            <p className="text-lg">Ready to go ?</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-center border-0 border-b border-gray-400 rounded-none bg-transparent focus:border-black focus-visible:ring-0 placeholder:text-gray-500"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center border-0 border-b border-gray-400 rounded-none bg-transparent focus:border-black focus-visible:ring-0 placeholder:text-gray-500"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800"
            >
              Login
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-8">
          You have till 11:59 pm Sunday 30th June to fill this form
        </div>
      </div>
    </div>
  );
};

export default Login;
