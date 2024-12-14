import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          toast.error("Error checking session");
          return;
        }
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("Error checking session");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
          navigate("/dashboard");
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        } else if (event === 'USER_UPDATED') {
          console.log("User updated");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <header className="container mx-auto py-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <img
            src="/placeholder.svg"
            alt="Co-Pilot Logo"
            className="h-16 w-auto"
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#007AFF',
                    brandAccent: '#0056b3',
                  },
                },
              },
              style: {
                button: {
                  borderRadius: '0.75rem',
                },
                input: {
                  borderRadius: '0.75rem',
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            onlyThirdPartyProviders={false}
          />
        </div>
      </main>

      <footer className="container mx-auto py-6 text-center text-copilot-gray">
        <p>© 2024 Co-Pilot. Alla rättigheter förbehållna.</p>
      </footer>
    </div>
  );
};

export default Login;