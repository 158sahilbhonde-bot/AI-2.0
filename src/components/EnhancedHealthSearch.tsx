import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Brain } from "lucide-react";
import { DiseaseSearch } from "./DiseaseSearch";
import { SymptomChecker } from "./SymptomChecker";

export const EnhancedHealthSearch = () => {
  const [activeTab, setActiveTab] = useState("symptom-checker");

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="symptom-checker" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI Symptom Checker</span>
          </TabsTrigger>
          <TabsTrigger value="disease-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Disease Search</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="symptom-checker" className="mt-0">
          <SymptomChecker />
        </TabsContent>

        <TabsContent value="disease-search" className="mt-0">
          <DiseaseSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};
