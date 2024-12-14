import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export default function AddConsultant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    location: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("consultants")
        .insert([formData])
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialitet</Label>
              <Input
                id="specialty"
                name="specialty"
                required
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Plats</Label>
              <Input
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
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
                {isLoading ? "Sparar..." : "Lägg till konsult"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}