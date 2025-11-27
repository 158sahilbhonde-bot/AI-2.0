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
}

export interface FollowUpQuestion {
  question: string;
  type: 'multiple_choice' | 'yes_no' | 'text';
  options?: string[];
}

/**
 * Analyzes user symptoms and matches them to conditions in the database
 */
export async function analyzeSymptoms(
  userSymptoms: string,
  conditions: any[],
  previousAnswers?: Record<string, string>
): Promise<SymptomAnalysisResult[]> {
  try {
    // Create a condensed version of conditions data for the AI to analyze
    const conditionsData = conditions.map(c => ({
      name: c.condition_name,
      symptoms: c.symptoms?.slice(0, 500), // Limit length
      overview: c.overview?.slice(0, 300)
    }));

    const prompt = `You are a medical symptom analyzer. Analyze the following user symptoms and match them to the most likely conditions from the provided medical database.

User Symptoms: ${userSymptoms}
${previousAnswers ? `\nPrevious Answers: ${JSON.stringify(previousAnswers)}` : ''}

Medical Conditions Database (sample of ${conditions.length} conditions):
${JSON.stringify(conditionsData.slice(0, 50))}
... and ${Math.max(0, conditions.length - 50)} more conditions

IMPORTANT INSTRUCTIONS:
1. Return ONLY a valid JSON array of matches (no markdown, no extra text)
2. Each match must have: conditionName (exact match from database), confidence (0-100), matchingSymptoms (array), reasoning
3. Order by confidence (highest first)
4. Include top 5-10 most relevant matches
5. Be conservative with confidence scores
6. Consider symptom severity and combinations

Return JSON array format:
[{"conditionName": "...", "confidence": 85, "matchingSymptoms": [...], "reasoning": "..."}]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant that analyzes symptoms and matches them to medical conditions. Always return valid JSON only, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content?.trim() || '[]';

    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.startsWith('```')) {
      jsonContent = content.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    const results = JSON.parse(jsonContent) as SymptomAnalysisResult[];

    // Filter to only include conditions that exist in our database
    const validResults = results.filter(r =>
      conditions.some(c =>
        c.condition_name.toLowerCase() === r.conditionName.toLowerCase()
      )
    );

    return validResults.slice(0, 10); // Return top 10
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
