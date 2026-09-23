import express from "express";
import type { Request, Response } from "express";
import { transactions } from "./data.js";

const app = express();
const port = 3000;

app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.send("Internet Bank API is running");
});


app.get("/transactions", (req: Request, res: Response) => {
  res.json(transactions);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});