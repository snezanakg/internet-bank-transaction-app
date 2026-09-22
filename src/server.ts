
import express from "express";
import { transactions } from "./data.js

import express from "express";

import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { transactions, classifications, Transaction, Classification } from "./data";


import transactions from "../data/transactions.json" with { type: "json" };


const app = express();
const port = 3000;


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Internet Bank API is running");
});

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.get("/classifications", (req, res) => {
    res.json(classifications);
});

app.put("/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id!);
  const transaction = transactions.find((t) => t.id === transactionId);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  transaction.date = req.body.date || transaction.date;
  transaction.recipient = req.body.recipient || transaction.recipient;
  transaction.amount = req.body.amount || transaction.amount;
  res.json(transaction);
});

app.delete("/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id!);
  const index = transactions.findIndex((t) => t.id === transactionId);
  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  transactions.splice(index, 1);

  res.json({ message: "Transaction deleted successfully!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



app.use(express.json());


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





