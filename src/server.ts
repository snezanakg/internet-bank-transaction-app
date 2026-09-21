import express from "express";

const app = express();
const port = 3000;

// lets Express read JSON from request bodies
app.use(express.json());

// simple route to check that the API is running
app.get("/", (req, res) => {
  res.send("Internet Bank API is running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});