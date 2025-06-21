import express, { Request, Response } from "express";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the API!");
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
}); 