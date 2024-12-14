import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultantHeader } from "@/components/consultants/ConsultantHeader";
import { ConsultantFilters } from "@/components/consultants/ConsultantFilters";
import { ConsultantTable } from "@/components/consultants/ConsultantTable";
import { ConsultantDrawer } from "@/components/consultants/ConsultantDrawer";
import { Consultant } from "@/types/consultant";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Settings, Users, Briefcase, FileCheck } from "lucide-react";
import { Button as NavButton } from "@/components/ui/button";
import { useConsultants } from "@/hooks/useConsultants";
import { useToast } from "@/components/ui/use-toast";

export default function Consultants() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    location: "",
  });

  const { data: consultants, isLoading, error } = useConsultants();

  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads", path: "/leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
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

  const filteredConsultants = consultants?.filter((consultant) => {
    const matchesSearch = consultant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      consultant.specialty.toLowerCase().includes(filters.search.toLowerCase()) ||
      consultant.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || consultant.status === filters.status;
    const matchesLocation = !filters.location || consultant.location === filters.location;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  if (error) {
    toast({
      title: "Ett fel uppstod",
      description: "Kunde inte hämta konsultdata. Försök igen senare.",
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Konsulter</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {navigationItems.map((item) => (
          <NavButton
            key={item.text}
            variant="ghost"
            className="whitespace-nowrap"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </NavButton>
        ))}
      </div>

      <Card>
        <CardContent>
          <ConsultantHeader />
          <ConsultantFilters onFilterChange={setFilters} />
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredConsultants ? (
            <ConsultantTable
              consultants={filteredConsultants}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onConsultantClick={handleConsultantClick}
            />
          ) : null}

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Visar {filteredConsultants?.length ?? 0} konsulter
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