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



 



Date Filtering Decisions

Are the start and end dates included?
Yes, both the start and end dates are inclusive. We use standard string comparison operators (>= and <=) against the YYYY-MM-DD format, which means any transactions occurring precisely on the start or end date will be included in the results.   

What happens if the date is invalid?
Since we rely on standard alphabetical string comparison for YYYY-MM-DD formats, malformed strings might yield unpredictable or empty results. For simplicity and robustness within the scope of this project, we assume the user inputs dates in the correct YYYY-MM-DD format.   

What happens if the start date is after the end date?If the start date (from) is chronologically after the end date (to), no transactions can satisfy both conditions (>= from and <= to). Consequently, the API will return an empty list.   

What happens if there are no transactions in the interval?
he API returns an empty array ([]), and the terminal client catches this and displays a friendly message to the user.   




// feature/date-filtering
