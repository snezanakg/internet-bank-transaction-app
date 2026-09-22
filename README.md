# internet-bank-transaction-app

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



 