import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Plus, Edit, Trash } from "lucide-react";
import { EmailTemplate } from "@/types/email";

interface EmailTemplatesProps {
  isConnected: boolean;
  onSelectTemplate: (template: string) => void;
}

export const EmailTemplates = ({ isConnected, onSelectTemplate }: EmailTemplatesProps) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    category: "",
  });

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("usage_count", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Could not load templates");
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("email_templates").insert([
        {
          name: currentTemplate.name,
          subject: currentTemplate.subject,
          content: currentTemplate.content,
          category: currentTemplate.category,
        },
      ]);

      if (error) throw error;

      toast.success("Mall sparad");
      setShowTemplateDialog(false);
      setCurrentTemplate({ name: "", subject: "", content: "", category: "" });
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Could not save template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = async (template: EmailTemplate) => {
    try {
      await supabase
        .from("email_templates")
        .update({ 
          usage_count: (template.usage_count || 0) + 1,
          last_used_at: new Date().toISOString()
        })
        .eq("id", template.id);

      onSelectTemplate(template.content);
    } catch (error) {
      console.error("Error updating template usage:", error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Mallar</h3>
          <Button
            size="sm"
            variant="outline"
            disabled={!isConnected}
            onClick={() => setShowTemplateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ny mall
          </Button>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center gap-2">
              <Button
                className="flex-1 justify-start"
                variant="outline"
                disabled={!isConnected}
                onClick={() => handleSelectTemplate(template)}
              >
                {template.name}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setCurrentTemplate({
                    name: template.name,
                    subject: template.subject || "",
                    content: template.content,
                    category: template.category || "",
                  });
                  setShowTemplateDialog(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Skapa ny mall</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Mallnamn"
                value={currentTemplate.name}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Ämne (valfritt)"
                value={currentTemplate.subject}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
              <Input
                placeholder="Kategori (valfritt)"
                value={currentTemplate.category}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, category: e.target.value }))
                }
              />
              <Textarea
                placeholder="Mallinnehåll"
                value={currentTemplate.content}
                onChange={(e) =>
                  setCurrentTemplate((prev) => ({ ...prev, content: e.target.value }))
                }
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateDialog(false)}
                  disabled={isLoading}
                >
                  Avbryt
                </Button>
                <Button onClick={handleSaveTemplate} disabled={isLoading}>
                  {isLoading ? "Sparar..." : "Spara"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
