# AI Symptom Checker Setup Guide

## Overview

The AI Symptom Checker is an enhanced feature that uses OpenAI's GPT models to analyze user-described symptoms and match them to conditions in your medical database. It provides an interactive, WebMD-style experience with:

- Natural language symptom input
- AI-powered symptom extraction and analysis
- Intelligent condition matching with confidence scores
- Follow-up questions for refined diagnosis
- Comprehensive condition details with treatments, causes, and remedies

## Prerequisites

1. Node.js installed
2. OpenAI API account and API key
3. Existing medical database (`medical_conditions_complete_database_FIXED.json`)

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy your API key (it starts with `sk-...`)

### 2. Configure Environment Variables

Edit the `.env` file in the project root:

```bash
VITE_DID_CLIENT_KEY="your_existing_key"
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Install Dependencies

The OpenAI SDK should already be installed. If not, run:

```bash
npm install openai
```

### 4. Start the Development Server

```bash
npm run dev
```

## Features

### 1. AI Symptom Checker Tab

- **Natural Language Input**: Users describe symptoms in plain English
- **Symptom Extraction**: AI extracts key symptoms from the description
- **Smart Matching**: AI analyzes symptoms against your 2,498 condition database
- **Confidence Scoring**: Each match includes a confidence percentage (0-100%)
- **Reasoning**: AI explains why conditions were matched
- **Follow-up Questions**: Interactive questions to refine the diagnosis

### 2. Traditional Disease Search Tab

- Search by condition name
- Filter through the complete medical database
- Quick access to known conditions

## API Usage & Costs

### Models Used

- **Primary**: `gpt-4o-mini` - Cost-effective for analysis
- **Purpose**: Symptom analysis, extraction, and follow-up questions

### Estimated Costs (as of 2024)

- Cost per symptom analysis: ~$0.01-0.03
- Most queries stay under 2,000 tokens
- Typical user session: 2-3 API calls (~$0.03-0.09)

### Cost Optimization Tips

1. **Use gpt-4o-mini**: Already configured for best cost/performance
2. **Cache Results**: Consider implementing caching for common symptoms
3. **Set Usage Limits**: Configure API key limits in OpenAI dashboard
4. **Monitor Usage**: Track API usage in OpenAI dashboard

## Architecture

### File Structure

```
src/
├── components/
│   ├── SymptomChecker.tsx          # Main symptom checker UI
│   ├── DiseaseSearch.tsx            # Traditional search
│   └── EnhancedHealthSearch.tsx     # Tab wrapper component
├── services/
│   └── symptomAnalyzer.ts           # OpenAI integration service
├── data/
│   └── medical_conditions_complete_database_FIXED.json
└── pages/
    └── Services.tsx                  # Uses EnhancedHealthSearch
```

### How It Works

1. **User Input**: User describes symptoms in natural language
2. **Symptom Extraction**: AI extracts discrete symptoms
3. **Database Query**: Loads relevant conditions from JSON
4. **AI Analysis**: GPT-4o-mini analyzes symptoms vs. conditions
5. **Matching**: Returns ranked list with confidence scores
6. **Follow-up**: Optionally generates clarifying questions
7. **Results**: Displays matched conditions with full details

## Security Considerations

### Current Implementation

- **Browser-side API Calls**: Uses `dangerouslyAllowBrowser: true`
- **Exposed API Key**: API key is in client-side code

### Production Recommendations

⚠️ **For production, implement a backend proxy:**

1. Create a backend API endpoint (Node.js/Express, Python/Flask, etc.)
2. Store OpenAI API key on the server (environment variables)
3. Client calls your backend
4. Backend calls OpenAI API
5. Backend returns results to client

Example backend endpoint:

```javascript
// backend/routes/symptom-analysis.js
app.post('/api/analyze-symptoms', async (req, res) => {
  const { symptoms, conditions } = req.body;

  // Call OpenAI with server-side API key
  const result = await openai.chat.completions.create({
    // ... configuration
  });

  res.json(result);
});
```

Then update `src/services/symptomAnalyzer.ts` to call your backend instead of OpenAI directly.

## Troubleshooting

### API Key Issues

**Error: "Invalid API key"**
- Verify the key in `.env` starts with `sk-`
- No quotes or extra spaces around the key
- Restart the dev server after changing `.env`

**Error: "API key not found"**
- Check `.env` file exists in project root
- Variable name is `VITE_OPENAI_API_KEY` (with VITE_ prefix)
- Restart dev server

### Rate Limiting

If you hit rate limits:
- Check usage in OpenAI dashboard
- Upgrade your OpenAI plan
- Implement request throttling

### JSON Parsing Errors

The AI service handles markdown code blocks automatically. If you see parsing errors:
- Check OpenAI API status
- Verify model name is correct (`gpt-4o-mini`)
- Check logs for the raw response

## Customization

### Adjust Confidence Thresholds

In `SymptomChecker.tsx`, modify the confidence score display:

```typescript
const confidenceColor =
  result.confidence >= 70 ? 'green'   // High confidence
  : result.confidence >= 50 ? 'yellow' // Medium confidence
  : 'orange';                          // Low confidence
```

### Modify AI Temperature

In `symptomAnalyzer.ts`, adjust creativity:

```typescript
temperature: 0.3, // Lower = more consistent, Higher = more creative
```

### Change Result Count

```typescript
return validResults.slice(0, 10); // Return top 10 (adjust as needed)
```

## Medical Disclaimer

The disclaimer is already included in the UI. Ensure it's prominently displayed:

> This AI symptom checker is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Support

For issues:
1. Check the browser console for errors
2. Verify API key configuration
3. Check OpenAI API status page
4. Review the code comments in `symptomAnalyzer.ts`

## Future Enhancements

Consider adding:
- [ ] User symptom history
- [ ] Export results to PDF
- [ ] Multi-language support
- [ ] Integration with telemedicine booking
- [ ] Severity triage (emergency vs. non-urgent)
- [ ] Symptom duration tracking
- [ ] Body part visual selector
- [ ] Analytics dashboard for common queries

---

**Ready to use!** Navigate to the Services page and try the AI Symptom Checker tab.
