
import { readFileSync } from "node:fs";
import { pool } from "./db.js";
import type { Transaction } from "./data.js";

const file = new URL("../data/transactions.json", import.meta.url);

const transactions: Transaction[] = JSON.parse(
  readFileSync(file, "utf-8")
);

async function importTransactions() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const transaction of transactions) {
      await client.query(
        `INSERT INTO transactions
          (id, date, recipient, amount, classification)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [
          transaction.id,
          transaction.date,
          transaction.recipient,
          transaction.amount,
          transaction.classification ?? null,
        ]
      );
    }

    await client.query(
      `SELECT setval(
        pg_get_serial_sequence('transactions', 'id'),
        (SELECT MAX(id) FROM transactions)
      )`
    );

    await client.query("COMMIT");
    console.log("Transactions imported successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Import failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

importTransactions().catch((error) => {
  console.error("Database connection failed:", error);
  process.exitCode = 1;
  pool.end();
});
