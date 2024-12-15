import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmailTemplate } from "@/types/email";

interface TemplateDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  template: Partial<EmailTemplate>;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof EmailTemplate, value: string) => void;
}

export const TemplateDialog = ({
  isOpen,
  isLoading,
  template,
  onClose,
  onSave,
  onChange,
}: TemplateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa ny mall</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Mallnamn"
            value={template.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
          />
          <Input
            placeholder="Ämne (valfritt)"
            value={template.subject || ""}
            onChange={(e) => onChange("subject", e.target.value)}
          />
          <Input
            placeholder="Kategori (valfritt)"
            value={template.category || ""}
            onChange={(e) => onChange("category", e.target.value)}
          />
          <Textarea
            placeholder="Mallinnehåll"
            value={template.content || ""}
            onChange={(e) => onChange("content", e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Avbryt
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Sparar..." : "Spara"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};