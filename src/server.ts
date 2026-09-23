
import express from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";


import { transactions, classifications } from "./data.js";
import type { Transaction, Classification } from "./data.js";

const app = express();
const port = 3000;

app.use(express.json());

const transactionsFile = new URL(
  "../data/transactions.json",
  import.meta.url
);

const saveTransactions = (allTransactions: Transaction[]) => {
  fs.writeFileSync(
    transactionsFile,
    JSON.stringify(allTransactions, null, 2),
    "utf-8"
  );
};

// Check that the API is running
app.get("/", (req, res) => {
  res.send("Internet Bank API is running");
});

// Get all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// Get one transaction
app.get("/transactions/:id", (req, res) => {
  const transactionId = Number(req.params.id);

  const transaction = transactions.find(
    (transaction) => transaction.id === transactionId
  );

  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found"
    });
  }

  res.json(transaction);
});

// Create transaction
app.post("/transactions", (req: Request, res: Response) => {
  const { date, recipient, amount } = req.body;

  if (!date || !recipient || amount === undefined) {
    return res.status(400).json({
      error: "Date, recipient and amount are required."
    });
  }

  const newId =
    transactions.length > 0
      ? Math.max(...transactions.map((transaction) => transaction.id)) + 1
      : 1;

  const foundClassification = classifications.find(
    (classification: Classification) =>
      classification.recipient.toLowerCase() ===
      recipient.toLowerCase()
  );

  const classification =
    foundClassification?.classification ?? "Unknown";

  const newTransaction: Transaction = {
    id: newId,
    date,
    recipient,
    amount,
    classification
  };

  transactions.push(newTransaction);

  saveTransactions(transactions);

  res.status(201).json({
    message: "Transaction added successfully!",
    transaction: newTransaction
  });
});

// Update transaction
app.put("/transactions/:id", (req, res) => {
  console.log("PUT ROUTE HIT!");
  const transactionId = parseInt(req.params.id!);
  const transaction = transactions.find((t) => t.id === transactionId);
  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found"
    });
  }

  transaction.date = req.body.date ?? transaction.date;
  transaction.recipient =
    req.body.recipient ?? transaction.recipient;
  transaction.amount =
    req.body.amount ?? transaction.amount;

  saveTransactions(transactions);

  res.json(transaction);
});

// Delete transaction
app.delete("/transactions/:id", (req, res) => {
  const transactionId = Number(req.params.id);

  const index = transactions.findIndex(
    (transaction) => transaction.id === transactionId
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Transaction not found"
    });
  }

  transactions.splice(index, 1);

  saveTransactions(transactions);

  res.json({
    message: "Transaction deleted successfully!"
  });
});


// Get all classifications
app.get("/classifications", (req, res) => {
  res.json(classifications);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.json());

app.post('/transactions', (req: Request, res: Response) => {
  const { date, recipient, amount } = req.body;

  if (!date || !recipient || !amount) {
    return res.status(400).json({ error: "Date, recipient and amount are required." });
  }

  const currentTransactions = transactions;

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
    date: req.body.date,
    recipient: req.body.recipient,
    amount: req.body.amount,
    classification: classification
  };

  currentTransactions.push(newTransaction);
  saveTransactions(currentTransactions);
  res.status(201).json({ message: "Transaction added successfully!", transaction: newTransaction });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





