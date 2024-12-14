import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Consultant {
  id: number;
  name: string;
  specialty: string;
  personalId: string;
  location: string;
}

interface ConsultantSelectorProps {
  consultants: Consultant[];
  onSelect: (consultant: Consultant | null) => void;
  selectedConsultant: Consultant | null;
}

export const ConsultantSelector = ({
  consultants,
  onSelect,
  selectedConsultant,
}: ConsultantSelectorProps) => {
  return (
    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
      <div className="relative">
        <Select
          onValueChange={(value) =>
            onSelect(consultants[Number(value)] || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sök konsult..." />
          </SelectTrigger>
          <SelectContent>
            {consultants.map((consultant, i) => (
              <SelectItem key={consultant.id} value={i.toString()}>
                {consultant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedConsultant && (
        <div className="p-4 bg-background rounded-md shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="font-bold">{selectedConsultant.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedConsultant.specialty}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm">{selectedConsultant.personalId}</p>
              <p className="text-sm text-muted-foreground">
                {selectedConsultant.location}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};