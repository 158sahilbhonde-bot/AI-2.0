import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  List,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BodyMap } from "./BodyMap";

interface Symptom {
  id: string;
  name: string;
  bodyPart?: string;
  severity?: string;
  duration?: string;
}

interface Condition {
  name: string;
  probability: string;
  description: string;
  urgency: "emergency" | "urgent" | "soon" | "self-care";
  recommendations: string[];
}

interface AnalysisResult {
  conditions: Condition[];
  generalAdvice: string;
  disclaimer: string;
}

type Step = "info" | "symptoms" | "conditions" | "details" | "treatment";

const steps: { id: Step; label: string }[] = [
  { id: "info", label: "INFO" },
  { id: "symptoms", label: "SYMPTOMS" },
  { id: "conditions", label: "CONDITIONS" },
  { id: "details", label: "DETAILS" },
  { id: "treatment", label: "TREATMENT" },
];

export const SymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [viewMode, setViewMode] = useState<"body" | "list">("body");
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch symptom suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (symptomInput.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);

      try {
        const bodyPartContext = selectedBodyPart 
          ? `Related to ${selectedBodyPart} area.` 
          : "";
        
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
                content: "You are a medical symptom autocomplete assistant. Return only a JSON array of matching symptom names."
              },
              {
                role: "user",
                content: `List up to 8 medical symptoms that match or contain "${symptomInput}". ${bodyPartContext} Return ONLY a JSON array of strings, nothing else. Example: ["headache", "head pain", "migraine"]. Focus on common, recognizable symptoms.`
              }
            ],
            temperature: 0.1,
            max_completion_tokens: 500,
          }),
        });

        if (response.ok) {
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
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [symptomInput, selectedBodyPart]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSymptom = (symptomName: string) => {
    if (symptoms.find(s => s.name.toLowerCase() === symptomName.toLowerCase())) {
      return;
    }
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      bodyPart: selectedBodyPart || undefined,
      severity: "moderate",
      duration: "few_days",
    };
    
    setSymptoms([...symptoms, newSymptom]);
    setSymptomInput("");
    setShowSuggestions(false);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const updateSymptom = (id: string, field: keyof Symptom, value: string) => {
    setSymptoms(symptoms.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;

    setIsAnalyzing(true);
    setCurrentStep("conditions");

    const symptomList = symptoms.map(s => {
      let desc = s.name;
      if (s.bodyPart) desc += ` (${s.bodyPart})`;
      if (s.severity) desc += ` - severity: ${s.severity}`;
      if (s.duration) desc += ` - duration: ${s.duration.replace('_', ' ')}`;
      return desc;
    }).join("; ");

    const prompt = `You are a medical diagnostic assistant. Based on the following patient information, provide possible conditions.

Patient Info:
- Age: ${age} years old
- Sex: ${sex}
- Symptoms: ${symptomList}

Analyze these symptoms and provide a response in the following JSON format ONLY (no markdown, no code blocks):
{
  "conditions": [
    {
      "name": "Condition Name",
      "probability": "High/Medium/Low",
      "description": "Brief description of the condition",
      "urgency": "emergency|urgent|soon|self-care",
      "recommendations": ["recommendation 1", "recommendation 2"]
    }
  ],
  "generalAdvice": "General health advice based on symptoms",
  "disclaimer": "Medical disclaimer"
}

Provide 3-5 most likely conditions. Be medically accurate but also emphasize when professional medical care is needed. For urgency:
- "emergency": Life-threatening, call emergency services
- "urgent": See a doctor within 24 hours
- "soon": Schedule an appointment within a few days
- "self-care": Can be managed at home with monitoring`;

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
              content: "You are a knowledgeable medical diagnostic assistant. Provide accurate, helpful health information while always emphasizing the importance of professional medical consultation."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_completion_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const result = JSON.parse(cleanedContent);
          setAnalysisResult(result);
        }
      }
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConditionDetails = async (condition: Condition) => {
    setSelectedCondition(condition);
    setCurrentStep("details");
  };

  const goToTreatment = () => {
    setCurrentStep("treatment");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "info":
        return age && sex;
      case "symptoms":
        return symptoms.length > 0;
      case "conditions":
        return analysisResult !== null;
      case "details":
        return selectedCondition !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (currentStep === "symptoms") {
      analyzeSymptoms();
    } else if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-500 text-white";
      case "urgent": return "bg-orange-500 text-white";
      case "soon": return "bg-yellow-500 text-black";
      case "self-care": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "Emergency - Call 911";
      case "urgent": return "See Doctor Within 24h";
      case "soon": return "Schedule Appointment";
      case "self-care": return "Self-Care";
      default: return urgency;
    }
  };

  return (
    <div className="min-h-[600px] bg-background">
      {/* Step Indicator */}
      <div className="border-b bg-muted/30">
        <div className="flex justify-center">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const stepIndex = steps.findIndex(s => s.id === currentStep);
            const isPast = index < stepIndex;
            
            return (
              <div
                key={step.id}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive 
                    ? "border-primary text-primary" 
                    : isPast 
                      ? "border-primary/50 text-primary/70"
                      : "border-transparent text-muted-foreground"
                }`}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Step 1: Info */}
        {currentStep === "info" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                This information helps us provide more accurate results
              </p>
            </div>

            <Card className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  What is your age?
                </Label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 text-lg"
                  min="0"
                  max="120"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  What is your sex?
                </Label>
                <RadioGroup value={sex} onValueChange={setSex} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {currentStep === "symptoms" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Symptom Input */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">What are your symptoms?</h2>
                <p className="text-muted-foreground text-sm">
                  Click on the body map or type your symptoms below
                </p>
              </div>

              {/* Symptom Input */}
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your main symptom here"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && symptomInput.trim()) {
                      addSymptom(symptomInput.trim());
                    }
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="h-12 text-lg pr-10"
                  autoComplete="off"
                />
                {isLoadingSuggestions && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <ul className="py-1">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2.5 cursor-pointer text-sm hover:bg-muted transition-colors"
                          onClick={() => addSymptom(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Selected Body Part Indicator */}
              {selectedBodyPart && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">
                  <Info className="h-4 w-4" />
                  Showing symptoms for: <strong>{selectedBodyPart}</strong>
                  <button 
                    onClick={() => setSelectedBodyPart(null)}
                    className="ml-auto text-primary hover:text-primary/80"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* My Symptoms List */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">My Symptoms</h3>
                {symptoms.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No symptoms added yet. Type or click on the body map to add symptoms.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {symptoms.map((symptom) => (
                      <li
                        key={symptom.id}
                        className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                      >
                        <span className="font-medium">{symptom.name}</span>
                        <button
                          onClick={() => removeSymptom(symptom.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* Right Panel - Body Map */}
            <div className="relative">
              {/* View Mode Toggle */}
              <div className="absolute top-0 right-0 flex flex-col gap-2 z-10">
                <Button
                  variant={viewMode === "body" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("body")}
                  title="Body Map View"
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Skin Symptoms"
                >
                  SKIN
                </Button>
              </div>

              {viewMode === "body" ? (
                <BodyMap
                  selectedPart={selectedBodyPart}
                  onSelectPart={(part) => setSelectedBodyPart(part)}
                />
              ) : (
                <Card className="p-4 h-[500px] overflow-y-auto">
                  <h3 className="font-semibold mb-4">Body Parts</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Head", "Face", "Eyes", "Ears", "Nose", "Mouth/Throat",
                      "Neck", "Chest", "Upper Back", "Lower Back", "Abdomen",
                      "Pelvis", "Left Arm", "Right Arm", "Left Hand", "Right Hand",
                      "Left Leg", "Right Leg", "Left Foot", "Right Foot", "Skin", "General"
                    ].map((part) => (
                      <Button
                        key={part}
                        variant={selectedBodyPart === part ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => setSelectedBodyPart(part)}
                      >
                        {part}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Conditions */}
        {currentStep === "conditions" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {isAnalyzing ? (
              <Card className="p-12 text-center">
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold mb-2">Analyzing your symptoms...</h3>
                <p className="text-muted-foreground">
                  Please wait while we identify possible conditions
                </p>
              </Card>
            ) : analysisResult ? (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Possible Conditions</h2>
                  <p className="text-muted-foreground">
                    Based on your symptoms, here are some possible conditions
                  </p>
                </div>

                <div className="space-y-4">
                  {analysisResult.conditions.map((condition, index) => (
                    <Card
                      key={index}
                      className="p-5 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                      onClick={() => getConditionDetails(condition)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{condition.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(condition.urgency)}`}>
                              {getUrgencyLabel(condition.urgency)}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {condition.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Likelihood:</span>
                            <span className={`${
                              condition.probability === "High" 
                                ? "text-red-500" 
                                : condition.probability === "Medium" 
                                  ? "text-yellow-600" 
                                  : "text-green-500"
                            }`}>
                              {condition.probability}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {analysisResult.generalAdvice}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        {analysisResult.disclaimer}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            ) : null}
          </div>
        )}

        {/* Step 4: Details */}
        {currentStep === "details" && selectedCondition && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedCondition.name}</h2>
                <span className={`text-sm px-3 py-1 rounded-full ${getUrgencyColor(selectedCondition.urgency)}`}>
                  {getUrgencyLabel(selectedCondition.urgency)}
                </span>
              </div>

              <p className="text-muted-foreground mb-6">
                {selectedCondition.description}
              </p>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <ul className="space-y-2">
                  {selectedCondition.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Additional Questions</h3>
                <div className="space-y-4">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <p className="font-medium">{symptom.name}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Severity</Label>
                          <Select
                            value={symptom.severity}
                            onValueChange={(value) => updateSymptom(symptom.id, "severity", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">Mild</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Duration</Label>
                          <Select
                            value={symptom.duration}
                            onValueChange={(value) => updateSymptom(symptom.id, "duration", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="just_started">Just started</SelectItem>
                              <SelectItem value="few_hours">Few hours</SelectItem>
                              <SelectItem value="few_days">Few days</SelectItem>
                              <SelectItem value="week_plus">A week or more</SelectItem>
                              <SelectItem value="month_plus">A month or more</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 5: Treatment */}
        {currentStep === "treatment" && selectedCondition && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Treatment & Next Steps</h2>
              <p className="text-muted-foreground">
                Based on your symptoms and the identified condition
              </p>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-full ${getUrgencyColor(selectedCondition.urgency)}`}>
                  {selectedCondition.urgency === "emergency" ? (
                    <AlertCircle className="h-6 w-6" />
                  ) : selectedCondition.urgency === "urgent" ? (
                    <AlertCircle className="h-6 w-6" />
                  ) : (
                    <CheckCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{getUrgencyLabel(selectedCondition.urgency)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommended action level
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">What you should do:</h4>
                  <ul className="space-y-2">
                    {selectedCondition.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Your Symptoms Summary:</h4>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <span
                        key={symptom.id}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {symptom.name}
                        {symptom.severity && ` (${symptom.severity})`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Important Disclaimer
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This symptom checker is for informational purposes only and is not a qualified medical opinion. 
                    Always consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setCurrentStep("info");
                  setSymptoms([]);
                  setAnalysisResult(null);
                  setSelectedCondition(null);
                  setAge("");
                  setSex("");
                }}
                variant="outline"
              >
                Start New Check
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="border-t p-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === "info"}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep !== "treatment" && (
          <Button
            onClick={currentStep === "details" ? goToTreatment : handleNext}
            disabled={!canProceed() || isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};