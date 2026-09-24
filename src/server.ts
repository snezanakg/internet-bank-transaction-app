
import express from "express";
import type { Request, Response } from "express";

import { transactions, classifications } from "./data.js";
import type { Transaction, Classification } from "./data.js";

import fs from "fs";
import path from "path";





const app = express();
const port = 3000;


app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.send("Internet Bank API is running");
});



app.get("/transactions", (req: Request, res: Response) => {
  res.json(transactions);
});


app.put("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id as string);

// Get all transactions with date filtering
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

// Get one transaction
app.get("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

if (isNaN(transactionId)) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a number."
    });
  }

  const transaction = transactions.find(
    (transaction) => transaction.id === transactionId
  );


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
  transaction.amount = req.body.amount || transaction.amount;
  res.json(transaction);

  saveTransactions(transactions);
  return res.status(200).json({
    message: "Transaction updated successfully!",
    transaction
  });

  return res.status(200).json(transaction);

});


app.delete("/transactions/:id", (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id as string);

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

  saveTransactions(transactions);

  return res.status(200).json({
    message: "Transaction deleted successfully!"
  });
});


const transactionsFilePath = path.join(__dirname, "../data/transactions.json");

const saveTransactions = (allTransactions: Transaction[]) => {
  fs.writeFileSync(transactionsFilePath, JSON.stringify(allTransactions, null, 2), "utf-8");
};


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





