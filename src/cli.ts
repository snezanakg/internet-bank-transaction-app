import { input } from "@inquirer/prompts";
import type { Transaction } from "./data.js";
let running = true;
while (running) {

    console.log("=== Internet Bank===");

    console.log(" 1. View all transactions");
    console.log(" 2. View one transaction");
    console.log(" 3. Add transaction");
    console.log(" 4. Update transaction");
    console.log(" 5. Delete transaction");

    console.log(" 6. Filter transactions by date");
    console.log(" 7. Exit");

    const choice = await input({ message: "Choose an option:" });
    console.log("You choose", choice);

    if (choice === "1") {
        try {
            const response = await fetch("http://localhost:3000/transactions");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log("Something went wrong.");
        }
    }
    else if (choice === "2") {

        try {
            const id = await input({ message: "Enter transaction ID:" })
            const response = await fetch(`http://localhost:3000/transactions/${id}`);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log("Something went wrong.");
        }

    }
    else if (choice === "3") {
        try {
            const data = await input({ message: "Enter date (YYYY-MM-DD" });
            const recipient = await input({ message: "Enter recipient:" });
            const amount = Number(await input({ message: "Enter amount:" }));
            const response = await fetch("http://localhost:3000/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: data,
                    recipient,
                    amount:
                        (amount),
                }),
            });
            const newTransaction = await
                response.json();
            console.log(newTransaction);
        } catch (error) {
            console.log("Something went wrong.", error);

        }
    }
    else if (choice === "4") {
        try {
            const id = await input({ message: "Enter transaction ID:" });
            const date = await input({ message: "Enter new date YYYY-MM-DD:" });
            const recipient = await input({ message: "Enter new recipient:" });
            const amount = Number(await input({ message: "Enter new amount:" }));
            const response = await fetch(`http://localhost:3000/transactions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    date,
                    recipient,
                    amount:
                        (amount),


                }),
            });

            const updatedTransaction = await response.json();
            console.log(updatedTransaction);
        } catch (error) {
            console.log("Something went wrong.");
        }
    }

    else if (choice === "5") {
        try {
            const id = await input({ message: "Enter transaction ID to delete:" });
            const response = await fetch(`http://localhost:3000/transactions/${id}`, {
                method: "delete",
            });
            const result = await
                response.json();
            console.log(result);
        } catch (error) {
            console.log("Something went wrong.");

        }
    }
    else if (choice === "6") {
        try {
            const startDate = await input({ message: " Enter start date (YYYY-MM-DD):" });
            const endDate = await input({ message: " Enter end date (YYYY-MM-DD):" });
            if
                (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))
            ) {
                console.log("Invalid date. Please use YYYY-MM-DD.");
                continue;
            };

            const response = await fetch("http://localhost:3000/transactions", {

            });
            const transactions = await
                response.json();

            const filtered = transactions.filter((transactions: Transaction) =>
                transactions.date >= startDate && transactions.date <= endDate);
            if (filtered.length === 0) {
                console.log("No transaction found for this date range.");

            } else {
                console.log(filtered);
            }
        } catch (error) {
            console.log("Something went wrong.");
        }
    }


    else if (choice === "7") {

        console.log("Exit");
        running = false;

    }
}

