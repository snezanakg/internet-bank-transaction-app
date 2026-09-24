import { input } from "@inquirer/prompts";
import { response } from "express";
let running = true;
while (running) {
    console.log("=== Internet Bank ===");


    console.log("=== Internet Bank===");

    console.log(" 1. View transactions");
    console.log(" 2. View one transactions");
    console.log(" 3. Add transactions");
    console.log(" 4. Update transactions");
    console.log(" 5. Delete transactions");
    console.log(" 6. Filter transactions by date");
    console.log(" 7. Exit");

    const choice = await input({ message: "Choose an option:" });
    console.log("You choose", choice);

    if (choice === "1") {
        const response = await fetch("http://localhost:3000/transactions");
        const data = await response.json();
        console.log(data);
    }
    else if (choice === "2") {
        const id = await input({ message: "Enter transaction ID:" })
        const response = await fetch(`http://localhost:3000/transactions/${id}`);
        const data = await response.json();
        console.log(data);


    }
    else if (choice === "3") {
        const data = await input({ message: "Enter date (YYYY-MM-DD" });
        const recipient = await input({ message: "Enter recipient:" });
        const amount = await input({ message: "Enter amount:" });
        const response = await fetch("http://localhost:3000/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: data,
                recipient,
                amount:
                    Number(amount),

            }),
        });
        const newTransaction = await
            response.json();
        console.log(newTransaction);




    }
    else if (choice === "4") {
        const id = await input({ message: "Enter transaction ID:" });
        const date = await input({ message: "Enter new date YYYY-MM-DD:" });
        const recipient = await input({ message: "Enter new recipient:" });
        const amount = await input({ message: "Enter new amount:" });
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
                    Number(amount),

            }),
        });

        const updatedTransaction = await response.json();
        console.log(updatedTransaction);
    }

    else if (choice === "5") {
        const id = await input({ message: "Enter transaction ID to delete:" });
        const response = await fetch(`http://localhost:3000/transactions/${id}`, {
            method: "delete",
        });
        const result = await
            response.json();
        console.log(result);



    }
    else if (choice === "6") {
        const date = await input({ message: " Enter date (YYYY-MM-DD):" });
        const response = await fetch("http://localhost:3000/transactions", {

        });
        const transactions = await
            response.json();
        const filtered = transactions.filter((transactions: any) =>
            transactions.date === date);
        console.log(filtered);
    }

    else if (choice === "7") {
        console.log("Exit");
        running = false;

    }
}
