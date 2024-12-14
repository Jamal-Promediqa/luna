import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("Session check error:", error);
          toast({
            title: "Error",
            description: "Error checking session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data.session) {
          navigate("/dashboard");
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Session check error:", error);
        toast({
          title: "Error",
          description: "Error checking session. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        switch (event) {
          case 'SIGNED_IN':
            if (mounted) {
              toast({
                title: "Success",
                description: "Successfully signed in!",
              });
              navigate("/dashboard");
            }
            break;
          
          case 'SIGNED_OUT':
            if (mounted) {
              toast({
                title: "Info",
                description: "Signed out",
              });
            }
            break;
          
          case 'USER_UPDATED':
            console.log("User updated");
            break;
          
          case 'PASSWORD_RECOVERY':
            if (mounted) {
              toast({
                title: "Info",
                description: "Password recovery email sent",
              });
            }
            break;
          
          default:
            if (mounted && event === 'TOKEN_REFRESHED') {
              console.log("Token refreshed");
            } else if (mounted) {
              toast({
                title: "Info",
                description: `Auth state: ${event}`,
              });
            }
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
                message: {
                  borderRadius: '0.75rem',
                  backgroundColor: '#f8d7da',
                  borderColor: '#f5c6cb',
                  color: '#721c24',
                  padding: '1rem',
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                message: 'auth-message',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            onlyThirdPartyProviders={false}
            options={{
              emailRedirectTo: `${window.location.origin}/dashboard`,
              metaData: {
                given_name: undefined as string | undefined,
                surname: undefined as string | undefined,
              },
            }}
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