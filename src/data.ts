import { readFileSync } from "node:fs";

export type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  classification: string;
};

export type Classification = {
  id: number;
  name: string;
};

const transactionsFile = new URL(
  "../data/transactions.json",
  import.meta.url
);

const classificationsFile = new URL(
  "../data/classifications.json",
  import.meta.url
);

export const transactions: Transaction[] = JSON.parse(
  readFileSync(transactionsFile, "utf-8")
);

export const classifications: Classification[] = JSON.parse(
  readFileSync(classificationsFile, "utf-8")
);