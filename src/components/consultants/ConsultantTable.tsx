import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MoreHorizontal, Phone, SortAsc, SortDesc, MapPin, Tag, Bell } from "lucide-react";
import { Consultant } from "@/types/consultant";

interface ConsultantTableProps {
  consultants: Consultant[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onConsultantClick: (consultant: Consultant) => void;
}

export const ConsultantTable = ({
  consultants,
  sortField,
  sortDirection,
  onSort,
  onConsultantClick,
}: ConsultantTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort("name")} className="cursor-pointer">
              <div className="flex items-center gap-2">
                Namn
                {sortField === "name" && (
                  sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort("specialty")} className="cursor-pointer">
              <div className="flex items-center gap-2">
                Specialitet
                {sortField === "specialty" && (
                  sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => onSort("location")} className="cursor-pointer">
              <div className="flex items-center gap-2">
                Plats
                {sortField === "location" && (
                  sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tillgänglighet</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow
              key={consultant.id}
              onClick={() => onConsultantClick(consultant)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={consultant.image}
                      alt={consultant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{consultant.name}</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {consultant.location}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{consultant.specialty}</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">TakeCare</Badge>
                    <Badge variant="outline" className="text-xs">Cosmic</Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>{consultant.location}</TableCell>
              <TableCell>
                <Badge variant={consultant.status === "Tillgänglig" ? "default" : "destructive"}>
                  {consultant.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 w-2 rounded-sm ${
                        Math.random() > 0.5 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Tag className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Redigera</DropdownMenuItem>
                      <DropdownMenuItem>Ta bort</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};