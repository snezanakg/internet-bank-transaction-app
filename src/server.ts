import express from "express";
import { transactions } from "./data.js";

const app = express();
const port = 3000;

app.use(express.json());

// Issue 1 - View all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});