# Internet Bank API & CLI

## 1. What the application does

A secure and simple backend server built with Express and TypeScript, complete with an interactive terminal client (CLI) to manage bank transactions.


<!-- We started by deside how to do the api with the properties: date, recipient and amount.
simple like in the assignments example. We spoke about what is important for us as users if we would like to check the transactions and these three are the most important to know about. 
we want to know, when, where and how much.  -->

<!-- Then we continued with the data files classifications.json and transactions.json as a structure for the rest of the routes. -->

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
npm run cli 
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