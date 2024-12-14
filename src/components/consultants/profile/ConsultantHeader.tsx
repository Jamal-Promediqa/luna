import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, Pencil } from "lucide-react";
import { Consultant } from "@/types/consultant";
import { useNavigate } from "react-router-dom";

interface ConsultantHeaderProps {
  consultant: Consultant;
}

export function ConsultantHeader({ consultant }: ConsultantHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={consultant.image} alt={consultant.name} />
          <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{consultant.name}</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate(`/consultants/${consultant.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Redigera
            </Button>
          </div>
          <div className="flex gap-2 mb-4">
            <Badge className="bg-copilot-teal text-white hover:bg-copilot-teal-dark">
              {consultant.specialty}
            </Badge>
            <Badge variant="secondary">{consultant.status}</Badge>
          </div>
          <div className="flex gap-6 text-muted-foreground">
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
      </div>
    </div>
  );
}