import express from "express";
import type { Request, Response } from "express";

import { transactions, classifications } from "./data.js";
import type { Transaction, Classification } from "./data.js";

import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());

const transactionsFilePath = new URL("../data/transactions.json", import.meta.url);

// Try-catch tillagd här kring fs.writeFileSync
const saveTransactions = (allTransactions: Transaction[]): boolean => {
  try {
    fs.writeFileSync(transactionsFilePath, JSON.stringify(allTransactions, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving transactions to file:", error);
    return false;
  }
};

// --- 1. Root ---

app.get("/", (req: Request, res: Response) => {
  res.send("Internet Bank API is running");
});




// --- 2. Get all transactions (with date filter) ---

app.get("/transactions", (req: Request, res: Response) => {
  let result = transactions;
  const { from, to } = req.query;


  if (typeof from === "string" && typeof to === "string") {
    result = transactions.filter((t) => {
      return t.date >= from && t.date <= to;
    });
  }
  return res.status(200).json(result);
});





// --- GET / classifications ---

app.get("/classifications", (req: Request, res: Response) => {
  return res.status(200).json(classifications);
});




// --- 3. Get one transaction by ID --- 

app.get("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (isNaN(transactionId)) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a number."
    });
  }

  const transaction = transactions.find((t: Transaction) => t.id === transactionId);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.status(200).json(transaction);
});





// --- 4. POST - Create new transaction ---

app.post('/transactions', (req: Request, res: Response) => {
  const { date, recipient, amount } = req.body;

  if (!date || !recipient || amount === undefined) {
    return res.status(400).json({ error: "Date, recipient and amount are required." });
  }

  const newId = transactions.length > 0 ? Math.max(...transactions.map((t: Transaction) => t.id)) + 1 : 1;

  let classification = "Unknown";

  if (amount < 0) {
    const found = classifications.find(
      (c: Classification) => c.recipient.toLowerCase() === recipient.toLowerCase()
    );
    if (found) {
      classification = found.classification;
    }
  } else {
    classification = "—";
  }

  const newTransaction: Transaction = {
    id: newId,
    date,
    recipient,
    amount,
    classification
  };

  transactions.push(newTransaction);

  const isSaved = saveTransactions(transactions);
  if (!isSaved) {
    return res.status(500).json({ error: "Internal server error: Could not save transaction." });
  }

  return res.status(201).json({ message: "Transaction added successfully!", transaction: newTransaction });
});





// --- 5. PUT - Update transaction ---

app.put("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (isNaN(transactionId)) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a number."
    });
  }

  const transaction = transactions.find((t: Transaction) => t.id === transactionId);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  transaction.date = req.body.date || transaction.date;
  transaction.recipient = req.body.recipient || transaction.recipient;
  transaction.amount = req.body.amount ?? transaction.amount;

  const isSaved = saveTransactions(transactions);
  if (!isSaved) {
    return res.status(500).json({ error: "Internal server error: Could not update transaction." });
  }

  return res.status(200).json({
    message: "Transaction updated successfully!",
    transaction
  });
});





// --- 6. DELETE - Remove transaction ---

app.delete("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (isNaN(transactionId)) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a number."
    });
  }

  const index = transactions.findIndex((t: Transaction) => t.id === transactionId);
  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  transactions.splice(index, 1);

  const isSaved = saveTransactions(transactions);
  if (!isSaved) {
    return res.status(500).json({ error: "Internal server error: Could not delete transaction." });
  }

  return res.status(200).json({
    message: "Transaction deleted successfully!"
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});