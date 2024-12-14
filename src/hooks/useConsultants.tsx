import { useQuery } from "@tanstack/react-query";
import { Consultant } from "@/types/consultant";
import { supabase } from "@/integrations/supabase/client";

export const useConsultants = () => {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*");
      
      if (error) throw error;
      
      // Add UI-specific fields not in database but needed by UI
      return (data || []).map(consultant => ({
        ...consultant,
        email: `${consultant.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: "+46 70 123 4567",
        status: "Tillgänglig",
        image: `https://api.dicebear.com/7.x/avatars/svg?seed=${consultant.name}`,
      })) as Consultant[];
    },
  });
};