// Import the local medical database
import medicalDatabase from '@/data/medical_conditions_complete_database_FIXED.json';

export interface SymptomAnalysisResult {
  conditionName: string;
  confidence: number; // 0-100
  matchingSymptoms: string[];
  reasoning: string;
  overview: string;
  symptoms: string;
  causes: string;
  causesSummary: string[]; // Key causes (3-5 items)
  riskFactorsSummary: string[]; // Key risk factors (3-5 items)
  diagnosis: string;
  treatment: string;
  homeRemedies: string;
  homeRemediesSummary: string[]; // Key remedies (3-5 items)
  exercises: string;
  exercisesSummary: string[]; // Key exercises (3-5 items)
  whenToSeeDoctor: string;
}

export interface FollowUpQuestion {
  question: string;
  type: 'multiple_choice' | 'yes_no' | 'text';
  options?: string[];
}

// Extract all unique symptoms from the database for autocomplete
let symptomCache: string[] | null = null;

function getAllSymptoms(): string[] {
  if (symptomCache) {
    return symptomCache;
  }

  const symptomsSet = new Set<string>();

  medicalDatabase.conditions.forEach(condition => {
    // Extract symptoms from the symptoms field
    const symptomText = condition.symptoms.toLowerCase();

    // Common symptom patterns to extract
    const patterns = [
      // Bullet points with asterisks
      /\*\s+\*\*([^*]+)\*\*/g,
      // Numbered items
      /\d+\.\s+\*\*([^*]+)\*\*/g,
      // Items in parentheses or standalone
      /(?:^|\n)\s*[-•]\s*([^\n]+)/g,
    ];

    patterns.forEach(pattern => {
      const matches = symptomText.matchAll(pattern);
      for (const match of matches) {
        let symptom = match[1].trim();
        // Clean up the symptom text
        symptom = symptom
          .replace(/\([^)]*\)/g, '') // Remove parentheses
          .replace(/[:;,.].*$/, '') // Remove everything after colon, semicolon, comma, or period
          .trim();

        if (symptom.length > 3 && symptom.length < 100) {
          symptomsSet.add(symptom);
        }
      }
    });
  });

  // Add common general symptoms
  const commonSymptoms = [
    'headache', 'fever', 'fatigue', 'nausea', 'vomiting', 'diarrhea',
    'cough', 'sore throat', 'runny nose', 'chest pain', 'shortness of breath',
    'dizziness', 'abdominal pain', 'back pain', 'muscle pain', 'joint pain',
    'rash', 'itching', 'swelling', 'numbness', 'tingling', 'weakness',
    'blurred vision', 'ear pain', 'difficulty swallowing', 'loss of appetite',
    'weight loss', 'weight gain', 'insomnia', 'anxiety', 'depression',
    'confusion', 'memory loss', 'difficulty concentrating', 'night sweats',
    'chills', 'rapid heartbeat', 'irregular heartbeat', 'high blood pressure',
    'low blood pressure', 'painful urination', 'frequent urination',
    'blood in urine', 'constipation', 'bloating', 'heartburn', 'acid reflux',
  ];

  commonSymptoms.forEach(s => symptomsSet.add(s));

  symptomCache = Array.from(symptomsSet).sort();
  return symptomCache;
}

/**
 * Gets symptom suggestions based on partial input (for autocomplete)
 */
export async function getSymptomSuggestions(partialInput: string): Promise<string[]> {
  if (!partialInput || partialInput.length < 2) {
    return [];
  }

  const allSymptoms = getAllSymptoms();
  const searchTerm = partialInput.toLowerCase().trim();

  // Filter symptoms that match the input
  const matches = allSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm)
  );

  // Prioritize symptoms that start with the search term
  const startsWithMatches = matches.filter(s => s.toLowerCase().startsWith(searchTerm));
  const containsMatches = matches.filter(s => !s.toLowerCase().startsWith(searchTerm));

  return [...startsWithMatches, ...containsMatches].slice(0, 10);
}

/**
 * Extract summary items from text
 */
function extractSummaryItems(text: string, count: number = 5): string[] {
  const items: string[] = [];

  // Try to extract bullet points or numbered items
  const bulletPattern = /(?:^|\n)\s*[*•-]\s+\*\*([^*]+)\*\*/g;
  let matches = text.matchAll(bulletPattern);

  for (const match of matches) {
    let item = match[1].trim();
    item = item.replace(/[:;.].*$/, '').trim();
    if (item.length > 5 && item.length < 150) {
      items.push(item);
    }
    if (items.length >= count) break;
  }

  // If not enough items, try sentences
  if (items.length < count) {
    const sentences = text.split(/[.!?]\s+/);
    for (const sentence of sentences) {
      const clean = sentence.replace(/\*\*/g, '').trim();
      if (clean.length > 10 && clean.length < 150 && !items.includes(clean)) {
        items.push(clean);
      }
      if (items.length >= count) break;
    }
  }

  return items.slice(0, count);
}

/**
 * Calculate symptom match score between user symptoms and condition
 */
