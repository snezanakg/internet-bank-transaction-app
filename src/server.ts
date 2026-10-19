import express from "express";
import type { Request, Response } from "express";
import { pool } from "./db.js";
import { classifications } from "./data.js";
import type {  Classification } from "./data.js";

import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());



// --- 1. Root ---

app.get("/", (req: Request, res: Response) => {
  res.send("Internet Bank API is running");
});




// --- 2. Get all transactions (with date filter) ---


app.get("/transactions", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    let query = `
      SELECT
        id,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        recipient,
        amount::double precision AS amount,
        classification
      FROM transactions
    `;

    const values: string[] = [];

    if (typeof from === "string" && typeof to === "string") {
      query += " WHERE date BETWEEN $1 AND $2";
      values.push(from, to);
    }

    query += " ORDER BY id";

    const result = await pool.query(query, values);

    const transactions = result.rows.map((row) => {
      if (row.classification === null) {
        const { classification, ...transaction } = row;
        return transaction;
      }
      return row;
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      error: "Could not fetch transactions"
    });
  }
});





// --- GET / classifications ---


app.get("/transactions/:id", async (req: Request, res: Response) => {
  try {
    const transactionId = Number(req.params.id);

    if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        error: "Invalid transaction ID format. Must be a positive integer."
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        recipient,
        amount::double precision AS amount,
        classification
       FROM transactions
       WHERE id = $1`,
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    const { classification, ...transaction } = result.rows[0];

    return res.status(200).json(
      classification === null
        ? transaction
        : { ...transaction, classification }
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);

    return res.status(500).json({
      error: "Could not fetch transaction"
    });
  }
});



// --- 3. Get one transaction by ID --- 


app.get("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    return res.status(400).json({
      error: "Invalid transaction ID format. Must be a positive integer."
    });
  }

  try {
    const result = await pool.query(
      `SELECT
        id,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        recipient,
        amount::double precision AS amount,
        classification
       FROM transactions
       WHERE id = $1`,
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    const { classification, ...transaction } = result.rows[0];

    return res.status(200).json(
      classification === null
        ? transaction
        : { ...transaction, classification }
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);

    return res.status(500).json({
      error: "Could not fetch transaction"
    });
  }
});




// --- 4. POST - Create new transaction ---


app.post("/transactions", async (req: Request, res: Response) => {
  const { date, recipient, amount } = req.body ?? {};

  // Validate required fields
  if (
    typeof date !== "string" ||
    typeof recipient !== "string" ||
    !recipient.trim() ||
    typeof amount !== "number" ||
    !Number.isFinite(amount)
  ) {
    return res.status(400).json({
      error: "Valid date, recipient and amount are required."
    });
  }

  // Validate transaction date
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return res.status(400).json({
      error: "Date must be a valid date in YYYY-MM-DD format."
    });
  }

  // Keep existing classification logic
  let classification = "Unknown";

  if (amount < 0) {
    const found = classifications.find(
      (c: Classification) =>
        c.recipient.toLowerCase() === recipient.trim().toLowerCase()
    );

    if (found) {
      classification = found.classification;
    }
  } else {
    classification = "—";
  }

  try {
    // Save the transaction in PostgreSQL
    const result = await pool.query(
      `INSERT INTO transactions
        (date, recipient, amount, classification)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         TO_CHAR(date, 'YYYY-MM-DD') AS date,
         recipient,
         amount::double precision AS amount,
         classification`,
      [date, recipient.trim(), amount, classification]
    );

    return res.status(201).json({
      message: "Transaction added successfully!",
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating transaction:", error);

    return res.status(500).json({
      error: "Could not save transaction."
    });
  }
});




// --- 5. PUT - Update transaction ---


app.put("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    return res.status(400).json({
      error: "Invalid transaction ID."
    });
  }

  const { date, recipient, amount } = req.body ?? {};

  // Validate optional fields
  if (
    (date !== undefined && typeof date !== "string") ||
    (recipient !== undefined &&
      (typeof recipient !== "string" || !recipient.trim())) ||
    (amount !== undefined &&
      (typeof amount !== "number" || !Number.isFinite(amount)))
  ) {
    return res.status(400).json({
      error: "Invalid transaction data."
    });
  }

  if (date !== undefined) {
    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        error: "Invalid date. Use YYYY-MM-DD."
      });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET
         date = COALESCE($1::date, date),
         recipient = COALESCE($2::text, recipient),
         amount = COALESCE($3::numeric, amount)
       WHERE id = $4
       RETURNING
         id,
         TO_CHAR(date, 'YYYY-MM-DD') AS date,
         recipient,
         amount::double precision AS amount,
         classification`,
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

    return res.status(200).json({
      message: "Transaction updated successfully!",
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating transaction:", error);

    return res.status(500).json({
      error: "Could not update transaction."
    });
  }
});






// --- 6. DELETE - Remove transaction ---

app.delete("/transactions/:id", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
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


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});