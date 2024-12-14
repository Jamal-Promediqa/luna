import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  type: z.enum(["company", "private"]),
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  personalNumber: z.string().optional(),
  givenName: z.string().min(2, "Förnamn måste vara minst 2 tecken"),
  surname: z.string().min(2, "Efternamn måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(6, "Telefonnummer måste vara minst 6 tecken"),
  location: z.string().min(2, "Ort måste vara minst 2 tecken"),
  postalCode: z.string().min(5, "Postnummer måste vara minst 5 tecken"),
  address: z.string().min(5, "Adress måste vara minst 5 tecken"),
  useMainAddress: z.boolean().default(false),
  doorCode: z.string().optional(),
  additionalInfo: z.string().optional(),
  compensationType: z.string().min(1, "Välj en ersättningstyp"),
});

export default function AddConsultant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "company",
      useMainAddress: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("consultants")
        .insert([{
          name: `${values.givenName} ${values.surname}`,
          email: values.email,
          phone: values.phone,
          location: values.location,
          specialty: values.compensationType,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Konsult tillagd",
        description: "Konsulten har lagts till i systemet.",
      });

      navigate(`/consultants/${data.id}`);
    } catch (error) {
      console.error("Error adding consultant:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte lägga till konsulten. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/consultants")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tillbaka till konsulter
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Lägg till ny konsult</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ansvarig</h3>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={field.value === "company" ? "default" : "outline"}
                          onClick={() => field.onChange("company")}
                        >
                          Företag
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "private" ? "default" : "outline"}
                          onClick={() => field.onChange("private")}
                        >
                          Privatperson
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compensationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ersättningstyp</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj ersättningstyp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Timlön</SelectItem>
                          <SelectItem value="monthly">Månadslön</SelectItem>
                          <SelectItem value="project">Projektbaserad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pers Nr alt Org Nr</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="givenName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Förnamn</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Efternamn</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Juridisk adress/Fakturaadress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postnummer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ort</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="useMainAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Samma besöksadress som juridisk adress ovan
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eventuell portkod</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Kontaktuppgifter & övrig information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobil/tel</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Övrig information</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/consultants")}
                >
                  Avbryt
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sparar..." : "Spara & gå till kontaktkort"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}