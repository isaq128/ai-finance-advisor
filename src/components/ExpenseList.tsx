import { Expense } from '../lib/supabase';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryConfig = {
  food: { label: 'Food & Dining', emoji: '🍔', color: 'bg-orange-100 text-orange-700' },
  transport: { label: 'Transport', emoji: '🚗', color: 'bg-blue-100 text-blue-700' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'bg-purple-100 text-purple-700' },
  bills: { label: 'Bills & Utilities', emoji: '💡', color: 'bg-yellow-100 text-yellow-700' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'bg-pink-100 text-pink-700' },
  health: { label: 'Health & Fitness', emoji: '💊', color: 'bg-green-100 text-green-700' },
  other: { label: 'Other', emoji: '📌', color: 'bg-slate-100 text-slate-700' },
};

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No expenses yet</p>
        <p className="text-slate-400 text-sm mt-2">Click "Add Expense" to get started</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const config = categoryConfig[expense.category];
        return (
          <div
            key={expense.id}
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                    {config.emoji} {config.label}
                  </span>
                  <span className="text-sm text-slate-500">{formatDate(expense.date)}</span>
                </div>
                {expense.description && (
                  <p className="text-slate-600 text-sm">{expense.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-xl font-bold text-slate-800">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                  aria-label="Delete expense"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
