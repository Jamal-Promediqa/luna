import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface FilterTabsProps {
  onCategoryChange: (value: string) => void;
}

export const FilterTabs = ({ onCategoryChange }: FilterTabsProps) => {
  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={onCategoryChange}>
      <TabsList className="w-full justify-start h-auto flex-wrap gap-3 bg-transparent p-1">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
        >
          Alla
          <Badge variant="secondary" className="ml-2">123</Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="doctor" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
        >
          Läkare
          <Badge variant="secondary" className="ml-2">45</Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="nurse" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
        >
          Sjuksköterska
          <Badge variant="secondary" className="ml-2">38</Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="social" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
        >
          Socionom
          <Badge variant="secondary" className="ml-2">40</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};