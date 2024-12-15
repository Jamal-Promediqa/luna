import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MicrosoftAccountCardProps {
  isLinked: boolean;
  showError: boolean;
  errorMessage: string;
  isLinking: boolean;
  onLink: () => void;
  onUnlink: () => void;
}

export const MicrosoftAccountCard = ({
  isLinked,
  showError,
  errorMessage,
  isLinking,
  onLink,
  onUnlink,
}: MicrosoftAccountCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <Mail className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-2xl font-semibold tracking-tight">Email Connection</h3>
        <p className="text-sm text-muted-foreground">
          {isLinked 
            ? "Your Microsoft account is connected to Luna"
            : "Link your Microsoft account to view and send emails in Luna"
          }
        </p>
      </CardHeader>
      
      <CardContent>
        {showError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        {isLinked ? (
          <Button 
            onClick={onUnlink}
            variant="destructive"
            className="w-full"
          >
            Disconnect Microsoft Account
          </Button>
        ) : (
          <Button 
            onClick={onLink} 
            disabled={isLinking}
            className="w-full bg-[#107C10] hover:bg-[#0B5C0B] text-white"
          >
            {isLinking ? 'Connecting...' : 'Connect Microsoft Account'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};