import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import DbConnect from "./DbConfig";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DbConnect();

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
