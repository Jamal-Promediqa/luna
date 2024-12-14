import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultantHeader } from "@/components/consultants/ConsultantHeader";
import { ConsultantFilters } from "@/components/consultants/ConsultantFilters";
import { ConsultantTable } from "@/components/consultants/ConsultantTable";
import { ConsultantDrawer } from "@/components/consultants/ConsultantDrawer";
import { Consultant } from "@/types/consultant";

export default function Consultants() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const consultants = [
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleConsultantClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setIsDrawerOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent>
          <ConsultantHeader />
          <ConsultantFilters />
          <ConsultantTable
            consultants={consultants}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onConsultantClick={handleConsultantClick}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Visar 1-3 av 3 konsulter
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Föregående
              </Button>
              <Button>1</Button>
              <Button variant="outline" disabled>
                Nästa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConsultantDrawer
        consultant={selectedConsultant}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}