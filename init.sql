CREATE TABLE IF NOT EXISTS classifications (
    recipient VARCHAR(255) PRIMARY KEY,
    classification VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);


INSERT INTO classifications (recipient, classification) VALUES
('ICA', 'Food'),
('SL', 'Transport'),
('Employer', 'Income')
ON CONFLICT (recipient) DO NOTHING;


INSERT INTO transactions (date, recipient, amount) VALUES
('2026-09-01', 'ICA', -350),
('2026-09-01', 'IKEA', -2000), 
('2026-10-01', 'ICA', 200);


/* 
  Fetches all transactions with their classification based on recipient. 
  If a recipient missing a classification (NULL), it defaults to '—'. 
*/
SELECT 
    t.id, 
    t.date, 
    t.recipient, 
    t.amount, 
    COALESCE(c.classification, '—') AS classification
FROM transactions t
LEFT JOIN classifications c ON t.recipient = c.recipient;


SELECT * FROM classifications;


SELECT * FROM transactions;