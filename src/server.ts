import express from "express";
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





