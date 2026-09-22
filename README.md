# internet-bank-transaction-app

<!-- We started by deside how to do the api with the properties: date, recipient and amount.
simple like in the assignments example. We spoke about what is important for us as users if we would like to check the transactions and these three are the most important to know about. 
we want to know, when, where and how much.  -->

<!-- Then we continued with the data files classifications.json and transactions.json as a structure for the rest of the routes. -->





<!-- 


Date Filtering Decisions

Are the start and end dates included?
Yes, both the start and end dates are inclusive. We use standard string comparison operators (>= and <=) against the YYYY-MM-DD format, which means any transactions occurring precisely on the start or end date will be included in the results.   

What happens if the date is invalid?
Since we rely on standard alphabetical string comparison for YYYY-MM-DD formats, malformed strings might yield unpredictable or empty results. For simplicity and robustness within the scope of this project, we assume the user inputs dates in the correct YYYY-MM-DD format.   

What happens if the start date is after the end date?If the start date (from) is chronologically after the end date (to), no transactions can satisfy both conditions (>= from and <= to). Consequently, the API will return an empty list.   

What happens if there are no transactions in the interval?
he API returns an empty array ([]), and the terminal client catches this and displays a friendly message to the user.   



 -->