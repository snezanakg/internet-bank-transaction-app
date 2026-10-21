# Internet Bank API & CLI (Sprint 2)
 
## 1. What the application does
A backend banking application built with Express, TypeScript, and **PostgreSQL**.

The application allows users to manage bank transactions through a REST API and an interactive terminal application (CLI).
Data is persistently stored in a relational PostgreSQL database running in Docker.

Users can:
- View all transactions (with their database classifications via JOIN)
- View one transaction by ID
- Add transactions
- Update transactions
- Delete transactions
- Filter transactions by date
- View classifications
 
 
### Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (hosted in Docker with persistent volume)
- **Validation:** Zod (for request body, params, and queries)
- **Terminal Client:** `@inquirer/prompts` for interactive menus
- **Code Quality:** ESLint, TypeScript compiler (`tsc`)
 
## 2. Prerequisites & Setup

Make sure you have **Node.js** and **Docker** installed on your computer.

#### 1, Clone the repository and install dependencies.
Type in the terminal:
```
npm install
```

#### 2, Create your environment variables file based on the example:
```
cp .env.example .env
```
(Adjust the values in .env if needed, e.g., database port or credentials).


#### 3, Start the PostgreSQL database using Docker Compose:
```
docker compose up -d
```

## 3. How to Start the API

Start the API Server:
 
```
npm run dev 
```
## 4. How to start the terminal application
Open a NEW terminal and type in:
 
```
npx tsx src/cli.ts
```
## 5. API Endpoints Documentation
 
| Method | Endpoint | Description | Zod Validation |
| :--- | :--- | :--- | :--- |
| GET | `/transactions` | Get all transactions | Query params (`startDate`, `endDate`) |
| GET | `/transactions/:id` | Get one transaction | Route param (`id`) |
| POST | `/transactions` | Create transaction | Request body (`date`, `recipient`, `amount`) |
| PUT | `/transactions/:id` | Update transaction | Route param (`id`) & Request body |
| DELETE | `/transactions/:id` | Delete transaction | Route param (`id`) |
| GET | `/classifications` | Get classifications | None |
 
## 6. How to use the terminal application
 
When running npx tsx src/cli.ts, you are presented with an interactive menu:
 
1. **View transactions** - Lists all stored transactions fetched from PostgreSQL.
 
2. **View one transaction** - Shows details for a specific ID.
 
3. **Add transaction** - Prompts for date, recipient, and amount, validates input and saves it via the API.
 
4. **Update transaction** - Modifies an existing transaction.
 
5. **Delete transaction** - Removes a transaction by ID.
 
6. **Filter transactions by date** - Shows transactions within a specific validated date range.
 
7. **Exit** - Closes the application.
 
 
## 7. Important Decisions & Technical Choices

### How is data stored?
Data is no longer stored in local JSON files. Instead, transactions and classification mappings are stored in relational PostgreSQL tables inside a Docker container. A named volume ensures data persists even if the container is restarted or stopped.

### How does classification work?
Outgoing transactions (negative amounts) are matched against the classification table using a SQL JOIN, categorizing them into groups (Household, Transport, Food, Entertainment, Unknown). Positive amounts (income) do not receive a classification.

### How is input validated and secured?

- **Zod:** Every incoming request body, route parameter, and query parameter is strictly validated using Zod schemas. Invalid input immediately returns an HTTP 400 Bad Request with a descriptive error message.

- **Security:** All database queries involving user input use parameterized queries ($1, $2, etc.) via the pg package to completely prevent SQL injection vulnerabilities.

### Code Quality Checks:
Before pushing or merging code, you can verify that everything passes linting and type-checking by running:
```
npm run lint
npm run typecheck

```
 
**HTTP Status Codes Used:**
* **200 OK**: Successful retrieval, update, or deletion.
 
* **201 Created**: Successful creation of a transaction.
 
* **400 Bad Request**: Validation failure (Zod)
 or invalid input format. 
* **404 Not Found**: Resource ID does not exist in the database.
 
* **500 Internal Server Error**: Unexpected database or server errors.


