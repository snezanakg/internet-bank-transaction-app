import express from "express";
import { transactions } from "./data.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Internet Bank API is running");
});

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});