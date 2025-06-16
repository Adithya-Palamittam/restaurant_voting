import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AuthGuard = () => {
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setRedirectTo("/");
        setChecking(false);
        return;
      }

      const { data: userRecord, error: dbError } = await supabase
        .from("users_table")
        .select("is_completed")
        .eq("uid", user.id)
        .single();

      if (dbError || !userRecord) {
        setRedirectTo("/");
      } else if (userRecord.is_completed) {
        console.log("User has completed the process, redirecting to thank you page.");
        setRedirectTo("/thank-you");
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) return <div className="text-center mt-10">Loading...</div>;

  return redirectTo ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default AuthGuard;
