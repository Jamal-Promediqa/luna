import { Users, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      {/* Header */}
      <header className="container mx-auto py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <img
            src="/placeholder.svg"
            alt="Co-Pilot Logo"
            className="h-16 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-copilot-blue">
              Välkommen till Co-Pilot
            </h1>
            <p className="text-copilot-gray text-lg">
              Effektivisera din konsultadministration med vår smarta plattform
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-copilot-blue hover:bg-copilot-blue/90 text-white h-12 text-lg"
              onClick={() => console.log("Create account clicked")}
            >
              <Users className="mr-2 h-5 w-5" />
              Skapa konto
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 text-lg border-copilot-blue text-copilot-blue hover:bg-copilot-blue/10"
              onClick={() => navigate("/login")}
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

      {/* Footer */}
      <footer className="container mx-auto py-6 text-center text-copilot-gray">
        <p>© 2024 Co-Pilot. Alla rättigheter förbehållna.</p>
      </footer>
    </div>
  );
};

export default Index;