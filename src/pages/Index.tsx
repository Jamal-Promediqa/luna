import { Users, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();
  }, [navigate]);

  const handleCreateAccount = () => {
    navigate("/login?mode=signup");
  };

  const handleLogin = () => {
    navigate("/login?mode=signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <header className="container mx-auto py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <img
            src="/lovable-uploads/039fe6f2-1823-467e-9222-1273291f5d48.png"
            alt="Luna Logo"
            className="h-16 w-auto"
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-copilot-blue">
              Välkommen till Luna
            </h1>
            <p className="text-copilot-gray text-lg">
              Effektivisera din konsultadministration med vår smarta plattform
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-copilot-blue hover:bg-copilot-blue/90 text-white h-12 text-lg"
              onClick={handleCreateAccount}
            >
              <Users className="mr-2 h-5 w-5" />
              Skapa konto
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 text-lg border-copilot-blue text-copilot-blue hover:bg-copilot-blue/10"
              onClick={handleLogin}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Logga in
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-copilot-green cursor-pointer hover:opacity-80 transition-opacity">
            <ArrowRight className="h-5 w-5" />
            <span>Kom igång på mindre än 5 minuter</span>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 text-center text-copilot-gray">
        <p>© 2024 Luna. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;