import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";
import morgan from "morgan";

mongoose.connect(process.env.DATABASE_CONNECTION_STRING as string).then(() => {
  console.log("Connected to the database");
});
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

//api/my/user
app.use("/api/my/user", myUserRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
