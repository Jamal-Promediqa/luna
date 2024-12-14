import { useParams, useNavigate } from "react-router-dom";
import { useConsultants } from "@/hooks/useConsultants";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ConsultantHeader } from "@/components/consultants/profile/ConsultantHeader";
import { ConsultantSidebar } from "@/components/consultants/profile/ConsultantSidebar";
import { ConsultantOverview } from "@/components/consultants/profile/ConsultantOverview";
import { ConsultantComments } from "@/components/consultants/profile/ConsultantComments";

export default function ConsultantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: consultants } = useConsultants();
  const consultant = consultants?.find(c => c.id.toString() === id);

  if (!consultant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <ConsultantHeader consultant={consultant} />
          <ConsultantOverview consultant={consultant} />
          <ConsultantComments />
        </div>

        {/* Sidebar */}
        <div>
          <ConsultantSidebar />
        </div>
      </div>
    </div>
  );
}