function calculateSymptomMatch(userSymptoms: string[], conditionSymptoms: string): number {
  const conditionText = conditionSymptoms.toLowerCase();
  let matchCount = 0;
  let totalWeight = 0;

  userSymptoms.forEach(symptom => {
    const symptomLower = symptom.toLowerCase();

    // Check for exact matches (higher weight)
    if (conditionText.includes(symptomLower)) {
      matchCount += 2;
      totalWeight += 2;
    } else {
      // Check for partial word matches
      const words = symptomLower.split(' ');
      const wordMatches = words.filter(word =>
        word.length > 3 && conditionText.includes(word)
      ).length;

      if (wordMatches > 0) {
        matchCount += wordMatches * 0.5;
        totalWeight += 1;
      } else {
        totalWeight += 2;
      }
    }
  });

  if (totalWeight === 0) return 0;

  // Calculate percentage (0-100)
  const percentage = (matchCount / totalWeight) * 100;
  return Math.min(95, Math.round(percentage)); // Cap at 95% to be conservative
}

/**
 * Analyzes user symptoms using the local medical database
 */
export async function analyzeSymptoms(
  userSymptoms: string,
  previousAnswers?: Record<string, string>
): Promise<SymptomAnalysisResult[]> {
  try {
    // Parse user symptoms into an array
    const symptomList = userSymptoms
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (symptomList.length === 0) {
      throw new Error('Please enter at least one symptom');
    }

    const results: SymptomAnalysisResult[] = [];

    // Analyze each condition in the database
    medicalDatabase.conditions.forEach(condition => {
      const confidence = calculateSymptomMatch(symptomList, condition.symptoms);

      // Only include conditions with some match
      if (confidence > 10) {
        // Find which symptoms matched
        const matchingSymptoms = symptomList.filter(symptom =>
          condition.symptoms.toLowerCase().includes(symptom.toLowerCase())
        );

        // Generate reasoning
        const reasoning = matchingSymptoms.length > 0
          ? `This condition matches ${matchingSymptoms.length} of your symptoms: ${matchingSymptoms.join(', ')}.`
          : 'This condition has symptoms that partially overlap with your description.';

        // Extract summaries from the database text
        const causesSummary = extractSummaryItems(condition.causes_and_risk_factors, 4);
        const riskFactorsSummary = extractSummaryItems(
          condition.causes_and_risk_factors.split('Risk Factors')[1] || condition.causes_and_risk_factors,
          4
        );
        const homeRemediesSummary = extractSummaryItems(condition.home_remedies_and_lifestyle, 4);
        const exercisesSummary = extractSummaryItems(condition.exercises, 4);

        // Create when to see doctor message
        const whenToSeeDoctor =
          'Consult a healthcare provider if: symptoms persist or worsen, you experience severe pain, ' +
          'you have difficulty breathing, you notice unusual swelling or bleeding, or if you are concerned ' +
          'about your symptoms. Seek immediate medical attention for severe or life-threatening symptoms.';

        results.push({
          conditionName: condition.condition_name,
          confidence,
          matchingSymptoms,
          reasoning,
          overview: condition.overview,
          symptoms: condition.symptoms,
          causes: condition.causes_and_risk_factors,
          causesSummary,
          riskFactorsSummary,
          diagnosis: condition.diagnosis,
          treatment: 'Consult your doctor for proper diagnosis and treatment. ' + condition.treatment,
          homeRemedies: 'While consulting a doctor is important, these approaches may help: ' +
                        condition.home_remedies_and_lifestyle,
          homeRemediesSummary,
          exercises: 'After consulting your healthcare provider, consider these activities: ' +
                    condition.exercises,
          exercisesSummary,
          whenToSeeDoctor,
        });
      }
    });

    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);

    // Return top 8 results
    return results.slice(0, 8);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

/**
 * Generates follow-up questions to refine the diagnosis
 */
export async function generateFollowUpQuestions(
  userSymptoms: string,
  currentAnalysis: SymptomAnalysisResult[]
): Promise<FollowUpQuestion[]> {
  // Generate basic follow-up questions based on top conditions
  const questions: FollowUpQuestion[] = [];

  if (currentAnalysis.length > 0) {
    const topCondition = currentAnalysis[0];

    // Add duration question
    questions.push({
      question: 'How long have you been experiencing these symptoms?',
      type: 'multiple_choice',
      options: ['Less than 24 hours', '1-3 days', '4-7 days', 'More than a week', 'More than a month']
    });

    // Add severity question
    questions.push({
      question: 'How would you rate the severity of your symptoms?',
      type: 'multiple_choice',
      options: ['Mild (barely noticeable)', 'Moderate (uncomfortable but manageable)', 'Severe (significantly affecting daily activities)']
    });

    // Add a condition-specific question
    if (topCondition.conditionName.toLowerCase().includes('fever') ||
        topCondition.symptoms.toLowerCase().includes('fever')) {
      questions.push({
        question: 'Have you experienced a fever?',
        type: 'yes_no'
      });
    }
  }

  return questions.slice(0, 3);
}

/**
 * Extracts and normalizes symptoms from natural language input
 */
export async function extractSymptoms(userInput: string): Promise<string[]> {
  // Simple extraction: split by common delimiters
  const symptoms = userInput
    .split(/[,;.!?]|\sand\s|\swith\s/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

  return symptoms.slice(0, 10); // Limit to 10 symptoms
}
