import { useState, useEffect, useRef } from "react";
import { Brain, Loader2, ChevronRight, AlertCircle, CheckCircle2, HelpCircle, Stethoscope, Heart, Home, AlertTriangle, Dumbbell, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  analyzeSymptoms,
  generateFollowUpQuestions,
  getSymptomSuggestions,
  type SymptomAnalysisResult,
  type FollowUpQuestion,
} from "@/services/symptomAnalyzer";

type Step = 'input' | 'analyzing' | 'follow-up' | 'results';

export const SymptomChecker = () => {
  const [step, setStep] = useState<Step>('input');
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<SymptomAnalysisResult[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce symptom input for autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (symptomInput.trim().length >= 2) {
        setLoadingSuggestions(true);
        try {
          const symptomSuggestions = await getSymptomSuggestions(symptomInput);
          setSuggestions(symptomSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error getting suggestions:', error);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [symptomInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSymptomInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('analyzing');

    try {
      // Combine selected symptoms into a description
      const symptomsDescription = selectedSymptoms.join(', ');

      // Analyze symptoms using OpenAI's medical knowledge
      const results = await analyzeSymptoms(symptomsDescription);

      setAnalysisResults(results);

      // Generate follow-up questions if we have results
      if (results.length > 0) {
        const questions = await generateFollowUpQuestions(symptomsDescription, results);
        if (questions.length > 0) {
          setFollowUpQuestions(questions);
          setStep('follow-up');
        } else {
          setStep('results');
        }
      } else {
        setError('No matching conditions found. Please try different symptoms.');
        setStep('input');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing symptoms');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Re-analyze with follow-up answers
      const symptomsDescription = selectedSymptoms.join(', ');
      const updatedResults = await analyzeSymptoms(
        symptomsDescription,
        followUpAnswers
      );
      setAnalysisResults(updatedResults);
      setStep('results');
    } catch (err) {
      console.error('Follow-up analysis error:', err);
      setError('An error occurred. Showing initial results.');
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipFollowUp = () => {
    setStep('results');
  };

  const handleStartOver = () => {
    setStep('input');
    setSymptomInput('');
    setSelectedSymptoms([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setAnalysisResults([]);
    setFollowUpQuestions([]);
    setFollowUpAnswers({});
    setError(null);
    setSelectedCondition(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Symptom Checker</CardTitle>
              <CardDescription>
                Powered by OpenAI - Describe your symptoms and get comprehensive medical insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Symptom Input */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                1
              </span>
              What are your symptoms?
            </CardTitle>
            <CardDescription>
              Start typing a symptom and select from the suggestions. Add multiple symptoms for more accurate results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Symptom Input with Autocomplete */}
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a symptom (e.g., headache, fever, cough)..."
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="h-12"
              />

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && (symptomInput.length >= 2) && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                >
                  {loadingSuggestions ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Finding symptoms...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => addSymptom(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between group"
                        >
                          <span className="text-sm">{suggestion}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            ADD
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No symptoms found. Try different words.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Symptoms Display */}
            {selectedSymptoms.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Your Symptoms:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 pr-1 flex items-center gap-1"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyzeSymptoms}
                disabled={selectedSymptoms.length === 0 || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Analyzing */}
      {step === 'analyzing' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Analyzing your symptoms...</p>
                <p className="text-sm text-muted-foreground">
                  OpenAI is analyzing your symptoms using comprehensive medical knowledge
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Follow-up Questions */}
      {step === 'follow-up' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                2
              </span>
              Follow-up Questions
            </CardTitle>
            <CardDescription>
              Answer these questions to help us provide more accurate results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedSymptoms.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Your Symptoms:
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSymptoms.map((symptom, idx) => (
                    <Badge key={idx} variant="secondary">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {followUpQuestions.map((question, idx) => (
              <div key={idx} className="space-y-2 p-4 border rounded-lg">
                <Label className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>{question.question}</span>
                </Label>

                {question.type === 'yes_no' && (
                  <RadioGroup
                    value={followUpAnswers[`q${idx}`] || ''}
                    onValueChange={(value) =>
                      setFollowUpAnswers({ ...followUpAnswers, [`q${idx}`]: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`q${idx}-yes`} />
                      <Label htmlFor={`q${idx}-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`q${idx}-no`} />
                      <Label htmlFor={`q${idx}-no`}>No</Label>
                    </div>
                  </RadioGroup>
                )}

                {question.type === 'multiple_choice' && question.options && (
                  <RadioGroup
                    value={followUpAnswers[`q${idx}`] || ''}
                    onValueChange={(value) =>
                      setFollowUpAnswers({ ...followUpAnswers, [`q${idx}`]: value })
                    }
                  >
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${idx}-opt${optIdx}`} />
                        <Label htmlFor={`q${idx}-opt${optIdx}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === 'text' && (
                  <Textarea
                    placeholder="Your answer..."
                    value={followUpAnswers[`q${idx}`] || ''}
                    onChange={(e) =>
                      setFollowUpAnswers({ ...followUpAnswers, [`q${idx}`]: e.target.value })
                    }
                    rows={2}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                onClick={handleFollowUpComplete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refining Results...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                onClick={handleSkipFollowUp}
                variant="outline"
                disabled={loading}
              >
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 'results' && analysisResults.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  3
                </span>
                Possible Conditions
              </CardTitle>
              <CardDescription>
                Based on your symptoms, here are the most likely conditions (ordered by confidence)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSymptoms.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="text-sm font-medium mb-2 block">Your Symptoms:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {analysisResults.map((result, idx) => {
                  const confidenceColor =
                    result.confidence >= 70
                      ? 'text-green-600 dark:text-green-400'
                      : result.confidence >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-orange-600 dark:text-orange-400';

                  return (
                    <Card
                      key={idx}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCondition === result.conditionName
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedCondition(
                          selectedCondition === result.conditionName
                            ? null
                            : result.conditionName
                        )
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {idx + 1}
                              </span>
                              <CardTitle className="text-xl">
                                {result.conditionName}
                              </CardTitle>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Match Confidence:</span>
                                <span className={`text-sm font-bold ${confidenceColor}`}>
                                  {result.confidence}%
                                </span>
                              </div>
                              <Progress value={result.confidence} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">
                              Matching Symptoms:
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.matchingSymptoms.map((symptom, sIdx) => (
                                <Badge key={sIdx} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">
                              AI Reasoning:
                            </Label>
                            <p className="text-sm mt-1 whitespace-pre-line">{result.reasoning}</p>
                          </div>
                        </div>
                      </CardHeader>

                      {selectedCondition === result.conditionName && (
                        <CardContent className="pt-0">
                          <Accordion type="single" collapsible className="w-full">
                            {result.overview && (
                              <AccordionItem value="overview">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <Brain className="h-4 w-4" />
                                  <span>Overview</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.overview}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.symptoms && (
                              <AccordionItem value="symptoms">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>Complete Symptom List</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.symptoms}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.causes && (
                              <AccordionItem value="causes">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4" />
                                  <span>Causes & Risk Factors</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.causes}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.diagnosis && (
                              <AccordionItem value="diagnosis">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4" />
                                  <span>Diagnosis</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.diagnosis}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.treatment && (
                              <AccordionItem value="treatment">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <Heart className="h-4 w-4" />
                                  <span>Treatment Options</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.treatment}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.homeRemedies && (
                              <AccordionItem value="remedies">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <Home className="h-4 w-4" />
                                  <span>Home Remedies & Lifestyle</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.homeRemedies}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.exercises && (
                              <AccordionItem value="exercises">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <Dumbbell className="h-4 w-4" />
                                  <span>Exercise & Physical Therapy</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {result.exercises}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {result.whenToSeeDoctor && (
                              <AccordionItem value="warning">
                                <AccordionTrigger className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <span className="text-red-600 dark:text-red-400">When to Seek Medical Care</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="text-red-700 dark:text-red-300 leading-relaxed whitespace-pre-line bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                                    {result.whenToSeeDoctor}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={handleStartOver} variant="outline" className="flex-1">
                  Check New Symptoms
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Important Medical Disclaimer
                    </p>
                    <p className="text-yellow-800 dark:text-yellow-200">
                      This AI symptom checker is for informational and educational purposes only. It is not
                      a substitute for professional medical advice, diagnosis, or treatment. Always seek
                      the advice of your physician or other qualified health provider with any questions
                      you may have regarding a medical condition.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
