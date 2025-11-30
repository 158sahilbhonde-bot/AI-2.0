import { useState, useEffect, useRef } from "react";
import { Search, Activity, Stethoscope, Heart, Dumbbell, Home, AlertCircle, Loader2, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DiseaseInfo {
  condition_name: string;
  overview: string;
  symptoms: string;
  causes_and_risk_factors: string;
  diagnosis: string;
  treatment: string;
  home_remedies_and_lifestyle: string;
  exercises: string;
}

export const DiseaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSuggestionsLoading(true);

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            messages: [
              {
                role: "system",
                content: "You are a medical conditions autocomplete assistant. Return only a JSON array of matching medical condition names."
              },
              {
                role: "user",
                content: `List up to 8 medical conditions, diseases, or health issues that start with or contain "${searchTerm}". Return ONLY a JSON array of strings, nothing else. Example: ["condition 1", "condition 2"]. If no conditions match, return an empty array [].`
              }
            ],
            temperature: 0.1,
            max_completion_tokens: 500,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (content) {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleanedContent);
          if (Array.isArray(parsed)) {
            setSuggestions(parsed);
            setShowSuggestions(true);
          }
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchDisease = async (term?: string) => {
    const searchQuery = term || searchTerm;
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);
    setDiseaseInfo(null);

    const prompt = `You are a medical information assistant. Provide comprehensive, accurate, and detailed information about the medical condition: "${searchQuery}".

Please respond in the following JSON format only (no markdown, no code blocks, just pure JSON):
{
  "condition_name": "Official name of the condition",
  "overview": "A comprehensive overview of the condition (2-3 paragraphs)",
  "symptoms": "Detailed list and description of all symptoms associated with this condition",
  "causes_and_risk_factors": "Complete information about causes, risk factors, and who is most likely to develop this condition",
  "diagnosis": "How this condition is diagnosed, including tests, examinations, and diagnostic criteria",
  "treatment": "All treatment options including medications, procedures, and therapies",
  "home_remedies_and_lifestyle": "Home care tips, lifestyle modifications, dietary recommendations, and self-care strategies",
  "exercises": "Recommended exercises, physical therapy options, and activity guidelines"
}

If the condition is not recognized or doesn't exist, respond with:
{
  "error": "Condition not found or not recognized as a medical condition"
}

Provide thorough, medically accurate information. Include specific details, not just general statements.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          messages: [
            {
              role: "system",
              content: "You are a knowledgeable medical information assistant. Provide accurate, comprehensive, and helpful health information. Always encourage users to consult healthcare professionals for personal medical advice."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No response received from API");
      }

      // Parse the JSON response
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedInfo = JSON.parse(cleanedContent);

      if (parsedInfo.error) {
        setError(parsedInfo.error);
      } else {
        setDiseaseInfo(parsedInfo);
      }
    } catch (err) {
      console.error("Error fetching disease info:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch disease information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        searchDisease();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          searchDisease();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    searchDisease(suggestion);
  };

  const InfoSection = ({ 
    icon: Icon, 
    title, 
    content 
  }: { 
    icon: React.ElementType; 
    title: string; 
    content: string;
  }) => {
    if (!content) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        </div>
        <div className="text-muted-foreground leading-relaxed pl-11 whitespace-pre-line">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Input with Autocomplete */}
      <div className="flex gap-3">
        <div ref={containerRef} className="relative flex-1" style={{ zIndex: 100 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter a disease or condition name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="pl-10 h-12 text-lg"
            disabled={isLoading}
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || isSuggestionsLoading) && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl overflow-hidden"
              style={{ zIndex: 9999 }}
            >
              {isSuggestionsLoading && suggestions.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading suggestions...
                </div>
              ) : (
                <ul className="py-1 max-h-[300px] overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={`px-4 py-3 cursor-pointer text-sm transition-colors border-b border-border/50 last:border-b-0 ${
                        index === selectedIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <Button 
          onClick={() => searchDisease()} 
          disabled={isLoading || !searchTerm.trim()}
          className="h-12 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground text-lg mb-2">
            Fetching comprehensive information...
          </p>
          <p className="text-sm text-muted-foreground">
            This may take a few seconds
          </p>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="p-8 text-center border-destructive/50">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg mb-2">
            {error}
          </p>
          <p className="text-sm text-muted-foreground">
            Please try a different search term or check your spelling
          </p>
        </Card>
      )}

      {/* Disease Information */}
      {diseaseInfo && !isLoading && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <h3 className="text-2xl md:text-3xl font-bold text-primary">
              {diseaseInfo.condition_name}
            </h3>
          </div>
          
          <div className="p-6">
            {/* Overview */}
            {diseaseInfo.overview && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Overview</h4>
                </div>
                <div className="text-muted-foreground leading-relaxed pl-11 whitespace-pre-line">
                  {diseaseInfo.overview}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <InfoSection 
                icon={Activity} 
                title="Symptoms" 
                content={diseaseInfo.symptoms} 
              />

              <InfoSection 
                icon={AlertCircle} 
                title="Causes & Risk Factors" 
                content={diseaseInfo.causes_and_risk_factors} 
              />

              <InfoSection 
                icon={Stethoscope} 
                title="Diagnosis" 
                content={diseaseInfo.diagnosis} 
              />

              <InfoSection 
                icon={Heart} 
                title="Treatment" 
                content={diseaseInfo.treatment} 
              />

              <InfoSection 
                icon={Home} 
                title="Home Remedies & Lifestyle" 
                content={diseaseInfo.home_remedies_and_lifestyle} 
              />

              <InfoSection 
                icon={Dumbbell} 
                title="Exercises & Physical Therapy" 
                content={diseaseInfo.exercises} 
              />
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <strong>Disclaimer:</strong> This information is for educational purposes only and should not be considered medical advice. 
                Always consult with a qualified healthcare professional for diagnosis and treatment of any medical condition.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Initial State */}
      {!searchTerm.trim() && !diseaseInfo && !isLoading && !error && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            Search for any medical condition
          </p>
          <p className="text-sm text-muted-foreground">
            Get comprehensive information about symptoms, causes, diagnosis, treatment options, and more
          </p>
        </Card>
      )}
    </div>
  );
};