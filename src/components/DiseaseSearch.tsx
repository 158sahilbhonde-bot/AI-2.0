import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import diseaseData from "@/data/india_diseases_database.json";

interface Question {
  q: string;
  a: string;
}

interface Disease {
  disease: string;
  questions: Question[];
}

export const DiseaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiseases = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return (diseaseData as Disease[]).filter((disease) =>
      disease.disease.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for diseases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {searchTerm.trim() && (
        <div className="space-y-4">
          {filteredDiseases.length > 0 ? (
            filteredDiseases.map((disease, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {disease.disease}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {disease.questions.map((qa, qIndex) => (
                    <AccordionItem key={qIndex} value={`item-${qIndex}`}>
                      <AccordionTrigger className="text-left">
                        {qa.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {qa.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No diseases found matching "{searchTerm}"
              </p>
            </Card>
          )}
        </div>
      )}

      {!searchTerm.trim() && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Start typing to search for diseases and health information
          </p>
        </Card>
      )}
    </div>
  );
};