import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone } from "lucide-react";
import { Consultant } from "@/types/consultant";

interface ConsultantHeaderProps {
  consultant: Consultant;
}

export function ConsultantHeader({ consultant }: ConsultantHeaderProps) {
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={consultant.image} alt={consultant.name} />
          <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{consultant.name}</h1>
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