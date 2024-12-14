import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Mail, Phone } from "lucide-react";
import { Consultant } from "@/types/consultant";
import { useNavigate } from "react-router-dom";

interface ConsultantDrawerProps {
  consultant: Consultant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantDrawer = ({
  consultant,
  isOpen,
  onClose,
}: ConsultantDrawerProps) => {
  const navigate = useNavigate();

  if (!consultant) return null;

  const handleProfileClick = () => {
    onClose();
    navigate(`/consultants/${consultant.id}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Konsultinformation</DrawerTitle>
          <DrawerDescription>{consultant.specialty}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{consultant.name}</h3>
              <p className="text-muted-foreground">{consultant.specialty}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Kontaktinformation</h4>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{consultant.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="h-4 w-4" />
                <span>{consultant.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Plats</h4>
              <p>{consultant.location}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Status</h4>
              <Badge variant={consultant.status === "Tillgänglig" ? "default" : "destructive"}>
                {consultant.status}
              </Badge>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-3 sm:justify-end">
          <Button variant="default" onClick={handleProfileClick}>
            Gå till kontakt kort
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Stäng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};