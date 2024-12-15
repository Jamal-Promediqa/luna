import React, { useState, useRef } from "react";
import { Copy, Edit2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface EmailAIResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (content: string) => void;
  emailContent: string;
  sender: string;
}

export const EmailAIResponseDialog = ({
  open,
  onOpenChange,
  onInsert,
  emailContent,
  sender,
}: EmailAIResponseDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateResponse = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email-response', {
        body: { emailContent, sender },
      });

      if (error) throw error;
      setResponse(data.response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error("Kunde inte generera AI-svar");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      generateResponse();
    } else {
      setIsEditing(false);
      setResponse("");
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    toast.success("Kopierat till urklipp");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleInsert = () => {
    onInsert(response);
    onOpenChange(false);
    toast.success("AI-svar infogat i meddelandet");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <h3 className="text-lg font-semibold">AI-genererat svar</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-6">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {isEditing ? (
                <Textarea
                  ref={textareaRef}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[200px] p-4 font-mono text-sm"
                />
              ) : (
                <pre className="min-h-[200px] whitespace-pre-wrap p-4 font-mono text-sm">
                  {response}
                </pre>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Redigera
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Kopiera
                </Button>

                <Button
                  size="sm"
                  onClick={handleInsert}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Infoga i svar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};