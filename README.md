# Internet Bank API & CLI

## 1. What the application does

A secure and simple backend server built with Express and TypeScript, complete with an interactive terminal client (CLI) to manage bank transactions.


<!-- We started by deside how to do the api with the properties: date, recipient and amount.
simple like in the assignments example. We spoke about what is important for us as users if we would like to check the transactions and these three are the most important to know about. 
we want to know, when, where and how much.  -->

<!-- Then we continued with the data files classifications.json and transactions.json as a structure for the rest of the routes. -->










<!-- Create a Transaction

When creating a new transaction via POST /transactions, we have defined the following requirements: -->

<!-- Required Fields:
date: Must be provided as a string in YYYY-MM-DD format.

recipient: The name of the receiver/sender (string). This is mandatory because it is also used to automatically determine the transaction's category.

amount: The transaction value (number, can be positive or negative). -->



<!-- Automatic Fields (Handled by the backend):

id: Generated automatically by finding the highest existing ID and incrementing it by 1 (or starting at 1 if the list is empty).

classification: Automatically assigned by looking up the recipient against our classification database. If no match is found, it defaults to "Unknown". -->

<!-- Validation & Error Handling:
If any of the required fields (date, recipient, or amount) are missing from the request body, the API returns a 400 Bad Request status code along with an explanatory error message. -->



 



Date Filtering Decisions

Are the start and end dates included?
Yes, both the start and end dates are inclusive. We use standard string comparison operators (>= and <=) against the YYYY-MM-DD format, which means any transactions occurring precisely on the start or end date will be included in the results.   

What happens if the date is invalid?
Since we rely on standard alphabetical string comparison for YYYY-MM-DD formats, malformed strings might yield unpredictable or empty results. For simplicity and robustness within the scope of this project, we assume the user inputs dates in the correct YYYY-MM-DD format.   

What happens if the start date is after the end date?If the start date (from) is chronologically after the end date (to), no transactions can satisfy both conditions (>= from and <= to). Consequently, the API will return an empty list.   

What happens if there are no transactions in the interval?
The API returns an empty array ([]), and the terminal client catches this and displays a friendly message to the user.




// feature/date-filteri
### Tech Stack
* Backend: Node.js, Express, TypeScript

* Data Storage: JSON file (transactions.json)

* Terminal Client: @inquirer/prompts for interactive menus.

## 2. How to start the API
Clone the repository and install dependencies.
Type in the terminal:

npm install
### Start the server:

Type into the terminal:


 npm run dev / server.ts
## 3. How to start the terminal application
Open a NEW terminal and type in:

npm run cli / cli.ts



npm run dev 

## 3. How to start the terminal application
Open a NEW terminal and type in:

npm run cli 

feature/readme-updates
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

When running npm run cli, you are presented with a menu:

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
date, recipient, and amount can all be updated. If the recipient changes, the classification updates automatically.

**What happens when a transaction does not exist?**
If a requested ID does not exist on GET, PUT, or DELETE, the API responds with HTTP status 404 Not Found.

**Which HTTP status codes did you choose?**
* **200 OK**: Successful retrieval, update, or deletion.

* **201 Created**: Successful creation of a transaction.

* **400 Bad Request**: Missing required fields or invalid ID format / invalid dates.

* **404 Not Found**: Transaction ID does not exist.


Which HTTP status codes did you choose?


* **500 Internal Server Error**: File system writing errors when saving to transactions.json.

