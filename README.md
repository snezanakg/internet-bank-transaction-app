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

We descided to have these options in the CLI:

1. View transactions
2. View one transaction
3. Delete transaction
4. Add Transaction
5. Update transaction
6. Filter transactions by date
7. Exit
## 6. Important Decisions

Explain decisions you made when the requirements were unclear.
For example: <br>

Are start/end dates included?

What happens with invalid dates?

What happens when there is no classification?

Which fields are required when creating a transaction?

Which fields can be updated?

What happens when a transaction does not exist?

Which HTTP status codes did you choose?

