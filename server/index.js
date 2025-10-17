import express from "express";
import chatRouter from "./server/chatRouter.js";

const app = express();
app.use(express.json());
app.use(chatRouter);
app.listen(process.env.PORT || 3000);
