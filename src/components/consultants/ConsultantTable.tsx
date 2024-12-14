import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Consultant } from "@/types/consultant";

interface ConsultantTableProps {
  consultants: Consultant[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onConsultantClick: (consultant: Consultant) => void;
}

export function ConsultantTable({
  consultants,
  sortField,
  sortDirection,
  onSort,
  onConsultantClick,
}: ConsultantTableProps) {
  const navigate = useNavigate();

  const handleAddConsultant = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/consultants/add");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddConsultant}>
          <Plus className="mr-2 h-4 w-4" />
          Lägg till ny konsult
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort("name")}>Namn {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("specialty")}>Specialitet {sortField === "specialty" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("location")}>Plats {sortField === "location" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("email")}>E-post {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id} onClick={() => onConsultantClick(consultant)}>
              <TableCell>{consultant.name}</TableCell>
              <TableCell>{consultant.specialty}</TableCell>
              <TableCell>{consultant.location}</TableCell>
              <TableCell>{consultant.email}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onConsultantClick(consultant);
                  }}
                >
                  Visa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}