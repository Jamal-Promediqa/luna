import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          // Clear any stale session data
          await supabase.auth.signOut({ scope: 'local' });
          return;
        }
        
        if (!mounted) {
          console.log("Component unmounted, skipping session check");
          return;
        }

        if (session?.user) {
          console.log("Session found, navigating to dashboard");
          navigate("/dashboard");
        } else {
          console.log("No session found");
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Session check error:", error);
        toast.error("Error checking session. Please try again.");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) {
          console.log("Component unmounted, skipping auth state change");
          return;
        }
        console.log("Auth state changed:", event, session);
        
        switch (event) {
          case 'SIGNED_IN':
            console.log("User signed in, navigating to dashboard");
            toast.success("Successfully signed in!");
            navigate("/dashboard");
            break;
          
          case 'SIGNED_OUT':
            console.log("User signed out");
            toast("Signed out");
            break;
          
          case 'USER_UPDATED':
            console.log("User updated");
            break;
          
          case 'PASSWORD_RECOVERY':
            console.log("Password recovery initiated");
            toast.info("Password recovery email sent");
            break;
          
          default:
            if (event === 'TOKEN_REFRESHED') {
              console.log("Token refreshed");
            } else {
              console.log("Auth event:", event);
            }
            break;
        }
      }
    );

    return () => {
      console.log("Login component unmounting, cleaning up");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="mb-8">
            <img
              src="/lovable-uploads/ae8d8a41-3fa8-40bf-bc84-638301c00648.png"
              alt="Luna Logo"
              className="mx-auto h-24 w-auto"
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
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
              localization={{
                variables: {
                  sign_up: {
                    email_label: "Email",
                    password_label: "Password",
                    email_input_placeholder: "Your email",
                    password_input_placeholder: "Your password",
                    button_label: "Sign up",
                    loading_button_label: "Signing up ...",
                    social_provider_text: "Sign in with {{provider}}",
                    link_text: "Don't have an account? Sign up",
                    confirmation_text: "Check your email for the confirmation link",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <footer className="container mx-auto py-6 text-center text-copilot-gray">
        <p>© 2024 Luna. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;