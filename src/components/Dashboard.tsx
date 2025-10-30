import { useState, useEffect } from 'react';
import { supabase, Expense } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AddExpenseForm } from './AddExpenseForm';
import { ExpenseList } from './ExpenseList';
import { MonthlySummary } from './MonthlySummary';
import { AIInsights } from './AIInsights';
import { Plus, LogOut, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'summary' | 'insights'>('expenses');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
    } else {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full">
                <span className="text-xl text-white font-bold">$</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Finance Tracker</h1>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Expense</span>
                </button>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'expenses'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Expenses
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'summary'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <TrendingUp size={16} />
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === 'insights'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  AI Insights
                </button>
              </div>

              {activeTab === 'expenses' && (
                <ExpenseList expenses={expenses} onDelete={handleDelete} />
              )}
              {activeTab === 'summary' && <MonthlySummary expenses={expenses} />}
              {activeTab === 'insights' && <AIInsights expenses={expenses} />}
            </div>
          </div>

          <div className="lg:w-80 space-y-6">
            <div className="lg:sticky lg:top-24">
              <MonthlySummary expenses={expenses} />
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddExpenseForm
          onClose={() => setShowAddForm(false)}
          onSuccess={loadExpenses}
        />
      )}
    </div>
  );
}
