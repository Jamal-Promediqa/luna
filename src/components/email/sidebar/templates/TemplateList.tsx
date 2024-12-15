import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EmailTemplate } from "@/types/email";

interface TemplateListProps {
  templates: EmailTemplate[];
  isConnected: boolean;
  onSelect: (template: EmailTemplate) => void;
  onEdit: (template: EmailTemplate) => void;
}

export const TemplateList = ({
  templates,
  isConnected,
  onSelect,
  onEdit,
}: TemplateListProps) => {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <div key={template.id} className="flex items-center gap-2">
          <Button
            className="flex-1 justify-start"
            variant="outline"
            disabled={!isConnected}
            onClick={() => onSelect(template)}
          >
            {template.name}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(template)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};