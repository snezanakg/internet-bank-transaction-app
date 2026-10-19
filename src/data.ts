import { readFileSync } from "node:fs";

// Transaction type used across the application
export type Transaction = {
  id: number;
  date: string;
  recipient: string;
  amount: number;
  classification?: string;
};

// Original transaction data retained for migration
const transactionsFile = new URL(
  "../data/transactions.json",
  import.meta.url
);

export const transactions: Transaction[] = JSON.parse(
  readFileSync(transactionsFile, "utf-8")
);
