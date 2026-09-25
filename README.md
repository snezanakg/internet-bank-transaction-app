# Internet Bank API & CLI
 
## 1. What the application does
 
 
### Tech Stack
* Backend: Node.js, Express, TypeScript
 
* Data Storage: JSON file (transactions.json)
 
* Terminal Client: @inquirer/prompts for interactive menus.
 
## 2. How to start the API
Clone the repository and install dependencies.
Type in the terminal:
```
npm install
```
### Start the server:
 
Type into the terminal:
 
```
npm run dev 
```
## 3. How to start the terminal application
Open a NEW terminal and type in:
 
```
npx tsx src/cli.ts
```
## 4. API Endpoints Documentation
 
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get one transaction |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction
| DELETE | `/transactions/:id` | Delete transaction |
| GET | `/classifications` | Get classifications |
 
## 5. How to use the terminal application
 
When running npx tsx src/cli.ts, you are presented with a menu:
 
1. **View transactions** - Lists all stored transactions.
 
2. **View one transaction** - Shows details for a specific ID.
 
3. **Add transaction** - Prompts for date, recipient, and amount, then saves it via the API.
 
4. **Update transaction** - Modifies an existing transaction.
 
5. **Delete transaction** - Removes a transaction by ID.
 
6. **Filter transactions by date** - Shows transactions within a specific date range.
 
7. **Exit** - Closes the application.
 
 
## 6. Important Decisions
 
Explain decisions you made when the requirements were unclear.
For example: <br>
 
**Are start/end dates included?**
 
Yes, both the start and end dates are inclusive. The filtering logic uses >= and <=, meaning any transactions occurring precisely on the start or end date will be included in the results.
 
**What happens with invalid dates?**
 
The terminal client validates the input format using Date.parse(). If an invalid date format (anything other than YYYY-MM-DD) is entered, the application prints an error message ("Invalid date. Please use YYYY-MM-DD.") and returns to the main menu without crashing.
 
**What happens when there is no classification?**
Outgoing transactions (negative amounts) are matched against classifications.json. If no match is found, the category defaults to "Unknown". Positive amounts (income) do not receive a classification.
 
**Which fields are required when creating a transaction?**
date (Format: YYYY-MM-DD), recipient (string), and amount (number). An id is automatically generated.
 
**Which fields can be updated?**
date, recipient, and amount can all be updated.
 
**What happens when a transaction does not exist?**
If a requested ID does not exist on GET, PUT, or DELETE, the API responds with HTTP status 404 Not Found.
 
**Which HTTP status codes did you choose?**
* **200 OK**: Successful retrieval, update, or deletion.
 
* **201 Created**: Successful creation of a transaction.
 
* **400 Bad Request**: Missing required fields or invalid ID format.
 
* **404 Not Found**: Transaction ID does not exist.
 
* **500 Internal Server Error**: File system writing errors when saving to transactions.json.


