import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { TaskFormValues } from "@/types/task";

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
}

export const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const form = useForm<TaskFormValues>();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Ange uppgiftens titel" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivning</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Lägg till mer kontext om uppgiften"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="brådskande">Brådskande</SelectItem>
                  <SelectItem value="pågående">Pågående</SelectItem>
                  <SelectItem value="väntar">Väntar</SelectItem>
                  <SelectItem value="klar">Klar</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Förfallodatum</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tilldela till</FormLabel>
              <FormControl>
                <Input placeholder="Ange namn" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="submit">Spara</Button>
        </div>
      </form>
    </Form>
  );
};