/*
  # Finance Tracker Database Schema

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key) - Unique identifier for each expense
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `amount` (decimal) - The expense amount
      - `category` (text) - Expense category (food, transport, entertainment, bills, shopping, health, other)
      - `description` (text) - Optional description of the expense
      - `date` (date) - Date of the expense
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `expenses` table
    - Add policy for users to read their own expenses
    - Add policy for users to insert their own expenses
    - Add policy for users to update their own expenses
    - Add policy for users to delete their own expenses

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on date for monthly summaries
    - Add composite index on user_id and date for optimized filtering
*/

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10, 2) NOT NULL CHECK (amount > 0),
  category text NOT NULL CHECK (category IN ('food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'other')),
  description text DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();