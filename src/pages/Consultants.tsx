import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Filter, Mail, MoreHorizontal, Phone, Search, SortAsc, SortDesc } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Consultant {
  id: number;
  name: string;
  specialty: string;
  location: string;
  status: string;
  email: string;
  phone: string;
  image: string;
}

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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Konsultlista</CardTitle>
          <Button className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Exportera
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Sök konsult..." className="pl-8" />
            </div>
            <div className="flex gap-4">
              <Select>
                <option>Status</option>
                <option>Tillgänglig</option>
                <option>Upptagen</option>
              </Select>
              <Select>
                <option>Plats</option>
                <option>Stockholm</option>
                <option>Göteborg</option>
                <option>Malmö</option>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Namn
                      {sortField === "name" && (
                        sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("specialty")} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Specialitet
                      {sortField === "specialty" && (
                        sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("location")} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Plats
                      {sortField === "location" && (
                        sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultants.map((consultant) => (
                  <TableRow
                    key={consultant.id}
                    onClick={() => handleConsultantClick(consultant)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={consultant.image}
                            alt={consultant.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{consultant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{consultant.specialty}</TableCell>
                    <TableCell>{consultant.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={consultant.status === "Tillgänglig" ? "success" : "destructive"}
                      >
                        {consultant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Konsultinformation</DrawerTitle>
            <DrawerDescription>
              {selectedConsultant?.specialty}
            </DrawerDescription>
          </DrawerHeader>
          {selectedConsultant && (
            <div className="px-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src={selectedConsultant.image}
                    alt={selectedConsultant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedConsultant.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedConsultant.specialty}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Kontaktinformation</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedConsultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedConsultant.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Plats</h4>
                  <p>{selectedConsultant.location}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge
                    variant={
                      selectedConsultant.status === "Tillgänglig"
                        ? "success"
                        : "destructive"
                    }
                  >
                    {selectedConsultant.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Stäng</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}