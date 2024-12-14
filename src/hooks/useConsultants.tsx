import { useQuery } from "@tanstack/react-query";
import { Consultant } from "@/types/consultant";

// This will be replaced with actual API call when we have the Adocka integration
const fetchConsultants = async (): Promise<Consultant[]> => {
  // Temporary mock data
  return [
    {
      id: 1,
      name: "Anna Andersson",
      specialty: "Frontend Utvecklare",
      location: "Stockholm",
      status: "Tillgänglig",
      email: "anna.andersson@example.com",
      phone: "+46 70 123 4567",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Erik Eriksson",
      specialty: "Backend Utvecklare",
      location: "Göteborg",
      status: "Upptagen",
      email: "erik.eriksson@example.com",
      phone: "+46 70 234 5678",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 3,
      name: "Maria Nilsson",
      specialty: "UX Designer",
      location: "Malmö",
      status: "Tillgänglig",
      email: "maria.nilsson@example.com",
      phone: "+46 70 345 6789",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];
};

export const useConsultants = () => {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: fetchConsultants,
  });
};