import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { EmailTemplate } from "@/types/email";
import { TemplateDialog } from "./templates/TemplateDialog";
import { TemplateList } from "./templates/TemplateList";

interface EmailTemplatesProps {
  isConnected: boolean;
  onSelectTemplate: (template: string) => void;
}

export const EmailTemplates = ({ isConnected, onSelectTemplate }: EmailTemplatesProps) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

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
      const { error } = await supabase
        .from("email_templates")
        .insert([
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

  const handleTemplateChange = (field: keyof EmailTemplate, value: string) => {
    setCurrentTemplate(prev => ({ ...prev, [field]: value }));
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

        <TemplateList
          templates={templates}
          isConnected={isConnected}
          onSelect={handleSelectTemplate}
          onEdit={(template) => {
            setCurrentTemplate(template);
            setShowTemplateDialog(true);
          }}
        />

        <TemplateDialog
          isOpen={showTemplateDialog}
          isLoading={isLoading}
          template={currentTemplate}
          onClose={() => setShowTemplateDialog(false)}
          onSave={handleSaveTemplate}
          onChange={handleTemplateChange}
        />
      </CardContent>
    </Card>
  );
};