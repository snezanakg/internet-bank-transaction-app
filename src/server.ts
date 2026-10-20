
import express from "express";
import type { Request, Response } from "express";

import { transactions } from "./data.js";
import type { Transaction } from "./data.js";

import fs from "fs";
import { z } from "zod";
import { pool } from "./db.js";
import { categories } from "./categories.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());


const transactionIdSchema = z.coerce.number().int().positive();
const transactionSchema =
  z.object({
    date: z.iso.date(),
    recipient: z.string().min(1, "Recipient is required"),
    amount: z.number().refine((value) => value !== 0, {
      message: "Amount cannot be zero",
    }),
  })
const transactionUpdateSchema = transactionSchema.partial();
const transactionsFilePath = new URL("../data/transactions.json", import.meta.url);

const dateQuerySchema = z.string().refine(isValidDate,
  {
    message: "Invalid date. Use YYYY-MM-DD",
  });
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
// Validate date format
function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  return (
    Number.isFinite(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

// SQL LEFT JOIN for transaction classifications
const transactionQuery = `
  SELECT
    t.id,
    TO_CHAR(t.date, 'YYYY-MM-DD') AS date,
    t.recipient,
    t.amount::double precision AS amount,
    CASE
      WHEN t.amount >= 0 THEN '—'
      ELSE COALESCE(rc.classification, 'Unknown')
    END AS classification
  FROM transactions AS t
  LEFT JOIN recipient_classifications AS rc
    ON LOWER(TRIM(t.recipient)) = LOWER(TRIM(rc.recipient))
`;

// Find a transaction with its classification
async function findTransactionById(id: number) {
  const result = await pool.query(
    `${transactionQuery} WHERE t.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

// 1. Root
app.get("/", (req: Request, res: Response) => {
  return res.send("Internet Bank API is running");
});

// 2. GET all transactions with optional date filter
app.get("/transactions", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const fromResult = from === undefined ? null :
      dateQuerySchema.safeParse(from);
    const toResult = to === undefined ? null :
      dateQuerySchema.safeParse(to);
    if (fromResult && !fromResult.success) {
      return res.status(400).json({
        error: "Invalid start date",
      });
    }
    if (toResult && !toResult.success) {
      return res.status(400).json({
        error: "Invalid end date",
      });
    }
    if (fromResult?.success && toResult?.success && fromResult.data > toResult.data
    ) {
      return res.status(400).json({
        error: "Start date cannot be after end date",
      });
    }



    let query = transactionQuery;
    const values: string[] = [];

    if (from !== undefined || to !== undefined) {
      if (
        typeof from !== "string" ||
        typeof to !== "string" ||
        !isValidDate(from) ||
        !isValidDate(to) ||
        from > to
      ) {
        return res.status(400).json({
          error: "Provide a valid date range in YYYY-MM-DD format."
        });
      }

      query += " WHERE t.date BETWEEN $1 AND $2";
      values.push(from, to);
    }

    query += " ORDER BY t.id";

    const result = await pool.query(query, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      error: "Could not fetch transactions"
    });
  }
});

// 3. GET fixed classification categories
app.get("/classifications", (req: Request, res: Response) => {
  return res.status(200).json(categories);
});

app.put("/transactions/:id", (req: Request, res: Response) => {

  const result = transactionUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues,
    });
  }

  const idResult = transactionIdSchema.safeParse(req.params.id);
  if (!idResult.success) {
    return res.status(400).json({
      error: "Invalid transaction ID",
    });
  }

  const transactionId = idResult.data;
  const transaction = transactions.find((t: Transaction) => t.id === transactionId);
  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found"
    });
  }
  transaction.date = result.data.date ?? transaction.date;
  transaction.recipient = result.data.recipient ?? transaction.recipient;
  transaction.amount = result.data.amount ?? transaction.amount;

  const isSaved = saveTransactions(transactions);
  if (!isSaved) {
    return res.status(500).json({ error: "Internal server error: Could not update transaction." });
  }

  return res.status(200).json({
    message: "Transaction updated successfully!",
    transaction
  });
});

// 5. POST - Create transaction
app.post("/transactions", async (req: Request, res: Response) => {
  const { date, recipient, amount } = req.body ?? {};

  if (
    typeof date !== "string" ||
    !isValidDate(date) ||
    typeof recipient !== "string" ||
    !recipient.trim() ||
    typeof amount !== "number" ||
    !Number.isFinite(amount)
  ) {
    return res.status(400).json({
      error: "Valid date, recipient and amount are required."
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (date, recipient, amount)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [date, recipient.trim(), amount]
    );

    const transactionId = result.rows[0].id;
    const transaction = await findTransactionById(transactionId);

    return res.status(201).json({
      message: "Transaction added successfully!",
      transaction
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      error: "Could not save transaction."
    });
  }
});

// 6. PUT - Update transaction
app.put("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (
    !Number.isSafeInteger(transactionId) ||
    transactionId <= 0
  ) {
    return res.status(400).json({
      error: "Invalid transaction ID."
    });
  }

  const { date, recipient, amount } = req.body ?? {};

  if (
    (date !== undefined &&
      (typeof date !== "string" || !isValidDate(date))) ||
    (recipient !== undefined &&
      (typeof recipient !== "string" || !recipient.trim())) ||
    (amount !== undefined &&
      (typeof amount !== "number" || !Number.isFinite(amount)))
  ) {
    return res.status(400).json({
      error: "Invalid transaction data."
    });
  }

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET
         date = COALESCE($1::date, date),
         recipient = COALESCE($2::text, recipient),
         amount = COALESCE($3::numeric, amount)
       WHERE id = $4
       RETURNING id`,
      [
        date ?? null,
        recipient?.trim() ?? null,
        amount ?? null,
        transactionId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    const transaction = await findTransactionById(transactionId);

    return res.status(200).json({
      message: "Transaction updated successfully!",
      transaction
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      error: "Could not update transaction."
    });
  }
});

// 4. GET one transaction by ID
app.get("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (
    !Number.isSafeInteger(transactionId) ||
    transactionId <= 0
  ) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a positive integer."
    });
  }

  try {
    const transaction = await findTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({
      error: "Could not fetch transaction"
    });
  }
});


// 7. DELETE transaction
app.delete("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (
    !Number.isSafeInteger(transactionId) ||
    transactionId <= 0
  ) {
    return res.status(400).json({
      error: "Invalid transaction ID."
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING id",
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      error: "Could not delete transaction."
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
