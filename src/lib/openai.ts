import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export default openai;

export async function categorizeExpense(description: string, amount: number): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that categorizes expenses. Respond with only the category name."
      },
      {
        role: "user",
        content: `Categorize this expense: ${description} for $${amount}. Respond with one of these categories only: Food, Transportation, Shopping, Entertainment, Bills, Healthcare, Education, Other`
      }
    ],
    temperature: 0.3,
    max_tokens: 10,
  });

  return response.choices[0].message.content?.trim() || 'Other';
}

export async function generateInsights(expenses: Array<{ amount: number; category: string; date: string; description: string }>) {
  const expensesSummary = expenses.map(e => `${e.description}: $${e.amount} (${e.category}) on ${e.date}`).join('\n');

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a financial advisor analyzing expense patterns. Provide concise, actionable insights."
      },
      {
        role: "user",
        content: `Analyze these expenses and provide 3 key insights and recommendations:\n${expensesSummary}`
      }
    ],
    temperature: 0.7,
    max_tokens: 250,
  });

  return response.choices[0].message.content?.trim() || 'No insights available.';
} 