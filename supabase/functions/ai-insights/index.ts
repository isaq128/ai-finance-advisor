import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Expense {
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface RequestPayload {
  expenses: Expense[];
  openRouterApiKey: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { expenses, openRouterApiKey }: RequestPayload = await req.json();

    if (!expenses || expenses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No expenses provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!openRouterApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenRouter API key is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalSpending) * 100).toFixed(1),
      }));

    const prompt = `You are a financial advisor. Analyze spending data and provide 3-5 actionable money-saving tips.\n\nTotal: $${totalSpending.toFixed(2)}\nTransactions: ${expenses.length}\n\nCategories:\n${sortedCategories.map(cat => `- ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage}%)`).join('\n')}\n\nProvide specific advice based on highest spending categories.`;

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate insights" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const aiResponse = await openRouterResponse.json();
    const insights = aiResponse.choices[0]?.message?.content || "Unable to generate insights.";

    return new Response(
      JSON.stringify({
        insights,
        summary: {
          totalSpending,
          transactionCount: expenses.length,
          topCategory: sortedCategories[0],
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});