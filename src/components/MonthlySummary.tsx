import { Expense } from '../lib/supabase';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlySummaryProps {
  expenses: Expense[];
}

const categoryConfig = {
  food: { label: 'Food & Dining', emoji: '🍔', color: 'bg-orange-500' },
  transport: { label: 'Transport', emoji: '🚗', color: 'bg-blue-500' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'bg-purple-500' },
  bills: { label: 'Bills & Utilities', emoji: '💡', color: 'bg-yellow-500' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'bg-pink-500' },
  health: { label: 'Health & Fitness', emoji: '💊', color: 'bg-green-500' },
  other: { label: 'Other', emoji: '📌', color: 'bg-slate-500' },
};

export function MonthlySummary({ expenses }: MonthlySummaryProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === previousMonth &&
      expenseDate.getFullYear() === previousYear
    );
  });

  const totalCurrent = currentMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalPrevious = previousMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const percentageChange = totalPrevious > 0
    ? ((totalCurrent - totalPrevious) / totalPrevious) * 100
    : 0;

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, total]) => ({
      category: category as keyof typeof categoryConfig,
      total,
      percentage: totalCurrent > 0 ? (total / totalCurrent) * 100 : 0,
    }));

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-lg font-medium opacity-90">{monthName}</h3>
          {percentageChange !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              percentageChange > 0 ? 'text-red-200' : 'text-emerald-200'
            }`}>
              {percentageChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(percentageChange).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="text-4xl font-bold">${totalCurrent.toFixed(2)}</div>
        <p className="text-sm opacity-75 mt-1">Total spending</p>
      </div>

      {sortedCategories.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-semibold text-slate-800 mb-4">Spending by Category</h4>
          <div className="space-y-4">
            {sortedCategories.map(({ category, total, percentage }) => {
              const config = categoryConfig[category];
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {config.emoji} {config.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      ${total.toFixed(2)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${config.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-slate-800">{currentMonthExpenses.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Average</p>
          <p className="text-2xl font-bold text-slate-800">
            ${currentMonthExpenses.length > 0
              ? (totalCurrent / currentMonthExpenses.length).toFixed(2)
              : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}
