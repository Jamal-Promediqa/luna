import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailForm {
  to: string;
  subject: string;
  message: string;
}

export const EmailCompose = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<EmailForm>();

  const onSubmit = async (data: EmailForm) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: [data.to],
          subject: data.subject,
          html: data.message,
        },
      });

      if (error) throw error;

      toast.success("Email sent successfully!");
      reset();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="To"
              {...register("to", { required: true })}
            />
          </div>
          <div>
            <Input
              placeholder="Subject"
              {...register("subject", { required: true })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Message"
              className="min-h-[200px]"
              {...register("message", { required: true })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};