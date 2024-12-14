import { Button } from "@/components/ui/button";
import { RefreshCw, PenSquare, ChevronRight } from "lucide-react";

interface EmailHeaderProps {
  onRefresh: () => void;
  onCompose: () => void;
  isLoading: boolean;
}

export const EmailHeader = ({ onRefresh, onCompose, isLoading }: EmailHeaderProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCompose}
      >
        <PenSquare className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-sm">
        View all
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};