import { useState, useMemo, useEffect } from "react";
import { Search, Activity, Stethoscope, Heart, Dumbbell, Home, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import medicalDatabase from "@/data/medical_conditions_complete_database_FIXED.json";

interface MedicalCondition {
  condition_name: string;
  overview: string;
  symptoms: string;
  causes_and_risk_factors: string;
  diagnosis: string;
  treatment: string;
  home_remedies_and_lifestyle: string;
  exercises: string;
  category: string;
  image_url: string;
  image_attribution: string;
}

interface MedicalDatabase {
  database_info: {
    name: string;
    version: string;
    total_conditions: number;
    last_updated: string;
    description: string;
  };
  conditions: MedicalCondition[];
}

// Utility function to format text with bold and line breaks
const formatText = (text: string): JSX.Element => {
  if (!text) return <></>;
  
  // Replace \n with actual line breaks and handle bold text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text
          const boldText = part.slice(2, -2);
          return <strong key={index} className="font-semibold text-foreground">{boldText}</strong>;
        } else {
          // Regular text with line breaks
          return part.split('\\n').map((line, lineIndex, arr) => (
            <span key={`${index}-${lineIndex}`}>
              {line}
              {lineIndex < arr.length - 1 && <br />}
            </span>
          ));
        }
      })}
    </>
  );
};

export const DiseaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const database = medicalDatabase as MedicalDatabase;

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Optimized search - only searches in condition_name
  const filteredConditions = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return [];
    
    const term = debouncedSearchTerm.toLowerCase();
    return database.conditions.filter((condition) =>
      condition.condition_name.toLowerCase().includes(term)
    );
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by condition name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {debouncedSearchTerm.trim() && (
        <div className="text-sm text-muted-foreground">
          Found {filteredConditions.length} condition{filteredConditions.length !== 1 ? 's' : ''} 
          {filteredConditions.length > 0 && ` matching "${debouncedSearchTerm}"`}
        </div>
      )}

      {debouncedSearchTerm.trim() && (
        <div className="space-y-4">
          {filteredConditions.length > 0 ? (
            filteredConditions.map((condition, index) => (
              <Card key={index} className="overflow-hidden">
                {condition.image_url && (
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                      src={condition.image_url}
                      alt={condition.condition_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-primary">
                      {condition.condition_name}
                    </h3>
                    {condition.category && (
                      <span className="shrink-0 text-xs font-semibold px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {condition.category}
                      </span>
                    )}
                  </div>

                  {condition.overview && (
                    <div className="text-muted-foreground mb-6 leading-relaxed">
                      {formatText(condition.overview)}
                    </div>
                  )}

                  <Accordion type="single" collapsible className="w-full">
                    {condition.symptoms && (
                      <AccordionItem value="symptoms">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span className="font-semibold">Symptoms</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.symptoms)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {condition.causes_and_risk_factors && (
                      <AccordionItem value="causes">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-semibold">Causes & Risk Factors</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.causes_and_risk_factors)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {condition.diagnosis && (
                      <AccordionItem value="diagnosis">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <span className="font-semibold">Diagnosis</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.diagnosis)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {condition.treatment && (
                      <AccordionItem value="treatment">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span className="font-semibold">Treatment</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.treatment)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {condition.home_remedies_and_lifestyle && (
                      <AccordionItem value="remedies">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="font-semibold">Home Remedies & Lifestyle</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.home_remedies_and_lifestyle)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {condition.exercises && (
                      <AccordionItem value="exercises">
                        <AccordionTrigger className="text-left hover:text-primary">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            <span className="font-semibold">Exercises & Physical Therapy</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-muted-foreground leading-relaxed pt-2">
                            {formatText(condition.exercises)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  {condition.image_attribution && (
                    <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                      Image: {condition.image_attribution}
                    </p>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No conditions found matching "{debouncedSearchTerm}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching with different condition names or check your spelling
              </p>
            </Card>
          )}
        </div>
      )}

      {!debouncedSearchTerm.trim() && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            Search our comprehensive health database
          </p>
          <p className="text-sm text-muted-foreground">
            Find detailed information about {database.database_info.total_conditions}+ medical conditions, symptoms, treatments, and more
          </p>
        </Card>
      )}
    </div>
  );
};