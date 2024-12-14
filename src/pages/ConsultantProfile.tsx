import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, FileText, Briefcase, Star, Upload, PenSquare, ChevronLeft } from "lucide-react";
import { useConsultants } from "@/hooks/useConsultants";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ConsultantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: consultants } = useConsultants();
  const consultant = consultants?.find(c => c.id.toString() === id);
  const [activeTab, setActiveTab] = useState("overview");

  if (!consultant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/consultants">Konsulter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{consultant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate('/consultants')}
        >
          <ChevronLeft className="h-4 w-4" />
          Tillbaka till konsulter
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={consultant.image} alt={consultant.name} />
              <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{consultant.name}</h1>
              <div className="flex gap-2 mb-4">
                <Badge>{consultant.specialty}</Badge>
                <Badge variant="secondary">{consultant.status}</Badge>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{consultant.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{consultant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{consultant.phone}</span>
                </div>
              </div>
            </div>
            <Button>Redigera Profil</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Översikt
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Uppdrag
          </TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Referenser
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Dokument
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            Anteckningar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Kompetenser</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Om {consultant.name}</h3>
                  <p className="text-muted-foreground">
                    Senior utvecklare med omfattande erfarenhet inom {consultant.specialty}.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tillgänglighet</h3>
                  <Badge variant={consultant.status === "Tillgänglig" ? "default" : "secondary"}>
                    {consultant.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pågående uppdrag</h3>
                <p className="text-muted-foreground">Inga pågående uppdrag att visa.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="references">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Referenser</h3>
                <p className="text-muted-foreground">Inga referenser tillgängliga.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dokument</h3>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Ladda upp nytt dokument
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Anteckningar</h3>
                <p className="text-muted-foreground">Inga anteckningar tillgängliga.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}