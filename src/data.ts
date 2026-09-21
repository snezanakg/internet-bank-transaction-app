export type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  classification: string;
};

export const transactions: Transaction[] = [
  {
    id: 1,
    date: "2026-09-20",
    description: "Grocery store",
    amount: -450,
    classification: "Food"
  },
  {
    id: 2,
    date: "2026-09-19",
    description: "Salary",
    amount: 25000,
    classification: "Income"
  },
  {
    id: 3,
    date: "2026-09-18",
    description: "Bus ticket",
    amount: -35,
    classification: "Transport"
  }
];