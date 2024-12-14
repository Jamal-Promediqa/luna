import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Home, Settings, Users, Briefcase, FileCheck, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type TaskFormValues = {
  title: string;
  status: string;
  dueDate: string;
  assignedTo: string;
};

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<TaskFormValues>();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads", path: "/leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
  ];

  const tasks = [
    { 
      title: "Granska CV för Erik Andersson", 
      status: "Brådskande", 
      variant: "destructive" as const,
      dueDate: "2024-03-20",
      assignedTo: "John Doe"
    },
    { 
      title: "Boka intervju med Maria Nilsson", 
      status: "Pågående", 
      variant: "default" as const,
      dueDate: "2024-03-22",
      assignedTo: "Jane Smith"
    },
    { 
      title: "Följ upp referenstagning", 
      status: "Väntar", 
      variant: "secondary" as const,
      dueDate: "2024-03-25",
      assignedTo: "John Doe"
    },
    { 
      title: "Uppdatera konsultprofil", 
      status: "Klar", 
      variant: "outline" as const,
      dueDate: "2024-03-18",
      assignedTo: "Jane Smith"
    }
  ];

  const onSubmit = (data: TaskFormValues) => {
    console.log(data);
    setOpen(false);
    form.reset();
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Uppgifter och aktiviteter</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {navigationItems.map((item) => (
          <Button
            key={item.text}
            variant="ghost"
            className="whitespace-nowrap"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Lägg till ny uppgift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till ny uppgift</DialogTitle>
            </DialogHeader>
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Förfallodatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignedTo"
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
                  <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">Spara</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <Card key={index} className="hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge variant={task.variant}>{task.status}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Förfaller: {task.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Tilldelad: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Visa detaljer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;