// src/contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      setUser(user);

      const { data, error: userError } = await supabase
        .from("users_table")
        .select(
          `*, region:assigned_region (region_id, region_name)`
        )
        .eq("uid", user.id)
        .single();

      if (!userError) {
        const regionId = data?.assigned_region;
        const { data: cities } = await supabase
          .from("cities_table")
          .select("city_name")
          .eq("region_id", regionId);

        setUserData({ ...data, cities });
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
