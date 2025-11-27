import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export interface SymptomAnalysisResult {
  conditionName: string;
  confidence: number; // 0-100
  matchingSymptoms: string[];
  reasoning: string;
  overview: string;
  symptoms: string;
  causes: string;
  diagnosis: string;
  treatment: string;
  homeRemedies: string;
  whenToSeeDoctor: string;
}

export interface FollowUpQuestion {
  question: string;
  type: 'multiple_choice' | 'yes_no' | 'text';
  options?: string[];
}

/**
 * Analyzes user symptoms using OpenAI's medical knowledge
 */
export async function analyzeSymptoms(
  userSymptoms: string,
  previousAnswers?: Record<string, string>
): Promise<SymptomAnalysisResult[]> {
  try {
    const prompt = `You are an expert medical AI assistant. Analyze the following symptoms and provide the most likely medical conditions.

User Symptoms: ${userSymptoms}
${previousAnswers ? `\nAdditional Information: ${JSON.stringify(previousAnswers)}` : ''}

IMPORTANT INSTRUCTIONS:
1. Identify 5-8 most likely medical conditions based on the symptoms
2. Order by likelihood (highest confidence first)
3. For EACH condition, provide comprehensive information
4. Be conservative with confidence scores (realistic medical assessment)
5. Include practical medical advice
6. Return ONLY valid JSON (no markdown, no code blocks, no extra text)

Return this EXACT JSON structure:
[
  {
    "conditionName": "Name of the condition",
    "confidence": 75,
    "matchingSymptoms": ["symptom1", "symptom2"],
    "reasoning": "Brief explanation of why this condition matches",
    "overview": "2-3 paragraph overview of the condition",
    "symptoms": "Complete list of common symptoms with descriptions",
    "causes": "Common causes and risk factors",
    "diagnosis": "How this condition is typically diagnosed",
    "treatment": "Standard treatment approaches and medications",
    "homeRemedies": "Self-care measures and lifestyle recommendations",
    "whenToSeeDoctor": "Warning signs that require immediate medical attention"
  }
]

Be thorough but concise. Each field should be informative and medically accurate.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert medical AI that provides comprehensive condition analysis. Always return valid JSON only. Be medically accurate, thorough, and practical.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content?.trim() || '[]';

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    const results = JSON.parse(jsonContent) as SymptomAnalysisResult[];

    return results.slice(0, 8); // Return top 8
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
  try {
    const prompt = `Based on the user's symptoms and the current analysis, generate 2-3 relevant follow-up questions to help narrow down the diagnosis.

User Symptoms: ${userSymptoms}

Current Top Matches:
${currentAnalysis.slice(0, 3).map(a => `- ${a.conditionName} (${a.confidence}% confidence)`).join('\n')}

Generate questions that would help differentiate between these conditions. Return ONLY a JSON array with this format:
[{"question": "...", "type": "yes_no"}, {"question": "...", "type": "multiple_choice", "options": ["option1", "option2", "option3"]}]

Types: yes_no, multiple_choice, or text`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI that generates relevant follow-up questions. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content?.trim() || '[]';

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    return JSON.parse(jsonContent) as FollowUpQuestion[];
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return [];
  }
}

/**
 * Extracts and normalizes symptoms from natural language input
 */
export async function extractSymptoms(userInput: string): Promise<string[]> {
  try {
    const prompt = `Extract distinct medical symptoms from this text. Return a JSON array of symptom strings.

User Input: "${userInput}"

Return only the JSON array, e.g.: ["headache", "fever", "nausea"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical text analyzer. Extract symptoms and return only a JSON array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const content = response.choices[0]?.message?.content?.trim() || '[]';

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    return JSON.parse(jsonContent) as string[];
  } catch (error) {
    console.error('Error extracting symptoms:', error);
    return [];
  }
}
