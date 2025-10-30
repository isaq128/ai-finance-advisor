import { useState } from 'react';
import { Expense } from '../lib/supabase';
import { Sparkles, Loader } from 'lucide-react';

interface AIInsightsProps {
  expenses: Expense[];
}

export function AIInsights({ expenses }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');
    setInsights('');

    try {
      const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!openRouterApiKey) {
        setError('OpenRouter API key not configured');
        setLoading(false);
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = `${supabaseUrl}/functions/v1/ai-insights`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expenses: expenses.map(exp => ({
            amount: Number(exp.amount),
            category: exp.category,
            date: exp.date,
            description: exp.description,
          })),
          openRouterApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-emerald-400" size={24} />
        <h3 className="text-xl font-bold">AI Insights</h3>
      </div>

      {!insights && !loading && (
        <div className="text-center py-8">
          <p className="text-slate-300 mb-4">
            Get personalized money-saving advice based on your spending patterns
          </p>
          <button
            onClick={generateInsights}
            disabled={expenses.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
            Generate Insights
          </button>
          {expenses.length === 0 && (
            <p className="text-sm text-slate-400 mt-2">Add some expenses first</p>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <Loader className="animate-spin mx-auto text-emerald-400 mb-3" size={32} />
          <p className="text-slate-300">Analyzing your spending patterns...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {insights && (
        <div className="space-y-4">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4">
            <p className="text-slate-100 whitespace-pre-line leading-relaxed">{insights}</p>
          </div>
          <button
            onClick={generateInsights}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition text-sm"
          >
            Regenerate insights
          </button>
        </div>
      )}
    </div>
  );
}
